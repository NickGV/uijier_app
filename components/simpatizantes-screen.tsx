"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Info, Plus } from "lucide-react"

const mockSimpatizantes = [
  {
    id: 1,
    nombre: "Ana López",
    telefono: "+34 612 345 678",
    notas: "Interesada en estudios bíblicos",
    fechaRegistro: "2024-01-07",
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    telefono: "+34 623 456 789",
    notas: "Vino con su familia",
    fechaRegistro: "2024-01-03",
  },
  {
    id: 3,
    nombre: "María Fernández",
    telefono: "+34 634 567 890",
    notas: "Primera visita",
    fechaRegistro: "2023-12-31",
  },
  {
    id: 4,
    nombre: "José Ramírez",
    telefono: "+34 645 678 901",
    notas: "Conoce a hermano Pedro",
    fechaRegistro: "2023-12-24",
  },
  {
    id: 5,
    nombre: "Laura Sánchez",
    telefono: "+34 656 789 012",
    notas: "Interesada en bautismo",
    fechaRegistro: "2023-12-20",
  },
]

interface SimpatizantesScreenProps {
  onSelectSimpatizante: (simpatizante: any) => void
}

export function SimpatizantesScreen({ onSelectSimpatizante }: SimpatizantesScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSimpatizantes = mockSimpatizantes.filter((simpatizante) =>
    simpatizante.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Simpatizantes
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {filteredSimpatizantes.length} registrados
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar simpatizante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New Button */}
      <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl py-3 shadow-lg">
        <Plus className="w-5 h-5 mr-2" />
        Agregar Nuevo Simpatizante
      </Button>

      {/* Simpatizantes List */}
      <div className="space-y-3">
        {filteredSimpatizantes.map((simpatizante) => (
          <Card key={simpatizante.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{simpatizante.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-2">{simpatizante.telefono}</p>
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
                  className="ml-3 bg-transparent"
                  onClick={() => onSelectSimpatizante(simpatizante)}
                >
                  <Info className="w-4 h-4" />
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
            <p className="text-gray-500">Intenta con un término de búsqueda diferente</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
