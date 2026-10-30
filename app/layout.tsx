import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Lao_Looped } from "next/font/google";
import { invitation } from "@/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoLao = Noto_Sans_Lao_Looped({
  variable: "--font-lao",
  subsets: ["lao", "latin"],
  weight: ["400", "500", "600", "700"],
});

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://attendant-wife-lid.ngrok-free.dev");

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: `${invitation.names} — Wedding Invitation`,
  description: `${invitation.laoCard.title} · ${invitation.laoCard.dateLao} | ${invitation.laoCard.venueTitleLao}`,
  openGraph: {
    title: `${invitation.names} — Wedding Invitation`,
    description: `${invitation.eyebrow} ${invitation.names} · ${invitation.date}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${invitation.names} — Wedding Invitation`,
    description: `${invitation.eyebrow} ${invitation.names} · ${invitation.date}`,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${notoLao.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
