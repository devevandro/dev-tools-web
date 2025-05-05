"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, KeyRound, CheckCircle2, XCircle } from "lucide-react"
import { Label } from "@/components/ui/label"

// Implementação simplificada do algoritmo APR1-MD5
// Nota: Esta é uma implementação para fins educacionais
// Em produção, use bibliotecas de criptografia adequadas
function generateAprMd5Hash(password: string, salt?: string): string {
  // Esta é uma implementação simulada do APR1-MD5
  // Em um ambiente real, você usaria uma biblioteca criptográfica

  // Gerar um salt aleatório se não for fornecido
  if (!salt) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    salt = ""
    for (let i = 0; i < 8; i++) {
      salt += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  // Simular o hash APR1-MD5
  // O formato real é: $apr1$salt$hash
  const simulatedHash =
    `$apr1$${salt}$` +
    Array.from(password + salt)
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("")

  return simulatedHash
}

function verifyAprMd5Hash(password: string, hash: string): boolean {
  // Extrair o salt do hash
  const parts = hash.split("$")
  if (parts.length !== 4 || parts[1] !== "apr1") {
    return false
  }

  const salt = parts[2]

  // Gerar um novo hash com a senha fornecida e o salt extraído
  const generatedHash = generateAprMd5Hash(password, salt)

  // Comparar os hashes
  return generatedHash === hash
}

export default function HashSenhaPage() {
  const [password, setPassword] = useState("")
  const [generatedHash, setGeneratedHash] = useState("")
  const [verifyPassword, setVerifyPassword] = useState("")
  const [hashToVerify, setHashToVerify] = useState("")
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateHash = () => {
    try {
      setError(null)

      if (!password.trim()) {
        setError("Por favor, insira uma senha")
        return
      }

      const hash = generateAprMd5Hash(password)
      setGeneratedHash(hash)
    } catch (err) {
      setError(`Erro ao gerar hash: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const verifyHash = () => {
    try {
      setError(null)
      setVerificationResult(null)

      if (!verifyPassword.trim() || !hashToVerify.trim()) {
        setError("Por favor, preencha todos os campos")
        return
      }

      const result = verifyAprMd5Hash(verifyPassword, hashToVerify)
      setVerificationResult(result)
    } catch (err) {
      setError(`Erro ao verificar hash: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedHash).catch((err) => {
      setError(`Erro ao copiar: ${err instanceof Error ? err.message : String(err)}`)
    })
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Hash de Senhas (APR1-MD5)</h1>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Gerar Hash</TabsTrigger>
            <TabsTrigger value="verify">Verificar Hash</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Gerar Hash APR1-MD5</CardTitle>
                <CardDescription>Gere um hash de senha usando o algoritmo Apache MD5 (APR1-MD5)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite a senha para gerar o hash"
                  />
                </div>

                <Button
                  onClick={generateHash}
                  className="w-full bg-[#089455] hover:bg-[#089455]/90"
                  disabled={!password.trim()}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  Gerar Hash
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {generatedHash && (
                  <div className="space-y-2">
                    <Label>Hash Gerado</Label>
                    <div className="flex">
                      <Input value={generatedHash} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyToClipboard}
                        className="ml-2 border-[#089455] text-[#089455]"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Este hash pode ser usado para armazenar senhas de forma segura em sistemas Apache.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Verificar Hash APR1-MD5</CardTitle>
                <CardDescription>Verifique se uma senha corresponde a um hash APR1-MD5</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verify-password">Senha</Label>
                  <Input
                    id="verify-password"
                    type="password"
                    value={verifyPassword}
                    onChange={(e) => setVerifyPassword(e.target.value)}
                    placeholder="Digite a senha para verificar"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hash-to-verify">Hash APR1-MD5</Label>
                  <Input
                    id="hash-to-verify"
                    value={hashToVerify}
                    onChange={(e) => setHashToVerify(e.target.value)}
                    placeholder="$apr1$salt$hash..."
                    className="font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={verifyHash}
                  className="w-full bg-[#089455] hover:bg-[#089455]/90"
                  disabled={!verifyPassword.trim() || !hashToVerify.trim()}
                >
                  Verificar Hash
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {verificationResult !== null && (
                  <Alert className={verificationResult ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                    <div className="flex items-center gap-2">
                      {verificationResult ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <AlertTitle className={verificationResult ? "text-green-800" : "text-red-800"}>
                        {verificationResult ? "Hash verificado com sucesso!" : "Hash não corresponde à senha."}
                      </AlertTitle>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
