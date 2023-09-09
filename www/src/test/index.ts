import { configureChains, createConfig } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { publicClient, webSocketPublicClient } = configureChains(
  [lineaTestnet],
  [publicProvider()]
);

export function setupConfig() {
  return createConfig({
    publicClient,
    webSocketPublicClient,
  });
}

export { testChains } from './utils';
