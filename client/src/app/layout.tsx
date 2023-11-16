import "../ui/global.css";
import type { Metadata } from "next";
import { courier } from "../ui/fonts";
import Script from "next/script";
import { Header } from "../ui/components/header";
import { Footer } from "../ui/components/footer";

// TODO make this dynamic
export const metadata: Metadata = {
  title: "BoonWeGig - Discover Local Concerts, Artists, and Venues in Seoul",
  description:
    "Your source for local concerts, artists, and venues in Seoul, South Korea.",
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
        <main className="mx-auto flex flex-col items-start sm:items-center min-h-screen p-4 bg-primary w-full md:w-5/6 overflow-x-hidden xl:w-[900px]">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </body>
    </html>
  );
}
