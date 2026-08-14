import { Home } from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    // Nếu có React Router, bạn sẽ set up <BrowserRouter>, <Routes>, <Route> ở đây
    // Ví dụ:
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
