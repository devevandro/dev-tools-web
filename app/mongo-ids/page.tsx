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

      // Extrair os IDs
      const ids = documents
        .map((doc) => {
          if (doc && doc._id && doc._id.$oid) {
            return doc._id.$oid
          } else if (doc && doc._id) {
            // Caso o ID não esteja no formato $oid
            return String(doc._id)
          }
          return null
        })
        .filter((id) => id !== null) as string[]

      if (ids.length === 0) {
        setError("Nenhum ID válido encontrado na coleção")
        return
      }

      setExtractedIds(ids)
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
    "version": "4.3.1",
    "lastVersion": false,
    "forceUpdate": true
  },
  {
    "_id": {
      "$oid": "62b34e9ac00fe024bef3ec6a"
    },
    "version": "4.3.2",
    "lastVersion": true,
    "forceUpdate": false
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
              <CardDescription>Cole o JSON da sua coleção MongoDB</CardDescription>
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
                  Total de documentos na coleção: <strong>{extractedIds.length}</strong>
                </span>
              </div>

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
