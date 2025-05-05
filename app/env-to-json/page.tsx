"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileJson, Copy, Download } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function EnvToJsonPage() {
  const [envText, setEnvText] = useState("")
  const [jsonResult, setJsonResult] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [prettify, setPrettify] = useState(true)
  const [converted, setConverted] = useState(false)

  const parseEnvToJson = () => {
    try {
      setError(null)

      if (!envText.trim()) {
        setError("Por favor, insira o conteúdo do arquivo .env")
        return
      }

      const lines = envText.split("\n")
      const result: Record<string, string> = {}

      lines.forEach((line, index) => {
        // Ignorar linhas vazias e comentários
        const trimmedLine = line.trim()
        if (!trimmedLine || trimmedLine.startsWith("#")) return

        // Encontrar o primeiro sinal de igual que não esteja dentro de aspas
        const equalIndex = trimmedLine.indexOf("=")
        if (equalIndex === -1) return

        const key = trimmedLine.substring(0, equalIndex).trim()
        let value = trimmedLine.substring(equalIndex + 1).trim()

        // Remover aspas se existirem
        if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
          value = value.substring(1, value.length - 1)
        }

        result[key] = value
      })

      // Converter para JSON
      const jsonOutput = prettify ? JSON.stringify(result, null, 2) : JSON.stringify(result)

      setJsonResult(jsonOutput)
      setConverted(true)
    } catch (err) {
      setError(`Erro ao converter: ${err instanceof Error ? err.message : String(err)}`)
      setConverted(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonResult)
      .then(() => {
        // Poderia mostrar uma notificação de sucesso aqui
      })
      .catch((err) => {
        setError(`Erro ao copiar: ${err instanceof Error ? err.message : String(err)}`)
      })
  }

  const downloadJson = () => {
    const blob = new Blob([jsonResult], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converted.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Converter .env para JSON</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Arquivo .env</CardTitle>
              <CardDescription>Cole o conteúdo do seu arquivo .env</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={envText}
                onChange={(e) => {
                  setEnvText(e.target.value)
                  setConverted(false)
                }}
                placeholder="DATABASE_URL='postgresql://user:password@localhost:5432/mydb'
API_KEY='your-api-key'
DEBUG=true"
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="prettify" checked={prettify} onCheckedChange={setPrettify} />
                  <Label htmlFor="prettify">Formatar JSON</Label>
                </div>

                <Button
                  onClick={parseEnvToJson}
                  className="bg-[#089455] hover:bg-[#089455]/90"
                  disabled={!envText.trim()}
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  Converter para JSON
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Resultado JSON</CardTitle>
              <CardDescription>JSON gerado a partir do arquivo .env</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  <Textarea
                    value={jsonResult}
                    readOnly
                    placeholder="O resultado JSON aparecerá aqui..."
                    className="min-h-[300px] font-mono text-sm"
                  />

                  {converted && (
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={copyToClipboard} className="border-[#089455] text-[#089455]">
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </Button>

                      <Button onClick={downloadJson} className="bg-[#089455] hover:bg-[#089455]/90">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
