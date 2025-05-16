"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, Database, ArrowRight } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MongoIdsPage() {
  const [inputJson, setInputJson] = useState("")
  const [outputFormat, setOutputFormat] = useState<"array" | "comma" | "quotes">("array")
  const [extractedIds, setExtractedIds] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [pathInfo, setPathInfo] = useState<Record<string, number>>({})
  const [includeQuotes, setIncludeQuotes] = useState(true)
  const [copied, setCopied] = useState(false)
  const [processed, setProcessed] = useState(false)

  const extractIds = () => {
    try {
      setError(null)

      if (!inputJson.trim()) {
        setError("Por favor, insira uma coleção MongoDB válida")
        return
      }

      // Tentar fazer o parse do JSON
      const documents = JSON.parse(inputJson)

      if (!Array.isArray(documents)) {
        setError("O JSON fornecido não é um array")
        return
      }

      // Função recursiva para encontrar objetos com $oid em qualquer nível
      const findOidValues = (obj: any, path: string[] = []): { id: string; path: string[] }[] => {
        if (!obj || typeof obj !== "object") return []

        let results: { id: string; path: string[] }[] = []

        for (const key in obj) {
          const currentPath = [...path, key]

          if (key === "$oid" && typeof obj[key] === "string") {
            // Encontramos um $oid diretamente
            return [{ id: obj[key], path }]
          } else if (typeof obj[key] === "object" && obj[key] !== null) {
            // Se for um objeto, procurar recursivamente
            const nestedResults = findOidValues(obj[key], currentPath)
            results = [...results, ...nestedResults]
          }
        }

        return results
      }

      // Extrair os IDs de cada documento
      const idsWithPaths = documents.flatMap((doc, index) => {
        const results = findOidValues(doc)
        return results.map((result) => ({
          ...result,
          docIndex: index,
        }))
      })

      if (idsWithPaths.length === 0) {
        setError("Nenhum ID válido (formato $oid) encontrado na coleção")
        return
      }

      // Extrair apenas os IDs
      const ids = idsWithPaths.map((item) => item.id)

      // Armazenar informações sobre os caminhos para exibição
      const pathInfo = idsWithPaths.reduce(
        (acc, { id, path, docIndex }) => {
          const fieldName =
            path[path.length - 1] === "$oid"
              ? path.length > 1
                ? path[path.length - 2]
                : "desconhecido"
              : path[path.length - 1]

          if (!acc[fieldName]) {
            acc[fieldName] = 0
          }
          acc[fieldName]++
          return acc
        },
        {} as Record<string, number>,
      )

      setExtractedIds(ids)
      setPathInfo(pathInfo)
      setProcessed(true)
    } catch (err) {
      setError(`Erro ao processar JSON: ${err instanceof Error ? err.message : String(err)}`)
      setProcessed(false)
    }
  }

  const formatOutput = () => {
    if (!extractedIds.length) return ""

    const formattedIds = includeQuotes ? extractedIds.map((id) => `"${id}"`) : extractedIds

    switch (outputFormat) {
      case "array":
        return `[\n  ${formattedIds.join(",\n  ")}\n]`
      case "comma":
        return formattedIds.join(", ")
      case "quotes":
        return formattedIds.join("\n")
      default:
        return `[\n  ${formattedIds.join(",\n  ")}\n]`
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatOutput()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const resetAll = () => {
    setInputJson("")
    setExtractedIds([])
    setError(null)
    setProcessed(false)
  }

  // Exemplo para o placeholder
  const exampleData = `[
  {
    "_id": {
      "$oid": "62b34e81c00fe024bef3ec69"
    },
    "version": "4.3.1"
  },
  {
    "student": {
      "$oid": "5e337ef699763dac88d2c9ed"
    }
  }
]`

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Extrator de IDs MongoDB</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Coleção MongoDB</CardTitle>
              <CardDescription>
                Cole o JSON da sua coleção MongoDB (suporta IDs em qualquer campo com formato $oid)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputJson}
                onChange={(e) => {
                  setInputJson(e.target.value)
                  setProcessed(false)
                }}
                placeholder={exampleData}
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex justify-end mt-4">
                <Button
                  onClick={extractIds}
                  className="bg-[#089455] hover:bg-[#089455]/90"
                  disabled={!inputJson.trim()}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Extrair IDs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>IDs Extraídos</CardTitle>
              <CardDescription>Array contendo apenas os IDs da coleção</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <Tabs value={outputFormat} onValueChange={(v) => setOutputFormat(v as any)} className="mb-4">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="array">Array</TabsTrigger>
                      <TabsTrigger value="comma">Separado por vírgula</TabsTrigger>
                      <TabsTrigger value="quotes">Um por linha</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center space-x-2 mb-4">
                    <Switch id="include-quotes" checked={includeQuotes} onCheckedChange={setIncludeQuotes} />
                    <Label htmlFor="include-quotes">Incluir aspas</Label>
                  </div>

                  <Textarea
                    value={formatOutput()}
                    readOnly
                    placeholder="Os IDs extraídos aparecerão aqui..."
                    className="min-h-[220px] font-mono text-sm"
                  />

                  {processed && extractedIds.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-muted-foreground">
                        {extractedIds.length} ID{extractedIds.length !== 1 ? "s" : ""} extraído
                        {extractedIds.length !== 1 ? "s" : ""}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={resetAll} className="border-[#089455] text-[#089455]">
                          Limpar
                        </Button>
                        <Button onClick={copyToClipboard} className="bg-[#089455] hover:bg-[#089455]/90">
                          <Copy className="mr-2 h-4 w-4" />
                          {copied ? "Copiado!" : "Copiar"}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {processed && extractedIds.length > 0 && (
          <Card className="w-full mt-6">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-[#089455]" />
                <span>
                  Total de IDs extraídos: <strong>{extractedIds.length}</strong>
                </span>
              </div>

              {Object.keys(pathInfo).length > 0 && (
                <div className="mt-3 text-sm">
                  <div className="font-medium mb-1">Campos encontrados:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(pathInfo).map(([field, count]) => (
                      <div key={field} className="flex items-center gap-1">
                        <span className="bg-[#089455]/10 text-[#089455] px-2 py-1 rounded text-xs font-mono">
                          {field}
                        </span>
                        <span className="text-gray-600">
                          {count} {count === 1 ? "ocorrência" : "ocorrências"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 bg-gray-100 p-4 rounded-md">
                <div className="font-medium mb-2 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-[#089455]" />
                  <span>Exemplo de uso em código:</span>
                </div>
                <div className="font-mono text-sm bg-gray-800 text-white p-3 rounded overflow-x-auto">
                  {`// JavaScript/Node.js
const ids = ${JSON.stringify(extractedIds.slice(0, 2))}${extractedIds.length > 2 ? "..." : ""};

// MongoDB Query
db.collection.find({ _id: { $in: ids.map(id => ObjectId(id)) } })`}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
