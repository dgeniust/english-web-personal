import { PointingHandIcon, LightningSticker } from "./Stickers";

export const Sidebar = () => {
  return (
    <aside className="w-[260px] hidden md:flex flex-col border-r-[1.5px] border-[var(--color-charcoal)] h-screen sticky top-0 bg-[var(--color-cream-paper)] pt-6 pb-12 px-6">
      <div className="mb-12 flex items-center gap-3">
        <PointingHandIcon />
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <p className="font-handwriting text-[20px] text-[var(--color-marker-orange)] mb-2 rotate-[-4deg]">
          index
        </p>

        {["my collection", "recent parchis", "favorites", "archived"].map(
          (item, idx) => (
            <a
              key={item}
              href="#"
              className={`px-4 py-2 rounded-[8px] text-[18px] font-medium lowercase transition-all flex items-center justify-between
              ${
                idx === 0
                  ? "bg-[var(--color-dew-drop)] border-[1.5px] border-[var(--color-charcoal)] text-[var(--color-charcoal)]"
                  : "text-[var(--color-charcoal)] border-[1.5px] border-transparent hover:border-dashed hover:border-[var(--color-charcoal)]"
              }`}
            >
              {item}
              {idx === 0 && (
                <span className="w-2 h-2 rounded-full bg-[var(--color-marker-orange)]"></span>
              )}
            </a>
          ),
        )}
      </nav>

      <div className="relative mt-auto">
        <div className="absolute -top-10 -right-4">
          <LightningSticker />
        </div>
        <div className="bg-[var(--color-dew-drop)] border-[1.5px] border-[var(--color-charcoal)] rounded-[12px] p-4 text-center">
          <p className="font-gelica-fallback text-[24px] text-[var(--color-cocoa-ink)] lowercase leading-tight">
            upgrade to <br /> superrbook pro
          </p>
        </div>
      </div>
    </aside>
  );
};
