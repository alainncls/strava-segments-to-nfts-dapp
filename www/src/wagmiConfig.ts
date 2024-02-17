import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { linea, lineaTestnet, mainnet } from "wagmi/chains";

export const walletConnectProjectId = "8e6bc8c2c601640ce32e4757d208ff71";
const metadata = {
  name: "Segments to NFTs",
  description: "Issue attestations of your Strava activities",
  url: "https://strava.alainnicolas.fr", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const chains = [lineaTestnet, linea, mainnet] as const;
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: walletConnectProjectId,
  metadata,
  enableCoinbase: false,
});
