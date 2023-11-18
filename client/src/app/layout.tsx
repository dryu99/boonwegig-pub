import "../ui/global.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  generator: "Next.js",
  applicationName: "BoonWeGig", // TODO should this be internationalized?
  referrer: "origin-when-cross-origin",
  authors: { name: "JB" },
  alternates: {
    canonical: "https://www.boonwegig.com",
    languages: {
      en: "https://www.boonwegig.com/en",
      ko: "https://www.boonwegig.com/ko",
      "x-default": "https://www.boonwegig.com/en", // TODO double check this redirects correctly
    },
  },
  // TODO look into Open graph and Twitter metadata
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export const viewport: Viewport = {
  themeColor: { media: "(prefers-color-scheme: dark)", color: "#000000" },
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
