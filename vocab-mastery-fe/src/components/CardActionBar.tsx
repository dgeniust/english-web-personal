// src/components/CardActionBar.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useCardStore } from "../store/useCardStore";
import { Button } from "@/components/ui/button"; // Component từ shadcn

export const CardActionBar = () => {
  const { selectedIds, clearSelection } = useCardStore();

  if (selectedIds.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#fdfbf9]/90 backdrop-blur-xl border-[1.5px] border-[var(--color-charcoal)] px-6 py-4 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      >
        <div className="flex flex-col">
          <span className="font-sans font-bold text-[var(--color-charcoal)] text-lg">
            Đã chọn {selectedIds.length} thẻ
          </span>
        </div>

        <div className="h-8 w-[1.5px] bg-[var(--color-charcoal)] opacity-20 mx-2" />

        <div className="flex gap-2">
          <Button variant="default" className="rounded-xl font-medium">
            🎮 Chơi Game
          </Button>
          <Button variant="secondary" className="rounded-xl font-medium">
            🧠 Flashcard
          </Button>
          <Button
            variant="ghost"
            onClick={clearSelection}
            className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 font-medium"
          >
            Bỏ chọn tất cả
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
