import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import Script from "next/script"

const kantumruyPro = localFont({
  src: [
    {
      path: "../public/fonts/KantumruyPro-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/KantumruyPro-Medium.ttf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-kantumruy-pro",
});

export const metadata: Metadata = {
  title: "SME NEWS - ព័ត៌មានអាជីវកម្មខ្នាតតូច និងមធ្យម",
  description: "ប្រភពព័ត៌មានអាជីវកម្ម នវានុវត្តន៍ និងបច្ចេកវិទ្យាឈានមុខគេ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="km"
      className={`${kantumruyPro.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="beforeInteractive" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster 
            toastOptions={{ 
              classNames: {
                toast: cn(kantumruyPro.className, "font-normal"),
                title: "font-normal",
                description: "font-normal",
              }
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
