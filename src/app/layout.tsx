
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/context/ClubContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MangaDiction!",
  description: "Join the Manga Community",
};

export default function No({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
