import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NIRVI - Contemporary Fashion",
  description: "Discover contemporary fashion for the modern individual. Shop the latest collections of clothing, accessories, and more at NIRVI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Expose Google Client ID to the browser at runtime */}
        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
          <>
            <meta name="google-client-id" content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.GOOGLE_CLIENT_ID = ${JSON.stringify(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)};`,
              }}
            />
          </>
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
