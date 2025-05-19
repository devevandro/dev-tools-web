"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Copy, RefreshCw, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ValidadorCpfCnpj() {
  const [documento, setDocumento] = useState("")
  const [tipoDocumento, setTipoDocumento] = useState<"cpf" | "cnpj" | null>(null)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [formatado, setFormatado] = useState("")
  const { toast } = useToast()

  // Função para limpar apenas os números
  const apenasNumeros = (valor: string) => valor.replace(/\D/g, "")

  // Função para formatar CPF
  const formatarCPF = (cpf: string) => {
    const numeros = apenasNumeros(cpf)
    if (numeros.length <= 3) return numeros
    if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`
    if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`
  }

  // Função para formatar CNPJ
  const formatarCNPJ = (cnpj: string) => {
    const numeros = apenasNumeros(cnpj)
    if (numeros.length <= 2) return numeros
    if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`
    if (numeros.length <= 8) return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`
    if (numeros.length <= 12)
      return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`
  }

  // Função para validar CPF
  const validarCPF = (cpf: string) => {
    const numeros = apenasNumeros(cpf)

    // Verifica se tem 11 dígitos
    if (numeros.length !== 11) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numeros)) return false

    // Validação do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += Number.parseInt(numeros.charAt(i)) * (10 - i)
    }
    let resto = soma % 11
    const digitoVerificador1 = resto < 2 ? 0 : 11 - resto

    if (digitoVerificador1 !== Number.parseInt(numeros.charAt(9))) return false

    // Validação do segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += Number.parseInt(numeros.charAt(i)) * (11 - i)
    }
    resto = soma % 11
    const digitoVerificador2 = resto < 2 ? 0 : 11 - resto

    return digitoVerificador2 === Number.parseInt(numeros.charAt(10))
  }

  // Função para validar CNPJ
  const validarCNPJ = (cnpj: string) => {
    const numeros = apenasNumeros(cnpj)

    // Verifica se tem 14 dígitos
    if (numeros.length !== 14) return false

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numeros)) return false

    // Validação do primeiro dígito verificador
    let tamanho = numeros.length - 2
    let numCNPJ = numeros.substring(0, tamanho)
    const digitosCNPJ = numeros.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numCNPJ.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== Number.parseInt(digitosCNPJ.charAt(0))) return false

    // Validação do segundo dígito verificador
    tamanho = tamanho + 1
    numCNPJ = numeros.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += Number.parseInt(numCNPJ.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

    return resultado === Number.parseInt(digitosCNPJ.charAt(1))
  }

  // Função para gerar CPF válido
  const gerarCPFValido = () => {
    // Gera 9 números aleatórios
    const numeros = []
    for (let i = 0; i < 9; i++) {
      numeros.push(Math.floor(Math.random() * 10))
    }

    // Calcula o primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
      soma += numeros[i] * (10 - i)
    }
    let resto = soma % 11
    const dv1 = resto < 2 ? 0 : 11 - resto
    numeros.push(dv1)

    // Calcula o segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
      soma += numeros[i] * (11 - i)
    }
    resto = soma % 11
    const dv2 = resto < 2 ? 0 : 11 - resto
    numeros.push(dv2)

    const cpfGerado = numeros.join("")
    setDocumento(cpfGerado)
    handleDocumentoChange(cpfGerado)
  }

  // Função para gerar CNPJ válido
  const gerarCNPJValido = () => {
    // Gera 12 números aleatórios (8 para a raiz + 4 para o sufixo)
    const numeros = []
    for (let i = 0; i < 12; i++) {
      numeros.push(Math.floor(Math.random() * 10))
    }

    // Calcula o primeiro dígito verificador
    let soma = 0
    let pos = 5
    for (let i = 0; i < 12; i++) {
      soma += numeros[i] * pos
      pos = pos === 2 ? 9 : pos - 1
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    numeros.push(resultado)

    // Calcula o segundo dígito verificador
    soma = 0
    pos = 6
    for (let i = 0; i < 13; i++) {
      soma += numeros[i] * pos
      pos = pos === 2 ? 9 : pos - 1
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    numeros.push(resultado)

    const cnpjGerado = numeros.join("")
    setDocumento(cnpjGerado)
    handleDocumentoChange(cnpjGerado)
  }

  // Função para copiar o documento
  const copiarDocumento = (formatado = true) => {
    const textoCopiar = formatado ? formatado : apenasNumeros(documento)
    navigator.clipboard.writeText(textoCopiar).then(() => {
      toast({
        title: "Copiado!",
        description: `${tipoDocumento?.toUpperCase()} ${formatado ? "formatado" : "sem formatação"} copiado para a área de transferência.`,
        duration: 3000,
      })
    })
  }

  // Função para lidar com a mudança no input
  const handleDocumentoChange = (valor: string) => {
    const numeros = apenasNumeros(valor)
    setDocumento(numeros)

    // Determina o tipo de documento com base no comprimento
    if (numeros.length <= 11) {
      setTipoDocumento("cpf")
      setFormatado(formatarCPF(numeros))

      // Só valida se tiver 11 dígitos
      if (numeros.length === 11) {
        setIsValid(validarCPF(numeros))
      } else if (numeros.length > 0) {
        setIsValid(false)
      } else {
        setIsValid(null)
      }
    } else {
      setTipoDocumento("cnpj")
      setFormatado(formatarCNPJ(numeros))

      // Só valida se tiver 14 dígitos
      if (numeros.length === 14) {
        setIsValid(validarCNPJ(numeros))
      } else {
        setIsValid(false)
      }
    }
  }

  // Limpar o documento
  const limparDocumento = () => {
    setDocumento("")
    setFormatado("")
    setIsValid(null)
    setTipoDocumento(null)
  }

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#089455] mb-6">Validador de CPF/CNPJ</h1>

        <Card>
          <CardHeader>
            <CardTitle>Validação de Documentos</CardTitle>
            <CardDescription>
              Digite um CPF ou CNPJ para verificar se é válido. O sistema detecta automaticamente o tipo de documento.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="documento" className="text-sm font-medium">
                  CPF ou CNPJ
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="documento"
                    placeholder="Digite o CPF ou CNPJ"
                    value={formatado}
                    onChange={(e) => handleDocumentoChange(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={limparDocumento} title="Limpar">
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {documento.length > 0 && (
                <div className="flex items-center space-x-2">
                  {isValid === true ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isValid === false ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}

                  <span>
                    {isValid === true
                      ? `${tipoDocumento?.toUpperCase()} válido`
                      : isValid === false
                        ? `${tipoDocumento?.toUpperCase()} inválido`
                        : "Digite o documento completo"}
                  </span>
                </div>
              )}

              {isValid !== null && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copiarDocumento(true)}
                    className="flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar formatado
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copiarDocumento(false)}
                    className="flex items-center"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar sem formatação
                  </Button>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Tabs defaultValue="cpf" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cpf">CPF</TabsTrigger>
                <TabsTrigger value="cnpj">CNPJ</TabsTrigger>
              </TabsList>

              <TabsContent value="cpf" className="space-y-4 pt-4">
                <Alert>
                  <AlertTitle className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Sobre a validação de CPF
                  </AlertTitle>
                  <AlertDescription>
                    A validação verifica se o CPF segue o algoritmo oficial da Receita Federal. Isso não garante que o
                    CPF exista oficialmente, apenas que ele é matematicamente válido.
                  </AlertDescription>
                </Alert>

                <Button onClick={gerarCPFValido} className="w-full bg-[#089455] hover:bg-[#089455]/90">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Gerar CPF válido para teste
                </Button>
              </TabsContent>

              <TabsContent value="cnpj" className="space-y-4 pt-4">
                <Alert>
                  <AlertTitle className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Sobre a validação de CNPJ
                  </AlertTitle>
                  <AlertDescription>
                    A validação verifica se o CNPJ segue o algoritmo oficial da Receita Federal. Isso não garante que o
                    CNPJ exista oficialmente, apenas que ele é matematicamente válido.
                  </AlertDescription>
                </Alert>

                <Button onClick={gerarCNPJValido} className="w-full bg-[#089455] hover:bg-[#089455]/90">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Gerar CNPJ válido para teste
                </Button>
              </TabsContent>
            </Tabs>
          </CardFooter>
        </Card>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Como funciona a validação?</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Validação de CPF</h3>
              <p className="text-muted-foreground">
                O CPF é composto por 11 dígitos, sendo os dois últimos dígitos verificadores. O algoritmo calcula esses
                dígitos com base nos 9 primeiros números, usando multiplicadores específicos e o módulo 11.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Validação de CNPJ</h3>
              <p className="text-muted-foreground">
                O CNPJ é composto por 14 dígitos, sendo os dois últimos dígitos verificadores. O algoritmo calcula esses
                dígitos com base nos 12 primeiros números, usando multiplicadores específicos e o módulo 11.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
