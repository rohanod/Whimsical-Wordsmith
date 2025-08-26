import type { Metadata } from "next";
import "./globals.css";
import APIKeyProvider from "./components/APIKeyProvider";

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
        <APIKeyProvider>
          {children}
        </APIKeyProvider>
      </body>
    </html>
  );
}
