import React, { ReactNode, createContext, useContext } from "react";
import { DataverseConnector } from "@dataverse/dataverse-connector";
import { ModelParser, Output } from "@dataverse/model-parser";
import app from "../../output/app.json";
import { WalletProvider } from "@dataverse/wallet-provider";

interface ContextType {
  dataverseConnector: DataverseConnector;
  walletProvider: WalletProvider;
  appVersion: string;
  modelParser: ModelParser;
}

const dataverseConnector = new DataverseConnector();
const appVersion = "0.0.1";
const modelParser = new ModelParser(app as Output);
const walletProvider = new WalletProvider();

const ConfigContext = createContext<ContextType>({} as ContextType);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConfigContext.Provider
      value={{
        dataverseConnector,
        walletProvider,
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
