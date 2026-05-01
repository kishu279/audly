import type { Metadata } from "next";
import "./globals.css";
import { spaceGrotesk } from "./fonts";
import WalletContextProvider from "@/contexts/WalletContextProvider";
import { NotificationList } from "@/components/ui/NotificationList";

export const metadata: Metadata = {
  title: "Audly",
  description: "Audly — Solana dApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <WalletContextProvider>
          {children}
          <NotificationList />
        </WalletContextProvider>
      </body>
    </html>
  );
}
