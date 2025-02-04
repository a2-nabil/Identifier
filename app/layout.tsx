import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Object Identifier",
  description: "Upload an image to identify objects using AI",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
