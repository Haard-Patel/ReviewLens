import type { Metadata } from "next";

import LensCursor from "@/components/LensCursor";
import ReviewLensHeader from "@/components/ReviewLensHeader";

import "./globals.css";

export const metadata: Metadata = {
  title: "ReviewLens — Customer Review Intelligence",
  description:
    "Explore customer review trends, sentiment, ratings, products, and engagement through ReviewLens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LensCursor />
        <ReviewLensHeader />
        {children}
      </body>
    </html>
  );
}