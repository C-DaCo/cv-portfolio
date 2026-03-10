import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { TestDashboard } from "./pages/TestDashboard/TestDashboard";
import "./i18n/index";
import React from "react";


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/tests" element={<TestDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);