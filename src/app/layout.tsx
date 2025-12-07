import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Git Profile - Analyze Your Coding Persona",
  description: "AI-powered analysis of your GitHub coding style and preferences",
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