"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, Edit3, UserPlus, Wifi, WifiOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ConteoScreen() {
  const [hermanos, setHermanos] = useState(0)
  const [hermanas, setHermanas] = useState(0)
  const [simpatizantes, setSimpatizantes] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [editingCounter, setEditingCounter] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [newSimpatizante, setNewSimpatizante] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleCounterEdit = (type: string, value: number) => {
    setEditingCounter(type)
    setTempValue(value.toString())
  }

  const saveCounterEdit = () => {
    const newValue = Number.parseInt(tempValue) || 0
    switch (editingCounter) {
      case "hermanos":
        setHermanos(newValue)
        break
      case "hermanas":
        setHermanas(newValue)
        break
      case "simpatizantes":
        setSimpatizantes(newValue)
        break
    }
    setEditingCounter(null)
    setTempValue("")
  }

  const addSimpatizante = () => {
    if (newSimpatizante.trim()) {
      setSimpatizantes((prev) => prev + 1)
      setNewSimpatizante("")
      setShowAddDialog(false)
    }
  }

  const total = hermanos + hermanas + simpatizantes

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">Conteo de Asistencia</CardTitle>
              <p className="text-sm text-gray-600 mt-1 capitalize">{currentDate}</p>
            </div>
            <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Servicio Dominical
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Ujier: Juan Pérez
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Total Counter */}
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <h2 className="text-3xl font-bold">{total}</h2>
          <p className="text-blue-100">Total de Asistentes</p>
        </CardContent>
      </Card>

      {/* Counters */}
      <div className="space-y-4">
        {/* Hermanos */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-800">Hermanos</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                  onClick={() => setHermanos(Math.max(0, hermanos - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                {editingCounter === "hermanos" ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-16 h-8 text-center"
                      type="number"
                    />
                    <Button size="sm" onClick={saveCounterEdit} className="h-8">
                      ✓
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-semibold w-8 text-center">{hermanos}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={() => handleCounterEdit("hermanos", hermanos)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                  onClick={() => setHermanos(hermanos + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hermanas */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="font-medium text-gray-800">Hermanas</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                  onClick={() => setHermanas(Math.max(0, hermanas - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                {editingCounter === "hermanas" ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-16 h-8 text-center"
                      type="number"
                    />
                    <Button size="sm" onClick={saveCounterEdit} className="h-8">
                      ✓
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-semibold w-8 text-center">{hermanas}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={() => handleCounterEdit("hermanas", hermanas)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                  onClick={() => setHermanas(hermanas + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simpatizantes */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-800">Simpatizantes</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                  onClick={() => setSimpatizantes(Math.max(0, simpatizantes - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                {editingCounter === "simpatizantes" ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-16 h-8 text-center"
                      type="number"
                    />
                    <Button size="sm" onClick={saveCounterEdit} className="h-8">
                      ✓
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-semibold w-8 text-center">{simpatizantes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0"
                      onClick={() => handleCounterEdit("simpatizantes", simpatizantes)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                  onClick={() => setSimpatizantes(simpatizantes + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Simpatizante Button */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl py-3 shadow-lg">
            <UserPlus className="w-5 h-5 mr-2" />
            Agregar Simpatizante
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Simpatizante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre del simpatizante"
              value={newSimpatizante}
              onChange={(e) => setNewSimpatizante(e.target.value)}
              className="rounded-lg"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600" onClick={addSimpatizante}>
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
