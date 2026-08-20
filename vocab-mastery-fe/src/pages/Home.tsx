import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import type { GetAllWordsResponse, WordsResponse } from "../types/word";
import AddWordForm from "../components/AddWordForm";
import { wordService } from "../services/wordService";
import { WordCard } from "../components/WordCard"; // Import component vừa tạo
import { CardActionBar } from "@/components/CardActionBar";
import { useCardStore } from "@/store/useCardStore";
import { useWordActionStore } from "@/store/useWordActionStore";

export const Home = () => {
  const [dictionary, setDictionary] = useState<GetAllWordsResponse>();
  const [words, setWords] = useState<WordsResponse[]>([]);

  const [page, setPage] = useState<number>(1);
  const limit = 16;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true);
        const res = await wordService.getWords(page, limit);
        if (res) {
          setTimeout(() => {
            setIsLoading(false);
          }, 1200);
        }
        setDictionary(res);
        setWords(res.data);
      } catch (error) {
        console.error("Lỗi khi fetch words:", error);
      }
    };
    fetchWords();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (dictionary?.pagination && page < dictionary.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const { handleEdit, handleDelete, handleAddToCollection } =
    useWordActionStore();
  const { isSelected, toggleSelection } = useCardStore();
  const selectedCards = useCardStore.getState().getSelectedCount();
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
            <AddWordForm />
          </div>
        </section>

        <hr className="border-t-[1.5px] border-[var(--color-charcoal)] opacity-20" />

        {/* --- GRID TỪ VỰNG SECTION --- */}
        <section className="flex flex-col gap-8 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="font-gelica-fallback text-[36px] text-[var(--color-cocoa-ink)] lowercase">
              my collection
            </h2>
            {selectedCards > 0 && (
              <span className="text-[16px] text-[var(--color-charcoal)] font-medium bg-[var(--color-dew-drop)] px-4 py-1.5 rounded-full border-[1.5px] border-[var(--color-charcoal)]">
                Đã chọn: {selectedCards}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px]">
              {Array.from({ length: limit }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-[24px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4"
                >
                  <div className="h-[33px] bg-gray-300/60 animate-pulse rounded w-3/4 pb-2"></div>
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="h-[24px] w-[60px] bg-gray-300/60 animate-pulse rounded-[20px]"></div>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <div className="h-[22px] w-full bg-gray-300/60 animate-pulse rounded"></div>
                      <div className="h-[22px] w-4/5 bg-gray-300/60 animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <CardActionBar />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px]">
                {words &&
                  words.map((item) => (
                    <WordCard
                      key={item.id || item.term}
                      item={item}
                      isSelected={isSelected(item.id)}
                      onSelect={toggleSelection}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onAddToCollection={handleAddToCollection}
                    />
                  ))}
              </div>

              {/* PAGINATION CONTROLS */}
              {dictionary?.pagination &&
                dictionary.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className="px-6 py-2 bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[20px] text-[16px] font-medium text-[var(--color-charcoal)] hover:bg-[var(--color-dew-drop)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    <span className="text-[16px] font-medium text-[var(--color-cocoa-ink)]">
                      Page {dictionary.pagination.currentPage} of{" "}
                      {dictionary.pagination.totalPages}
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={page === dictionary.pagination.totalPages}
                      className="px-6 py-2 bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[20px] text-[16px] font-medium text-[var(--color-charcoal)] hover:bg-[var(--color-dew-drop)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
            </>
          )}
        </section>
      </div>
    </Layout>
  );
};
