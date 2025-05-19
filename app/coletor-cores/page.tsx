"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Pipette, Plus, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Função para converter RGB para HEX
function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
}

// Função para converter RGB para HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

// Função para verificar se uma cor é clara ou escura
function isLightColor(r: number, g: number, b: number): boolean {
  // Fórmula YIQ para determinar se uma cor é clara ou escura
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128
}

// Componente para exibir uma cor com tooltip
function ColorSwatch({ color, onClick }: { color: string; onClick: (color: string) => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
            onClick={() => onClick(color)}
            aria-label={`Selecionar cor ${color}`}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{color}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function ColetorCoresPage() {
  const [currentColor, setCurrentColor] = useState<string>("#089455")
  const [rgbValues, setRgbValues] = useState<[number, number, number]>([8, 148, 85])
  const [hslValues, setHslValues] = useState<[number, number, number]>([150, 90, 31])
  const [colorHistory, setColorHistory] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [customColors, setCustomColors] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cores predefinidas
  const predefinedColors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#4B0082",
    "#9400D3", // Cores do arco-íris
    "#000000",
    "#333333",
    "#666666",
    "#999999",
    "#CCCCCC",
    "#FFFFFF", // Tons de cinza
    "#FF1493",
    "#00BFFF",
    "#32CD32",
    "#FFD700",
    "#FF4500",
    "#8A2BE2",
    "#2E8B57", // Cores vibrantes
    "#089455", // Cor do tema
  ]

  // Atualizar valores RGB e HSL quando a cor atual mudar
  useEffect(() => {
    if (currentColor.startsWith("#") && currentColor.length >= 7) {
      const r = Number.parseInt(currentColor.slice(1, 3), 16)
      const g = Number.parseInt(currentColor.slice(3, 5), 16)
      const b = Number.parseInt(currentColor.slice(5, 7), 16)
      setRgbValues([r, g, b])
      setHslValues(rgbToHsl(r, g, b))
    }
  }, [currentColor])

  // Adicionar cor ao histórico
  const addToHistory = (color: string) => {
    if (!colorHistory.includes(color)) {
      setColorHistory((prev) => [color, ...prev.slice(0, 19)]) // Limitar a 20 cores
    }
  }

  // Selecionar uma cor
  const selectColor = (color: string) => {
    setCurrentColor(color)
    addToHistory(color)
  }

  // Copiar valor para a área de transferência
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  // Iniciar captura de cor
  const startCapture = () => {
    setIsCapturing(true)
  }

  // Parar captura de cor
  const stopCapture = () => {
    setIsCapturing(false)
  }

  // Adicionar cor personalizada
  const addCustomColor = () => {
    if (!customColors.includes(currentColor)) {
      setCustomColors((prev) => [...prev, currentColor])
    }
  }

  // Remover cor personalizada
  const removeCustomColor = (color: string) => {
    setCustomColors((prev) => prev.filter((c) => c !== color))
  }

  // Carregar imagem para captura de cores
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const img = new Image()
        img.onload = () => {
          // Ajustar o tamanho do canvas para a imagem
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
        }
        img.src = URL.createObjectURL(file)
      }
    }
  }

  // Capturar cor do canvas
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isCapturing || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width))
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height))

    const ctx = canvas.getContext("2d")
    if (ctx) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data
      const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2])
      setCurrentColor(hex)
    }
  }

  // Capturar cor ao clicar no canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width))
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height))

    const ctx = canvas.getContext("2d")
    if (ctx) {
      const pixelData = ctx.getImageData(x, y, 1, 1).data
      const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2])
      selectColor(hex)
    }
  }

  // Determinar se o texto deve ser claro ou escuro com base na cor de fundo
  const textColor = isLightColor(rgbValues[0], rgbValues[1], rgbValues[2]) ? "text-black" : "text-white"

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-[calc(100vh-8rem)] w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#089455] mb-6">Coletor de Cores</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Visualização e Captura de Cores */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visualização da Cor</CardTitle>
                <CardDescription>Passe o mouse sobre a imagem para capturar cores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className="h-40 rounded-lg flex items-center justify-center transition-colors"
                    style={{ backgroundColor: currentColor }}
                  >
                    <span className={`text-2xl font-bold ${textColor}`}>{currentColor}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={startCapture}
                      className={`bg-[#089455] hover:bg-[#089455]/90 ${isCapturing ? "ring-2 ring-offset-2 ring-[#089455]" : ""}`}
                    >
                      <Pipette className="mr-2 h-4 w-4" />
                      {isCapturing ? "Capturando..." : "Capturar Cor"}
                    </Button>

                    <Button
                      onClick={stopCapture}
                      variant="outline"
                      className="border-[#089455] text-[#089455]"
                      disabled={!isCapturing}
                    >
                      Parar Captura
                    </Button>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="border-[#089455] text-[#089455]"
                    >
                      Carregar Imagem
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <Button onClick={addCustomColor} variant="outline" className="ml-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar à Paleta
                    </Button>
                  </div>

                  <div className="relative border rounded-lg overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-auto max-h-[400px] object-contain cursor-crosshair"
                      onMouseMove={handleCanvasMouseMove}
                      onClick={handleCanvasClick}
                      width="800"
                      height="600"
                    />
                    {!canvasRef.current?.getContext("2d")?.getImageData(0, 0, 1, 1).data[3] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                        Carregue uma imagem ou use a paleta de cores abaixo
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Paleta de Cores</CardTitle>
                <CardDescription>Selecione uma cor predefinida ou personalizada</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="predefined">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="predefined">Predefinidas</TabsTrigger>
                    <TabsTrigger value="custom">Personalizadas</TabsTrigger>
                    <TabsTrigger value="history">Histórico</TabsTrigger>
                  </TabsList>

                  <TabsContent value="predefined" className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {predefinedColors.map((color) => (
                        <ColorSwatch key={color} color={color} onClick={selectColor} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="mt-4">
                    {customColors.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {customColors.map((color) => (
                          <div key={color} className="relative group">
                            <ColorSwatch color={color} onClick={selectColor} />
                            <button
                              className="absolute -top-1 -right-1 bg-white rounded-full w-4 h-4 flex items-center justify-center border border-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeCustomColor(color)}
                              aria-label={`Remover cor ${color}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Nenhuma cor personalizada adicionada. Use o botão "Adicionar à Paleta" para salvar cores.
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    {colorHistory.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {colorHistory.map((color) => (
                          <ColorSwatch key={color} color={color} onClick={selectColor} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        O histórico de cores aparecerá aqui conforme você selecionar cores.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2: Detalhes da Cor */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Detalhes da Cor</CardTitle>
                <CardDescription>Informações e valores da cor selecionada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="hex-value">Valor Hexadecimal</Label>
                  <div className="flex mt-1.5">
                    <Input id="hex-value" value={currentColor} readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(currentColor, "hex")}
                      className="ml-2 border-[#089455] text-[#089455]"
                    >
                      {copied === "hex" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rgb-value">Valor RGB</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="rgb-value"
                      value={`rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`, "rgb")}
                      className="ml-2 border-[#089455] text-[#089455]"
                    >
                      {copied === "rgb" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="hsl-value">Valor HSL</Label>
                  <div className="flex mt-1.5">
                    <Input
                      id="hsl-value"
                      value={`hsl(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%)`}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`hsl(${hslValues[0]}, ${hslValues[1]}%, ${hslValues[2]}%)`, "hsl")}
                      className="ml-2 border-[#089455] text-[#089455]"
                    >
                      {copied === "hsl" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Componentes RGB</Label>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">R (Vermelho)</span>
                        <Badge variant="outline" className="bg-red-100">
                          {rgbValues[0]}
                        </Badge>
                      </div>
                      <Slider
                        value={[rgbValues[0]]}
                        min={0}
                        max={255}
                        step={1}
                        onValueChange={(value) => {
                          const [r, g, b] = rgbValues
                          const newColor = rgbToHex(value[0], g, b)
                          setCurrentColor(newColor)
                        }}
                        className="[&>span]:bg-red-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">G (Verde)</span>
                        <Badge variant="outline" className="bg-green-100">
                          {rgbValues[1]}
                        </Badge>
                      </div>
                      <Slider
                        value={[rgbValues[1]]}
                        min={0}
                        max={255}
                        step={1}
                        onValueChange={(value) => {
                          const [r, g, b] = rgbValues
                          const newColor = rgbToHex(r, value[0], b)
                          setCurrentColor(newColor)
                        }}
                        className="[&>span]:bg-green-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">B (Azul)</span>
                        <Badge variant="outline" className="bg-blue-100">
                          {rgbValues[2]}
                        </Badge>
                      </div>
                      <Slider
                        value={[rgbValues[2]]}
                        min={0}
                        max={255}
                        step={1}
                        onValueChange={(value) => {
                          const [r, g, b] = rgbValues
                          const newColor = rgbToHex(r, g, value[0])
                          setCurrentColor(newColor)
                        }}
                        className="[&>span]:bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={addCustomColor}
                  className="w-full bg-[#089455] hover:bg-[#089455]/90"
                  disabled={customColors.includes(currentColor)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {customColors.includes(currentColor) ? "Já adicionada à paleta" : "Adicionar à paleta"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
