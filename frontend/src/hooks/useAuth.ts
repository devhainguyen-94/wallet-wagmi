import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { useState } from 'react';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!isConnected) {
      console.log('🔌 Wallet not connected. Connecting now...');
      await connect({ connector: connectors[0] });
      return; // đợi kết nối xong rồi mới login lại
    }

    if (!address) {
      console.error('❌ No address found even after connection');
      return;
    }

    setLoading(true);

    try {
      const res1 = await fetch(`http://localhost:3001/api/auth/nonce?address=${address}`);
      const { nonce } = await res1.json();

      const signature = await signMessageAsync({ message: nonce });

      const res2 = await fetch('http://localhost:3001/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature }),
      });

      const data = await res2.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

    } catch (error) {
      console.error('❌ Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, address };
}
