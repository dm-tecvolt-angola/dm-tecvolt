import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DM-TECVOLT | Soluções Elétricas e Segurança",
    template: "%s | DM-TECVOLT",
  },
  description:
    "DM-TECVOLT, Venda e Serviço (SU), LDA — soluções em instalações elétricas, CCTV, segurança eletrónica, cerca elétrica, videoporteiro e manutenção técnica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />

<div className="flex-1">{children}</div>

<Footer />

<WhatsAppButton />
      </body>
    </html>
  );
}