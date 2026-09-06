import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "@/pages/SignUp";
import LayoutStudy from "@/pages/LayoutStudy";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/layouts" element={<LayoutStudy />} />
      </Routes>
    </BrowserRouter>
  );
}
