/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GradReady — From Graduate to Ready",
  description:
    "Platform web berbasis AI yang membantu fresh graduate menganalisis CV, mengidentifikasi skill gap, dan mempersiapkan karir secara menyeluruh.",
  keywords: [
    "fresh graduate",
    "CV analyzer",
    "skill gap",
    "career readiness",
    "job preparation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={nunito.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={nunito.className}>{children}</body>
    </html>
  );
}
