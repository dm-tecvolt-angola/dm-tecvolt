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
  metadataBase: new URL("https://dm-tecvolt.vercel.app"),

  title: {
    default: "DM-TECVOLT | Instalações Elétricas e Segurança Eletrónica",
    template: "%s | DM-TECVOLT",
  },

  description:
    "DM-TECVOLT, Venda e Serviço (SU), LDA — soluções profissionais em instalações elétricas, CCTV, segurança eletrónica, cerca elétrica, videoporteiro e manutenção técnica em Angola.",

  keywords: [
    "DM-TECVOLT",
    "instalações elétricas em Angola",
    "instalações elétricas em Cabinda",
    "CCTV em Angola",
    "CCTV em Cabinda",
    "segurança eletrónica em Angola",
    "cerca elétrica em Angola",
    "videoporteiro em Angola",
    "manutenção elétrica em Angola",
    "segurança eletrónica em Cabinda",
    "serviços elétricos Cabinda",
  ],

  authors: [
    {
      name: "DM-TECVOLT",
    },
  ],

  creator: "DM-TECVOLT",
  publisher: "DM-TECVOLT",

  verification: {
    google: "BR1fgAbaGvYaEviiLwlC2UtMFX3D_W0VL-1ZDe4eNzM",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "pt_AO",
    url: "https://dm-tecvolt.vercel.app",
    siteName: "DM-TECVOLT",
    title: "DM-TECVOLT | Instalações Elétricas e Segurança Eletrónica",
    description:
      "Soluções profissionais em instalações elétricas, CCTV, segurança eletrónica, cerca elétrica, videoporteiro e manutenção técnica em Angola.",
    images: [
      {
        url: "/images/logo/logo.jpeg",
        width: 800,
        height: 800,
        alt: "DM-TECVOLT",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DM-TECVOLT | Instalações Elétricas e Segurança",
    description:
      "Soluções profissionais em instalações elétricas, CCTV, segurança eletrónica, cerca elétrica, videoporteiro e manutenção técnica em Angola.",
    images: ["/images/logo/logo.jpeg"],
  },

  icons: {
    icon: "/favicon.ico",
  },
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
      <body className="flex min-h-full flex-col">
        <Navbar />

        <div className="flex-1">{children}</div>

        <Footer />

        <WhatsAppButton />
      </body>
    </html>
  );
}