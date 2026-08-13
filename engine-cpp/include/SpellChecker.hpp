#pragma once 

#include <string>

class SpellChecker {
public: 
    static int calculateLevenshteinDistance(const std::string& s1, const std::string& s2);
};