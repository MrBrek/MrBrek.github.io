import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhiteAI",
  description: "A focused workspace for conversations with AI models.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
