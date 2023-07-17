import React, { ReactNode, createContext, useContext } from "react";
import { Extension, CoreConnector } from "@dataverse/core-connector";
import { ModelParser, Output } from "@dataverse/model-parser";
import app from "../../output/app.json";

interface ContextType {
  coreConnector: CoreConnector;
  appVersion: string;
  modelParser: ModelParser;
}

const coreConnector = new CoreConnector(Extension);
const appVersion = "0.0.1";
const modelParser = new ModelParser(app as Output);

const ConfigContext = createContext<ContextType>({} as ContextType);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigContext.Provider
      value={{
        coreConnector,
        appVersion,
        modelParser,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};
