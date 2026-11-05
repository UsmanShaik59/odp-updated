import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://odp-five.vercel.app"),

  title: "OneStep Dream Property | Find Your Next Home",

  description:
    "Discover thoughtfully selected flats and residential properties across India with OneStep Dream Property.",

  applicationName: "OneStep Dream Property",
  generator: "v0.app",

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.jpg",
        type: "image/jpeg",
        sizes: "32x32",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.jpg",
        type: "image/jpeg",
        sizes: "32x32",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon.ico",
      },
    ],
    shortcut: "/favicon.ico",
    apple: {
      url: "/apple-icon.png",
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://odp-five.vercel.app/",
    siteName: "OneStep Dream Property",
    title: "OneStep Dream Property | Find Your Next Home",
    description:
      "One Step Closer to Your Dream Property. Discover thoughtfully selected flats and residential properties across India.",
    images: [
      {
        url: "/odp-share.png",
        width: 1200,
        height: 630,
        alt: "OneStep Dream Property - Find Your Next Home",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "OneStep Dream Property | Find Your Next Home",
    description: "One Step Closer to Your Dream Property.",
    images: ["/odp-share.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
