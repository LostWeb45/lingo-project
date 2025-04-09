import type { Metadata } from "next";
import "../globals.css";
import { Header } from "@/components/shared";

export const metadata: Metadata = {
  title: "Lingo | Главная страница",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
