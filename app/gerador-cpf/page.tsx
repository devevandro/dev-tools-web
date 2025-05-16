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

// Função para gerar um CPF válido
function generateCPF(formatted = true): string {
  // Gera os 9 primeiros dígitos aleatórios
  const cpfArray: number[] = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

  // Calcula o primeiro dígito verificador
  let sum = cpfArray.reduce((acc, digit, index) => acc + digit * (10 - index), 0)
  let remainder = (sum * 10) % 11
  const firstDigit = remainder === 10 ? 0 : remainder

  cpfArray.push(firstDigit)

  // Calcula o segundo dígito verificador
  sum = cpfArray.reduce((acc, digit, index) => acc + digit * (11 - index), 0)
  remainder = (sum * 10) % 11
  const secondDigit = remainder === 10 ? 0 : remainder

  cpfArray.push(secondDigit)

  // Formata o CPF se necessário
  if (formatted) {
    return `${cpfArray.slice(0, 3).join("")}.${cpfArray.slice(3, 6).join("")}.${cpfArray
      .slice(6, 9)
      .join("")}-${cpfArray.slice(9).join("")}`
  }

  return cpfArray.join("")
}

// Função para validar um CPF
function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "")

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false

  // Verifica se todos os dígitos são iguais (caso inválido)
  if (/^(\d)\1+$/.test(cpf)) return false

  // Converte para array de números
  const cpfArray = cpf.split("").map(Number)

  // Valida o primeiro dígito verificador
  let sum = cpfArray.slice(0, 9).reduce((acc, digit, index) => acc + digit * (10 - index), 0)
  let remainder = (sum * 10) % 11
  const firstDigit = remainder === 10 ? 0 : remainder
  if (firstDigit !== cpfArray[9]) return false

  // Valida o segundo dígito verificador
  sum = cpfArray.slice(0, 10).reduce((acc, digit, index) => acc + digit * (11 - index), 0)
  remainder = (sum * 10) % 11
  const secondDigit = remainder === 10 ? 0 : remainder
  if (secondDigit !== cpfArray[10]) return false

  return true
}

export default function GeradorCPFPage() {
  const [cpf, setCpf] = useState("")
  const [multipleCount, setMultipleCount] = useState(5)
  const [multipleCPFs, setMultipleCPFs] = useState<string[]>([])
  const [formatCPF, setFormatCPF] = useState(true)
  const [copied, setCopied] = useState(false)
  const [validationInput, setValidationInput] = useState("")
  const [validationResult, setValidationResult] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState("generate")

  // Gerar um único CPF
  const handleGenerateCPF = () => {
    const newCPF = generateCPF(formatCPF)
    setCpf(newCPF)
    setCopied(false)
  }

  // Gerar múltiplos CPFs
  const handleGenerateMultiple = () => {
    const count = Math.min(Math.max(1, multipleCount), 100) // Limita entre 1 e 100
    const cpfs = Array.from({ length: count }, () => generateCPF(formatCPF))
    setMultipleCPFs(cpfs)
  }

  // Validar um CPF
  const handleValidateCPF = () => {
    if (!validationInput.trim()) {
      setValidationResult(null)
      return
    }
    setValidationResult(validateCPF(validationInput))
  }

  // Copiar para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Copiar múltiplos CPFs
  const copyMultipleCPFs = () => {
    navigator.clipboard.writeText(multipleCPFs.join("\n"))
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Gerador de CPF</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Gerar CPF</TabsTrigger>
            <TabsTrigger value="validate">Validar CPF</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerar CPF Único</CardTitle>
                <CardDescription>Gere um número de CPF válido aleatório</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="format-cpf" checked={formatCPF} onCheckedChange={setFormatCPF} />
                      <Label htmlFor="format-cpf">Formatar CPF (com pontuação)</Label>
                    </div>

                    <Button onClick={handleGenerateCPF} className="bg-[#089455] hover:bg-[#089455]/90">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gerar CPF
                    </Button>
                  </div>

                  {cpf && (
                    <div className="mt-4">
                      <Label htmlFor="cpf-result">CPF Gerado</Label>
                      <div className="flex mt-1.5">
                        <Input id="cpf-result" value={cpf} readOnly className="font-mono text-base flex-1" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(cpf)}
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
                <CardTitle>Gerar Múltiplos CPFs</CardTitle>
                <CardDescription>Gere vários números de CPF válidos de uma vez</CardDescription>
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
                      Gerar {multipleCount} CPFs
                    </Button>
                  </div>

                  {multipleCPFs.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>CPFs Gerados</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyMultipleCPFs}
                          className="border-[#089455] text-[#089455]"
                        >
                          <Copy className="mr-2 h-3 w-3" />
                          Copiar Todos
                        </Button>
                      </div>
                      <div className="bg-gray-50 border rounded-md p-3 max-h-60 overflow-y-auto">
                        <ul className="space-y-1">
                          {multipleCPFs.map((cpf, index) => (
                            <li key={index} className="font-mono text-sm flex justify-between items-center">
                              <span>{cpf}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(cpf)}
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
                <CardTitle>Validar CPF</CardTitle>
                <CardDescription>Verifique se um número de CPF é válido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="validation-input">Digite o CPF para validar</Label>
                    <div className="flex mt-1.5">
                      <Input
                        id="validation-input"
                        value={validationInput}
                        onChange={(e) => setValidationInput(e.target.value)}
                        placeholder="Ex: 123.456.789-09 ou 12345678909"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleValidateCPF}
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
                          {validationResult ? "CPF Válido" : "CPF Inválido"}
                        </AlertTitle>
                      </div>
                      <AlertDescription className="mt-2">
                        {validationResult
                          ? "O número de CPF informado é válido de acordo com o algoritmo de verificação."
                          : "O número de CPF informado não é válido. Verifique se digitou corretamente."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-gray-50 p-4 rounded-md border mt-4">
                    <h3 className="font-medium mb-2">Sobre a validação de CPF</h3>
                    <p className="text-sm text-gray-600">
                      A validação verifica se o CPF segue as regras matemáticas definidas pela Receita Federal,
                      calculando os dígitos verificadores. Um CPF válido pelo algoritmo não significa necessariamente
                      que ele exista oficialmente ou pertença a alguém.
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
              Os CPFs gerados são matematicamente válidos, mas são números aleatórios que não pertencem a nenhuma pessoa
              real. Use apenas para testes de sistemas e desenvolvimento de software.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
