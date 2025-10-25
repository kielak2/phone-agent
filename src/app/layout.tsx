import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { plPL } from "@clerk/localizations";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoxAgent — Telefoniczny agent AI dla e‑commerce",
  description: "Automatyczny asystent telefoniczny 24/7: odbiera połączenia, pomaga klientom i zwiększa sprzedaż.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider localization={plPL}>
          <ConvexClientProvider>
          {children}  
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
