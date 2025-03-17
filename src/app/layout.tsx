import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Betterflare",
  description: "R2 management that doesn't hurt your soul",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistSans.className} antialiased`}
      >
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
