import { HeartSticker } from "./Stickers";

export const Footer = () => {
  return (
    <footer className="w-full bg-[var(--color-marker-orange)] mt-24 rounded-tl-[56px] rounded-tr-[12px] border-t-[1.5px] border-[var(--color-charcoal)] pt-16 pb-8 px-8 relative overflow-hidden">
      <div className="absolute top-10 right-20 opacity-50">
        <HeartSticker />
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="font-gelica-fallback text-[46px] text-[var(--color-cream-paper)] lowercase leading-[1.2] m-0">
            we're done, <br /> and we had fun.
          </h2>
          <div className="flex gap-4 font-sans text-[var(--color-cream-paper)] lowercase">
            <a href="#" className="hover:underline decoration-wavy">
              about
            </a>
            <a href="#" className="hover:underline decoration-wavy">
              privacy
            </a>
            <a href="#" className="hover:underline decoration-wavy">
              terms
            </a>
          </div>
        </div>

        <p className="font-handwriting text-[24px] text-[var(--color-cocoa-ink)] rotate-[-2deg]">
          made in schoolyard.
        </p>
      </div>
    </footer>
  );
};
