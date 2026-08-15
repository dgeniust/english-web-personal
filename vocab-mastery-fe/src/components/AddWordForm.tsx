import React, { useState } from "react";
// import { wordService } from "../services/wordService"; // Gọi service bạn đã tạo ở bước trước

export default function AddWordForm() {
  const [formData, setFormData] = useState({
    term: "",
    type: "noun", // Khởi tạo mặc định
    meaning: "",
    tags: "", // Sẽ chuyển thành mảng khi submit
    inputSynonyms: "", // Sẽ chuyển thành mảng khi submit
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Xử lý tách chuỗi thành mảng và loại bỏ khoảng trắng dư thừa
    const payload = {
      term: formData.term,
      type: formData.type,
      meaning: formData.meaning,
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      inputSynonyms: formData.inputSynonyms
        ? formData.inputSynonyms
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    try {
      // Gọi API bằng service:
      // await wordService.createWord(payload);

      console.log("Payload gửi đi:", payload);
      alert("Thêm từ thành công!");

      // Reset form sau khi submit thành công
      setFormData({
        term: "",
        type: "noun",
        meaning: "",
        tags: "",
        inputSynonyms: "",
      });
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Term */}
      <div className="flex flex-col gap-2">
        <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
          Từ tiếng Anh (Term)
        </label>
        <input
          type="text"
          name="term"
          value={formData.term}
          onChange={handleInputChange}
          placeholder="e.g. crucial"
          className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[18px] focus:outline-none focus:border-[var(--color-marker-orange)]"
          required
        />
      </div>

      {/* Type & Meaning */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
            Loại từ (Type)
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[16px] focus:outline-none focus:border-[var(--color-marker-orange)]"
          >
            {/* Lưu ý: value truyền đi phải là chữ thường để khớp với enum của Backend */}
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
            Nghĩa (Meaning)
          </label>
          <input
            type="text"
            name="meaning"
            value={formData.meaning}
            onChange={handleInputChange}
            placeholder="e.g. quan trọng"
            className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[16px] focus:outline-none focus:border-[var(--color-marker-orange)]"
            required
          />
        </div>
      </div>

      {/* Tags & Synonyms */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
            Tags{" "}
            <span className="text-sm font-normal opacity-70">
              (cách nhau bằng dấu phẩy)
            </span>
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g. vocabulary, ielts"
            className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[16px] focus:outline-none focus:border-[var(--color-marker-orange)]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
            Từ đồng nghĩa{" "}
            <span className="text-sm font-normal opacity-70">
              (cách nhau bằng dấu phẩy)
            </span>
          </label>
          <input
            type="text"
            name="inputSynonyms"
            value={formData.inputSynonyms}
            onChange={handleInputChange}
            placeholder="e.g. vital, essential"
            className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[16px] focus:outline-none focus:border-[var(--color-marker-orange)]"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="self-start mt-4 bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[20px] px-[28px] py-[10px] text-[16px] font-medium text-[var(--color-charcoal)] shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:bg-[var(--color-dew-drop)] transition-colors"
      >
        add to notebook
      </button>
    </form>
  );
}
