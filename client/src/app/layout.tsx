import "./ui/global.css";
import type { Metadata } from "next";
import { inter } from "./ui/fonts";

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
