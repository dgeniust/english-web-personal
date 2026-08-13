import React, { useState } from "react";

// Định nghĩa kiểu dữ liệu cho Từ vựng
type VocabWord = {
  id: string;
  word: string;
  meaning: string;
  type: string;
};

export default function App() {
  // State lưu trữ danh sách từ vựng (khởi tạo với vài từ mẫu)
  const [words, setWords] = useState<VocabWord[]>([
    {
      id: "1",
      word: "parchi",
      meaning: "Mảnh giấy nhỏ, nhãn vở",
      type: "Noun",
    },
    {
      id: "2",
      word: "mischievous",
      meaning: "Tinh nghịch, láu lỉnh",
      type: "Adjective",
    },
  ]);

  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
    type: "Noun",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaning.trim()) return;

    const newWord: VocabWord = {
      id: Date.now().toString(),
      word: formData.word,
      meaning: formData.meaning,
      type: formData.type,
    };

    setWords([newWord, ...words]);
    setFormData({ word: "", meaning: "", type: "Noun" });
  };

  return (
    <div className="relative max-w-[1200px] mx-auto px-6 py-12 md:py-20 flex flex-col gap-[64px]">
      {/* Decorative Stickers (Trang trí rải rác) */}
      <div className="absolute top-10 left-10 text-[var(--color-sky-sticker)] rotate-[-12deg] pointer-events-none">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
      <div className="absolute top-40 right-20 text-[var(--color-bubblegum-sticker)] rotate-[15deg] pointer-events-none">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* --- PHẦN 1: HEADER & FORM --- */}
      <section className="grid md:grid-cols-2 gap-12 items-start">
        {/* Cột trái: Tiêu đề */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            {/* Handwritten Caption */}
            <span className="font-handwriting text-[24px] text-[var(--color-marker-orange)] rotate-[-2deg] inline-block mb-2">
              my new notebook,
            </span>
            {/* Display Headline */}
            <h1 className="font-gelica-fallback text-[64px] md:text-[104px] leading-[1.08] text-[var(--color-cocoa-ink)] lowercase m-0 tracking-normal">
              vocab superrbook
            </h1>
          </div>
          <p className="text-[20px] text-[var(--color-charcoal)] leading-[1.5] max-w-md">
            Ghi chép lại những từ vựng bạn{" "}
            <span className="text-[var(--color-marker-orange)] underline decoration-wavy decoration-2 underline-offset-4">
              mới học được
            </span>{" "}
            ngày hôm nay.
          </p>
        </div>

        {/* Cột phải: Form nhập liệu (Thiết kế như một card notebook) */}
        <div className="bg-[var(--color-dew-drop)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-[32px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] rotate-[2deg] relative">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
                Từ tiếng Anh
              </label>
              <input
                type="text"
                name="word"
                value={formData.word}
                onChange={handleInputChange}
                placeholder="e.g. tactile"
                className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[18px] focus:outline-none focus:border-[var(--color-marker-orange)] focus:ring-1 focus:ring-[var(--color-marker-orange)] transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
                  Loại từ
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[16px] focus:outline-none focus:border-[var(--color-marker-orange)]"
                >
                  <option value="Noun">Noun (Danh từ)</option>
                  <option value="Verb">Verb (Động từ)</option>
                  <option value="Adjective">Adjective (Tính từ)</option>
                  <option value="Adverb">Adverb (Trạng từ)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
                  Nghĩa
                </label>
                <input
                  type="text"
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleInputChange}
                  placeholder="Xúc giác..."
                  className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[16px] focus:outline-none focus:border-[var(--color-marker-orange)]"
                  required
                />
              </div>
            </div>

            {/* Pill Action Button */}
            <button
              type="submit"
              className="self-start mt-4 bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[20px] px-[28px] py-[10px] text-[16px] font-medium text-[var(--color-charcoal)] shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:bg-[var(--color-dew-drop)] transition-colors"
            >
              add to notebook
            </button>
          </form>
        </div>
      </section>

      <hr className="border-t-[1.5px] border-[var(--color-charcoal)] opacity-20" />

      {/* --- PHẦN 2: DANH SÁCH TỪ VỰNG (CARD GRID) --- */}
      <section className="flex flex-col gap-8">
        <h2 className="font-gelica-fallback text-[36px] text-[var(--color-cocoa-ink)] lowercase">
          my collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px]">
          {words.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-[24px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4 hover:rotate-1 transition-transform cursor-pointer"
            >
              {/* Word */}
              <h3 className="font-gelica-fallback text-[28px] text-[var(--color-cocoa-ink)] lowercase leading-[1.2] border-b-[1.5px] border-dashed border-[var(--color-charcoal)] pb-2">
                {item.word}
              </h3>

              <div className="flex flex-col gap-2 mt-1">
                {/* Type Tag (Sprout Sticker accent outline) */}
                <span className="self-start border-[1px] border-[var(--color-sprout-sticker)] text-[var(--color-charcoal)] text-[14px] rounded-[20px] px-3 py-0.5">
                  {item.type}
                </span>

                {/* Meaning */}
                <p className="text-[18px] text-[var(--color-charcoal)] mt-1 font-handwriting text-[22px]">
                  {item.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER BRAND BAND --- */}
      <footer className="mt-12 bg-[var(--color-marker-orange)] rounded-tl-[56px] rounded-tr-[56px] py-8 px-6 border-t-[1.5px] border-[var(--color-charcoal)]">
        <p className="font-gelica-fallback text-[24px] text-[var(--color-cream-paper)] lowercase text-center">
          keep learning, keep growing.
        </p>
      </footer>
    </div>
  );
}
