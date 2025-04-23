"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function GenerateWallet() {
  const [wallet, setWallet] = useState<{ address: string; privateKey: string } | null>(null);

  const handleGenerate = async () => {
    const res = await fetch("/api/wallets", { method: "POST" });
    const data = await res.json();
    setWallet(data);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate}>Generate Wallet</Button>
      {wallet && (
        <Card>
          <CardContent>
            <p><strong>Address:</strong> {wallet.address}</p>
            <p><strong>Private Key:</strong> {wallet.privateKey}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
