export const metadata = {
  title: "Wallet Wagmi",
  description: "Wallet generator using Wagmi and Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
