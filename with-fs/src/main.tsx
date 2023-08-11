import React, { } from "react";
import ReactDOM from "react-dom/client";
import { DataverseContextProvider } from "@dataverse/hooks";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModelParser, Output } from "@dataverse/model-parser";
import App from "./pages/App";
import Folder from "./pages/Folder";
import File from "./pages/File";
import app from "../output/app.json";
import pacakage from "../package.json";
import "./index.css";
import "./global.css";

const appVersion = pacakage.version;
const modelParser = new ModelParser(app as Output);

export const AppContext = React.createContext<{
  appVersion: string;
  modelParser: ModelParser;
}>({
  appVersion,
  modelParser,
});

const Index = () => {
  return <BrowserRouter>
    <AppContext.Provider value={{ appVersion, modelParser }}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/folder" element={<Folder />} />
        <Route path="/file" element={<File />} />
      </Routes>
    </AppContext.Provider>
  </BrowserRouter>
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <Index />
  </DataverseContextProvider>
);
