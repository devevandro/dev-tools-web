"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, FileText } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { tools } from "@/lib/tools"

export function AppHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isHome = pathname === "/"

  // Adicionar o item de início ao menu
  const menuItems = [{ id: "home", name: "Início", path: "/", icon: <FileText className="h-4 w-4 mr-2" /> }, ...tools]

  // Encontrar o item de menu atual com base no pathname
  const currentMenuItem = isHome ? null : menuItems.find((item) => item.path === pathname)

  // Função para renderizar o botão de uma ferramenta específica
  const renderToolButton = (item: (typeof menuItems)[0]) => (
    <Button variant="default" size="sm" asChild className="bg-[#089455] hover:bg-[#089455]/90">
      <Link href={item.path}>
        {item.icon}
        <span className="ml-1">{item.name}</span>
      </Link>
    </Button>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-center relative">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-4">
          {/* Na página inicial, não mostramos nenhum menu */}
          {!isHome && (
            <div className="flex items-center space-x-4">
              {/* Home link */}
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <span className="font-peralta text-[#089455]">Início</span>
                </Link>
              </Button>

              {/* Tools dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-[#089455] text-[#089455]">
                    Ferramentas
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56">
                  {tools.map((item) => (
                    <DropdownMenuItem key={item.id} asChild>
                      <Link
                        href={item.path}
                        className={`flex items-center w-full ${pathname === item.path ? "font-medium text-[#089455]" : ""}`}
                      >
                        <div className="flex-1 flex items-center">
                          {item.icon}
                          {item.name}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Current tool button */}
              {currentMenuItem && currentMenuItem.id !== "home" && (
                <div className="flex items-center space-x-2">{renderToolButton(currentMenuItem)}</div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Button - Mostrar apenas em páginas que não são a inicial ou quando o menu está aberto */}
        {(!isHome || mobileMenuOpen) && (
          <div className="flex md:hidden absolute right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-2">
            <nav className="grid gap-1">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  <Button
                    variant={pathname === item.path ? "default" : "ghost"}
                    className={`justify-start flex-1 ${pathname === item.path ? "bg-[#089455] hover:bg-[#089455]/90" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                    asChild
                  >
                    <Link href={item.path} className="flex items-center">
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
