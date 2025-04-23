import GenerateWallet from "@/components/GenerateWallet";

export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Wallet Generator</h1>
      <GenerateWallet />
    </main>
  );
}
