import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "./global.css";
import { DataverseContextProvider } from "@dataverse/hooks";
import {
  // dataverseWallet,
  injectedDataverseWallet,
} from "@dataverse/wallet-adapter";
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
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli, polygon, bsc, bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import App from "./App";
import { polygonMumbai } from "./utils/configChains";

const { chains, publicClient } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai, bsc, bscTestnet],
  [publicProvider()],
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
  </WagmiConfig>,
);
