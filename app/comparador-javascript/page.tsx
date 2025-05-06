"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Função para formatar código JavaScript
function formatJavaScript(code: string): string {
  try {
    // Remover comentários de linha única
    code = code.replace(/\/\/.*$/gm, "")
    // Remover comentários de múltiplas linhas
    code = code.replace(/\/\*[\s\S]*?\*\//gm, "")
    // Remover espaços em branco extras
    code = code.replace(/\s+/g, " ")
    // Remover espaços em branco antes e depois de operadores
    code = code.replace(/\s*([+\-*/%=&|<>!?:;,(){}[\]])\s*/g, "$1")
    // Adicionar espaço após vírgulas
    code = code.replace(/,/g, ", ")
    // Remover ponto e vírgula no final
    code = code.replace(/;$/gm, "")
    // Remover espaços em branco no início e fim
    code = code.trim()

    return code
  } catch (error) {
    console.error("Erro ao formatar código:", error)
    return code
  }
}

// Função para comparar códigos JavaScript
function compareJavaScript(code1: string, code2: string, ignoreFormatting: boolean, ignoreCase: boolean): any {
  // Pré-processamento dos códigos conforme as opções
  let processedCode1 = code1
  let processedCode2 = code2

  if (ignoreCase) {
    processedCode1 = processedCode1.toLowerCase()
    processedCode2 = processedCode2.toLowerCase()
  }

  if (ignoreFormatting) {
    processedCode1 = formatJavaScript(processedCode1)
    processedCode2 = formatJavaScript(processedCode2)
  }

  // Verificar se os códigos são idênticos após processamento
  const areIdentical = processedCode1 === processedCode2

  // Dividir os códigos em linhas para análise detalhada
  const lines1 = processedCode1.split("\n")
  const lines2 = processedCode2.split("\n")

  // Comparar linha por linha
  const result = {
    identical: areIdentical,
    differentLines: [] as { lineNumber: number; code1: string; code2: string }[],
    onlyInFirst: [] as { lineNumber: number; code: string }[],
    onlyInSecond: [] as { lineNumber: number; code: string }[],
    totalLines1: lines1.length,
    totalLines2: lines2.length,
  }

  // Encontrar o número máximo de linhas para iterar
  const maxLines = Math.max(lines1.length, lines2.length)

  for (let i = 0; i < maxLines; i++) {
    if (i < lines1.length && i < lines2.length) {
      // Ambos os códigos têm esta linha
      if (lines1[i] !== lines2[i]) {
        result.differentLines.push({
          lineNumber: i + 1,
          code1: lines1[i],
          code2: lines2[i],
        })
      }
    } else if (i < lines1.length) {
      // Apenas o primeiro código tem esta linha
      result.onlyInFirst.push({
        lineNumber: i + 1,
        code: lines1[i],
      })
    } else if (i < lines2.length) {
      // Apenas o segundo código tem esta linha
      result.onlyInSecond.push({
        lineNumber: i + 1,
        code: lines2[i],
      })
    }
  }

  return result
}

// Função para tentar executar o código e verificar se produz o mesmo resultado
function testCodeExecution(
  code1: string,
  code2: string,
): { success: boolean; result1: any; result2: any; error?: string } {
  try {
    // Envolver o código em uma função para capturar o retorno
    const wrappedCode1 = `(function() { ${code1} })()`
    const wrappedCode2 = `(function() { ${code2} })()`

    // Executar os códigos (isso é simplificado e não seguro para produção)
    // Em um ambiente real, você usaria uma sandbox ou avaliação segura
    const result1 = eval(wrappedCode1)
    const result2 = eval(wrappedCode2)

    // Comparar os resultados (comparação superficial)
    const areEqual = JSON.stringify(result1) === JSON.stringify(result2)

    return {
      success: true,
      result1,
      result2,
      equal: areEqual,
    }
  } catch (error) {
    return {
      success: false,
      result1: null,
      result2: null,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

export default function ComparadorJavaScriptPage() {
  const [code1, setCode1] = useState("")
  const [code2, setCode2] = useState("")
  const [result, setResult] = useState<any>(null)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [ignoreFormatting, setIgnoreFormatting] = useState(true)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [isCompared, setIsCompared] = useState(false)
  const [activeTab, setActiveTab] = useState("syntax")

  const compareCodes = () => {
    // Comparar a sintaxe dos códigos
    const comparisonResult = compareJavaScript(code1, code2, ignoreFormatting, ignoreCase)
    setResult(comparisonResult)

    // Se estiver na aba de execução, tentar executar os códigos
    if (activeTab === "execution") {
      const execResult = testCodeExecution(code1, code2)
      setExecutionResult(execResult)
    }

    setIsCompared(true)
  }

  const resetComparison = () => {
    setCode1("")
    setCode2("")
    setResult(null)
    setExecutionResult(null)
    setIsCompared(false)
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Comparador de JavaScript</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Primeiro Código JavaScript</CardTitle>
              <CardDescription>Cole ou digite o primeiro código JavaScript</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code1}
                onChange={(e) => setCode1(e.target.value)}
                placeholder="function exemplo() { return 42; }"
                className="min-h-[300px] font-mono text-sm w-full"
              />
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Segundo Código JavaScript</CardTitle>
              <CardDescription>Cole ou digite o segundo código JavaScript</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code2}
                onChange={(e) => setCode2(e.target.value)}
                placeholder="function exemplo() { return 42; }"
                className="min-h-[300px] font-mono text-sm w-full"
              />
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="syntax">Comparar Sintaxe</TabsTrigger>
            <TabsTrigger value="execution">Comparar Execução</TabsTrigger>
          </TabsList>

          <TabsContent value="syntax" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Opções de Comparação de Sintaxe</CardTitle>
                <CardDescription>Configure como os códigos serão comparados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="ignore-formatting" checked={ignoreFormatting} onCheckedChange={setIgnoreFormatting} />
                      <Label htmlFor="ignore-formatting">Ignorar formatação</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="ignore-case" checked={ignoreCase} onCheckedChange={setIgnoreCase} />
                      <Label htmlFor="ignore-case">Ignorar maiúsculas/minúsculas</Label>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full sm:w-auto">
                    <Button
                      onClick={compareCodes}
                      className="bg-[#089455] hover:bg-[#089455]/90 flex-1 sm:flex-none"
                      disabled={!code1.trim() || !code2.trim()}
                    >
                      Comparar Códigos
                    </Button>

                    <Button
                      onClick={resetComparison}
                      variant="outline"
                      className="border-[#089455] text-[#089455] flex-1 sm:flex-none"
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="execution" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Comparação de Execução</CardTitle>
                <CardDescription>Verifica se os códigos produzem o mesmo resultado quando executados</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="bg-amber-50 border-amber-200 mb-4">
                  <Info className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-800">Atenção</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Esta funcionalidade tenta executar os códigos para comparar seus resultados. Use apenas com códigos
                    seguros e simples.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-4">
                  <Button
                    onClick={compareCodes}
                    className="bg-[#089455] hover:bg-[#089455]/90"
                    disabled={!code1.trim() || !code2.trim()}
                  >
                    Executar e Comparar
                  </Button>

                  <Button onClick={resetComparison} variant="outline" className="border-[#089455] text-[#089455]">
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {isCompared && result && activeTab === "syntax" && (
          <div className="space-y-6 w-full">
            <Alert className={result.identical ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
              <div className="flex items-center gap-2">
                {result.identical ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Info className="h-5 w-5 text-blue-600" />
                )}
                <AlertTitle className={result.identical ? "text-green-800" : "text-blue-800"}>
                  {result.identical ? "Os códigos são idênticos!" : "Diferenças encontradas"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.identical
                  ? `Ambos os códigos são idênticos, com ${result.totalLines1} linhas.`
                  : `Encontramos ${result.differentLines.length} linhas com conteúdo diferente, ${result.onlyInFirst.length} linhas apenas no primeiro código e ${result.onlyInSecond.length} linhas apenas no segundo código.`}
              </AlertDescription>
            </Alert>

            {!result.identical && (
              <div className="space-y-4 w-full">
                {result.differentLines.length > 0 && (
                  <Card className="w-full">
                    <CardHeader className="bg-amber-50">
                      <CardTitle className="text-amber-800">
                        Linhas com conteúdo diferente ({result.differentLines.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {result.differentLines.map((diff: any, index: number) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="font-medium mb-2">Linha {diff.lineNumber}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="bg-red-50 p-2 rounded">
                                <div className="text-xs text-red-600 mb-1">Primeiro código</div>
                                <div className="font-mono text-sm break-all">{diff.code1}</div>
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <div className="text-xs text-green-600 mb-1">Segundo código</div>
                                <div className="font-mono text-sm break-all">{diff.code2}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.onlyInFirst.length > 0 && (
                  <Card className="w-full">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-red-800">
                        Linhas apenas no primeiro código ({result.onlyInFirst.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {result.onlyInFirst.map((line: any, index: number) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="font-medium mb-1">Linha {line.lineNumber}</div>
                            <div className="font-mono text-sm break-all">{line.code}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.onlyInSecond.length > 0 && (
                  <Card className="w-full">
                    <CardHeader className="bg-green-50">
                      <CardTitle className="text-green-800">
                        Linhas apenas no segundo código ({result.onlyInSecond.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {result.onlyInSecond.map((line: any, index: number) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="font-medium mb-1">Linha {line.lineNumber}</div>
                            <div className="font-mono text-sm break-all">{line.code}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {isCompared && executionResult && activeTab === "execution" && (
          <div className="space-y-6 w-full">
            {executionResult.success ? (
              <Alert
                className={executionResult.equal ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}
              >
                <div className="flex items-center gap-2">
                  {executionResult.equal ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-600" />
                  )}
                  <AlertTitle className={executionResult.equal ? "text-green-800" : "text-amber-800"}>
                    {executionResult.equal
                      ? "Os códigos produzem o mesmo resultado!"
                      : "Os códigos produzem resultados diferentes"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  {executionResult.equal
                    ? "Ambos os códigos foram executados e produziram resultados idênticos."
                    : "Os códigos foram executados, mas produziram resultados diferentes."}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <XCircle className="h-5 w-5" />
                <AlertTitle>Erro ao executar os códigos</AlertTitle>
                <AlertDescription>{executionResult.error}</AlertDescription>
              </Alert>
            )}

            {executionResult.success && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Resultado do Primeiro Código</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded border font-mono text-sm">
                      {typeof executionResult.result1 === "object"
                        ? JSON.stringify(executionResult.result1, null, 2)
                        : String(executionResult.result1)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resultado do Segundo Código</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-3 rounded border font-mono text-sm">
                      {typeof executionResult.result2 === "object"
                        ? JSON.stringify(executionResult.result2, null, 2)
                        : String(executionResult.result2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
