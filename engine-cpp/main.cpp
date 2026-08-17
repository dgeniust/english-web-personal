#include "include/crow_all.h" // Đảm bảo đường dẫn này trỏ đúng file header của Crow
#include <iostream>
#include <chrono>
#include <vector>
#include <cctype>
#include <cmath>
#include <algorithm>
#include <mutex> // Thư viện xử lý đa luồng

// Các module thuật toán
#include "include/Trie.hpp"
#include "include/SpellChecker.hpp"
#include "include/LRUCache.hpp"
#include "include/InvertedIndex.hpp"

// Hàm chuẩn hóa
std::string normalizeString(const std::string& input) {
    std::string result = "";
    for (char c : input) {
        if (std::isalpha(c)) {
            result += std::tolower(c);
        }
    }
    return result;
}

int main() {
    crow::SimpleApp app;

    // Khởi tạo các cấu trúc dữ liệu
    Trie engine;
    InvertedIndex docIndex;
    LRUCache cache(100); // Tăng dung lượng Cache lên 100 cho server
    std::vector<std::string> fullDictionary;
    
    // Khai báo Mutex ở đây để dùng chung cho toàn bộ các luồng (cache và data)
    std::mutex cacheMutex; 
    std::mutex dataMutex;  

    // ==========================================
    // KHỞI TẠO DỮ LIỆU KHI START SERVER
    // ==========================================
    std::cout << "[System] Dang nap Inverted Index...\n";
    docIndex.addDocument("doc1_tech.txt", "apple releases new application for macbook");
    docIndex.addDocument("doc2_food.txt", "how to make apple pie and banana cake");
    docIndex.addDocument("doc3_work.txt", "how to apply for a job and become a boss");
    
    std::cout << "[System] Server san sang tiep nhan request tu Node.js!\n";
    std::cout << "==================================================\n";

    // ==========================================
    // ĐỊNH NGHĨA CÁC API ENDPOINTS
    // ==========================================

    // API 1: Health check
    CROW_ROUTE(app, "/health")([](){
        return "C++ Algorithm Engine is running smoothly!";
    });

    // API 2: API Search tổng hợp
    CROW_ROUTE(app, "/api/search/<string>")([&](std::string rawInput){
        auto startQuery = std::chrono::high_resolution_clock::now();
        crow::json::wvalue response; // Object JSON trả về

        std::string input = normalizeString(rawInput);
        if (input.empty()) {
            response["error"] = "Tu khoa khong hop le!";
            return response;
        }

        std::vector<std::string> suggestions;
        bool isFuzzy = false;
        bool isCacheHit = false;

        // BƯỚC 1: KIỂM TRA CACHE (Thread-safe)
        {
            std::lock_guard<std::mutex> lock(cacheMutex);
            isCacheHit = cache.get(input, suggestions);
        }

        // BƯỚC 2: NẾU KHÔNG CÓ TRONG CACHE -> TÌM TRONG TRIE HOẶC FUZZY
        if (!isCacheHit) {
            suggestions = engine.autocomplete(input, 5);

            if (suggestions.empty()) {
                isFuzzy = true;
                std::vector<std::pair<int, std::string>> fuzzyResults;

                for (const auto& dictWord : fullDictionary) {
                    if (std::abs((int)dictWord.length() - (int)input.length()) <= 2) {
                        int dist = SpellChecker::calculateLevenshteinDistance(input, dictWord);
                        if (dist <= 2) {
                            fuzzyResults.push_back({dist, dictWord});
                        }
                    }
                }
                std::sort(fuzzyResults.begin(), fuzzyResults.end());
                std::set<std::string> seenWords;
                int count = 0;
                for (const auto& pair : fuzzyResults) {
                    if (count++ >= 3) break;
                    if(seenWords.find(pair.second) == seenWords.end()){
                        suggestions.push_back(pair.second);
                        seenWords.insert(pair.second);
                        count++;
                    }
                }
            }

            // Lưu kết quả vào Cache (Thread-safe)
            if (!suggestions.empty()) {
                std::lock_guard<std::mutex> lock(cacheMutex);
                cache.put(input, suggestions);
            }
        }

        // BƯỚC 3: TÌM TÀI LIỆU (INVERTED INDEX)
        std::vector<std::string> docs = docIndex.search(input);

        auto endQuery = std::chrono::high_resolution_clock::now();
        std::chrono::duration<double, std::milli> queryTime = endQuery - startQuery;

        // BƯỚC 4: XUẤT RA JSON
        response["query"] = input;
        response["cache_hit"] = isCacheHit;
        response["is_fuzzy_search"] = isFuzzy;
        
        response["suggestions"] = suggestions; 
        response["related_documents"] = docs;
        response["execution_time_ms"] = queryTime.count();

        return response;
    });

    // API 3: Nạp dữ liệu hàng loạt từ MongoDB qua Node.js
    CROW_ROUTE(app, "/api/init_dictionary").methods(crow::HTTPMethod::Post)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        if(!body || !body.has("words")){
            return crow::response(400, "Invalid JSON data");
        }
        
        int count = 0;
        
        // Khóa bảo vệ bộ nhớ trước khi nạp data
        std::lock_guard<std::mutex> lock(dataMutex);
        
        for(const auto& item : body["words"]){
            std::string word = normalizeString(item.s());
            if(!word.empty()){
                engine.insert(word);
                fullDictionary.push_back(word);
                count++;
            }
        }
        std::cout << "[System] Node.js da bom thanh cong " << count << " tu vung!\n";
        return crow::response(200, "Tai du lieu thanh cong!");
    });

    // API 4: Đồng bộ 1 từ mới từ Node.js
    CROW_ROUTE(app, "/api/add_word").methods(crow::HTTPMethod::Post)([&](const crow::request& req){
        auto body = crow::json::load(req.body);
        if (!body || !body.has("word")) {
            return crow::response(400, "Invalid JSON");
        }
        
        std::string newWord = normalizeString(body["word"].s());
        if(!newWord.empty()){
            // Khóa bảo vệ bộ nhớ trước khi chèn thêm từ
            std::lock_guard<std::mutex> lock(dataMutex);

            engine.insert(newWord);
            fullDictionary.push_back(newWord);
        }
        return crow::response(200, "Da cap nhat tu vung moi vao Engine!");
    });

    // Chạy server tại cổng 8080 với chế độ đa luồng
    app.port(8080).multithreaded().run();
}