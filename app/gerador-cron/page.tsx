"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Clock, Code, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CronPreset {
  name: string
  expression: string
  description: string
}

const cronPresets: CronPreset[] = [
  { name: "A cada minuto", expression: "* * * * *", description: "Executa a cada minuto" },
  { name: "A cada 5 minutos", expression: "*/5 * * * *", description: "Executa a cada 5 minutos" },
  { name: "A cada 15 minutos", expression: "*/15 * * * *", description: "Executa a cada 15 minutos" },
  { name: "A cada 30 minutos", expression: "*/30 * * * *", description: "Executa a cada 30 minutos" },
  { name: "A cada hora", expression: "0 * * * *", description: "Executa no início de cada hora" },
  { name: "Diariamente às 9h", expression: "0 9 * * *", description: "Executa todos os dias às 9:00" },
  { name: "Diariamente à meia-noite", expression: "0 0 * * *", description: "Executa todos os dias à meia-noite" },
  { name: "Semanalmente (domingo)", expression: "0 0 * * 0", description: "Executa todo domingo à meia-noite" },
  { name: "Mensalmente (dia 1)", expression: "0 0 1 * *", description: "Executa no primeiro dia de cada mês" },
  { name: "Dias úteis às 9h", expression: "0 9 * * 1-5", description: "Executa de segunda a sexta às 9:00" },
]

export default function GeradorCronPage() {
  const [minute, setMinute] = useState("*")
  const [hour, setHour] = useState("*")
  const [dayOfMonth, setDayOfMonth] = useState("*")
  const [month, setMonth] = useState("*")
  const [dayOfWeek, setDayOfWeek] = useState("*")
  const [cronExpression, setCronExpression] = useState("* * * * *")
  const [selectedPreset, setSelectedPreset] = useState("")
  const { toast } = useToast()

  const generateCronExpression = () => {
    const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`
    setCronExpression(expression)
  }

  const applyPreset = (preset: CronPreset) => {
    const parts = preset.expression.split(" ")
    setMinute(parts[0] || "*")
    setHour(parts[1] || "*")
    setDayOfMonth(parts[2] || "*")
    setMonth(parts[3] || "*")
    setDayOfWeek(parts[4] || "*")
    setCronExpression(preset.expression)
    setSelectedPreset(preset.name)
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência.`,
    })
  }

  const getHumanReadable = (expression: string): string => {
    const parts = expression.split(" ")
    const [min, hr, dom, mon, dow] = parts

    let readable = "Executa "

    // Frequency
    if (min === "*" && hr === "*" && dom === "*" && mon === "*" && dow === "*") {
      return "Executa a cada minuto"
    }

    if (min.startsWith("*/")) {
      readable += `a cada ${min.substring(2)} minutos`
    } else if (min === "0" && hr.startsWith("*/")) {
      readable += `a cada ${hr.substring(2)} horas`
    } else if (min === "0" && hr === "0" && dom === "*" && mon === "*" && dow === "*") {
      readable += "diariamente à meia-noite"
    } else if (min === "0" && hr !== "*" && dom === "*" && mon === "*" && dow === "*") {
      readable += `diariamente às ${hr}:00`
    } else if (dow !== "*" && dow !== "0-6") {
      const days = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]
      if (dow.includes("-")) {
        readable += `de ${days[Number.parseInt(dow.split("-")[0])]} a ${days[Number.parseInt(dow.split("-")[1])]}`
      } else {
        readable += `toda ${days[Number.parseInt(dow)]}`
      }
      if (hr !== "*") readable += ` às ${hr}:${min.padStart(2, "0")}`
    } else if (dom !== "*" && dom !== "1-31") {
      readable += `no dia ${dom} de cada mês`
      if (hr !== "*") readable += ` às ${hr}:${min.padStart(2, "0")}`
    } else {
      readable += `às ${hr}:${min.padStart(2, "0")}`
    }

    return readable
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerador de Cron Jobs</h1>
          <p className="text-muted-foreground">Crie expressões cron para agendamento de tarefas em JavaScript</p>
        </div>

        <Tabs defaultValue="builder" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Construtor</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Construtor de Expressão Cron
                </CardTitle>
                <CardDescription>Configure cada campo da expressão cron manualmente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minute">Minuto (0-59)</Label>
                    <Input id="minute" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="*" />
                    <p className="text-xs text-muted-foreground">* = qualquer</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hour">Hora (0-23)</Label>
                    <Input id="hour" value={hour} onChange={(e) => setHour(e.target.value)} placeholder="*" />
                    <p className="text-xs text-muted-foreground">* = qualquer</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dayOfMonth">Dia do Mês (1-31)</Label>
                    <Input
                      id="dayOfMonth"
                      value={dayOfMonth}
                      onChange={(e) => setDayOfMonth(e.target.value)}
                      placeholder="*"
                    />
                    <p className="text-xs text-muted-foreground">* = qualquer</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month">Mês (1-12)</Label>
                    <Input id="month" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="*" />
                    <p className="text-xs text-muted-foreground">* = qualquer</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek">Dia da Semana (0-6)</Label>
                    <Input
                      id="dayOfWeek"
                      value={dayOfWeek}
                      onChange={(e) => setDayOfWeek(e.target.value)}
                      placeholder="*"
                    />
                    <p className="text-xs text-muted-foreground">0 = domingo</p>
                  </div>
                </div>

                <Button onClick={generateCronExpression} className="w-full">
                  Gerar Expressão Cron
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Presets Comuns</CardTitle>
                <CardDescription>Selecione uma configuração pré-definida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cronPresets.map((preset, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                        selectedPreset === preset.name ? "border-primary bg-muted" : ""
                      }`}
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{preset.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {preset.expression}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{preset.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>Expressão cron gerada e exemplos de uso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Expressão Cron:</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">{cronExpression}</code>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(cronExpression, "Expressão cron")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Descrição:</Label>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">{getHumanReadable(cronExpression)}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code className="h-5 w-5" />
                Exemplos de Uso
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Node.js com node-cron:</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                      {`cron.schedule('${cronExpression}', () => {\n  console.log('Tarefa executada!');\n});`}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `cron.schedule('${cronExpression}', () => {\n  console.log('Tarefa executada!');\n});`,
                          "Código Node.js",
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Vercel Cron Jobs (vercel.json):</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                      {`{\n  "crons": [\n    {\n      "path": "/api/cron",\n      "schedule": "${cronExpression}"\n    }\n  ]\n}`}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `{\n  "crons": [\n    {\n      "path": "/api/cron",\n      "schedule": "${cronExpression}"\n    }\n  ]\n}`,
                          "Configuração Vercel",
                        )
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">AWS EventBridge:</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                      {`cron(${cronExpression})`}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`cron(${cronExpression})`, "Expressão AWS")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Formato da Expressão Cron:</p>
                  <p className="text-blue-800 mb-2">
                    <code>minuto hora dia-do-mês mês dia-da-semana</code>
                  </p>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>
                      • <strong>*</strong> = qualquer valor
                    </li>
                    <li>
                      • <strong>*/n</strong> = a cada n unidades (ex: */5 = a cada 5)
                    </li>
                    <li>
                      • <strong>n-m</strong> = intervalo de n a m (ex: 1-5 = de 1 a 5)
                    </li>
                    <li>
                      • <strong>n,m</strong> = valores específicos (ex: 1,3,5)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
