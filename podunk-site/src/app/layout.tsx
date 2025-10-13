import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import AuthProvider from "@/components/AuthProvider";
import Navigation from "@/components/Navigation";

// logo colors
const PODUNK_YELLOW = "#F9A72A";
const PODUNK_BLUE = "#13477B";

// fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// monospaced font for code snippets
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for the site
export const metadata: Metadata = {
  title: "Podunk Ramblers",
  description: "The official website of the Podunk Ramblers",
  icons: {
    icon: "/logo-clean.svg",
  },
};

// Root layout component
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Instagram embed script */}
        <script async src="https://www.instagram.com/embed.js"></script>
      </head>
      {/* Primary brand blue used for page backgrounds */}
      <body style={{ fontFamily: "sans-serif", margin: 0, background: PODUNK_BLUE, minHeight: "100vh", color: "white" }}>
        <AuthProvider>
          <header className="site-header" role="banner">
            <div className="brand">
              <a href="/" aria-label="Podunk Ramblers home">
                <Image src="/logo-clean.svg" alt="Podunk Ramblers" width={40} height={40} className="logo" />
                <span className="sr-only">Podunk Ramblers</span>
              </a>
            </div>
            {/* header navigation */}
            <Navigation />
          </header>
          <main>{children}</main>
        </AuthProvider>
        <footer className="site-footer" role="contentinfo">
          <p>© {new Date().getFullYear()} Podunk Ramblers</p>
        </footer>
      </body>
    </html>
  );
}