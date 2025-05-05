"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type EnvEntry = {
  key: string
  value: string
  line: number
}

type ComparisonResult = {
  isEqual: boolean
  onlyInFirst: EnvEntry[]
  onlyInSecond: EnvEntry[]
  different: { first: EnvEntry; second: EnvEntry }[]
  equal: { key: string; value: string }[]
}

export default function ComparadorPage() {
  const [firstEnv, setFirstEnv] = useState("")
  const [secondEnv, setSecondEnv] = useState("")
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [isCompared, setIsCompared] = useState(false)

  const parseEnvFile = (content: string): EnvEntry[] => {
    const lines = content.split("\n")
    const entries: EnvEntry[] = []

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

      entries.push({ key, value, line: index + 1 })
    })

    return entries
  }

  const compareEnvs = () => {
    const firstEntries = parseEnvFile(firstEnv)
    const secondEntries = parseEnvFile(secondEnv)

    const firstMap = new Map(firstEntries.map((entry) => [entry.key, entry]))
    const secondMap = new Map(secondEntries.map((entry) => [entry.key, entry]))

    const onlyInFirst: EnvEntry[] = []
    const onlyInSecond: EnvEntry[] = []
    const different: { first: EnvEntry; second: EnvEntry }[] = []
    const equal: { key: string; value: string }[] = []

    // Verificar entradas no primeiro arquivo
    firstEntries.forEach((entry) => {
      const secondEntry = secondMap.get(entry.key)
      if (!secondEntry) {
        onlyInFirst.push(entry)
      } else if (entry.value !== secondEntry.value) {
        different.push({ first: entry, second: secondEntry })
      } else {
        equal.push({ key: entry.key, value: entry.value })
      }
    })

    // Verificar entradas apenas no segundo arquivo
    secondEntries.forEach((entry) => {
      if (!firstMap.has(entry.key)) {
        onlyInSecond.push(entry)
      }
    })

    const comparisonResult: ComparisonResult = {
      isEqual: onlyInFirst.length === 0 && onlyInSecond.length === 0 && different.length === 0,
      onlyInFirst,
      onlyInSecond,
      different,
      equal,
    }

    setResult(comparisonResult)
    setIsCompared(true)
  }

  const resetComparison = () => {
    setFirstEnv("")
    setSecondEnv("")
    setResult(null)
    setIsCompared(false)
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Comparador de Arquivos .env</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Primeiro Arquivo .env</CardTitle>
              <CardDescription>Cole o conteúdo do primeiro arquivo .env</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={firstEnv}
                onChange={(e) => setFirstEnv(e.target.value)}
                placeholder="Ex: API_KEY='12345'"
                className="min-h-[200px] font-mono text-sm w-full"
              />
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Segundo Arquivo .env</CardTitle>
              <CardDescription>Cole o conteúdo do segundo arquivo .env</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={secondEnv}
                onChange={(e) => setSecondEnv(e.target.value)}
                placeholder="Ex: API_KEY='12345'"
                className="min-h-[200px] font-mono text-sm w-full"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={compareEnvs}
            className="bg-[#089455] hover:bg-[#089455]/90"
            disabled={!firstEnv.trim() || !secondEnv.trim()}
          >
            Comparar Arquivos
          </Button>

          <Button onClick={resetComparison} variant="outline" className="border-[#089455] text-[#089455]">
            Limpar
          </Button>
        </div>

        {isCompared && result && (
          <div className="space-y-6 w-full">
            <Alert className={result.isEqual ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
              <div className="flex items-center gap-2">
                {result.isEqual ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <AlertTitle className={result.isEqual ? "text-green-800" : "text-red-800"}>
                  {result.isEqual ? "Os arquivos são idênticos!" : "Os arquivos são diferentes!"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.isEqual
                  ? `Ambos os arquivos contêm ${result.equal.length} variáveis com valores idênticos.`
                  : `Encontramos ${result.different.length} variáveis com valores diferentes, ${result.onlyInFirst.length} variáveis apenas no primeiro arquivo e ${result.onlyInSecond.length} variáveis apenas no segundo arquivo.`}
              </AlertDescription>
            </Alert>

            {!result.isEqual && (
              <div className="space-y-4 w-full">
                {result.different.length > 0 && (
                  <Card className="w-full">
                    <CardHeader className="bg-amber-50">
                      <CardTitle className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="h-5 w-5" />
                        Variáveis com valores diferentes ({result.different.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        {result.different.map(({ first, second }) => (
                          <div key={first.key} className="border rounded-md p-3">
                            <div className="font-medium mb-2">{first.key}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="bg-blue-50 p-2 rounded">
                                <Badge variant="outline" className="mb-1 bg-blue-100">
                                  Arquivo 1 (linha {first.line})
                                </Badge>
                                <div className="font-mono text-sm break-all">{first.value}</div>
                              </div>
                              <div className="bg-purple-50 p-2 rounded">
                                <Badge variant="outline" className="mb-1 bg-purple-100">
                                  Arquivo 2 (linha {second.line})
                                </Badge>
                                <div className="font-mono text-sm break-all">{second.value}</div>
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
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="text-blue-800">
                        Variáveis apenas no primeiro arquivo ({result.onlyInFirst.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {result.onlyInFirst.map((entry) => (
                          <div key={entry.key} className="border rounded-md p-3">
                            <Badge className="mb-1">Linha {entry.line}</Badge>
                            <div className="font-medium">{entry.key}</div>
                            <div className="font-mono text-sm mt-1 break-all">{entry.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {result.onlyInSecond.length > 0 && (
                  <Card className="w-full">
                    <CardHeader className="bg-purple-50">
                      <CardTitle className="text-purple-800">
                        Variáveis apenas no segundo arquivo ({result.onlyInSecond.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        {result.onlyInSecond.map((entry) => (
                          <div key={entry.key} className="border rounded-md p-3">
                            <Badge className="mb-1">Linha {entry.line}</Badge>
                            <div className="font-medium">{entry.key}</div>
                            <div className="font-mono text-sm mt-1 break-all">{entry.value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {result.equal.length > 0 && (
              <Card className="w-full">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-800">
                    Variáveis idênticas em ambos os arquivos ({result.equal.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {result.equal.map((entry) => (
                      <div key={entry.key} className="border rounded-md p-2">
                        <div className="font-medium text-sm">{entry.key}</div>
                        <div className="font-mono text-xs text-gray-600 truncate" title={entry.value}>
                          {entry.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
