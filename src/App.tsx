import React from 'react';
import { createClient, WagmiConfig } from 'wagmi';
import { goerli, sepolia } from 'wagmi/chains';
import { Route, Routes } from 'react-router-dom';
import Home from './screens/Home/Home';
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import StravaLogin from './screens/StravaLogin/StravaLogin';

const infuraId = process.env.REACT_APP_INFURA_ID;
const chains = [goerli, sepolia];

// Wagmi client
const client = createClient(
  getDefaultClient({
    appName: 'Strava NFTs',
    infuraId,
    chains,
  }),
);

function App() {
  return (
    <React.StrictMode>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/oauth" element={<StravaLogin />} />
            {/* <Route path="about" element={<About />} />
              <Route path="features" element={<Dashboard />} />
              <Route path="*" element={<NoMatch />} /> */}
          </Routes>
        </ConnectKitProvider>
      </WagmiConfig>
    </React.StrictMode>
  );
}

export default App;
