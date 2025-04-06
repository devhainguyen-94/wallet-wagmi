
import { useAccount, useSignMessage } from 'wagmi'
import { useState } from 'react'

export function useAuth() {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [loading, setLoading] = useState(false)
  
  const login = async () => {
    if (!address) return
    setLoading(true)

    const res1 = await fetch(`http://localhost:3001/api/auth/nonce?address=${address}`)
    const { nonce } = await res1.json()

    const signature = await signMessageAsync({ message: nonce })
    console.log(res1)
    const res2 = await fetch('http://localhost:3001/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature }),
    })

    const data = await res2.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
    }

    setLoading(false)
  }

  return { login, loading, address }
}
