import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./LobbyHost.tsx"; // ここを変える

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
