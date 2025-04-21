import React from 'react';
import { WagmiConfig, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';
import { useAuth } from './hooks/useAuth';

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    walletConnectProjectId: 'f637276fa2040a313cb65c70e23c37f2',
    appName: 'Wagmi Auth',
  })
);

function App() {
  const { login, loading, address } = useAuth();

  const handleCreateWallet = async () => {
    try {
      if (!address) {
        alert('Please connect your wallet first.');
        return;
      }

      const res = await fetch('http://localhost:3002/api/auth/create-wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Wallet created: ${data.walletAddress}`);
        console.log(data);
      } else {
        alert(`❌ Failed to create wallet: ${data.error}`);
        console.error(data);
      }
    } catch (err) {
      console.error('💥 Error calling create-wallet:', err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login with Wallet</h1>
      <p>Address: {address}</p>
      <button onClick={login} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p>Click the button below to create your wallet.</p>

      <input
        type="password"
        placeholder="Enter your private key"
        style={{ marginTop: 16, padding: 8, width: '100%' }}
      />

      <button
        onClick={handleCreateWallet}
        style={{ marginTop: 16, padding: 8, width: '100%' }}
      >
        Create Wallet
      </button>
    </div>
  );
}

export default App;
