import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { WordCard } from "@/components/WordCard";
import { CardActionBar } from "@/components/CardActionBar";
import { useWordActionStore } from "@/store/useWordActionStore";
import { useCardStore } from "@/store/useCardStore";
import { deckService } from "@/services/deckService";
import type { CollectionDetail, Deck } from "@/types/deck";

// ==========================================
// 1. DỮ LIỆU & ICONS
// ==========================================
const mockDecks: Deck[] = [
  {
    _id: "6a815c9a3739ab7189b94be2",
    userId: "6a7f0741d98237ff0988c349",
    name: "Từ vựng TOEIC Part 1",
    description: "Mục tiêu đạt 800+ TOEIC",
    createdAt: "2026-08-16T06:45:46.275Z",
    __v: 0,
  },
  {
    _id: "6a815c9a3739ab7189b94be3",
    userId: "user_2",
    name: "IT English",
    description: "Từ vựng chuyên ngành IT",
    createdAt: "2026-08-16T06:45:46.275Z",
    __v: 0,
  },
];

const BackArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

// Skeleton cho WordCard
const WordCardSkeleton = () => (
  <div className="bg-[var(--color-dew-drop)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-[24px] flex flex-col gap-4 h-[200px] animate-pulse">
    <div className="h-8 bg-[var(--color-shadow-mist)]/30 rounded w-2/3"></div>
    <div className="h-6 bg-[var(--color-shadow-mist)]/30 rounded-full w-1/4 mt-2"></div>
    <div className="mt-auto h-6 bg-[var(--color-shadow-mist)]/30 rounded w-full"></div>
  </div>
);

// ==========================================
// 2. COMPONENT: GIAO DIỆN CUỐN SỔ (NOTEBOOK)
// ==========================================
// Thiết kế dựa theo mô tả "Product Notebook" của Superr: nền xanh/hồng, có bìa dán nhãn (sticker label).
const NotebookCover = ({
  deck,
  layoutId,
}: {
  deck: Deck;
  layoutId: string;
}) => {
  // Đổi màu ngẫu nhiên dựa trên ID để các sổ trông khác nhau
  const isBlue = deck._id.endsWith("2");
  const bgColor = isBlue
    ? "bg-[var(--color-sky-sticker)]"
    : "bg-[var(--color-bubblegum-sticker)]";

  return (
    <motion.div
      layoutId={layoutId}
      className={`relative w-full aspect-[3/4] ${bgColor} rounded-r-[16px] rounded-l-[4px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-[1.5px] border-[var(--color-charcoal)] flex items-center justify-center cursor-pointer`}
    >
      {/* Gáy sổ (Binding Edge) */}
      <div className="absolute left-0 top-0 bottom-0 w-8 border-r-[1.5px] border-[var(--color-charcoal)] bg-[#171717]/10 flex flex-col justify-evenly items-center">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-10 h-1.5 bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-full -ml-2"
          />
        ))}
      </div>

      {/* Nhãn vở (Name Label Sticker) */}
      <div className="bg-white border-[1.5px] border-[var(--color-charcoal)] rounded-[8px] w-[75%] p-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.25)] flex flex-col gap-2 -rotate-2 ml-4">
        <div className="text-[var(--color-charcoal)] font-sans text-xs border-b-[1.5px] border-[var(--color-charcoal)]/20 pb-1 flex justify-between items-end">
          <span className="font-semibold opacity-50">Tên bộ:</span>
          <span className="font-handwriting text-[var(--color-marker-orange)] text-[16px] leading-none truncate max-w-[100px]">
            {deck.name}
          </span>
        </div>
        <div className="text-[var(--color-charcoal)] font-sans text-xs border-b-[1.5px] border-[var(--color-charcoal)]/20 pb-1 flex justify-between items-end">
          <span className="font-semibold opacity-50">Mô tả:</span>
          <span className="font-handwriting text-[var(--color-cocoa-ink)] text-[14px] leading-none truncate max-w-[100px]">
            {deck.description}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// 3. PAGE CHÍNH
// ==========================================
export default function CollectionsPage() {
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
  const [detailData, setDetailData] = useState<CollectionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { handleEdit, handleDelete, handleAddToCollection } =
    useWordActionStore();
  const { isSelected, toggleSelection } = useCardStore();

  // Gọi API mỗi khi có activeDeck mới
  useEffect(() => {
    if (activeDeck) {
      setIsLoading(true);
      setDetailData(null); // Xoá dữ liệu cũ khi chuyển sổ
      deckService
        .getDeckDetail(activeDeck._id)
        .then((res) => setDetailData(res))
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [activeDeck]);

  // Cấu hình góc nghiêng ngẫu nhiên cho những cuốn sổ trên mặt bàn
  const rotations = [-4, 6, -6, 4];

  return (
    <Layout>
      <div className="min-h-screen bg-[var(--color-cream-paper)] text-[var(--color-charcoal)] pb-20 relative overflow-hidden">
        {/* Lớp nền mờ khi lật sổ ra */}
        <AnimatePresence>
          {activeDeck && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[var(--color-cream-paper)] z-40"
            />
          )}
        </AnimatePresence>

        <div className="w-full mx-auto max-w-[1200px] px-6 relative z-10">
          {/* HEADER: Tiêu đề trang (ẩn đi khi mở cuốn sổ) */}
          <motion.div
            animate={{ opacity: activeDeck ? 0 : 1, y: activeDeck ? -20 : 0 }}
            className="mb-12 pt-8"
          >
            <h1 className="font-gelica-fallback text-[56px] md:text-[84px] text-[var(--color-cocoa-ink)] lowercase leading-[1.08]">
              my collections
            </h1>
            <p className="font-handwriting text-[24px] text-[var(--color-marker-orange)] mt-2">
              Time to hit the books! Chọn một cuốn sổ nhé.
            </p>
          </motion.div>

          {/* VIEW 1: LƯỚI NHỮNG CUỐN SỔ (GRID VIEW) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {mockDecks.map((deck, idx) => (
              <motion.div
                key={deck._id}
                layoutId={`deck-container-${deck._id}`}
                initial={{ rotate: rotations[idx % 4] }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDeck(deck)}
                className="relative"
              >
                <NotebookCover deck={deck} layoutId={`notebook-${deck._id}`} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* VIEW 2: CUỐN SỔ ĐƯỢC MỞ RA (EXPANDED VIEW) */}
        <AnimatePresence>
          {activeDeck && (
            <motion.div
              layoutId={`deck-container-${activeDeck._id}`}
              className="fixed inset-0 z-50 overflow-y-auto pt-8 px-6 pb-24"
            >
              <div className="max-w-[1200px] mx-auto">
                {/* Nút Quay Lại & Header của Cuốn sổ */}
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                  {/* Cuốn sổ nhét vào góc */}
                  <div className="w-40 shrink-0">
                    <NotebookCover
                      deck={activeDeck}
                      layoutId={`notebook-${activeDeck._id}`}
                    />
                  </div>

                  {/* Nội dung bên cạnh */}
                  <div className="flex-grow pt-4">
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setActiveDeck(null)}
                      className="mb-6 flex items-center gap-2 font-sans font-medium text-[16px] text-[var(--color-charcoal)] hover:text-[var(--color-marker-orange)] transition-colors"
                    >
                      <BackArrowIcon /> Xếp sổ lại
                    </motion.button>

                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-gelica-fallback text-[46px] text-[var(--color-cocoa-ink)] lowercase leading-[1.1] mb-2"
                    >
                      {activeDeck.name}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="font-sans text-[18px] text-[var(--color-charcoal)] opacity-80"
                    >
                      {activeDeck.description}
                    </motion.p>
                  </div>
                </div>

                <CardActionBar />

                {/* Danh sách Thẻ Từ Vựng (Loading Skeletons / Words) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
                >
                  {isLoading && (
                    <>
                      <WordCardSkeleton />
                      <WordCardSkeleton />
                      <WordCardSkeleton />
                      <WordCardSkeleton />
                    </>
                  )}

                  {!isLoading &&
                    detailData &&
                    detailData.words.length > 0 &&
                    detailData.words.map((word) => {
                      const cardId = word.id || word.term;
                      return (
                        <WordCard
                          key={cardId}
                          item={word}
                          isSelected={isSelected(cardId)}
                          onSelect={toggleSelection}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onAddToCollection={handleAddToCollection}
                        />
                      );
                    })}

                  {!isLoading &&
                    detailData &&
                    detailData.words.length === 0 && (
                      <div className="col-span-full py-16 text-center">
                        <span className="font-handwriting text-[24px] text-[var(--color-marker-orange)]">
                          Úi, cuốn sổ này vẫn còn trống trơn! Mới mua hả?
                        </span>
                      </div>
                    )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
