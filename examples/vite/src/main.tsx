import "trek-core/trek.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { TrekProvider } from "trek-core";

createRoot(document.getElementById("trek")!).render(
  <StrictMode>
    <TrekProvider>
      <App />
    </TrekProvider>
  </StrictMode>,
);
