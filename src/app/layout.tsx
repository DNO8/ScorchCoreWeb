import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/lib/providers/Web3Provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ScorchCore Protocol - Prospector Mining on Ronin",
  description: "Despierta el poder dormido de Lunacia. Transforma Axies en CoreMiners y mina $CORE en el ecosistema Ronin.",
  keywords: ["Axie Infinity", "Ronin", "NFT", "Mining", "Play-to-Earn", "Blockchain"],
  authors: [{ name: "ScorchCore Team" }],
  openGraph: {
    title: "ScorchCore Protocol",
    description: "Sé un Prospector - Forja CoreMiners y mina $CORE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-black`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
