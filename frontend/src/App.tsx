import { WagmiConfig, createConfig, configureChains, useSendTransaction, usePrepareSendTransaction } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { createClient } from 'viem'
import { useAuth } from './hooks/useAuth'
import React, { useState } from 'react'
import { parseEther } from 'viem'

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    walletConnectProjectId: 'f637276fa2040a313cb65c70e23c37f2',
    appName: 'Wagmi Auth',
  })
)

function App() {
  const { login, loading, address } = useAuth()

  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('0.01')

  const { config: txConfig } = usePrepareSendTransaction({
    to,
    value: parseEther(amount || '0'),
    enabled: Boolean(to),
  })

  const { sendTransaction, isLoading: isSending, isSuccess, error } = useSendTransaction(txConfig)

  const handleSend = () => {
    if (sendTransaction) sendTransaction()
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Login with Wallet</h1>
      <p>Address: {address}</p>
      <button onClick={login} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <hr style={{ margin: '24px 0' }} />

      <h2>Send ETH</h2>
      <input
        placeholder="Recipient address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ display: 'block', marginBottom: 12, padding: 8, width: '100%' }}
      />
      <input
        placeholder="Amount in ETH"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ display: 'block', marginBottom: 12, padding: 8, width: '100%' }}
      />
      <button onClick={handleSend} disabled={!sendTransaction || isSending}>
        {isSending ? 'Sending...' : 'Send Transaction'}
      </button>

      {isSuccess && <p style={{ color: 'green' }}>Transaction sent!</p>}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  )
}

export default App
