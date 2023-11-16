import "../ui/global.css";
import type { Metadata, Viewport } from "next";
import { courier } from "../ui/fonts";
import Script from "next/script";
import { Header } from "../ui/components/header";
import { Footer } from "../ui/components/footer";

// TODO make this dynamic
// TODO add more metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: "BoonWeGig - Discover Local Concerts, Artists, and Venues in Seoul",
  description:
    "Your source for local concerts, artists, and venues in Seoul, South Korea.",
  generator: "Next.js",
  applicationName: "BoonWeGig",
  referrer: "origin-when-cross-origin",
  keywords: ["Concerts", "Indie", "Underground"],
  authors: { name: "JB" },
  alternates: {
    canonical: "https://boonwegig.com",
  },
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
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://analytics.eu.umami.is/script.js"
          data-website-id="83518a8a-77e1-4bed-8813-24c70de9ff35"
        />
      </head>
      <body className={`${courier.className} antialiased`}>
        <main className="mx-auto flex flex-col items-center min-h-screen p-4 bg-primary w-full md:w-5/6 overflow-x-hidden xl:w-[900px]">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
