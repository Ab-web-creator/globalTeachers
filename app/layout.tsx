import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import FontSizeInspector from "./components/font-size-inspector";
import { CallSessionProvider } from "./components/calls/call-session";
import VisitTracker from "./components/visit-tracker";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "TeacherNavigator",
  description: "Build your international teaching career with TeacherNavigator.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${roboto.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CallSessionProvider>{children}</CallSessionProvider>
        <VisitTracker />
        {process.env.NODE_ENV === "development" && <FontSizeInspector />}
      </body>
    </html>
  );
}
