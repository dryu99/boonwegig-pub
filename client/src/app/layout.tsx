import "./ui/global.css";
import type { Metadata } from "next";
import { courier } from "./ui/fonts";
import { CityPicker } from "./ui/city-picker";

export const metadata: Metadata = {
  title: "BoonWeGig",
  description: "Created with love and uncertainty",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
