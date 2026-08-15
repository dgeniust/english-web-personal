import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import type { GetAllWordsResponse, WordsResponse } from "../types/word";
import AddWordForm from "../components/AddWordForm";
import { wordService } from "../services/wordService";
import CustomLoader from "../components/CustomLoader";

export const Home = () => {
  const [dictionary, setDictionary] = useState<GetAllWordsResponse>();
  const [words, setWords] = useState<WordsResponse[]>([]);

  // 1. Thêm state để quản lý trang hiện tại
  const [page, setPage] = useState<number>(1);
  const limit = 3;
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

  // Hàm chuyển trang
  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (dictionary?.pagination && page < dictionary.pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  if (isLoading) {
    return <CustomLoader isLoading={isLoading} text="Đang tải dữ liệu..." />;
  }
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
          <h2 className="font-gelica-fallback text-[36px] text-[var(--color-cocoa-ink)] lowercase">
            my collection
          </h2>

          {isLoading ? (
            <div className="text-center text-[var(--color-charcoal)] py-10">
              Đang tải...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[12px]">
                {words &&
                  words.map((item) => (
                    <div
                      key={item.id || item.term} // Thay item.id bằng item._id nếu dùng _id từ MongoDB
                      className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-[24px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] flex flex-col gap-4 hover:rotate-1 transition-transform"
                    >
                      <h3 className="font-gelica-fallback text-[28px] text-[var(--color-cocoa-ink)] lowercase leading-[1.2] border-b-[1.5px] border-dashed border-[var(--color-charcoal)] pb-2">
                        {item.term}
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

              {/* 3. PAGINATION CONTROLS */}
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
