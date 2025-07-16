import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
