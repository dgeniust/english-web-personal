#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <sstream>

class InvertedIndex {
private:
    std::unordered_map<std::string, std::vector<int>> index;
    std::unordered_map<int, std::string> docMap;
    int docIdCounter = 1;
public: 
    void addDocument(const std::string& docName, const std::string& content){
        int currentDocId = docIdCounter++;
        docMap[currentDocId] = docName;
        std::stringstream ss(content);
        std::string word;
        while(ss >> word){
            if(index[word].empty() || index[word].back() != currentDocId){
                index[word].push_back(currentDocId);
            }
        }
    }
    std::vector<std::string> search(const std::string& keyword){
        std::vector<std::string> result;
        if(index.find(keyword) != index.end()){
            for(int id : index[keyword]){
                result.push_back(docMap[id]);
            }
        }
        return result;
    }
};