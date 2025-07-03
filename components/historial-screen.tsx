"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter, TrendingUp, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockData = [
  {
    id: 1,
    fecha: "2024-01-07",
    servicio: "Dominical",
    ujier: "Juan Pérez",
    hermanos: 45,
    hermanas: 52,
    simpatizantes: 8,
    total: 105,
  },
  {
    id: 2,
    fecha: "2024-01-03",
    servicio: "Miércoles",
    ujier: "María García",
    hermanos: 32,
    hermanas: 38,
    simpatizantes: 5,
    total: 75,
  },
  {
    id: 3,
    fecha: "2023-12-31",
    servicio: "Dominical",
    ujier: "Juan Pérez",
    hermanos: 48,
    hermanas: 55,
    simpatizantes: 12,
    total: 115,
  },
  {
    id: 4,
    fecha: "2023-12-27",
    servicio: "Miércoles",
    ujier: "Carlos López",
    hermanos: 28,
    hermanas: 35,
    simpatizantes: 3,
    total: 66,
  },
  {
    id: 5,
    fecha: "2023-12-24",
    servicio: "Dominical",
    ujier: "Ana Martín",
    hermanos: 52,
    hermanas: 58,
    simpatizantes: 15,
    total: 125,
  },
]

export function HistorialScreen() {
  const [filtroServicio, setFiltroServicio] = useState("todos")
  const [filtroUjier, setFiltroUjier] = useState("todos")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const filteredData = mockData.filter((record) => {
    const servicioMatch =
      filtroServicio === "todos" || record.servicio.toLowerCase().includes(filtroServicio.toLowerCase())
    const ujierMatch = filtroUjier === "todos" || record.ujier === filtroUjier
    return servicioMatch && ujierMatch
  })

  const chartData = filteredData.slice(0, 5).reverse()
  const maxValue = Math.max(...chartData.map((d) => d.total))

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Historial de Asistencia
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtros</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Tipo de Servicio</label>
              <Select value={filtroServicio} onValueChange={setFiltroServicio}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="dominical">Dominical</SelectItem>
                  <SelectItem value="miércoles">Miércoles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Ujier</label>
              <Select value={filtroUjier} onValueChange={setFiltroUjier}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                  <SelectItem value="María García">María García</SelectItem>
                  <SelectItem value="Carlos López">Carlos López</SelectItem>
                  <SelectItem value="Ana Martín">Ana Martín</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendencia de Asistencia
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-end justify-between h-32 gap-2">
            {chartData.map((data, index) => (
              <div key={data.id} className="flex flex-col items-center flex-1">
                <div
                  className="bg-gradient-to-t from-blue-500 to-green-400 rounded-t-md w-full transition-all duration-300"
                  style={{ height: `${(data.total / maxValue) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-600 mt-2 text-center">
                  <div className="font-semibold">{data.total}</div>
                  <div>
                    {new Date(data.fecha).getDate()}/{new Date(data.fecha).getMonth() + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Registros Recientes</h3>
        {filteredData.map((record) => (
          <Card key={record.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-gray-800">
                    {new Date(record.fecha).toLocaleDateString("es-ES", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <div className="text-sm text-gray-600">{record.ujier}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">{record.total}</div>
                  <Badge variant="outline" className="text-xs">
                    {record.servicio}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <div className="text-sm font-semibold text-blue-600">{record.hermanos}</div>
                  <div className="text-xs text-gray-500">Hermanos</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-pink-600">{record.hermanas}</div>
                  <div className="text-xs text-gray-500">Hermanas</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-green-600">{record.simpatizantes}</div>
                  <div className="text-xs text-gray-500">Simpatizantes</div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => setSelectedRecord(record)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalles
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Detalle del Registro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Fecha:</span>
                  <div className="font-semibold">{selectedRecord.fecha}</div>
                </div>
                <div>
                  <span className="text-gray-600">Servicio:</span>
                  <div className="font-semibold">{selectedRecord.servicio}</div>
                </div>
                <div>
                  <span className="text-gray-600">Ujier:</span>
                  <div className="font-semibold">{selectedRecord.ujier}</div>
                </div>
                <div>
                  <span className="text-gray-600">Total:</span>
                  <div className="font-semibold text-lg">{selectedRecord.total}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{selectedRecord.hermanos}</div>
                  <div className="text-xs text-gray-500">Hermanos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-pink-600">{selectedRecord.hermanas}</div>
                  <div className="text-xs text-gray-500">Hermanas</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{selectedRecord.simpatizantes}</div>
                  <div className="text-xs text-gray-500">Simpatizantes</div>
                </div>
              </div>

              <Button className="w-full mt-4" onClick={() => setSelectedRecord(null)}>
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
