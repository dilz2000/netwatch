import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { WebSocketProvider } from "./lib/websocket";

import { TempoDevtools } from "tempo-devtools";
import { WebSocketProvider } from "./services/websocket-provider.tsx";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
