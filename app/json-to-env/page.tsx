"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Copy, Download } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function JsonToEnvPage() {
  const [jsonText, setJsonText] = useState("")
  const [envResult, setEnvResult] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [quoteValues, setQuoteValues] = useState(true)
  const [converted, setConverted] = useState(false)

  const parseJsonToEnv = () => {
    try {
      setError(null)

      if (!jsonText.trim()) {
        setError("Por favor, insira o conteúdo JSON")
        return
      }

      // Tentar fazer o parse do JSON
      const jsonData = JSON.parse(jsonText)

      if (typeof jsonData !== "object" || jsonData === null || Array.isArray(jsonData)) {
        setError("O JSON deve ser um objeto válido")
        return
      }

      // Converter para formato .env
      const envLines = Object.entries(jsonData).map(([key, value]) => {
        // Tratar diferentes tipos de valores
        let formattedValue = String(value)

        // Adicionar aspas se a opção estiver ativada ou se o valor contiver espaços
        if (quoteValues || /\s/.test(formattedValue)) {
          formattedValue = `"${formattedValue.replace(/"/g, '\\"')}"`
        }

        return `${key}=${formattedValue}`
      })

      setEnvResult(envLines.join("\n"))
      setConverted(true)
    } catch (err) {
      setError(`Erro ao converter: ${err instanceof Error ? err.message : String(err)}`)
      setConverted(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(envResult)
      .then(() => {
        // Poderia mostrar uma notificação de sucesso aqui
      })
      .catch((err) => {
        setError(`Erro ao copiar: ${err instanceof Error ? err.message : String(err)}`)
      })
  }

  const downloadEnv = () => {
    const blob = new Blob([envResult], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = ".env"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Converter JSON para .env</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>JSON</CardTitle>
              <CardDescription>Cole o conteúdo do seu arquivo JSON</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value)
                  setConverted(false)
                }}
                placeholder={`{
  "DATABASE_URL": "postgresql://user:password@localhost:5432/mydb",
  "API_KEY": "your-api-key",
  "DEBUG": "true"
}`}
                className="min-h-[300px] font-mono text-sm"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <Switch id="quote-values" checked={quoteValues} onCheckedChange={setQuoteValues} />
                  <Label htmlFor="quote-values">Adicionar aspas aos valores</Label>
                </div>

                <Button
                  onClick={parseJsonToEnv}
                  className="bg-[#089455] hover:bg-[#089455]/90"
                  disabled={!jsonText.trim()}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Converter para .env
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Resultado .env</CardTitle>
              <CardDescription>Arquivo .env gerado a partir do JSON</CardDescription>
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
                    value={envResult}
                    readOnly
                    placeholder="O resultado .env aparecerá aqui..."
                    className="min-h-[300px] font-mono text-sm"
                  />

                  {converted && (
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" onClick={copyToClipboard} className="border-[#089455] text-[#089455]">
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar
                      </Button>

                      <Button onClick={downloadEnv} className="bg-[#089455] hover:bg-[#089455]/90">
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
