import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Browser } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext.jsx";
import ChatContextProvider from "./context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ChatContextProvider>
      <React.StrictMode>
        <Browser>
          <App />
        </Browser>
      </React.StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);
