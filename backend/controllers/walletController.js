import { Wallet } from 'ethers';
// import { encryptPrivateKey } from '../utils/encryption.js'

// Tiếp tục với phần còn lại của code

import { prisma } from '../lib/prisma.js';

export async function createWallet(req, res) {
  try {
    console.log('request:', req.body);
   
    const address = req.body.address;
    const walletAddress = req.body.walletAddress;
    console.log(address)
    if (!address) return res.status(400).json({ error: 'Address is required' });

    const wallet = Wallet.createRandom();
    const encryptedPrivateKey = wallet.privateKey;

    await prisma.user.upsert({
      where: { address },
      update: { walletAddress },
      create: { address, walletAddress,encryptedPrivateKey },
    });
    return res.json({ walletAddress:address, privateKey: encryptedPrivateKey });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
