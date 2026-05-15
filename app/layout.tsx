import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Company Profile",
  description: "View company registration details",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
