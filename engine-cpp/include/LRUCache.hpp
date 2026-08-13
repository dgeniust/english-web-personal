#pragma once

#include <iostream>
#include <vector>
#include <string>
#include <list>
#include <unordered_map>

class LRUCache {
private: 
    int capacity;
    std::list<std::pair<std::string, std::vector<std::string>>> cacheList;
    std::unordered_map<std::string, std::list<std::pair<std::string, std::vector<std::string>>>::iterator> cacheMap;
public:
    LRUCache(int cap): capacity(cap){}
    bool get(const std::string& key, std::vector<std::string>& result){
        if(cacheMap.find(key) == cacheMap.end()){
            return false;
        }
        cacheList.splice(cacheList.begin(), cacheList, cacheMap[key]);
        result = cacheMap[key]->second;
        return true;
    }
    void put(const std::string& key, const std::vector<std::string>& value){
        if(cacheMap.find(key) != cacheMap.end()){
            cacheList.splice(cacheList.begin(), cacheList, cacheMap[key]);
            cacheMap[key]->second = value;
            return;
        }
        if(cacheList.size() == capacity){
            auto last = cacheList.back();
            cacheMap.erase(last.first);
            cacheList.pop_back();
        }
        cacheList.push_front({key, value});
        cacheMap[key] = cacheList.begin();
    }
};