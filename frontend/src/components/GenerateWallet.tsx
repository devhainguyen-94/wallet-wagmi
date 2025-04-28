"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { generatePrivateKey } from "@/utils/generatePrivateKey";
import { sendTransaction } from "@/utils/sendTx";
export default function GenerateWallet() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);
  const [amount, setAmount] = useState(0);
  const handleGenerate = async () => {
    const wallet = await generatePrivateKey();
    setWallet(wallet);
  };
const handleSendTransaction = async (address: string , privateKey:string) => {
  
    try {
      const txHash = await sendTransaction(wallet.privateKey, wallet.address, amount.toString(), "https://rpc.sepolia.org");
      console.log("Transaction sent:", txHash);
    } catch (error) {
      console.error("Error sending transaction:", error);
}
}
  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate}>Generate Wallet</Button>
      {wallet && (
        <Card>
          <CardContent>
            <p><strong>Address:</strong> {wallet.address}</p>
            <p><strong>Private Key:</strong> {wallet.privateKey}</p>
            {/* <p><strong>Mnemonic : </strong> {wallet.mnemonic}</p> */}
            <Button onClick={() =>
    handleSendTransaction(wallet.address, wallet.privateKey)} >Send Transaction</Button>
    <input
  type="number"
  placeholder="Enter amount (ETH)"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
  className="border rounded p-2 w-full"
/>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
