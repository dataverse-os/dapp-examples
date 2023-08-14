import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./global.css";
import { DataverseContextProvider } from "@dataverse/hooks";
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  // dataverseWallet,
  injectedDataverseWallet,
} from "@dataverse/wallet-adapter";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli, polygon, bsc, bscTestnet } from "wagmi/chains";
import { polygonMumbai } from "./utils/configChains";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet],
  [publicProvider()]
);

const projectId = "a0e03b973ec9560c3f40607b20019762";

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
      injectedDataverseWallet({ chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <DataverseContextProvider>
        <App />
      </DataverseContextProvider>
    </RainbowKitProvider>
  </WagmiConfig>
);
