import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Check, X, Flame, Eye } from "lucide-react";

// --- KHO DỮ LIỆU TỪ VỰNG MẪU ---
interface FlipCard {
  id: number;
  word: string;
  meaning: string;
  type: string;
}

const SAMPLE_VOCABULARY: FlipCard[] = [
  { id: 1, word: "Apple", meaning: "quả táo", type: "n" },
  { id: 2, word: "Run", meaning: "chạy", type: "v" },
  { id: 3, word: "Beautiful", meaning: "đẹp", type: "adj" },
  { id: 4, word: "Quickly", meaning: "nhanh", type: "adv" },
  { id: 5, word: "Cat", meaning: "con mèo", type: "n" },
  { id: 6, word: "Dog", meaning: "con chó", type: "n" },
  { id: 7, word: "Eat", meaning: "ăn", type: "v" },
  { id: 8, word: "Happy", meaning: "hạnh phúc", type: "adj" },
  { id: 9, word: "Water", meaning: "nước", type: "n" },
  { id: 10, word: "Read", meaning: "đọc", type: "v" },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const FlashcardGame: React.FC = () => {
  // Trạng thái tổng quan
  const [queue, setQueue] = useState<FlipCard[]>([]); // Hàng đợi thẻ (dàn ngang ở dưới)
  const [activeCard, setActiveCard] = useState<FlipCard | null>(null); // Thẻ đang học ở giữa
  const [isFlipped, setIsFlipped] = useState(false); // Trạng thái lật của thẻ hiện tại

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [totalCards, setTotalCards] = useState(0);

  // Khởi tạo game
  const initGame = () => {
    const shuffled = shuffleArray(SAMPLE_VOCABULARY);
    setTotalCards(shuffled.length);
    setActiveCard(shuffled[0]); // Đưa thẻ đầu tiên lên
    setQueue(shuffled.slice(1)); // Phần còn lại xếp hàng ngang
    setIsFlipped(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Xử lý khi người dùng chọn Nhớ hoặc Quên
  const handleNextCard = (isCorrect: boolean) => {
    // 1. Tính điểm & Streak
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0); // Đứt chuỗi
    }

    // 2. Kéo thẻ tiếp theo lên
    if (queue.length > 0) {
      const nextCard = queue[0];
      setActiveCard(nextCard);
      setQueue((prev) => prev.slice(1)); // Cắt thẻ đầu tiên khỏi hàng đợi
      setIsFlipped(false);
    } else {
      // Hết bài
      setActiveCard(null);
      setTimeout(() => setIsFinished(true), 500); // Đợi anim bay xong rồi hiện màn kết thúc
    }
  };

  // Keyboard Shortcuts (Trải nghiệm cực nhanh như app Anki)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (e.code === "Space" || e.code === "Enter") {
        if (!isFlipped) setIsFlipped(true);
      } else if (e.code === "ArrowRight") {
        if (isFlipped) handleNextCard(true);
      } else if (e.code === "ArrowLeft") {
        if (isFlipped) handleNextCard(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, isFinished, queue, activeCard]);

  // --- MÀN HÌNH KẾT THÚC ---
  if (isFinished) {
    const percent = Math.round((score / totalCards) * 100);
    return (
      <div className="min-h-screen bg-[#f6f5f0] flex flex-col items-center justify-center p-6 font-serif">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-stone-200"
        >
          <h2 className="text-3xl font-bold text-stone-800 mb-2">
            Hoàn Thành!
          </h2>
          <p className="text-stone-500 mb-6">
            Bạn đã nhớ được {score}/{totalCards} từ vựng
          </p>
          <div
            className={`text-6xl font-bold mb-8 ${percent >= 80 ? "text-green-500" : percent >= 50 ? "text-amber-500" : "text-red-500"}`}
          >
            {percent}%
          </div>
          <button
            onClick={initGame}
            className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-medium transition-all active:scale-95"
          >
            <RefreshCcw className="w-5 h-5" /> Ôn tập lại
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f6f5f0] text-slate-800 flex flex-col overflow-hidden p-4 sm:p-6 font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center z-50 relative max-w-5xl w-full mx-auto">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-800">
            Flashcard Pro
          </h1>
          <p className="text-sm text-stone-500 font-medium mt-1">
            Tiến độ: {totalCards - queue.length - (activeCard ? 0 : 1)} /{" "}
            {totalCards}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-1 font-bold transition-colors ${streak > 2 ? "text-orange-500 scale-110" : "text-stone-400"}`}
          >
            <Flame className={`w-5 h-5 ${streak > 2 && "animate-bounce"}`} /> x
            {streak}
          </div>
        </div>
      </header>

      {/* KHU VỰC THẺ CHÍNH Ở GIỮA */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full mt-8">
        <div className="h-[350px] w-full flex justify-center items-center relative">
          <AnimatePresence mode="popLayout">
            {activeCard && (
              <motion.div
                key={activeCard.id}
                layoutId={`card-${activeCard.id}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  y: -150, // Bay vút lên trên biến mất
                  scale: 0.8,
                  filter: "blur(4px)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative w-72 h-96 cursor-pointer"
                style={{ perspective: 1000 }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <motion.div
                  className="w-full h-full absolute"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* MẶT TRƯỚC (Từ tiếng Anh) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl flex flex-col justify-center items-center bg-white border-2 border-stone-200 shadow-xl hover:shadow-2xl hover:border-amber-300 transition-all"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-5xl font-serif font-bold text-stone-800">
                      {activeCard.word}
                    </span>
                    <span className="text-lg text-stone-400 mt-2 font-medium">
                      ({activeCard.type})
                    </span>
                    <div className="absolute bottom-6 text-stone-300 flex flex-col items-center text-sm">
                      <Eye className="w-5 h-5 mb-1" /> Chạm để lật
                    </div>
                  </div>

                  {/* MẶT SAU (Nghĩa tiếng Việt) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-3xl flex flex-col justify-center items-center bg-stone-800 border-2 border-stone-800 shadow-xl"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span className="text-lg font-medium text-stone-400 mb-2">
                      {activeCard.word} ({activeCard.type})
                    </span>
                    <span className="text-4xl font-serif font-bold text-white px-4 text-center">
                      {activeCard.meaning}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NÚT ĐIỀU KHIỂN SAU KHI LẬT */}
        <div className="h-24 mt-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isFlipped && activeCard ? (
              <motion.button
                key="flip-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setIsFlipped(true)}
                className="px-10 py-4 bg-white border-2 border-stone-200 text-stone-700 hover:border-amber-400 rounded-2xl font-bold text-lg shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                Lật thẻ{" "}
                <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-500">
                  Phím Space
                </span>
              </motion.button>
            ) : isFlipped && activeCard ? (
              <motion.div
                key="action-btns"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-4"
              >
                <button
                  onClick={() => handleNextCard(false)}
                  className="flex flex-col items-center justify-center w-32 h-16 bg-red-100 text-red-600 hover:bg-red-200 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  <span className="flex items-center gap-1">
                    <X className="w-5 h-5" /> Quên
                  </span>
                  <span className="text-[10px] font-normal opacity-60">
                    Phím ←
                  </span>
                </button>
                <button
                  onClick={() => handleNextCard(true)}
                  className="flex flex-col items-center justify-center w-32 h-16 bg-green-500 text-white hover:bg-green-600 rounded-2xl font-bold shadow-lg shadow-green-500/30 active:scale-95 transition-all"
                >
                  <span className="flex items-center gap-1">
                    <Check className="w-5 h-5" /> Nhớ
                  </span>
                  <span className="text-[10px] font-normal opacity-80">
                    Phím →
                  </span>
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </main>

      {/* DÀN BÀI NGANG Ở DƯỚI (HÀNG ĐỢI) */}
      <footer className="w-full flex justify-center py-8">
        <div className="flex gap-3 px-4 max-w-full overflow-hidden justify-center items-center h-24">
          <AnimatePresence>
            {queue.map((card, index) => {
              // Chỉ hiển thị tối đa 5 thẻ ở dưới cho đỡ chật màn hình
              if (index > 4) return null;

              return (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{
                    opacity: 1 - index * 0.15,
                    scale: 1 - index * 0.05,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="w-14 h-20 sm:w-16 sm:h-24 bg-white border border-stone-200 rounded-lg shadow-sm flex items-center justify-center shrink-0 relative overflow-hidden"
                >
                  <div className="absolute w-full h-full bg-gradient-to-br from-stone-50 to-stone-200 opacity-50" />
                  <span className="text-stone-300 font-serif font-bold text-xs">
                    {card.type}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {queue.length > 5 && (
            <div className="text-stone-400 font-bold text-sm ml-2">
              +{queue.length - 5}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default FlashcardGame;
