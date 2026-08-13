#pragma once

#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>

struct TrieNode {
    std::unordered_map<char, std::unique_ptr<TrieNode>> children;
    bool isEndOfWord = false;
};

class Trie{
private :
    std::unique_ptr<TrieNode> root;
    void dfs(TrieNode* node, std::string currentWord, std::vector<std::string>& results, int limits);
public :
    Trie();
    void insert(const std::string& word);
    std::vector<std::string> autocomplete(const std::string& prefix, int limit = 10);
};