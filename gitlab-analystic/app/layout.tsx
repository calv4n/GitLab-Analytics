import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@six-group/ui-library/dist/ui-library/ui-library.css";

import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitLab Changes Viewer",
  description: "Visualize gitlab activity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  );
}
