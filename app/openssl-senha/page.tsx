"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy, RefreshCw, Check, Terminal } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Função para gerar bytes aleatórios (similar ao openssl rand)
function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length))
}

// Função para converter para base64 (similar ao -base64 do openssl)
function toBase64(bytes: Uint8Array): string {
  // Converter para string base64
  let binary = ""
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Função para remover quebras de linha (similar ao tr -d '\n')
function removeNewlines(str: string): string {
  return str.replace(/\n/g, "")
}

// Função principal que simula o comando completo
function simulateOpenSSLCommand(byteLength: number): string {
  const randomBytes = generateRandomBytes(byteLength)
  const base64String = toBase64(randomBytes)
  return removeNewlines(base64String)
}

export default function OpenSSLSenhaPage() {
  const [byteLength, setByteLength] = useState(36)
  const [password, setPassword] = useState("")
  const [copied, setCopied] = useState(false)
  const [showLengthIndicator, setShowLengthIndicator] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<"fraca" | "média" | "forte" | "muito forte">("forte")
  const [commandOutput, setCommandOutput] = useState("")

  // Gerar senha quando a página carrega
  useEffect(() => {
    generatePassword()
  }, [])

  // Avaliar a força da senha
  useEffect(() => {
    evaluatePasswordStrength()
  }, [password])

  const handleSliderInteraction = () => {
    setShowLengthIndicator(true)
    setTimeout(() => {
      setShowLengthIndicator(false)
    }, 2000)
  }

  const generatePassword = () => {
    const newPassword = simulateOpenSSLCommand(byteLength)
    setPassword(newPassword)

    // Atualizar o comando que seria executado
    setCommandOutput(`openssl rand -base64 ${byteLength} | tr -d '\\n'`)

    setCopied(false)
  }

  const evaluatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength("fraca")
      return
    }

    // Avaliar com base no comprimento e na entropia
    if (byteLength >= 48) {
      setPasswordStrength("muito forte")
    } else if (byteLength >= 32) {
      setPasswordStrength("forte")
    } else if (byteLength >= 24) {
      setPasswordStrength("média")
    } else {
      setPasswordStrength("fraca")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "fraca":
        return "bg-red-500"
      case "média":
        return "bg-yellow-500"
      case "forte":
        return "bg-green-500"
      case "muito forte":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Calcular o comprimento aproximado da senha resultante
  const estimatedPasswordLength = Math.ceil((byteLength * 4) / 3)

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Gerador de Senhas OpenSSL</h1>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator">Gerador</TabsTrigger>
            <TabsTrigger value="about">Sobre o Comando</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Senha Gerada</CardTitle>
                <CardDescription>Senha aleatória gerada usando o equivalente ao comando OpenSSL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input value={password} readOnly className="pr-24 font-mono text-sm h-12 overflow-x-auto" />
                  <div className="absolute right-1 top-1 flex space-x-1">
                    <Button variant="ghost" size="icon" onClick={generatePassword} className="h-10 w-10">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(password)} className="h-10 w-10">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <div className="text-sm">Força:</div>
                  <Badge className={`${getStrengthColor()} capitalize`}>{passwordStrength}</Badge>
                  <div className="text-xs text-gray-500 ml-auto">
                    Comprimento: ~{estimatedPasswordLength} caracteres
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
                <CardDescription>Ajuste os parâmetros para gerar sua senha</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="byte-length">Número de bytes: {byteLength}</Label>
                  </div>
                  <div className="relative mt-6 mb-8">
                    {showLengthIndicator && (
                      <div
                        className="absolute -top-7 bg-[#089455] text-white px-2 py-1 rounded-md text-xs font-medium transform -translate-x-1/2 transition-all opacity-100 scale-100"
                        style={{ left: `${((byteLength - 12) / (96 - 12)) * 100}%` }}
                      >
                        {byteLength}
                      </div>
                    )}
                    <Slider
                      id="byte-length"
                      min={12}
                      max={96}
                      step={4}
                      value={[byteLength]}
                      onValueChange={(value) => {
                        setByteLength(value[0])
                        handleSliderInteraction()
                      }}
                      onMouseDown={handleSliderInteraction}
                      onTouchStart={handleSliderInteraction}
                      className="[&>span]:bg-[#089455] cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[12, 24, 36, 48, 64, 72, 84, 96].map((value) => (
                      <Button
                        key={value}
                        variant={byteLength === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setByteLength(value)
                          handleSliderInteraction()
                        }}
                        className={byteLength === value ? "bg-[#089455] hover:bg-[#089455]/90" : ""}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>

                  <Alert className="bg-[#089455]/10 border-[#089455]/20 mt-4">
                    <AlertDescription>
                      Recomendamos pelo menos 36 bytes para senhas seguras. Quanto maior o número de bytes, mais segura
                      será a senha.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="bg-gray-100 p-4 rounded-md border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Terminal className="h-4 w-4 mr-2 text-[#089455]" />
                    <Label className="font-medium">Comando equivalente:</Label>
                  </div>
                  <div className="bg-gray-900 text-white p-3 rounded-md font-mono text-sm overflow-x-auto">
                    {commandOutput}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={generatePassword} className="w-full bg-[#089455] hover:bg-[#089455]/90">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Gerar Nova Senha
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sobre o Comando OpenSSL</CardTitle>
                <CardDescription>Entenda como funciona o comando usado para gerar senhas seguras</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">O que é o OpenSSL?</h3>
                  <p className="text-gray-700">
                    OpenSSL é uma biblioteca de criptografia robusta que implementa os protocolos Secure Sockets Layer
                    (SSL) e Transport Layer Security (TLS). Além de ser usado para comunicações seguras, o OpenSSL
                    também fornece utilitários de linha de comando para várias tarefas criptográficas.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Como funciona o comando</h3>
                  <div className="bg-gray-900 text-white p-3 rounded-md font-mono text-sm mb-3">
                    openssl rand -base64 36 | tr -d '\n'
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>
                      <strong>openssl rand</strong>: Gera bytes aleatórios criptograficamente seguros
                    </li>
                    <li>
                      <strong>-base64 36</strong>: Converte 36 bytes aleatórios para formato base64 (mais legível)
                    </li>
                    <li>
                      <strong>tr -d '\n'</strong>: Remove qualquer quebra de linha da saída
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Por que usar este método?</h3>
                  <p className="text-gray-700">
                    Este método gera senhas com alta entropia (aleatoriedade), tornando-as extremamente difíceis de
                    adivinhar ou quebrar por força bruta. A codificação base64 garante que a senha contenha uma mistura
                    de letras maiúsculas, minúsculas, números e alguns símbolos.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Relação entre bytes e caracteres</h3>
                  <p className="text-gray-700">
                    Quando convertemos bytes para base64, cada 3 bytes geram aproximadamente 4 caracteres. Assim, 36
                    bytes resultam em aproximadamente 48 caracteres. Esta ferramenta simula esse comportamento usando
                    APIs criptográficas do navegador.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
