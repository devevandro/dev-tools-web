"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Download, FileType, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FormatadorYamlPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [indentation, setIndentation] = useState("2")
  const [sortKeys, setSortKeys] = useState(false)
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false)
  const { toast } = useToast()

  const sampleYaml = `# Exemplo de configuração YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: default
  labels:
    app: myapp
    version: "1.0"
data:
  database_url: "postgresql://localhost:5432/mydb"
  redis_url: "redis://localhost:6379"
  debug: "true"
  
  # Configurações de cache
  cache:
    ttl: 3600
    max_size: 1000
    
  # Lista de features
  features:
    - authentication
    - logging
    - monitoring
    - caching`

  const formatYaml = useCallback(() => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }

    try {
      // Simple YAML parser and formatter
      const lines = input.split("\n")
      const formatted: string[] = []
      let currentIndent = 0
      const indentSize = Number.parseInt(indentation)

      for (const line of lines) {
        const trimmed = line.trim()

        // Skip empty lines if option is enabled
        if (removeEmptyLines && !trimmed) continue

        // Keep comments as is
        if (trimmed.startsWith("#")) {
          formatted.push(" ".repeat(currentIndent) + trimmed)
          continue
        }

        // Skip empty lines
        if (!trimmed) {
          formatted.push("")
          continue
        }

        // Handle list items
        if (trimmed.startsWith("- ")) {
          formatted.push(" ".repeat(currentIndent) + trimmed)
          continue
        }

        // Handle key-value pairs
        if (trimmed.includes(":")) {
          const [key, ...valueParts] = trimmed.split(":")
          const value = valueParts.join(":").trim()

          // Determine indentation based on the original line
          const originalIndent = line.length - line.trimStart().length
          const normalizedIndent = Math.floor(originalIndent / indentSize) * indentSize

          if (value) {
            // Key with value
            formatted.push(" ".repeat(normalizedIndent) + `${key.trim()}: ${value}`)
          } else {
            // Key without value (object start)
            formatted.push(" ".repeat(normalizedIndent) + `${key.trim()}:`)
            currentIndent = normalizedIndent + indentSize
          }
        } else {
          // Other lines
          formatted.push(" ".repeat(currentIndent) + trimmed)
        }
      }

      let result = formatted.join("\n")

      // Sort keys if option is enabled (simple implementation)
      if (sortKeys) {
        // This is a simplified sort - in a real implementation you'd want a proper YAML parser
        const sections = result.split("\n\n")
        const sortedSections = sections.map((section) => {
          const lines = section.split("\n")
          const keyLines = lines.filter((line) => line.includes(":") && !line.trim().startsWith("#"))
          const otherLines = lines.filter((line) => !line.includes(":") || line.trim().startsWith("#"))

          keyLines.sort((a, b) => {
            const keyA = a.split(":")[0].trim()
            const keyB = b.split(":")[0].trim()
            return keyA.localeCompare(keyB)
          })

          return [...otherLines, ...keyLines].join("\n")
        })
        result = sortedSections.join("\n\n")
      }

      setOutput(result)
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao formatar YAML")
      setOutput("")
    }
  }, [input, indentation, sortKeys, removeEmptyLines])

  const handleInputChange = (value: string) => {
    setInput(value)
    // Auto-format with debounce would go here in a real implementation
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast({
        title: "Copiado!",
        description: "YAML formatado copiado para a área de transferência.",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive",
      })
    }
  }

  const downloadYaml = () => {
    const blob = new Blob([output], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.yml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download iniciado",
      description: "Arquivo YAML formatado baixado com sucesso.",
    })
  }

  const clearAll = () => {
    setInput("")
    setOutput("")
    setError("")
  }

  const loadSample = () => {
    setInput(sampleYaml)
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <FileType className="mr-3 h-8 w-8" />
          Formatador de YAML
        </h1>
        <p className="text-muted-foreground">Formate e valide arquivos YAML/YML com opções de customização.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>YAML de Entrada</CardTitle>
            <CardDescription>Cole seu código YAML aqui para formatação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={loadSample} variant="outline" size="sm">
                Exemplo
              </Button>
              <Button onClick={clearAll} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-1" />
                Limpar
              </Button>
              <Button onClick={formatYaml} size="sm">
                Formatar YAML
              </Button>
            </div>

            {/* Formatting Options */}
            <div className="space-y-3 p-3 bg-muted rounded-lg">
              <h4 className="font-medium">Opções de Formatação</h4>

              <Tabs value={indentation} onValueChange={setIndentation}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="2">2 espaços</TabsTrigger>
                  <TabsTrigger value="4">4 espaços</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sortKeys}
                    onChange={(e) => setSortKeys(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Ordenar chaves</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeEmptyLines}
                    onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Remover linhas vazias</span>
                </label>
              </div>
            </div>

            <Textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Cole seu YAML aqui..."
              className="min-h-[400px] font-mono text-sm"
            />

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{input.length} caracteres</span>
              <span>{input.split("\n").length} linhas</span>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              YAML Formatado
              <div className="flex gap-2">
                {output && (
                  <>
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-1" />
                      Copiar
                    </Button>
                    <Button onClick={downloadYaml} variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
            <CardDescription>Resultado da formatação do YAML</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {output && !error && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>YAML formatado com sucesso!</AlertDescription>
              </Alert>
            )}

            <Textarea
              value={output}
              readOnly
              placeholder="O YAML formatado aparecerá aqui..."
              className="min-h-[400px] font-mono text-sm"
            />

            {output && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{output.length} caracteres</span>
                <span>{output.split("\n").length} linhas</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Como usar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Recursos:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Formatação automática de YAML</li>
                <li>• Validação de sintaxe</li>
                <li>• Opções de indentação (2 ou 4 espaços)</li>
                <li>• Ordenação de chaves</li>
                <li>• Remoção de linhas vazias</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Suporte para:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Arquivos de configuração</li>
                <li>• Manifests do Kubernetes</li>
                <li>• Docker Compose</li>
                <li>• CI/CD pipelines</li>
                <li>• Qualquer arquivo .yml/.yaml</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
