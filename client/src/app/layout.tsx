import "./ui/global.css";
import type { Metadata } from "next";
import { courier } from "./ui/fonts";
import { CityPicker } from "./ui/city-picker";
import Script from "next/script";

// TODO make this dynamic
export const metadata: Metadata = {
  title: "BoonWeGig - Seoul Indie Concerts Simplified",
  description:
    "Your source for indie and underground concerts in Seoul, South Korea.",
  viewport: "width=device-width, initial-scale=1",
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
          <div className="sm:text-center">
            <h1 className="text-2xl mt-3 mb-2 font-bold">BoonWeGig</h1>
            <CityPicker />
          </div>

          {children}
        </main>
      </body>
    </html>
  );
}
