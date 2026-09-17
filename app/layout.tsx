import { Fira_Code, Inter, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalFooter } from "@/components/layout/conditional-footer"
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  fallback: ["Helvetica", "Arial", "sans-serif"],
})

const fontMono = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
  fallback: ["JetBrains Mono", "monospace"],
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-heading",
  fallback: ["Helvetica", "Arial", "sans-serif"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
        roboto.variable,
      )}
    >
      <body>
        <ThemeProvider>
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex-1">{children}</div>
            <ConditionalFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
