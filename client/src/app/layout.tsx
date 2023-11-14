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
        <div className="flex flex-col items-center">
          <h1 className="text-2xl p-8 pb-4 font-bold">BoonWeGig</h1>
          <CityPicker />
        </div>

        {children}
      </body>
    </html>
  );
}
