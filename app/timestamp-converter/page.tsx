"use client"

import { useState, useEffect } from "react"
import { Clock, Copy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function TimestampConverterPage() {
  const [timestamp, setTimestamp] = useState<string>("")
  const [dateTime, setDateTime] = useState<Date | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isExpired, setIsExpired] = useState<boolean>(false)
  const [format, setFormat] = useState<"seconds" | "milliseconds">("seconds")
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const { toast } = useToast()

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      if (dateTime) {
        updateTimeLeft(dateTime)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [dateTime])

  // Convert timestamp to date when input changes
  useEffect(() => {
    if (timestamp) {
      convertTimestamp()
    } else {
      setDateTime(null)
      setTimeLeft("")
      setIsExpired(false)
    }
  }, [timestamp, format])

  const convertTimestamp = () => {
    try {
      const parsedTimestamp = Number.parseInt(timestamp, 10)
      if (isNaN(parsedTimestamp)) {
        setDateTime(null)
        setTimeLeft("")
        return
      }

      // Convert to milliseconds if in seconds format
      const timestampMs = format === "seconds" ? parsedTimestamp * 1000 : parsedTimestamp
      const date = new Date(timestampMs)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        setDateTime(null)
        setTimeLeft("")
        return
      }

      setDateTime(date)
      updateTimeLeft(date)
    } catch (error) {
      setDateTime(null)
      setTimeLeft("")
      console.error("Error converting timestamp:", error)
    }
  }

  const updateTimeLeft = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    setIsExpired(diff < 0)

    // Calculate time difference
    const absDiff = Math.abs(diff)
    const seconds = Math.floor(absDiff / 1000) % 60
    const minutes = Math.floor(absDiff / (1000 * 60)) % 60
    const hours = Math.floor(absDiff / (1000 * 60 * 60)) % 24
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))

    let timeLeftStr = ""
    if (days > 0) timeLeftStr += `${days} dia${days !== 1 ? "s" : ""} `
    if (hours > 0 || days > 0) timeLeftStr += `${hours} hora${hours !== 1 ? "s" : ""} `
    if (minutes > 0 || hours > 0 || days > 0) timeLeftStr += `${minutes} minuto${minutes !== 1 ? "s" : ""} `
    timeLeftStr += `${seconds} segundo${seconds !== 1 ? "s" : ""}`

    setTimeLeft(timeLeftStr)
  }

  const handleCopyToClipboard = () => {
    if (!dateTime) return

    const formattedDate = dateTime.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    navigator.clipboard.writeText(formattedDate)
    toast({
      title: "Copiado!",
      description: "Data copiada para a área de transferência",
    })
  }

  const handleNowTimestamp = () => {
    const now = new Date()
    if (format === "seconds") {
      setTimestamp(Math.floor(now.getTime() / 1000).toString())
    } else {
      setTimestamp(now.getTime().toString())
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Conversor de Timestamp</CardTitle>
          <CardDescription>Converta timestamps Unix para datas legíveis e veja quando expiram</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Digite o timestamp (ex: 1747846811)"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleNowTimestamp} title="Usar timestamp atual">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <Tabs value={format} onValueChange={(v) => setFormat(v as "seconds" | "milliseconds")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="seconds">Segundos</TabsTrigger>
                  <TabsTrigger value="milliseconds">Milissegundos</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {dateTime && (
              <div className="space-y-4">
                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Data e Hora</h3>
                    <Button variant="ghost" size="sm" onClick={handleCopyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>

                  <div className="p-3 bg-muted rounded-md font-mono">
                    {dateTime.toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {dateTime.toLocaleString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      timeZoneName: "short",
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <h3 className="text-lg font-medium">Status</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={isExpired ? "destructive" : "default"}>{isExpired ? "Expirado" : "Válido"}</Badge>
                    <span className="text-sm">
                      {isExpired ? "Expirou há" : "Expira em"} {timeLeft}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">Hora atual: {currentTime.toLocaleString("pt-BR")}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
