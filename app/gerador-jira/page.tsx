"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Check } from "lucide-react"

export default function GeradorJira() {
  const [ticketNumber, setTicketNumber] = useState("")
  const [prefix, setPrefix] = useState("APE")
  const [generatedLink, setGeneratedLink] = useState("")
  const [copied, setCopied] = useState(false)
  const [isValid, setIsValid] = useState(false)

  // Validate ticket number (only numbers)
  useEffect(() => {
    setIsValid(!!ticketNumber && /^\d+$/.test(ticketNumber))
  }, [ticketNumber])

  // Generate link when ticket number or prefix changes
  useEffect(() => {
    if (isValid) {
      const ticketId = `${prefix}-${ticketNumber}`
      const url = `https://startse.atlassian.net/browse/${ticketId}`
      setGeneratedLink(`[${ticketId}](${url})`)
    } else {
      setGeneratedLink("")
    }
  }, [ticketNumber, prefix, isValid])

  // Copy to clipboard
  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Open link in new tab
  const openLink = () => {
    if (isValid) {
      const ticketId = `${prefix}-${ticketNumber}`
      const url = `https://startse.atlassian.net/browse/${ticketId}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#089455]">Gerador de Links Jira</CardTitle>
          <CardDescription>
            Gere links formatados para tickets do Jira em formato Markdown para usar em documentações e PRs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prefix Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Prefixo do Projeto</label>
            <Tabs defaultValue="APE" value={prefix} onValueChange={setPrefix}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="APE">APE</TabsTrigger>
                <TabsTrigger value="CX">CX</TabsTrigger>
                <TabsTrigger value="APP">APP</TabsTrigger>
                <TabsTrigger value="BO">BO</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Ticket Number Input */}
          <div className="space-y-2">
            <label htmlFor="ticketNumber" className="text-sm font-medium">
              Número do Ticket
            </label>
            <Input
              id="ticketNumber"
              type="text"
              placeholder="Ex: 1719"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              className={!ticketNumber || isValid ? "" : "border-red-500"}
            />
            {ticketNumber && !isValid && <p className="text-red-500 text-sm">Por favor, insira apenas números.</p>}
          </div>

          {/* Generated Link */}
          {generatedLink && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Gerado (Markdown)</label>
                <div className="bg-gray-100 p-3 rounded-md font-mono text-sm break-all">{generatedLink}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Visualização</label>
                <div className="bg-gray-100 p-3 rounded-md">
                  <a
                    href={`https://startse.atlassian.net/browse/${prefix}-${ticketNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {`${prefix}-${ticketNumber}`}
                  </a>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={copyToClipboard} className="bg-[#089455] hover:bg-[#089455]/90">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
                <Button onClick={openLink} variant="outline" className="border-[#089455] text-[#089455]">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir Link
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
