import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DataverseContextProvider } from "@dataverse/hooks";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <DataverseContextProvider>
    <App />
  </DataverseContextProvider>,
);
