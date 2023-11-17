import "../ui/global.css";
import type { Metadata, Viewport } from "next";
import { courier } from "../ui/fonts";
import Script from "next/script";
import { Header } from "../ui/components/header";
import { Footer } from "../ui/components/footer";
import { Analytics } from "@vercel/analytics/react";

// TODO make this dynamic
// TODO add more metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#basic-fields
export const metadata: Metadata = {
  title: "BoonWeGig (Seoul) - Your Friendly Neighbourhood Gig Guide",
  description:
    "Discover indie concerts, underground venues, and local artists in Seoul, South Korea.",
  generator: "Next.js",
  applicationName: "BoonWeGig",
  referrer: "origin-when-cross-origin",
  keywords: ["Concerts", "Indie", "Underground"],
  authors: { name: "JB" },
  alternates: {
    canonical: "https://www.boonwegig.com",
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
          data-domains="www.boonwegig.com"
          src="https://umami-ten-indol.vercel.app/script.js"
          data-website-id="89ba67d0-9f46-4234-b81b-989a67eba5cc"
        />
      </head>
      <body className={`${courier.className} antialiased`}>
        <main className="mx-auto flex flex-col items-center min-h-screen p-4 bg-primary w-full md:w-5/6 overflow-x-hidden xl:w-[900px]">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <Analytics />
        </main>
      </body>
    </html>
  );
}
