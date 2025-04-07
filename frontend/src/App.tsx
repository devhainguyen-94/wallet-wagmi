import {
  WagmiConfig,
  createConfig,
  useSendTransaction,
  usePrepareSendTransaction,
} from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { parseEther } from 'viem'

import { useAuth } from './hooks/useAuth'
import React, { useState } from 'react'

const config = createConfig(
  getDefaultConfig({
    chains: [mainnet],
    walletConnectProjectId: 'f637276fa2040a313cb65c70e23c37f2',
    appName: 'Wagmi Auth',
  })
)

function App() {
  const { login, loading, address } = useAuth()

  // ----------- Client-Side Send (via Wagmi) ----------
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

  // ----------- Server-Side Send (via Backend) ------------
  const [serverTo, setServerTo] = useState('')
  const [serverAmount, setServerAmount] = useState('0.01')
  const [serverResult, setServerResult] = useState(null)
  const [serverLoading, setServerLoading] = useState(false)

  const handleServerSend = async () => {
    setServerLoading(true)
    setServerResult(null)

    try {
      const res = await fetch('http://localhost:3001/send-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAddress: address,
          toAddress: serverTo,
          amount: serverAmount,
        }),
      })

      const data = await res.json()
      if (data.txHash) {
        setServerResult({ success: true, txHash: data.txHash })
      } else {
        setServerResult({ success: false, error: data.error || data.details })
      }
    } catch (err) {
      setServerResult({ success: false, error: err.message })
    }

    setServerLoading(false)
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto' }}>
      <h1>Login with Wallet</h1>
      <p>Address: {address}</p>
      <button onClick={login} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <hr style={{ margin: '24px 0' }} />

      {/* Client-Side Transaction */}
      <h2>Send ETH (Client-Side)</h2>
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
        {isSending ? 'Sending...' : 'Send Transaction (Client)'}
      </button>

      {isSuccess && <p style={{ color: 'green' }}>✅ Transaction sent (client)!</p>}
      {error && <p style={{ color: 'red' }}>{error.message}</p>}

      <hr style={{ margin: '24px 0' }} />

      {/* Server-Side Transaction */}
      <h2>Send ETH (Server-Side)</h2>
      <input
        placeholder="Recipient address"
        value={serverTo}
        onChange={(e) => setServerTo(e.target.value)}
        style={{ display: 'block', marginBottom: 12, padding: 8, width: '100%' }}
      />
      <input
        placeholder="Amount in ETH"
        value={serverAmount}
        onChange={(e) => setServerAmount(e.target.value)}
        style={{ display: 'block', marginBottom: 12, padding: 8, width: '100%' }}
      />
      <button onClick={handleServerSend} disabled={serverLoading || !address}>
        {serverLoading ? 'Sending...' : 'Send Transaction (Server)'}
      </button>

      {serverResult?.success && (
        <p style={{ color: 'green' }}>
          ✅ Transaction sent from server! Hash: <br />
          <a href={`https://sepolia.etherscan.io/tx/${serverResult.txHash}`} target="_blank" rel="noreferrer">
            {serverResult.txHash}
          </a>
        </p>
      )}
      {serverResult?.error && (
        <p style={{ color: 'red' }}>❌ Error: {serverResult.error}</p>
      )}
    </div>
  )
}

export default App
