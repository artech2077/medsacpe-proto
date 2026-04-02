import type { Metadata } from "next";
import { prototypeMono, prototypeSans } from "@/styles/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Medscape AI Prototype Workspace",
  description: "Figma-driven prototyping workspace for product features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${prototypeSans.variable} ${prototypeMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
