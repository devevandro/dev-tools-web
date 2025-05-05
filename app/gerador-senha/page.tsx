"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Copy, RefreshCw, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function GeradorSenhaPage() {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<"fraca" | "média" | "forte" | "muito forte">("forte")

  // Gerar senha quando as opções mudarem
  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  // Avaliar a força da senha
  useEffect(() => {
    evaluatePasswordStrength()
  }, [password])

  const generatePassword = () => {
    let charset = ""
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+{}[]|:;<>,.?/~`"

    // Verificar se pelo menos um conjunto de caracteres está selecionado
    if (!charset) {
      setPassword("")
      return
    }

    let newPassword = ""
    let hasLower = !includeLowercase
    let hasUpper = !includeUppercase
    let hasNumber = !includeNumbers
    let hasSymbol = !includeSymbols

    // Garantir que a senha tenha pelo menos um caractere de cada tipo selecionado
    while (
      newPassword.length < length ||
      (!hasLower && includeLowercase) ||
      (!hasUpper && includeUppercase) ||
      (!hasNumber && includeNumbers) ||
      (!hasSymbol && includeSymbols)
    ) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      const char = charset[randomIndex]

      // Verificar o tipo de caractere
      if (/[a-z]/.test(char)) hasLower = true
      else if (/[A-Z]/.test(char)) hasUpper = true
      else if (/[0-9]/.test(char)) hasNumber = true
      else hasSymbol = true

      newPassword += char

      // Se a senha já atingiu o comprimento desejado, mas não tem todos os tipos necessários,
      // remover um caractere aleatório para dar espaço para os tipos que faltam
      if (
        newPassword.length >= length &&
        ((!hasLower && includeLowercase) ||
          (!hasUpper && includeUppercase) ||
          (!hasNumber && includeNumbers) ||
          (!hasSymbol && includeSymbols))
      ) {
        const removeIndex = Math.floor(Math.random() * newPassword.length)
        newPassword = newPassword.substring(0, removeIndex) + newPassword.substring(removeIndex + 1)
      }
    }

    // Cortar a senha para o comprimento exato
    if (newPassword.length > length) {
      newPassword = newPassword.substring(0, length)
    }

    setPassword(newPassword)
    setCopied(false)
  }

  const evaluatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength("fraca")
      return
    }

    let score = 0

    // Comprimento
    if (password.length >= 12) score += 2
    else if (password.length >= 8) score += 1

    // Complexidade
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^a-zA-Z0-9]/.test(password)) score += 1

    // Variedade
    const uniqueChars = new Set(password).size
    if (uniqueChars > password.length * 0.7) score += 1

    // Determinar força
    if (score >= 6) setPasswordStrength("muito forte")
    else if (score >= 4) setPasswordStrength("forte")
    else if (score >= 3) setPasswordStrength("média")
    else setPasswordStrength("fraca")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password).then(() => {
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

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Gerador de Senhas Seguras</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sua Senha Gerada</CardTitle>
            <CardDescription>Uma senha forte e aleatória para uso em qualquer serviço</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Input value={password} readOnly className="pr-24 font-mono text-lg h-12" />
              <div className="absolute right-1 top-1 flex space-x-1">
                <Button variant="ghost" size="icon" onClick={generatePassword} className="h-10 w-10">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-10 w-10">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="text-sm">Força:</div>
              <Badge className={`${getStrengthColor()} capitalize`}>{passwordStrength}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opções de Geração</CardTitle>
            <CardDescription>Personalize as configurações da sua senha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="length">Comprimento: {length} caracteres</Label>
              </div>
              <Slider
                id="length"
                min={8}
                max={32}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                className="[&>span]:bg-[#089455]"
              />
              <Alert className="bg-[#089455]/10 border-[#089455]/20">
                <AlertDescription>
                  Recomendamos senhas com pelo menos 12 caracteres para maior segurança.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-3">
              <Label>Incluir:</Label>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                  <Label htmlFor="uppercase">Letras maiúsculas (A-Z)</Label>
                </div>
                <span className="text-sm text-muted-foreground">A, B, C...</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                  <Label htmlFor="lowercase">Letras minúsculas (a-z)</Label>
                </div>
                <span className="text-sm text-muted-foreground">a, b, c...</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                  <Label htmlFor="numbers">Números (0-9)</Label>
                </div>
                <span className="text-sm text-muted-foreground">0, 1, 2...</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                  <Label htmlFor="symbols">Símbolos especiais</Label>
                </div>
                <span className="text-sm text-muted-foreground">!, @, #...</span>
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full bg-[#089455] hover:bg-[#089455]/90">
              <RefreshCw className="mr-2 h-4 w-4" />
              Gerar Nova Senha
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
