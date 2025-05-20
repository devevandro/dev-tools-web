import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Tool } from "@/lib/types"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  const { name, path, icon, description } = tool

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center text-center h-full">
      <div className="h-12 w-12 text-[#089455] mb-4 flex items-center justify-center">
        {React.cloneElement(icon, { className: "h-12 w-12" })}
      </div>

      <h2 className="text-xl font-semibold text-[#089455] mb-2">{name}</h2>
      <p className="text-gray-600 mb-4">{description}</p>

      <Button asChild className="bg-[#089455] hover:bg-[#089455]/90 mt-auto">
        <Link href={path}>Acessar {name.split(" ")[0]}</Link>
      </Button>
    </div>
  )
}
