"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, Info } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Função para calcular as diferenças entre dois textos
function findDifferences(text1: string, text2: string, ignoreCase: boolean, ignoreWhitespace: boolean) {
  // Pré-processamento dos textos conforme as opções
  let processedText1 = text1
  let processedText2 = text2

  if (ignoreCase) {
    processedText1 = processedText1.toLowerCase()
    processedText2 = processedText2.toLowerCase()
  }

  if (ignoreWhitespace) {
    processedText1 = processedText1.replace(/\s+/g, " ").trim()
    processedText2 = processedText2.replace(/\s+/g, " ").trim()
  }

  // Dividir os textos em linhas
  const lines1 = processedText1.split("\n")
  const lines2 = processedText2.split("\n")

  // Comparar linha por linha
  const result = {
    identical: processedText1 === processedText2,
    differentLines: [] as { lineNumber: number; text1: string; text2: string }[],
    onlyInFirst: [] as { lineNumber: number; text: string }[],
    onlyInSecond: [] as { lineNumber: number; text: string }[],
    totalLines1: lines1.length,
    totalLines2: lines2.length,
  }

  // Encontrar o número máximo de linhas para iterar
  const maxLines = Math.max(lines1.length, lines2.length)

  for (let i = 0; i < maxLines; i++) {
    if (i < lines1.length && i < lines2.length) {
      // Ambos os textos têm esta linha
      if (lines1[i] !== lines2[i]) {
        result.differentLines.push({
          lineNumber: i + 1,
          text1: lines1[i],
          text2: lines2[i],
        })
      }
    } else if (i < lines1.length) {
      // Apenas o primeiro texto tem esta linha
      result.onlyInFirst.push({
        lineNumber: i + 1,
        text: lines1[i],
      })
    } else if (i < lines2.length) {
      // Apenas o segundo texto tem esta linha
      result.onlyInSecond.push({
        lineNumber: i + 1,
        text: lines2[i],
      })
    }
  }

  return result
}

export default function ComparadorTextosPage() {
  const [firstText, setFirstText] = useState("")
  const [secondText, setSecondText] = useState("")
  const [result, setResult] = useState<any>(null)
  const [ignoreCase, setIgnoreCase] = useState(false)
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false)
  const [isCompared, setIsCompared] = useState(false)

  const compareTexts = () => {
    const differences = findDifferences(firstText, secondText, ignoreCase, ignoreWhitespace)
    setResult(differences)
    setIsCompared(true)
  }

  const resetComparison = () => {
    setFirstText("")
    setSecondText("")
    setResult(null)
    setIsCompared(false)
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Comparador de Textos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Primeiro Texto</CardTitle>
              <CardDescription>Cole ou digite o primeiro texto para comparação</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={firstText}
                onChange={(e) => setFirstText(e.target.value)}
                placeholder="Digite ou cole o primeiro texto aqui..."
                className="min-h-[200px] w-full"
              />
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Segundo Texto</CardTitle>
              <CardDescription>Cole ou digite o segundo texto para comparação</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={secondText}
                onChange={(e) => setSecondText(e.target.value)}
                placeholder="Digite ou cole o segundo texto aqui..."
                className="min-h-[200px] w-full"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="ignore-case" checked={ignoreCase} onCheckedChange={setIgnoreCase} />
              <Label htmlFor="ignore-case">Ignorar maiúsculas/minúsculas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="ignore-whitespace" checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} />
              <Label htmlFor="ignore-whitespace">Ignorar espaços em branco extras</Label>
            </div>
          </div>

          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              onClick={compareTexts}
              className="bg-[#089455] hover:bg-[#089455]/90 flex-1 sm:flex-none"
              disabled={!firstText.trim() || !secondText.trim()}
            >
              Comparar Textos
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

        {isCompared && result && (
          <div className="space-y-6 w-full">
            <Alert className={result.identical ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
              <div className="flex items-center gap-2">
                {result.identical ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Info className="h-5 w-5 text-blue-600" />
                )}
                <AlertTitle className={result.identical ? "text-green-800" : "text-blue-800"}>
                  {result.identical ? "Os textos são idênticos!" : "Diferenças encontradas"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.identical
                  ? `Ambos os textos são idênticos, com ${result.totalLines1} linhas.`
                  : `Encontramos ${result.differentLines.length} linhas com conteúdo diferente, ${result.onlyInFirst.length} linhas apenas no primeiro texto e ${result.onlyInSecond.length} linhas apenas no segundo texto.`}
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
                                <div className="text-xs text-red-600 mb-1">Primeiro texto</div>
                                <div className="break-all">{diff.text1}</div>
                              </div>
                              <div className="bg-green-50 p-2 rounded">
                                <div className="text-xs text-green-600 mb-1">Segundo texto</div>
                                <div className="break-all">{diff.text2}</div>
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
                        Linhas apenas no primeiro texto ({result.onlyInFirst.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {result.onlyInFirst.map((line: any, index: number) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="font-medium mb-1">Linha {line.lineNumber}</div>
                            <div className="break-all">{line.text}</div>
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
                        Linhas apenas no segundo texto ({result.onlyInSecond.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {result.onlyInSecond.map((line: any, index: number) => (
                          <div key={index} className="border rounded-md p-3">
                            <div className="font-medium mb-1">Linha {line.lineNumber}</div>
                            <div className="break-all">{line.text}</div>
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
      </div>
    </div>
  )
}
