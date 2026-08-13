#include "include/crow_all.h" // Đảm bảo đường dẫn này trỏ đúng file header của Crow
#include <iostream>
#include <fstream>
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
    std::mutex cacheMutex; // Mutex bảo vệ Cache trong môi trường đa luồng

    // ==========================================
    // KHỞI TẠO DỮ LIỆU KHI START SERVER
    // ==========================================
    std::cout << "[System] Dang tai tu dien vao bo nho..." << std::endl;
    std::ifstream file("data/dictionary.txt"); 
    if (!file.is_open()) {
        std::cerr << "[Error] Khong the mo file data/dictionary.txt!\n";
        return 1;
    }

    std::string word;
    int wordCount = 0;
    while (std::getline(file, word)) {
        std::string cleanWord = normalizeString(word);
        if (!cleanWord.empty()) {
            engine.insert(cleanWord);
            fullDictionary.push_back(cleanWord);
            wordCount++;
        }
    }
    file.close();
    std::cout << "[System] Da tai " << wordCount << " tu vựng!\n";

    std::cout << "[System] Dang nap Inverted Index...\n";
    docIndex.addDocument("doc1_tech.txt", "apple releases new application for macbook");
    docIndex.addDocument("doc2_food.txt", "how to make apple pie and banana cake");
    docIndex.addDocument("doc3_work.txt", "how to apply for a job and become a boss");
    std::cout << "[System] Server san sang tiep nhan request!\n";
    std::cout << "==================================================\n";

    // ==========================================
    // ĐỊNH NGHĨA CÁC API ENDPOINTS
    // ==========================================

    // API 1: Health check
    CROW_ROUTE(app, "/health")([](){
        return "C++ Algorithm Engine is running smoothly!";
    });

    // API 2: API Search tổng hợp
    // Lưu ý: Dùng [&] để truyền tham chiếu của engine, cache, docIndex vào hàm Lambda
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
                
                int count = 0;
                for (const auto& pair : fuzzyResults) {
                    if (count++ >= 3) break;
                    suggestions.push_back(pair.second);
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
        
        // Crow tự động convert std::vector sang mảng JSON
        response["suggestions"] = suggestions; 
        response["related_documents"] = docs;
        response["execution_time_ms"] = queryTime.count();

        return response;
    });

    // Chạy server tại cổng 8080 với chế độ đa luồng
    app.port(8080).multithreaded().run();
}