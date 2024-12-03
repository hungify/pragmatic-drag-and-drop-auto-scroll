import { createRoot } from "react-dom/client";
import "./index.css";
import AppProvider from "@atlaskit/app-provider";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
