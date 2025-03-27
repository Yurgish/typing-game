import "@repo/ui/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import Lesson from "./pages/Lesson.tsx";
import Lessons from "./pages/Lessons.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
