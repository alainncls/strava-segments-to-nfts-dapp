import React from 'react';
import { createConfig, WagmiConfig } from 'wagmi';
import { goerli, lineaTestnet, sepolia } from 'wagmi/chains';
import { Route, Routes } from 'react-router-dom';
import Home from './screens/Home/Home';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import StravaLogin from './screens/StravaLogin/StravaLogin';
import About from './screens/About/About';

const chains = [lineaTestnet, goerli, sepolia];

const config = createConfig(
  getDefaultConfig({
    infuraId: import.meta.env.VITE_INFURA_API_KEY,
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
    appName: 'Segments to NFTs',
    chains,
  })
);

function App() {
  return (
    <React.StrictMode>
      <WagmiConfig config={config}>
        <ConnectKitProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/oauth" element={<StravaLogin />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </ConnectKitProvider>
      </WagmiConfig>
    </React.StrictMode>
  );
}

export default App;
