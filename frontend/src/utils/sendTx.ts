import { ethers } from "ethers";

export const sendTransaction = async (privateKey: string, to: string, amountInEth: string, rpcUrl: string) => {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  const tx = await signer.sendTransaction({
    to,
    value: ethers.parseEther(amountInEth),
    gasLimit: 21000,
  });

  await tx.wait();
  return tx.hash;
};
