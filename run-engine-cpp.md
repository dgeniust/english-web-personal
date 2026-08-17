===RUN IN POWERSHELL===

1. cd D:
2. cd build -> cd vocab-mastery
3. cd engine-cpp
4. cmake ..
5. cmake --build .
6. .\Debug\VocabEngine.exe
   ===Các câu lệnh test Engine Cpp===

1) Test Health Check (Kiểm tra server sống/chết)
   => curl http://localhost:8080/health

2) Test Nạp Dữ Liệu (Init Dictionary)
   => curl -X POST http://localhost:8080/api/init_dictionary \
    -H "Content-Type: application/json" \
    -d '{"words": ["apple", "application", "apply", "banana", "boss", "macbook", "job", "pie"]}'

3) Test Tìm Kiếm Autocomplete (Search)
   => curl http://localhost:8080/api/search/app

4) Test Cache Hit
   => curl http://localhost:8080/api/search/app
   => \*\*\*Lưu ý: thời gian giảm rõ rệt
