import type { Metadata } from "next";
import "./globals.css";
import APIKeyProvider from "./components/APIKeyProvider";
import ClearStorageHelper from "./components/ClearStorageHelper";

export const metadata: Metadata = {
  title: "Whimsical Wordsmith",
  description: "A collection of delightful word tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClearStorageHelper />
        <APIKeyProvider isDark={true}>
          {children}
        </APIKeyProvider>
      </body>
    </html>
  );
}
