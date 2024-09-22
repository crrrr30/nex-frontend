import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NexDock from "@/customs/dock";
import KeybindWrapper from "@/customs/keybind_wrapper";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { createContext } from "vm";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased relative min-h-screen`}>
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          )}
        />
        <KeybindWrapper>{children}</KeybindWrapper>

        <div className="pointer-events-none fixed bottom-8 w-full flex flex-row justify-center">
          <NexDock />
        </div>

        <div className="h-32" />
      </body>
    </html>
  );
}
