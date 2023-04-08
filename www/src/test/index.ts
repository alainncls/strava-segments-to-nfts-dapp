import { Chain, createClient } from 'wagmi';
import { getProvider, getSigners } from './utils';
import { MockConnector } from 'wagmi/connectors/mock';

type Config = { chains?: Chain[] };

export const connector = new MockConnector({
  options: {
    signer: getSigners()[0],
  },
});

export function setupClient(config: Config = {}) {
  return createClient({
    connectors: [connector],
    provider: ({ chainId }) => getProvider({ chainId, chains: config.chains }),
    ...config,
  });
}

export {
  getProvider,
  getWebSocketProvider,
  getSigners,
  testChains,
} from './utils';
