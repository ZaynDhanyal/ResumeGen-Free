import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import AppProvider from "@/components/AppProvider";
import React from "react";

export const metadata: Metadata = {
  title: "ResumeGen Free - AI Resume Builder",
  description: "A free online resume and cover letter builder with AI-powered writing suggestions. Create, edit, and download professional resumes from customizable templates, optimized with AI keyword analysis and integrated with ad and affiliate placements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;700&family=Open+Sans:wght@400;700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/react-image-crop/dist/ReactCrop.css" />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900">
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`
            if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          `}
        </Script>
        {/* FIX: The error 'Property 'children' is missing' is resolved by passing children as an explicit prop. */}
        <AppProvider children={children} />
      </body>
    </html>
  );
}