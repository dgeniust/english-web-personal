cmake_minimum_required(VERSION 3.15)
project(VocabEngine CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_compile_definitions(ASIO_STANDALONE)

if(WIN32)
    add_compile_definitions(_WIN32_WINNT=0x0601)
endif()

include_directories(include)
include_directories(.) # Thêm thư mục hiện tại để tìm Trie.hpp

# SỬA DÒNG NÀY: Bổ sung Trie.cpp vào danh sách source files
add_executable(VocabEngine main.cpp Trie.cpp SpellChecker.cpp)