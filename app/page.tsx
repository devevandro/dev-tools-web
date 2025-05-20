"use client"
import { ToolCard } from "@/components/tool-card"
import { tools } from "@/lib/tools"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] w-full p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-[#089455] mb-6">
        <span className="font-peralta text-4xl">Develop Tools</span>
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Utilize nossas ferramentas para análise e manipulação de texto.
      </p>

      <div className="w-full max-w-6xl mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  )
}
