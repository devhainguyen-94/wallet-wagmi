import crypto from 'crypto'
// import dotenv from 'dotenv'

// dotenv.config()

const algorithm = 'aes-256-cbc'
const key = crypto.createHash('sha256')
  .update(String(process.env.PRIVATE_KEY_SECRET))
  .digest('base64')
  .substring(0, 32)

export function encryptPrivateKey(privateKey) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(privateKey)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export function decryptPrivateKey(encrypted) {
  const [ivHex, encryptedHex] = encrypted.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const encryptedText = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}
