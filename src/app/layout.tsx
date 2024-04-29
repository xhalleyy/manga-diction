

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/context/ClubContext";
import { NavbarComponent } from "./components/NavbarComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MangaDiction!",
  description: "Join the Manga Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
            <NavbarComponent />
          {children}
        </AppWrapper>

      </body>
    </html>
  );
}
