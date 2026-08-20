import type { WordsResponse } from "../types/word";
import { motion } from "framer-motion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AddIcon } from "./svg/AddSVG";
import { CheckIcon } from "./svg/CheckSVG";
import { EditIcon } from "./svg/EditSVG";
import { BinIcon } from "./svg/BinSVG";

interface WordCardProps {
  item: WordsResponse;
  isSelected: boolean;
  onSelect: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onAddToCollection?: (id: string | number) => void;
}

// Sticker trang trí xuất hiện khi thẻ được chọn (Sprout Sticker Green)
const SelectedSticker = () => (
  <motion.div
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: 1, rotate: 12 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
    className="absolute -top-3 -right-3 z-10 w-8 h-8 drop-shadow-md"
  >
    <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
      <path
        d="M50 10L61 38H90L67 56L76 85L50 68L24 85L33 56L10 38H39L50 10Z"
        fill="var(--color-sprout-sticker, #22c55e)"
        stroke="var(--color-charcoal, #171717)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </motion.div>
);

export const WordCard = ({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onAddToCollection,
}: WordCardProps) => {
  const cardId = item.id || item.term;

  return (
    <ContextMenu>
      {/* Sử dụng asChild để truyền ContextMenuTrigger vào motion.div */}
      <ContextMenuTrigger>
        <motion.div
          layout
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.02,
            rotate: isSelected ? 0 : -2, // Nghiêng nhẹ như mảnh giấy thật khi hover
            transition: { type: "spring", stiffness: 300 },
          }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onSelect(cardId)}
          className={`relative bg-[var(--color-cream-paper)] border-[1.5px] rounded-[12px] p-[24px] flex flex-col gap-3 cursor-pointer select-none
            ${
              isSelected
                ? "border-[var(--color-charcoal)] bg-[var(--color-dew-drop)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.25)]"
                : "border-[var(--color-charcoal)] shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            }
          `}
        >
          {isSelected && <SelectedSticker />}

          {/* Headline: Sử dụng Gelica, chữ thường, màu Cocoa Ink */}
          <h3 className="font-gelica-fallback text-[32px] text-[var(--color-cocoa-ink)] lowercase leading-[1.08]">
            {item.term}
          </h3>

          <div className="flex flex-col gap-2">
            {/* Tag từ loại: Bo góc 20px (pill radius), viền charcoal */}
            <span className="self-start font-sans font-medium border-[1.5px] border-[var(--color-charcoal)] bg-[var(--color-cream-paper)] text-[var(--color-charcoal)] text-[14px] rounded-[20px] px-3 py-1">
              {item.type}
            </span>

            {/* Dịch nghĩa: Viết tay bằng bút dạ cam (Marker Orange) */}
            <div className="relative mt-2">
              <p className="font-handwriting text-[22px] text-[var(--color-marker-orange)] leading-[1.5]">
                {item.meaning}
              </p>
              {/* Nét gạch dưới mô phỏng nét bút dạ */}
              <svg
                className="absolute -bottom-1 left-0 w-full h-[4px] opacity-40 pointer-events-none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,2 Q50,4 100,0"
                  stroke="var(--color-marker-orange)"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      </ContextMenuTrigger>

      {/* Tùy chỉnh ContextMenu theo style bảng vẽ: Giấy nền Cream, viền Charcoal */}
      <ContextMenuContent className="w-56 bg-[#fdfbf9]/75 backdrop-blur-xl border border-white/60 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-2 font-sans">
        <ContextMenuItem
          onClick={() => onAddToCollection?.(cardId)}
          className="cursor-pointer text-[15px] font-medium text-[var(--color-charcoal)] focus:bg-white/80 focus:shadow-sm focus:text-[var(--color-charcoal)] rounded-[10px] py-2.5 mb-1 transition-all"
        >
          <span className="mr-3 flex items-center justify-center text-[var(--color-sprout-sticker)] bg-white/90 p-1.5 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <AddIcon />
          </span>
          Thêm vào Collection
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => onSelect(cardId)}
          className="cursor-pointer text-[15px] font-medium text-[var(--color-charcoal)] focus:bg-white/80 focus:shadow-sm focus:text-[var(--color-charcoal)] rounded-[10px] py-2.5 mb-1 transition-all"
        >
          <span className="mr-3 flex items-center justify-center text-[var(--color-sky-sticker)] bg-white/90 p-1.5 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <CheckIcon />
          </span>
          {isSelected ? "Bỏ chọn thẻ này" : "Chọn thẻ này"}
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => onEdit?.(cardId)}
          className="cursor-pointer text-[15px] font-medium text-[var(--color-charcoal)] focus:bg-white/80 focus:shadow-sm focus:text-[var(--color-charcoal)] rounded-[10px] py-2.5 transition-all"
        >
          <span className="mr-3 flex items-center justify-center text-[var(--color-marker-orange)] bg-white/90 p-1.5 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <EditIcon />
          </span>
          Chỉnh sửa
        </ContextMenuItem>

        <ContextMenuSeparator className="bg-[var(--color-charcoal)] opacity-10 my-2 mx-1" />

        <ContextMenuItem
          onClick={() => onDelete?.(cardId)}
          className="cursor-pointer text-[15px] font-semibold text-[#b91c1c] focus:bg-red-50/80 focus:shadow-sm focus:text-[#991b1b] rounded-[10px] py-2.5 transition-all"
        >
          <span className="mr-3 flex items-center justify-center text-[#ef4444] bg-white/90 p-1.5 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
            <BinIcon />
          </span>
          Xoá từ này
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
