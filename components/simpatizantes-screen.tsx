"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Info, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface SimpatizantesScreenProps {
  simpatizantes: any[]
  onSelectSimpatizante: (simpatizante: any) => void
  onAddSimpatizante: (simpatizante: any) => any
}

export function SimpatizantesScreen({
  simpatizantes,
  onSelectSimpatizante,
  onAddSimpatizante,
}: SimpatizantesScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newSimpatizante, setNewSimpatizante] = useState({
    nombre: "",
    telefono: "",
    notas: "",
  })

  const filteredSimpatizantes = simpatizantes.filter((simpatizante) =>
    simpatizante.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const addNewSimpatizante = () => {
    if (newSimpatizante.nombre.trim()) {
      onAddSimpatizante(newSimpatizante)
      setNewSimpatizante({ nombre: "", telefono: "", notas: "" })
      setShowAddDialog(false)
    }
  }

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            Simpatizantes
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
              {filteredSimpatizantes.length} registrados
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            <Input
              placeholder="Buscar simpatizante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 rounded-lg h-8 sm:h-9 text-xs sm:text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New Button */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl py-2 sm:py-3 shadow-lg text-sm sm:text-base">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Agregar Nuevo Simpatizante
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Simpatizante</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre Completo *</label>
              <Input
                placeholder="Nombre del simpatizante"
                value={newSimpatizante.nombre}
                onChange={(e) => setNewSimpatizante({ ...newSimpatizante, nombre: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Teléfono</label>
              <Input
                placeholder="Número de teléfono"
                value={newSimpatizante.telefono}
                onChange={(e) => setNewSimpatizante({ ...newSimpatizante, telefono: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Notas</label>
              <Input
                placeholder="Notas adicionales"
                value={newSimpatizante.notas}
                onChange={(e) => setNewSimpatizante({ ...newSimpatizante, notas: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-slate-600 hover:bg-slate-700"
                onClick={addNewSimpatizante}
                disabled={!newSimpatizante.nombre.trim()}
              >
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simpatizantes List */}
      <div className="space-y-3">
        {filteredSimpatizantes.map((simpatizante) => (
          <Card key={simpatizante.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base truncate">
                    {simpatizante.nombre}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{simpatizante.telefono}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{simpatizante.notas}</p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Registrado: {new Date(simpatizante.fechaRegistro).toLocaleDateString("es-ES")}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 sm:ml-3 bg-transparent h-8 w-8"
                  onClick={() => onSelectSimpatizante(simpatizante)}
                >
                  <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSimpatizantes.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron simpatizantes</h3>
            <p className="text-gray-500">
              {searchTerm ? "Intenta con un término de búsqueda diferente" : "Aún no hay simpatizantes registrados"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
