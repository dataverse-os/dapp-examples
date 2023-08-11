import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "./context/configContext";
import { UserProvider } from "./context/userContext";
import Toolkits from "./pages/toolkits";
import "./index.css";
import "./global.css";
import { DataverseContextProvider } from "@dataverse/hooks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <ConfigProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/toolkits" element={<Toolkits />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ConfigProvider>
  </DataverseContextProvider>
);
