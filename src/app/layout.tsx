import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KagujjeMDM - Professional Mobile Device Management",
  description: "💪🏾 Professional MDM removal, FRP bypass, and device unlocking solutions for technicians worldwide. East Africa's trusted mobile repair platform.",
  keywords: ["MDM removal", "FRP bypass", "Samsung MDM", "device unlock", "mobile repair", "KagujjeMDM", "Uganda", "East Africa"],
  authors: [{ name: "Kagujje Inc." }],
  openGraph: {
    title: "KagujjeMDM - Professional Mobile Device Management",
    description: "💪🏾 Professional MDM removal, FRP bypass, and device unlocking solutions",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "KagujjeMDM",
    description: "💪🏾 Professional Mobile Device Management",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
