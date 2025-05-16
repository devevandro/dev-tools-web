"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, RefreshCw, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Função para gerar um CNPJ válido
function generateCNPJ(formatted = true): string {
  // Gera os 12 primeiros dígitos aleatórios
  const cnpjArray: number[] = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10))

  // Calcula o primeiro dígito verificador
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) {
    sum += cnpjArray[i] * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder

  cnpjArray.push(firstDigit)

  // Calcula o segundo dígito verificador
  sum = 0
  weight = 6
  for (let i = 0; i < 13; i++) {
    sum += cnpjArray[i] * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder

  cnpjArray.push(secondDigit)

  // Formata o CNPJ se necessário
  if (formatted) {
    return `${cnpjArray.slice(0, 2).join("")}.${cnpjArray.slice(2, 5).join("")}.${cnpjArray
      .slice(5, 8)
      .join("")}/${cnpjArray.slice(8, 12).join("")}-${cnpjArray.slice(12).join("")}`
  }

  return cnpjArray.join("")
}

// Função para validar um CNPJ
function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, "")

  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false

  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cnpj)) return false

  // Converte para array de números
  const cnpjArray = cnpj.split("").map(Number)

  // Valida o primeiro dígito verificador
  let sum = 0
  let weight = 5
  for (let i = 0; i < 12; i++) {
    sum += cnpjArray[i] * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder
  if (firstDigit !== cnpjArray[12]) return false

  // Valida o segundo dígito verificador
  sum = 0
  weight = 6
  for (let i = 0; i < 13; i++) {
    sum += cnpjArray[i] * weight
    weight = weight === 2 ? 9 : weight - 1
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder
  if (secondDigit !== cnpjArray[13]) return false

  return true
}

export default function GeradorCNPJPage() {
  const [cnpj, setCnpj] = useState("")
  const [multipleCount, setMultipleCount] = useState(5)
  const [multipleCNPJs, setMultipleCNPJs] = useState<string[]>([])
  const [formatCNPJ, setFormatCNPJ] = useState(true)
  const [copied, setCopied] = useState(false)
  const [validationInput, setValidationInput] = useState("")
  const [validationResult, setValidationResult] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState("generate")

  // Gerar um único CNPJ
  const handleGenerateCNPJ = () => {
    const newCNPJ = generateCNPJ(formatCNPJ)
    setCnpj(newCNPJ)
    setCopied(false)
  }

  // Gerar múltiplos CNPJs
  const handleGenerateMultiple = () => {
    const count = Math.min(Math.max(1, multipleCount), 100) // Limita entre 1 e 100
    const cnpjs = Array.from({ length: count }, () => generateCNPJ(formatCNPJ))
    setMultipleCNPJs(cnpjs)
  }

  // Validar um CNPJ
  const handleValidateCNPJ = () => {
    if (!validationInput.trim()) {
      setValidationResult(null)
      return
    }
    setValidationResult(validateCNPJ(validationInput))
  }

  // Copiar para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Copiar múltiplos CNPJs
  const copyMultipleCNPJs = () => {
    navigator.clipboard.writeText(multipleCNPJs.join("\n"))
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Gerador de CNPJ</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Gerar CNPJ</TabsTrigger>
            <TabsTrigger value="validate">Validar CNPJ</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerar CNPJ Único</CardTitle>
                <CardDescription>Gere um número de CNPJ válido aleatório</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="format-cnpj" checked={formatCNPJ} onCheckedChange={setFormatCNPJ} />
                      <Label htmlFor="format-cnpj">Formatar CNPJ (com pontuação)</Label>
                    </div>

                    <Button onClick={handleGenerateCNPJ} className="bg-[#089455] hover:bg-[#089455]/90">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gerar CNPJ
                    </Button>
                  </div>

                  {cnpj && (
                    <div className="mt-4">
                      <Label htmlFor="cnpj-result">CNPJ Gerado</Label>
                      <div className="flex mt-1.5">
                        <Input id="cnpj-result" value={cnpj} readOnly className="font-mono text-base flex-1" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(cnpj)}
                          className="ml-2 border-[#089455] text-[#089455]"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gerar Múltiplos CNPJs</CardTitle>
                <CardDescription>Gere vários números de CNPJ válidos de uma vez</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="multiple-count" className="min-w-24">
                        Quantidade:
                      </Label>
                      <Input
                        id="multiple-count"
                        type="number"
                        min="1"
                        max="100"
                        value={multipleCount}
                        onChange={(e) => setMultipleCount(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>

                    <Button onClick={handleGenerateMultiple} className="bg-[#089455] hover:bg-[#089455]/90">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gerar {multipleCount} CNPJs
                    </Button>
                  </div>

                  {multipleCNPJs.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>CNPJs Gerados</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyMultipleCNPJs}
                          className="border-[#089455] text-[#089455]"
                        >
                          <Copy className="mr-2 h-3 w-3" />
                          Copiar Todos
                        </Button>
                      </div>
                      <div className="bg-gray-50 border rounded-md p-3 max-h-60 overflow-y-auto">
                        <ul className="space-y-1">
                          {multipleCNPJs.map((cnpj, index) => (
                            <li key={index} className="font-mono text-sm flex justify-between items-center">
                              <span>{cnpj}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(cnpj)}
                                className="h-6 w-6 text-gray-500 hover:text-[#089455]"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Validar CNPJ</CardTitle>
                <CardDescription>Verifique se um número de CNPJ é válido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="validation-input">Digite o CNPJ para validar</Label>
                    <div className="flex mt-1.5">
                      <Input
                        id="validation-input"
                        value={validationInput}
                        onChange={(e) => setValidationInput(e.target.value)}
                        placeholder="Ex: 12.345.678/0001-90 ou 12345678000190"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleValidateCNPJ}
                        className="ml-2 bg-[#089455] hover:bg-[#089455]/90"
                        disabled={!validationInput.trim()}
                      >
                        Validar
                      </Button>
                    </div>
                  </div>

                  {validationResult !== null && (
                    <Alert className={validationResult ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                      <div className="flex items-center">
                        {validationResult ? (
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                        )}
                        <AlertTitle className={validationResult ? "text-green-800" : "text-red-800"}>
                          {validationResult ? "CNPJ Válido" : "CNPJ Inválido"}
                        </AlertTitle>
                      </div>
                      <AlertDescription className="mt-2">
                        {validationResult
                          ? "O número de CNPJ informado é válido de acordo com o algoritmo de verificação."
                          : "O número de CNPJ informado não é válido. Verifique se digitou corretamente."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-gray-50 p-4 rounded-md border mt-4">
                    <h3 className="font-medium mb-2">Sobre a validação de CNPJ</h3>
                    <p className="text-sm text-gray-600">
                      A validação verifica se o CNPJ segue as regras matemáticas definidas pela Receita Federal,
                      calculando os dígitos verificadores. Um CNPJ válido pelo algoritmo não significa necessariamente
                      que ele exista oficialmente ou pertença a uma empresa real.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Apenas para fins de teste</AlertTitle>
            <AlertDescription className="text-blue-700">
              Os CNPJs gerados são matematicamente válidos, mas são números aleatórios que não pertencem a nenhuma
              empresa real. Use apenas para testes de sistemas e desenvolvimento de software.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
