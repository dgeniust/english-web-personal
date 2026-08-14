import React, { useState } from "react";
import { Layout } from "../components/Layout";

type VocabWord = {
  id: string;
  word: string;
  meaning: string;
  type: string;
};

export const Home = () => {
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
    <Layout>
      <div className="flex flex-col gap-[64px]">
        {/* --- FORM SECTION --- */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <div className="relative">
              <span className="font-handwriting text-[24px] text-[var(--color-marker-orange)] rotate-[-2deg] inline-block mb-2">
                my new notebook,
              </span>
              <h1 className="font-gelica-fallback text-[64px] md:text-[104px] leading-[1.08] text-[var(--color-cocoa-ink)] lowercase m-0 tracking-normal">
                vocab superbooks
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

          <div className="bg-[var(--color-dew-drop)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-[32px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] rotate-[2deg]">
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
                  className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] px-4 py-3 text-[18px] focus:outline-none focus:border-[var(--color-marker-orange)]"
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
                    <option value="Noun">Noun</option>
                    <option value="Verb">Verb</option>
                    <option value="Adjective">Adjective</option>
                    <option value="Adverb">Adverb</option>
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

        {/* --- GRID TỪ VỰNG SECTION --- */}
        <section className="flex flex-col gap-8">
          <h2 className="font-gelica-fallback text-[36px] text-[var(--color-cocoa-ink)] lowercase">
            my collection
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px]">
            {words.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-[24px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4 hover:rotate-1 transition-transform"
              >
                <h3 className="font-gelica-fallback text-[28px] text-[var(--color-cocoa-ink)] lowercase leading-[1.2] border-b-[1.5px] border-dashed border-[var(--color-charcoal)] pb-2">
                  {item.word}
                </h3>

                <div className="flex flex-col gap-2 mt-1">
                  <span className="self-start border-[1px] border-[var(--color-sprout-sticker)] text-[var(--color-charcoal)] text-[14px] rounded-[20px] px-3 py-0.5">
                    {item.type}
                  </span>
                  <p className="text-[18px] text-[var(--color-charcoal)] mt-1 font-handwriting text-[22px]">
                    {item.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};
