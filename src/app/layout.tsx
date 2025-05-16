import type { Metadata } from "next";
// import  Geist_Sans, {MONO}  from "next/font/google";
import "./globals.css";
import CustomModal from "../components/custom-modal";
import { Toaster } from 'sonner';
import Providers from "./providers";

// const geistSans = Geist_Sans({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "BuildPro",
  description: "BuildPro",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` antialiased`}>
        <Providers>
          <CustomModal />
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
