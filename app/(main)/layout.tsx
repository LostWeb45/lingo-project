import type { Metadata } from "next";
import "../globals.css";
import { Footer, HeaderServer } from "@/components/shared/";

export const metadata: Metadata = {
  title: "LinGo | Главная страница",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <HeaderServer />
      {children}
      <Footer />
    </main>
  );
}
