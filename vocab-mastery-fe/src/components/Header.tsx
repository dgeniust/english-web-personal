import { PointingHandIcon } from "./Stickers";

export const Header = () => {
  return (
    <header className="w-full flex justify-between items-center py-6 px-8 bg-[var(--color-cream-paper)] z-10 relative">
      <div className="md:hidden">
        <PointingHandIcon />
      </div>
      <div className="hidden md:block">{/* Spacer for desktop */}</div>

      <button className="bg-[var(--color-cream-paper)] border-[1.5px] border-[var(--color-charcoal)] rounded-[20px] px-[28px] py-[10px] text-[16px] font-medium text-[var(--color-charcoal)] shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:bg-[var(--color-dew-drop)] transition-colors font-sans lowercase">
        new parchi
      </button>
    </header>
  );
};
