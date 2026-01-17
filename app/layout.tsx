import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sidebar } from "@/components/layout/Sidebar"; // Import the Sidebar
import LayoutWrapper from "@/components/layout/LayoutWrapper"; // Helper component for logic

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Tesla • Invest. Trade. Drive.",
  description:
    "All-in-one platform for crypto wallet funding, automated investments, live stocks, and premium EV inventory.",
  metadataBase: new URL("https://tslavehiclepartners.com"),
  icons: {
    icon: "/hhb7Yj6zdj7QzEXWiKRVvkjJznru8eGnB5wKm2Ue-fav.svg",
    shortcut: "/hhb7Yj6zdj7QzEXWiKRVvkjJznru8eGnB5wKm2Ue-fav.svg",
    apple: "/hhb7Yj6zdj7QzEXWiKRVvkjJznru8eGnB5wKm2Ue-fav.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased bg-white dark:bg-[#050505] text-black dark:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
