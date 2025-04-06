import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains'
const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    walletConnectProjectId: 'f637276fa2040a313cb65c70e23c37f2',
    appName: 'Wagmi Auth',
  })
)
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('app')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <WagmiConfig config={config}>
                <ConnectKitProvider>
                    <App />
                </ConnectKitProvider>
            </WagmiConfig>
        </QueryClientProvider>
    </React.StrictMode>
)