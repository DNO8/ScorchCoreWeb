import type { Metadata } from "next";
import { Cinzel_Decorative, Roboto_Mono } from "next/font/google";
import "./globals.css";
import LoaderWrapper from "@/components/landing/LoaderWrapper";
import { Web3Provider } from "@/lib/providers/Web3Provider";

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-cinzel-decorative",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "ScorchCore Protocol - Prospector Mining on Ronin",
  description:
    "Despierta el poder dormido de Lunacia. Transforma Axies en CoreMiners y mina $CORE en el ecosistema Ronin.",
  keywords: [
    "Axie Infinity",
    "Ronin",
    "NFT",
    "Mining",
    "Play-to-Earn",
    "Blockchain",
  ],
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
      <body
        className={`${cinzelDecorative.variable} ${robotoMono.variable} font-sans antialiased bg-black`}
      >
        <Web3Provider>
          <LoaderWrapper />
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}
