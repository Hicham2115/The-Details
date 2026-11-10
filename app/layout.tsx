import type { Metadata, Viewport } from "next";
import { Archivo, Bebas_Neue, Gloock, UnifrakturCook } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" });
const gloock = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-gloock" });
const archivo = Archivo({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-archivo" });
const unifraktur = UnifrakturCook({ weight: "700", subsets: ["latin"], variable: "--font-unifraktur" });

export const metadata: Metadata = {
  title: "The Details — Vintage & Y2K accessories",
  description: "Vintage and Y2K belts, buckles, rings and cases, sold online in Morocco.",
};

export const viewport: Viewport = { themeColor: "#121111" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${gloock.variable} ${archivo.variable} ${unifraktur.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
