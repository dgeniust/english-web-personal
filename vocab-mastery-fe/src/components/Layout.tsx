import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[var(--color-cream-paper)] text-[var(--color-charcoal)]">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full relative">
        <Header />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 pt-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
