import React, {  } from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App/App";
import "./index.css";
import { DataverseContextProvider } from "@dataverse/hooks";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import app from "../output/app.json";
import pacakage from "../package.json";
import { ModelParser, Output } from "@dataverse/model-parser";
import Folder from "./pages/Folder";

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
      </Routes>
    </AppContext.Provider>
  </BrowserRouter>
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <Index />
  </DataverseContextProvider>
);
