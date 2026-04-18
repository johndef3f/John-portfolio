import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "John — 3D & Motion Portfolio",
  description:
    "Crafting stories through 3D, motion, and visual narrative. Selected works by John (沈習約).",
  openGraph: {
    title: "John — 3D & Motion Portfolio",
    description: "Crafting stories through 3D, motion, and visual narrative.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-bg text-fg font-sans antialiased">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
