
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { verifyMessage } from 'viem'
import { generateNonce } from 'siwe'
import { createWallet } from './controllers/walletController.js';
const app = express()
const PORT = 3001
const JWT_SECRET = 'your-secret'
const nonces = new Map()
app.use(express.json())

const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`)

app.post('/send-transaction', async (req, res) => {
  const { fromAddress, toAddress, amount } = req.body

  try {
    const wallet = await prisma.wallet.findUnique({
      where: { address: fromAddress.toLowerCase() },
    })

    if (!wallet) return res.status(404).json({ error: 'Wallet not found' })

    const signer = new ethers.Wallet(wallet.privateKey, provider)
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount),
    })

    return res.json({ txHash: tx.hash })
  } catch (err) {
    console.error('Send TX error:', err)
    res.status(500).json({ error: 'Transaction failed', details: err.message })
  }
})
app.use(cors())
app.use(express.json())

app.get('/api/auth/nonce', (req, res) => {
  const address = req.query.address
  const nonce = generateNonce()
  nonces.set(address, nonce)
  res.json({ nonce })
})

app.post('/api/auth/create-wallet',createWallet)
app.post('/api/auth/verify', async (req, res) => {
  const { address, signature } = req.body
  const nonce = nonces.get(address)
  if (!nonce) return res.status(400).json({ error: 'Nonce not found' })

  const isValid = await verifyMessage({ address, message: nonce, signature })
  if (!isValid) return res.status(401).json({ error: 'Invalid signature' })

  const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' })
  res.json({ token })
})

app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'No token' })

  try {
    const token = auth.split(' ')[1]
    const payload = jwt.verify(token, JWT_SECRET)
    res.json({ user: payload })
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`)
})
