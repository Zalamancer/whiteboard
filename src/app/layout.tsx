import type { Metadata } from "next";
import { ToastProvider } from "@/components/shared/Toast";
import {
  Caveat,
  Indie_Flower,
  Patrick_Hand,
  Architects_Daughter,
  Shadows_Into_Light,
  Permanent_Marker,
  Coming_Soon,
  Gloria_Hallelujah,
} from "next/font/google";
import "./globals.css";

// Handwriting & display fonts for whiteboard styles
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });
const indieFlower = Indie_Flower({ weight: "400", subsets: ["latin"], variable: "--font-indie-flower", display: "swap" });
const patrickHand = Patrick_Hand({ weight: "400", subsets: ["latin"], variable: "--font-patrick-hand", display: "swap" });
const architectsDaughter = Architects_Daughter({ weight: "400", subsets: ["latin"], variable: "--font-architects-daughter", display: "swap" });
const shadowsIntoLight = Shadows_Into_Light({ weight: "400", subsets: ["latin"], variable: "--font-shadows-into-light", display: "swap" });
const permanentMarker = Permanent_Marker({ weight: "400", subsets: ["latin"], variable: "--font-permanent-marker", display: "swap" });
const comingSoon = Coming_Soon({ weight: "400", subsets: ["latin"], variable: "--font-coming-soon", display: "swap" });
const gloriaHallelujah = Gloria_Hallelujah({ weight: "400", subsets: ["latin"], variable: "--font-gloria-hallelujah", display: "swap" });

const fontVariables = [
  caveat.variable,
  indieFlower.variable,
  patrickHand.variable,
  architectsDaughter.variable,
  shadowsIntoLight.variable,
  permanentMarker.variable,
  comingSoon.variable,
  gloriaHallelujah.variable,
].join(" ");

export const metadata: Metadata = {
  title: "Whiteboard Editor",
  description: "AI-powered whiteboard explainer video editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fontVariables}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
