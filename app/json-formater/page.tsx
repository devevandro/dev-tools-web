"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, FileJson, Check, RefreshCw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Função para colorir diferentes partes do JSON
function syntaxHighlight(json: string): string {
  // Substituir caracteres especiais por entidades HTML
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  // Regex para identificar diferentes partes do JSON
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-blue-600" // string
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "text-red-600" // chave
        } else {
          cls = "text-green-600" // valor string
        }
      } else if (/true|false/.test(match)) {
        cls = "text-orange-600" // booleano
      } else if (/null/.test(match)) {
        cls = "text-gray-600" // null
      } else if (/\d/.test(match)) {
        cls = "text-purple-600" // número
      }
      return `<span class="${cls}">${match}</span>`
    },
  )
}

// Função para formatar o JSON com indentação
function formatJSON(json: string, spaces = 2): string {
  try {
    const obj = JSON.parse(json)
    return JSON.stringify(obj, null, spaces)
  } catch (e) {
    throw new Error("JSON inválido")
  }
}

// Componente para exibir o JSON formatado e colorido
function JsonDisplay({ json, theme }: { json: string; theme: "light" | "dark" }) {
  const highlighted = syntaxHighlight(json)

  return (
    <pre
      className={`p-4 rounded-md overflow-auto text-sm font-mono ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  )
}

// Exemplo de dados para o placeholder
const exampleData = `{
  "type": "student-enrollment",
  "body": {
    "user": {
      "firstName": "Andre",
      "lastName": "Pierobon",
      "email": "andre.pierobon@startse.com"
    },
    "course": {
      "slug": "ai-for-leaders-2a-edicao-2025",
      "sendEmail": true,
      "sendAccessEmail": true,
      "typeEnrollment": "61365edd1233b17afeb26671",
      "forceEnrollment": false,
      "expiresAt": "2025-11-16 23:59"
    }
  }
}`

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useState("")
  const [formattedJson, setFormattedJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [indentation, setIndentation] = useState(2)

  const formatAndHighlight = () => {
    try {
      setError(null)

      if (!inputJson.trim()) {
        setError("Por favor, insira um JSON válido")
        return
      }

      const formatted = formatJSON(inputJson, indentation)
      setFormattedJson(formatted)
    } catch (err) {
      setError(`Erro: ${err instanceof Error ? err.message : String(err)}`)
      setFormattedJson("")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedJson).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const resetAll = () => {
    setInputJson("")
    setFormattedJson("")
    setError(null)
  }

  const loadExample = () => {
    setInputJson(exampleData)
    try {
      const formatted = formatJSON(exampleData, indentation)
      setFormattedJson(formatted)
      setError(null)
    } catch (err) {
      setError(`Erro: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Formatador de JSON</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>JSON de Entrada</CardTitle>
              <CardDescription>Cole seu JSON para formatação e coloração</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder={exampleData}
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={loadExample} className="border-[#089455] text-[#089455]">
                  Carregar Exemplo
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetAll} className="border-[#089455] text-[#089455]">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Limpar
                  </Button>

                  <Button
                    onClick={formatAndHighlight}
                    className="bg-[#089455] hover:bg-[#089455]/90"
                    disabled={!inputJson.trim()}
                  >
                    <FileJson className="mr-2 h-4 w-4" />
                    Formatar JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>JSON Formatado</CardTitle>
                  <CardDescription>Visualização formatada e colorida</CardDescription>
                </div>

                <Tabs value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")} className="w-auto">
                  <TabsList className="grid w-[180px] grid-cols-2">
                    <TabsTrigger value="light">Tema Claro</TabsTrigger>
                    <TabsTrigger value="dark">Tema Escuro</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Indentação:</span>
                      <Tabs
                        value={String(indentation)}
                        onValueChange={(v) => {
                          const newIndent = Number.parseInt(v)
                          setIndentation(newIndent)
                          if (formattedJson) {
                            try {
                              setFormattedJson(formatJSON(formattedJson, newIndent))
                            } catch (e) {
                              // Ignorar erros aqui, pois o JSON já foi validado
                            }
                          }
                        }}
                        className="w-auto"
                      >
                        <TabsList className="grid w-[120px] grid-cols-3">
                          <TabsTrigger value="2">2</TabsTrigger>
                          <TabsTrigger value="4">4</TabsTrigger>
                          <TabsTrigger value="8">8</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {formattedJson && (
                      <Button onClick={copyToClipboard} className="bg-[#089455] hover:bg-[#089455]/90">
                        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? "Copiado!" : "Copiar"}
                      </Button>
                    )}
                  </div>

                  {formattedJson ? (
                    <div className="border rounded-md overflow-hidden">
                      <JsonDisplay json={formattedJson} theme={theme} />
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center border rounded-md bg-gray-50 text-gray-400">
                      <p>O JSON formatado aparecerá aqui</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {formattedJson && (
          <Card className="w-full mt-6">
            <CardHeader>
              <CardTitle>Legenda de Cores</CardTitle>
              <CardDescription>Significado das cores no JSON formatado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <span>Chaves</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-600"></div>
                  <span>Strings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                  <span>Números</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                  <span>Booleanos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                  <span>Null</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
