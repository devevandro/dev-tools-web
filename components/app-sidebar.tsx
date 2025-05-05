"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Home, Calculator, GitCompare, FileSearch, FileText } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-[#054f77]/20">
      <SidebarHeader className="bg-[#054f77] text-white p-4 flex justify-center">
        <h1 className="text-2xl font-caveat text-center">Tools APP</h1>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem className="mt-4">
            <SidebarMenuButton asChild tooltip="Início" isActive={pathname === "/"}>
              <Link href="/" className={`text-[#054f77] ${pathname === "/" ? "bg-[#054f77]/10 font-medium" : ""}`}>
                <Home />
                <span>Início</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Contador" isActive={pathname === "/contador"}>
              <Link
                href="/contador"
                className={`text-[#054f77] ${pathname === "/contador" ? "bg-[#054f77]/10 font-medium" : ""}`}
              >
                <Calculator />
                <span>Contador de Caracteres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Comparador .env" isActive={pathname === "/comparador"}>
              <Link
                href="/comparador"
                className={`text-[#054f77] ${pathname === "/comparador" ? "bg-[#054f77]/10 font-medium" : ""}`}
              >
                <GitCompare />
                <span>Comparador de .env</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Comparador de Textos" isActive={pathname === "/comparador-textos"}>
              <Link
                href="/comparador-textos"
                className={`text-[#054f77] ${pathname === "/comparador-textos" ? "bg-[#054f77]/10 font-medium" : ""}`}
              >
                <FileText />
                <span>Comparador de Textos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Localizar e Substituir" isActive={pathname === "/localizar-substituir"}>
              <Link
                href="/localizar-substituir"
                className={`text-[#054f77] ${pathname === "/localizar-substituir" ? "bg-[#054f77]/10 font-medium" : ""}`}
              >
                <FileSearch />
                <span>Localizar e Substituir</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="bg-[#054f77] text-white p-2 text-xs text-center">© 2025 Tools APP</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
