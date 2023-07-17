import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "./context/configContext";
import { UserProvider } from "./context/userContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ConfigProvider>
    <UserProvider>
        <App />
    </UserProvider>
  </ConfigProvider>
);
