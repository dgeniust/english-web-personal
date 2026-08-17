import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

// --- KHO DỮ LIỆU TỪ VỰNG MẪU ---
interface RememberCard {
  id: number;
  word: string;
  meaning: string;
  type: string; // n, v, adj, adv...
}

const SAMPLE_VOCABULARY: RememberCard[] = [
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

// Hàm trộn mảng
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const RememberCardGame: React.FC = () => {
  // Trạng thái game
  const [round, setRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Bộ bài ở dưới (chứa tất cả các từ chưa được bốc)
  const [deck, setDeck] = useState<RememberCard[]>([]);

  // Trạng thái Round hiện tại
  const [slotsCount, setSlotsCount] = useState<number>(1);
  const [selectedCards, setSelectedCards] = useState<(RememberCard | null)[]>(
    [],
  );
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [roundResults, setRoundResults] = useState<
    { isCorrect: boolean }[] | null
  >(null);

  const [isDealt, setIsDealt] = useState(false);

  // Khởi tạo game
  const initGame = () => {
    const shuffled = shuffleArray(SAMPLE_VOCABULARY);
    setDeck(shuffled);
    setScore(0);
    setRound(1);
    setIsFinished(false);
    setupNextRound(shuffled.length, 1);
  };

  useEffect(() => {
    initGame();
  }, []);

  // Bắt đầu một vòng mới
  const setupNextRound = (
    remainingCardsCount: number,
    nextRoundNum: number,
  ) => {
    setIsDealt(false);
    setRoundResults(null);
    setRound(nextRoundNum);

    // Random số lượng ô từ 1 đến 3 (không vượt quá số thẻ còn lại)
    const count = Math.min(
      Math.floor(Math.random() * 3) + 1,
      remainingCardsCount,
    );

    setSlotsCount(count);
    setSelectedCards(Array(count).fill(null));
    setUserInputs(Array(count).fill(""));

    setTimeout(() => setIsDealt(true), 600);
  };

  // Bốc thẻ từ dưới bộ bài đưa lên ô trống
  const handleSelectCard = (card: RememberCard) => {
    if (roundResults) return; // Nếu đã chấm điểm thì khóa
    const nextSlot = selectedCards.findIndex((slot) => slot === null);
    if (nextSlot === -1) return; // Nếu ô đã đầy thì không cho bốc

    const newSelected = [...selectedCards];
    newSelected[nextSlot] = card;
    setSelectedCards(newSelected);

    // Rút thẻ khỏi deck ở dưới
    setDeck((prev) => prev.filter((c) => c.id !== card.id));
  };

  // Hoàn tác thẻ từ ô trống trả về bộ bài ở dưới
  const handleRemoveCard = (index: number) => {
    if (roundResults) return; // Khóa khi đã chấm
    const card = selectedCards[index];
    if (!card) return;

    const newSelected = [...selectedCards];
    newSelected[index] = null;
    setSelectedCards(newSelected);

    // Trả lại thẻ vào deck
    setDeck((prev) => [...prev, card]);

    // Xóa chữ đã nhập
    const newInputs = [...userInputs];
    newInputs[index] = "";
    setUserInputs(newInputs);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);
  };

  // Kiểm tra hợp lệ (đã điền đủ tất cả các ô)
  const canSubmit =
    selectedCards.every((card) => card !== null) &&
    userInputs.every((input) => input.trim() !== "");

  // Chấm bài
  const handleSubmit = () => {
    let roundScore = 0;
    const results = selectedCards.map((card, index) => {
      if (!card) return { isCorrect: false };

      const isCorrect =
        userInputs[index].trim().toLowerCase() === card.meaning.toLowerCase();
      if (isCorrect) roundScore += 1;
      return { isCorrect };
    });

    setRoundResults(results);
    setScore((prev) => prev + roundScore);
  };

  // Chuyển sang vòng kế hoặc kết thúc
  const handleNextRound = () => {
    if (deck.length === 0) {
      setIsFinished(true); // Nếu không còn bài ở dưới thì kết thúc
    } else {
      setupNextRound(deck.length, round + 1);
    }
  };

  // Màn hình kết thúc
  if (isFinished) {
    const percentage = Math.round((score / SAMPLE_VOCABULARY.length) * 100);
    return (
      <div className="min-h-screen bg-[#f6f5f0] flex flex-col items-center justify-center p-6 font-serif">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full border border-stone-200"
        >
          <h2 className="text-3xl font-bold text-stone-800 mb-4">
            Kết Quả Cuối Cùng
          </h2>
          <div className="text-6xl font-bold text-amber-500 mb-6">
            {percentage}%
          </div>
          <p className="text-stone-600 text-lg mb-8">
            Bạn đã trả lời đúng {score} / {SAMPLE_VOCABULARY.length} từ vựng!
          </p>
          <button
            onClick={initGame}
            className="w-full flex justify-center items-center gap-2 px-6 py-4 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-medium tracking-wide transition-all active:scale-95"
          >
            <RefreshCcw className="w-5 h-5" />
            Chơi Lại Lần Nữa
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f6f5f0] text-slate-800 flex flex-col justify-between overflow-hidden p-4 sm:p-6 select-none font-sans">
      {/* HEADER */}
      <header className="flex justify-between items-center z-50 relative pointer-events-auto max-w-6xl w-full mx-auto">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-semibold tracking-wide text-stone-800">
            Trải Bài Từ Vựng
          </h1>
          <p className="text-sm text-stone-500 mt-1 font-medium">
            Round {round} • Còn lại: {deck.length} thẻ
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm font-semibold text-stone-600 bg-stone-200 px-4 py-2 rounded-full">
            Điểm: {score}
          </div>
          <button
            onClick={initGame}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-100 active:scale-95 border border-stone-300 rounded-full text-xs uppercase font-bold tracking-wider text-stone-600 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      </header>

      {/* KHU VỰC ĐIỀN ĐÁP ÁN (SLOTS) */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 w-full mt-4">
        <div className="flex justify-center gap-4 sm:gap-10 w-full max-w-5xl px-2">
          {Array.from({ length: slotsCount }).map((_, index) => {
            const card = selectedCards[index];
            const isEvaluated = roundResults !== null;
            const isCorrect = isEvaluated
              ? roundResults[index].isCorrect
              : null;

            return (
              <div
                key={index}
                className="flex flex-col items-center w-full max-w-[280px]"
              >
                {/* Khung thẻ bài */}
                <div
                  className={`relative w-40 h-56 sm:w-56 sm:h-[18rem] rounded-2xl border-2 border-dashed flex items-center justify-center transition-colors
                    ${card ? "border-transparent" : "border-stone-300 bg-stone-200/40"}
                  `}
                >
                  {card ? (
                    <motion.div
                      layoutId={`card-${card.id}`}
                      onClick={() => handleRemoveCard(index)}
                      className={`w-full h-full rounded-2xl shadow-lg border overflow-hidden flex flex-col justify-center items-center cursor-pointer p-4 transition-colors
                        ${
                          isEvaluated
                            ? isCorrect
                              ? "bg-green-50 border-green-400"
                              : "bg-red-50 border-red-400"
                            : "bg-white border-stone-200 hover:border-amber-300 hover:shadow-xl"
                        }
                      `}
                    >
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-800 text-center flex flex-col items-center gap-2">
                        {card.word}
                        <span className="text-base sm:text-lg text-stone-500 font-medium font-sans">
                          ({card.type})
                        </span>
                      </span>

                      {/* Icon báo kết quả */}
                      {isEvaluated && (
                        <div className="absolute top-4 right-4">
                          {isCorrect ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          ) : (
                            <XCircle className="w-8 h-8 text-red-500" />
                          )}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <span className="text-xs sm:text-sm text-stone-400 font-medium">
                      Bốc 1 thẻ vào đây
                    </span>
                  )}
                </div>

                {/* Form điền từ vựng (chỉ điền Nghĩa) */}
                <AnimatePresence>
                  {card && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="w-full mt-4 flex flex-col gap-3"
                    >
                      <input
                        type="text"
                        placeholder="Nhập nghĩa tiếng việt..."
                        disabled={isEvaluated}
                        value={userInputs[index]}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        className={`w-full px-4 py-3.5 rounded-xl border text-sm sm:text-base outline-none transition-all ${
                          isEvaluated && !isCorrect
                            ? "border-red-400 bg-red-50 text-red-700 font-semibold"
                            : "border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                        }`}
                      />
                      {/* Hiển thị đáp án đúng nếu sai */}
                      {isEvaluated && !isCorrect && (
                        <div className="text-sm text-red-600 bg-red-100 p-2.5 rounded-lg font-medium text-center shadow-sm">
                          Đáp án đúng:{" "}
                          <span className="font-bold">{card.meaning}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Nút Hành động */}
        <div className="h-24 mt-8 flex items-center justify-center">
          {!roundResults ? (
            <AnimatePresence>
              {canSubmit && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={handleSubmit}
                  className="px-8 py-3.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold tracking-wide shadow-lg shadow-stone-800/20 active:scale-95 transition-all"
                >
                  Nộp Bài Cả {slotsCount} Ô
                </motion.button>
              )}
            </AnimatePresence>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleNextRound}
              className="flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold tracking-wide shadow-lg active:scale-95 transition-all"
            >
              {deck.length === 0
                ? "Xem Kết Quả Cuối Cùng"
                : "Tiếp Tục Round Kế"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </main>

      {/* BỘ BÀI Ở DƯỚI (FAN SPREAD) */}
      <footer className="relative w-full h-40 sm:h-48 flex justify-center items-end pb-4 overflow-visible z-20 pointer-events-none">
        <div className="relative w-full max-w-4xl flex justify-center items-end pointer-events-auto">
          <AnimatePresence mode="popLayout">
            {deck.map((card, i) => {
              const total = deck.length;
              // Xếp hình quạt linh hoạt tùy số lượng thẻ còn lại
              const angle = (i - (total - 1) / 2) * 5;
              const xOffset = (i - (total - 1) / 2) * 28;
              const yOffset = Math.abs(i - (total - 1) / 2) * 3;

              return (
                <motion.div
                  key={card.id}
                  layout
                  layoutId={`card-${card.id}`}
                  onClick={() => handleSelectCard(card)}
                  style={{ transformOrigin: "bottom center", zIndex: i }}
                  initial={{ opacity: 0, y: 140, scale: 0.7 }}
                  animate={{
                    rotate: angle,
                    x: xOffset,
                    y: yOffset,
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  whileHover={{
                    y: yOffset - 40,
                    scale: 1.15,
                    zIndex: 100,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 30,
                    mass: 0.8,
                    delay: isDealt ? 0 : i * 0.05,
                  }}
                  className="absolute bottom-0 w-[140px] h-[180px] sm:w-[170px] sm:h-[220px] rounded-xl bg-zinc-800 border-2 border-stone-600 shadow-xl cursor-pointer hover:border-amber-400 flex items-center justify-center p-1.5"
                >
                  <img
                    src="https://i.pinimg.com/736x/1a/6a/af/1a6aaf36529cf70e9ab47b02be2b4d4e.jpg"
                    alt="Mặt sau thẻ bài"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </footer>
    </div>
  );
};

export default RememberCardGame;
