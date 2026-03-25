import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { TestDashboard } from "./pages/TestDashboard/TestDashboard";
import { ErrorBoundary } from "@components/ui/ErrorBoundary/ErrorBoundary";
import "./i18n/index";
import React from "react";
import photoUrl from "./assets/photo-320.webp";

// Preload LCP image — injecté avant le montage React pour que le browser
// commence le téléchargement dès l'exécution du script
const preloadLink = document.createElement("link");
preloadLink.rel = "preload";
preloadLink.as = "image";
preloadLink.href = photoUrl;
preloadLink.setAttribute("fetchpriority", "high");
document.head.appendChild(preloadLink);


const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Élément #root introuvable dans le DOM — vérifier index.html");

createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/tests" element={<TestDashboard />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);