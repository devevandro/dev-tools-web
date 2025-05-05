import type React from "react"
import type { Metadata } from "next/types"
import { Inter, Arvo, Peralta } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppHeader } from "@/components/app-header"
import { AppFooter } from "@/components/app-footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const arvo = Arvo({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-arvo" })
const peralta = Peralta({ subsets: ["latin"], variable: "--font-peralta" })

export const metadata: Metadata = {
  title: "Tools APP",
  description: "Ferramentas úteis para manipulação de texto",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${arvo.variable} ${peralta.variable} font-arvo`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1 w-full">{children}</main>
            <AppFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
