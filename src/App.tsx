import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "@/pages/SignUp";
import LayoutStudy from "@/pages/LayoutStudy";
import LayoutGallery from "@/pages/LayoutGallery";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/layouts" element={<LayoutStudy />} />
        <Route path="/gallery" element={<LayoutGallery />} />
      </Routes>
    </BrowserRouter>
  );
}
