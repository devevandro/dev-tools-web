"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

export default function ContadorPage() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState({
    characters: 0,
    words: 0,
    lines: 0,
  })

  useEffect(() => {
    // Contar caracteres
    const characters = text.length

    // Contar palavras (dividir por espaços e filtrar strings vazias)
    const words = text
      ? text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      : 0

    // Contar linhas
    const lines = text ? text.split("\n").length : 0

    setStats({ characters, words, lines })
  }, [text])

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-sm h-full">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Contador de Caracteres</h1>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">Digite ou cole o texto no campo abaixo:</p>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] border-gray-300 focus:border-[#054f77] focus:ring-[#054f77] w-full"
            placeholder="Digite ou cole seu texto aqui..."
          />
        </div>

        <div className="text-gray-700">
          <span className="mr-4">Caracteres: {stats.characters}</span>
          <span className="mr-4">Palavras: {stats.words}</span>
          <span>Linhas: {stats.lines}</span>
        </div>
      </div>
    </div>
  )
}
