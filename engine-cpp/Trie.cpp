#include "include/Trie.hpp"

Trie::Trie(){
    root = std::make_unique<TrieNode>();
}

void Trie::insert(const std::string& word){
    TrieNode* current = root.get();
    for(char ch : word){
        if(current->children.find(ch) == current->children.end()){
            current->children[ch] = std::make_unique<TrieNode>();
        }
        current = current->children[ch].get();
    }
    current->isEndOfWord = true;
}
void Trie::dfs(TrieNode* node, std::string currentWord, std::vector<std::string>& results, int limit){
    if(results.size() >= limit) return;
    if(node->isEndOfWord){
        results.push_back(currentWord);
    }
    for(auto& pair : node ->children){
        dfs(pair.second.get(), currentWord + pair.first, results, limit);
    }
}

std::vector<std::string> Trie::autocomplete(const std::string& prefix, int limit){
    TrieNode* current = root.get();
    std::vector<std::string> results;
    for(char ch : prefix){
        if(current->children.find(ch) == current->children.end()){
            return results; // No words with this prefix
        }
        current = current->children[ch].get();
    }
    dfs(current, prefix, results, limit);
    return results;
}