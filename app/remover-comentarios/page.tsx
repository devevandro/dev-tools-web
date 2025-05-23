"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, FileCode, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RemoverComentariosPage() {
  const [inputCode, setInputCode] = useState("")
  const [outputCode, setOutputCode] = useState("")
  const [commentsRemoved, setCommentsRemoved] = useState(0)
  const [charactersSaved, setCharactersSaved] = useState(0)
  const { toast } = useToast()

  const removeComments = (code: string): { cleanCode: string; removedCount: number } => {
    let cleanCode = code
    let removedCount = 0

    // Remove single-line comments (// comment)
    cleanCode = cleanCode.replace(/\/\/.*$/gm, (match) => {
      removedCount++
      return ""
    })

    // Remove multi-line comments (/* comment */)
    cleanCode = cleanCode.replace(/\/\*[\s\S]*?\*\//g, (match) => {
      removedCount++
      return ""
    })

    // Remove empty lines that were left after comment removal
    cleanCode = cleanCode.replace(/^\s*\n/gm, "")

    return { cleanCode, removedCount }
  }

  const handleRemoveComments = () => {
    if (!inputCode.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira algum código JavaScript.",
        variant: "destructive",
      })
      return
    }

    const { cleanCode, removedCount } = removeComments(inputCode)
    setOutputCode(cleanCode)
    setCommentsRemoved(removedCount)
    setCharactersSaved(inputCode.length - cleanCode.length)

    toast({
      title: "Comentários removidos!",
      description: `${removedCount} comentário(s) removido(s) com sucesso.`,
    })
  }

  const handleCopy = async () => {
    if (!outputCode) return

    try {
      await navigator.clipboard.writeText(outputCode)
      toast({
        title: "Copiado!",
        description: "Código limpo copiado para a área de transferência.",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (!outputCode) return

    const blob = new Blob([outputCode], { type: "text/javascript" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "codigo-limpo.js"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download iniciado!",
      description: "O arquivo foi baixado com sucesso.",
    })
  }

  const handleClear = () => {
    setInputCode("")
    setOutputCode("")
    setCommentsRemoved(0)
    setCharactersSaved(0)
  }

  const handleSampleCode = () => {
    const sampleCode = `// Este é um comentário de linha única
function exemploFuncao() {
  /* Este é um comentário
     de múltiplas linhas */
  const variavel = "valor"; // Comentário inline
  
  /**
   * Este é um comentário JSDoc
   * @param {string} param - Descrição do parâmetro
   * @returns {string} Descrição do retorno
   */
  function outraFuncao(param) {
    // TODO: Implementar esta função
    return param.toUpperCase();
  }
  
  return outraFuncao(variavel);
}`
    setInputCode(sampleCode)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <FileCode className="mr-3 h-8 w-8" />
            Remover Comentários JavaScript
          </h1>
          <p className="text-muted-foreground">
            Remova todos os comentários do seu código JavaScript, incluindo comentários de linha única, múltiplas linhas
            e JSDoc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Código JavaScript</CardTitle>
              <CardDescription>Cole seu código JavaScript aqui para remover os comentários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={handleSampleCode} variant="outline" size="sm">
                  Código de Exemplo
                </Button>
                <Button onClick={handleClear} variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </div>
              <Textarea
                placeholder="// Cole seu código JavaScript aqui..."
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{inputCode.length} caracteres</span>
                <span>{inputCode.split("\n").length} linhas</span>
              </div>
              <Button onClick={handleRemoveComments} className="w-full">
                Remover Comentários
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <CardTitle>Código Limpo</CardTitle>
              <CardDescription>Código JavaScript sem comentários</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {outputCode && (
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{commentsRemoved} comentário(s) removido(s)</Badge>
                  <Badge variant="secondary">{charactersSaved} caracteres economizados</Badge>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm" disabled={!outputCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button onClick={handleDownload} variant="outline" size="sm" disabled={!outputCode}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
              <Textarea
                placeholder="O código limpo aparecerá aqui..."
                value={outputCode}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
              {outputCode && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{outputCode.length} caracteres</span>
                  <span>{outputCode.split("\n").length} linhas</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Como funciona</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Comentários de linha única</h4>
                <code className="text-muted-foreground">// Este comentário será removido</code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Comentários de múltiplas linhas</h4>
                <code className="text-muted-foreground">/* Este comentário também será removido */</code>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Comentários JSDoc</h4>
                <code className="text-muted-foreground">/** Documentação JSDoc removida */</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
