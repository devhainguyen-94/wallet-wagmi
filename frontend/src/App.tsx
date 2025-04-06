
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { createClient } from 'viem'
import { useAuth } from './hooks/useAuth'
import React from 'react';
const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    walletConnectProjectId: 'f637276fa2040a313cb65c70e23c37f2',
    appName: 'Wagmi Auth',
  })
)

function App() {
  const { login, loading, address } = useAuth()
  console.log(login);
  return (
    <div style={{ padding: 24 }}>
      <h1>Login with Wallet</h1>
      <p>Address: {address}</p>
      <button onClick={login} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}

export default App
