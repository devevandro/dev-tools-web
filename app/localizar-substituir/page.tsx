"use client"

import { useState, useEffect, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Replace, RotateCcw } from "lucide-react"

export default function LocalizarSubstituirPage() {
  const [text, setText] = useState("")
  const [searchText, setSearchText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const [matchCase, setMatchCase] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [occurrences, setOccurrences] = useState<number[]>([])
  const [resultText, setResultText] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [hasReplaced, setHasReplaced] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Função para encontrar todas as ocorrências
  const findOccurrences = () => {
    if (!searchText || !text) {
      setOccurrences([])
      setHasSearched(false)
      return
    }

    let searchPattern = searchText

    // Escape special regex characters
    searchPattern = searchPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    // Se for palavra inteira, adicionar limites de palavra
    if (wholeWord) {
      searchPattern = `\\b${searchPattern}\\b`
    }

    // Criar regex com ou sem case sensitivity
    const regex = new RegExp(searchPattern, matchCase ? "g" : "gi")

    // Encontrar todas as ocorrências
    const matches = []
    let match
    while ((match = regex.exec(text)) !== null) {
      matches.push(match.index)
    }

    setOccurrences(matches)
    setHasSearched(true)
    setHasReplaced(false)
  }

  // Função para substituir todas as ocorrências
  const replaceAll = () => {
    if (!searchText || !text || occurrences.length === 0) return

    let searchPattern = searchText

    // Escape special regex characters
    searchPattern = searchPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

    // Se for palavra inteira, adicionar limites de palavra
    if (wholeWord) {
      searchPattern = `\\b${searchPattern}\\b`
    }

    // Criar regex com ou sem case sensitivity
    const regex = new RegExp(searchPattern, matchCase ? "g" : "gi")

    // Substituir todas as ocorrências
    const newText = text.replace(regex, replaceText)
    setResultText(newText)
    setHasReplaced(true)
  }

  // Aplicar o texto substituído
  const applyReplacement = () => {
    if (hasReplaced) {
      setText(resultText)
      setOccurrences([])
      setHasSearched(false)
      setHasReplaced(false)
    }
  }

  // Resetar tudo
  const resetAll = () => {
    setText("")
    setSearchText("")
    setReplaceText("")
    setOccurrences([])
    setResultText("")
    setHasSearched(false)
    setHasReplaced(false)
  }

  // Destacar as ocorrências no texto
  const highlightText = () => {
    if (!hasSearched || occurrences.length === 0 || !textareaRef.current) return

    // Implementação simplificada - na prática, seria melhor usar uma biblioteca de highlight
    // ou um componente personalizado para mostrar o texto com highlights
    const textarea = textareaRef.current
    textarea.focus()

    // Selecionar a primeira ocorrência
    if (occurrences.length > 0) {
      const start = occurrences[0]
      const end = start + searchText.length
      textarea.setSelectionRange(start, end)

      // Scroll para a seleção
      const lineHeight = 20 // Estimativa da altura da linha
      const lines = text.substring(0, start).split("\n").length - 1
      textarea.scrollTop = lines * lineHeight
    }
  }

  // Efeito para destacar texto quando as ocorrências mudam
  useEffect(() => {
    if (hasSearched && occurrences.length > 0) {
      highlightText()
    }
  }, [occurrences, hasSearched])

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Localizar e Substituir</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Texto</CardTitle>
            <CardDescription>Digite ou cole o texto no qual deseja localizar e substituir</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setHasSearched(false)
                setHasReplaced(false)
              }}
              placeholder="Digite ou cole seu texto aqui..."
              className="min-h-[200px] w-full font-mono text-sm"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Localizar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search-text">Texto a localizar</Label>
                  <div className="flex mt-1">
                    <Input
                      id="search-text"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value)
                        setHasSearched(false)
                      }}
                      placeholder="Digite o texto que deseja encontrar"
                      className="flex-1"
                    />
                    <Button
                      onClick={findOccurrences}
                      disabled={!searchText || !text}
                      className="ml-2 bg-[#089455] hover:bg-[#089455]/90"
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Localizar
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="match-case"
                      checked={matchCase}
                      onCheckedChange={(checked) => {
                        setMatchCase(checked)
                        setHasSearched(false)
                      }}
                    />
                    <Label htmlFor="match-case">Diferenciar maiúsculas/minúsculas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="whole-word"
                      checked={wholeWord}
                      onCheckedChange={(checked) => {
                        setWholeWord(checked)
                        setHasSearched(false)
                      }}
                    />
                    <Label htmlFor="whole-word">Palavra inteira</Label>
                  </div>
                </div>

                {hasSearched && (
                  <Alert
                    className={occurrences.length > 0 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}
                  >
                    <AlertTitle>
                      {occurrences.length > 0
                        ? `${occurrences.length} ocorrência${occurrences.length !== 1 ? "s" : ""} encontrada${occurrences.length !== 1 ? "s" : ""}`
                        : "Nenhuma ocorrência encontrada"}
                    </AlertTitle>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Substituir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="replace-text">Texto substituto</Label>
                  <Input
                    id="replace-text"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    placeholder="Digite o texto substituto"
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={replaceAll}
                    disabled={!hasSearched || occurrences.length === 0}
                    className="bg-[#089455] hover:bg-[#089455]/90 flex-1"
                  >
                    <Replace className="h-4 w-4 mr-1" />
                    Substituir Tudo
                  </Button>

                  <Button onClick={resetAll} variant="outline" className="border-[#089455] text-[#089455] flex-1">
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Limpar Tudo
                  </Button>
                </div>

                {hasReplaced && (
                  <div className="mt-4">
                    <Alert className="bg-blue-50 border-blue-200 mb-2">
                      <AlertTitle>Prévia da substituição</AlertTitle>
                      <AlertDescription>Revise as alterações antes de aplicá-las</AlertDescription>
                    </Alert>
                    <Button onClick={applyReplacement} className="w-full bg-green-600 hover:bg-green-700">
                      Aplicar Substituições
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {hasReplaced && (
          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Texto com as substituições aplicadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Badge className="absolute top-2 right-2 bg-blue-500">Prévia</Badge>
                <Textarea value={resultText} readOnly className="min-h-[200px] w-full font-mono text-sm" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
