import { Wallet } from "ethers";

export const generatePrivateKey = async () => {
  const wallet = Wallet.createRandom();

  const res = await fetch("http://localhost:3002/api/auth/create-wallet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: wallet.address,
      privateKey: wallet.privateKey,
    }),
  });

  console.log("response: 12312", res);

  if (!res.ok) {
    throw new Error("Failed to save wallet");
  }

  const responseData = await res.json();
  console.log("response json:", responseData );

  return {
    privateKey: responseData.privateKey,
    address: responseData.walletAddress,
    // mnemonic: wallet.mnemonic.phrase,
  };
};
