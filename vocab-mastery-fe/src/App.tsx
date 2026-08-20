import GameFlashCard from "./pages/GameFlashCard";
import GameRememberCard from "./pages/GameRememberCard";
import { Home } from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CollectionsPage from "./pages/CollectionPage";
export default function App() {
  return (
    // Nếu có React Router, bạn sẽ set up <BrowserRouter>, <Routes>, <Route> ở đây
    // Ví dụ:
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<CollectionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/flash-card" element={<GameFlashCard />} />
        <Route path="/remember-card" element={<GameRememberCard />} />
      </Routes>
    </BrowserRouter>
  );
}
