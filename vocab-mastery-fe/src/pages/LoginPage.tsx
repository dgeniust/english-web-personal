import { useState } from "react";
import { motion } from "framer-motion";
import { FlowerSVG } from "../components/svg/FlowerSVG";
import { HeartSVG } from "../components/svg/HeartSVG";
import { StarSVG } from "../components/svg/StarSVG";
import { BookSVG } from "../components/svg/BookSVG";
import { LotusSVG } from "../components/svg/LotusSVG";

const HandDrawnArrow = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    width="100%"
    height="100%"
    overflow="visible"
  >
    <path
      d="M10 10 Q 40 10, 60 50 T 80 90"
      fill="none"
      stroke="#ff6f1e"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M65 85 L 80 90 L 85 75"
      fill="none"
      stroke="#ff6f1e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf9] text-[#171717] overflow-x-hidden relative selection:bg-[#ff6f1e] selection:text-white">
      {/* 
        Injecting Google Fonts directly into the component to maintain single-file mandate.
        Using DM Serif Display as the fallback for 'gelica', Playwrite for handwriting, and Inter for 'geist'.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&family=Playwrite+GB+S:ital,wght@0,100..400;1,100..400&display=swap');
        .font-gelica { font-family: 'DM Serif Display', serif; }
        .font-geist { font-family: 'Inter', sans-serif; }
        .font-hand { font-family: 'Playwrite GB S', cursive; }
        .shadow-subtle { box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25); }
        .shadow-card { box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.06); }
        .border-ink { border: 1.5px solid #171717; }
        
        /* Custom marker highlight effect */
        .marker-highlight {
          position: relative;
          color: #ff6f1e;
          white-space: nowrap;
        }
        .marker-highlight::after {
          content: '';
          position: absolute;
          left: -2px;
          right: -2px;
          bottom: 2px;
          height: 3px;
          background-color: #ff6f1e;
          border-radius: 4px;
          transform: rotate(-1deg);
          z-index: -1;
        }
      `}</style>

      {/* Top Header */}
      <header className="w-full max-w-[1200px] mx-auto px-6 py-6 flex justify-between items-center z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        >
          <LotusSVG />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#fdfbf9] border-ink rounded-[20px] px-5 py-2 font-geist font-medium text-[16px] shadow-subtle hover:bg-[#f7efe9] active:scale-95 transition-all"
        >
          sign up
        </motion.button>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center py-12 z-10">
        {/* Left Column: Typography & Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col relative"
        >
          <h1 className="font-gelica text-[56px] md:text-[84px] leading-[1.08] text-[#2b1a07] lowercase tracking-tight mb-4">
            open your <br /> superrbook
          </h1>

          <p className="font-geist text-[20px] text-[#171717] max-w-md mb-10 leading-[1.5]">
            Welcome back to class! Grab your favorite{" "}
            <span className="marker-highlight">pencil</span> and let's get back
            to learning english, actually!
          </p>

          <form
            className="flex flex-col gap-5 max-w-sm relative"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-1.5">
              <label className="font-geist text-[16px] text-[#171717] font-medium pl-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@school.com"
                className="bg-[#f7efe9] border-ink rounded-[8px] px-4 py-3 font-geist text-[18px] outline-none focus:ring-2 focus:ring-[#ff6f1e] focus:bg-[#fdfbf9] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-geist text-[16px] text-[#171717] font-medium pl-1">
                Secret password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#f7efe9] border-ink rounded-[8px] px-4 py-3 font-geist text-[18px] outline-none focus:ring-2 focus:ring-[#ff6f1e] focus:bg-[#fdfbf9] transition-colors"
              />
            </div>

            <div className="mt-4 relative">
              <button
                type="submit"
                className="w-full bg-[#fdfbf9] border-ink rounded-[20px] px-8 py-3 shadow-subtle hover:bg-[#f7efe9] active:scale-95 transition-all font-geist font-medium text-[18px] cursor-pointer"
              >
                let's go!
              </button>

              {/* Handwritten Note near button */}
              <motion.div
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: -12 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute -right-24 top-2 pointer-events-none"
              >
                <div className="font-hand text-[#ff6f1e] text-[20px]">
                  click me!
                </div>
                <div className="w-12 h-12 -ml-8 -mt-2 -rotate-[60deg]">
                  <HandDrawnArrow />
                </div>
              </motion.div>
            </div>

            <p className="font-geist text-[16px] text-[#2b1a07] mt-2 pl-1">
              Forgot your password?{" "}
              <a
                href="#"
                className="text-[#ff6f1e] hover:underline underline-offset-4 decoration-2"
              >
                Reset it here.
              </a>
            </p>
          </form>
        </motion.div>

        {/* Right Column: Imagery / Notebook Visual */}
        <div className="relative h-[600px] flex items-center justify-center pointer-events-none md:pointer-events-auto">
          {/* Draggable Stickers scattered around */}
          <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            }}
            className="absolute top-10 left-10 w-20 h-20 z-30 cursor-grab active:cursor-grabbing rotate-[-12deg]"
          >
            <FlowerSVG />
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            animate={{ y: [0, 8, 0] }}
            transition={{
              y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 },
            }}
            className="absolute bottom-10 right-4 w-24 h-24 z-30 cursor-grab active:cursor-grabbing rotate-[15deg]"
          >
            <HeartSVG />
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            animate={{ y: [0, -12, 0] }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 3.5,
                ease: "easeInOut",
                delay: 0.5,
              },
            }}
            className="absolute top-32 right-12 w-16 h-16 z-30 cursor-grab active:cursor-grabbing rotate-[8deg]"
          >
            <StarSVG />
          </motion.div>

          <motion.div
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            animate={{ y: [0, 15, 0] }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut",
                delay: 1.5,
              },
            }}
            className="absolute bottom-32 left-4 w-20 h-20 z-30 cursor-grab active:cursor-grabbing rotate-[-5deg]"
          >
            <BookSVG />
          </motion.div>

          {/* The Hero Product Object: A CSS Illustrated Notebook */}
          <motion.div
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 6, scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 100,
              delay: 0.2,
            }}
            className="relative w-[340px] h-[460px] bg-[#3b82f6] rounded-r-[16px] rounded-l-[4px] shadow-card border-ink flex items-center justify-center z-20 group"
          >
            {/* Notebook Binding Edge */}
            <div className="absolute left-0 top-0 bottom-0 w-10 border-r-[2px] border-[#171717] bg-[#171717]/10 flex flex-col justify-evenly items-center">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-2 bg-[#fdfbf9] border-ink rounded-full -ml-4"
                />
              ))}
            </div>

            {/* Sticker Name Label on Notebook */}
            <motion.div
              whileHover={{ rotate: -2, scale: 1.05 }}
              className="bg-white border-[1.5px] border-[#171717] rounded-[8px] w-56 p-4 shadow-subtle flex flex-col gap-3 -rotate-4 mt-12 cursor-pointer"
            >
              <div className="text-[#171717] font-geist text-sm border-b-[1.5px] border-[#171717]/20 pb-1 flex justify-between items-end">
                <span>Name:</span>
                <span className="font-hand text-[#ff6f1e] text-[22px] leading-none">
                  Ha Lan
                </span>
              </div>
              <div className="text-[#171717] font-geist text-sm border-b-[1.5px] border-[#171717]/20 pb-1 flex justify-between items-end">
                <span>Subject:</span>
                <span className="font-hand text-[#ff6f1e] text-[22px] leading-none">
                  English
                </span>
              </div>
              <div className="text-[#171717] font-geist text-sm border-b-[1.5px] border-[#171717]/20 pb-1 flex justify-between items-end">
                <span>Roll No:</span>
                <span className="font-hand text-[#ff6f1e] text-[22px] leading-none">
                  01 🌸
                </span>
              </div>
            </motion.div>

            {/* Script annotation pointing to notebook */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-16 -right-16 pointer-events-none"
            >
              <div className="font-hand text-[#ff6f1e] text-[24px] rotate-[8deg]">
                a big blue parchi!
              </div>
              <div className="w-16 h-16 ml-4 mt-2 rotate-[120deg] scale-y-[-1]">
                <HandDrawnArrow />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer Brand Band */}
      <footer className="mt-auto bg-[#ff6f1e] w-full pt-10 pb-8 px-6 rounded-t-[56px] z-20">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-gelica text-[#fdfbf9] text-[24px] lowercase">
            superr english
          </p>
          <div className="font-geist text-[16px] text-[#fdfbf9]/90 flex gap-6">
            <a href="#" className="hover:text-[#171717] transition-colors">
              terms
            </a>
            <a href="#" className="hover:text-[#171717] transition-colors">
              privacy
            </a>
            <a href="#" className="hover:text-[#171717] transition-colors">
              help
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
