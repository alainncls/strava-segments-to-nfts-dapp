import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter } from "react-router-dom";
import { Web3ModalProvider } from "./Web3ModalProvider";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Web3ModalProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Web3ModalProvider>
  </React.StrictMode>,
);
