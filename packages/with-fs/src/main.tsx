import React from "react";
import ReactDOM from "react-dom/client";

import { DataverseContextProvider } from "@dataverse/hooks";
import { ModelParser, Output } from "@dataverse/model-parser";

import App from "./App";
import app from "../output/app.json";
import "./index.css";
import "./global.css";

// const appVersion = pacakage.version;
const modelParser = new ModelParser(app as Output);

export const AppContext = React.createContext<{
  appVersion: string;
  modelParser: ModelParser;
}>({
  appVersion: "0.0.1",
  modelParser,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <AppContext.Provider value={{ appVersion: "0.0.1", modelParser }}>
      <App />
    </AppContext.Provider>
  </DataverseContextProvider>,
);
