"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { generatePrivateKey } from "@/utils/generatePrivateKey";
export default function GenerateWallet() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);

  const handleGenerate = async () => {
    const wallet = await generatePrivateKey();
    setWallet(wallet);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate}>Generate Wallet</Button>
      {wallet && (
        <Card>
          <CardContent>
            <p><strong>Address:</strong> {wallet.address}</p>
            <p><strong>Private Key:</strong> {wallet.privateKey}</p>
            {/* <p><strong>Mnemonic : </strong> {wallet.mnemonic}</p> */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
