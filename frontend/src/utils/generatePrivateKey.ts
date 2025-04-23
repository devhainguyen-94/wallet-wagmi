import { Wallet } from "ethers";

export const generatePrivateKey = () => {
  const wallet = Wallet.createRandom();
  return {
    privateKey: wallet.privateKey,
    address: wallet.address,
    mnemonic: wallet.mnemonic.phrase,
  };
};
