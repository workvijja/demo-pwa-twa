import type {Metadata, Viewport} from "next";
import "./globals.css";
import {UpdateNotifier} from "@/components/utils/updateNotifier";
import {Toaster} from "@/components/ui/sonner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Demo PWA TWA",
  description: "Proof of Concept for PWA and TWA",
  manifest: '/manifest.webmanifest', // Next serves app/manifest.ts here
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <UpdateNotifier/>
        <Toaster/>
      </body>
    </html>
  );
}
