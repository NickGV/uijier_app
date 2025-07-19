"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Filter, TrendingUp, Eye, Users, Download, FileText, BarChart3, CalendarDays } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HistorialScreenProps {
  historial: any[]
}

export function HistorialScreen({ historial }: HistorialScreenProps) {
  const [filtroServicio, setFiltroServicio] = useState("todos")
  const [filtroUjier, setFiltroUjier] = useState("todos")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const filteredData = historial.filter((record) => {
    const servicioMatch =
      filtroServicio === "todos" || record.servicio.toLowerCase().includes(filtroServicio.toLowerCase())
    const ujierMatch = filtroUjier === "todos" || record.ujier === filtroUjier

    // Filtro por rango de fechas
    let fechaMatch = true
    if (fechaInicio || fechaFin) {
      const recordDate = new Date(record.fecha)
      if (fechaInicio) {
        const startDate = new Date(fechaInicio)
        fechaMatch = fechaMatch && recordDate >= startDate
      }
      if (fechaFin) {
        const endDate = new Date(fechaFin)
        fechaMatch = fechaMatch && recordDate <= endDate
      }
    }

    return servicioMatch && ujierMatch && fechaMatch
  })

  const chartData = filteredData.slice(0, 7).reverse()
  const maxValue = Math.max(...chartData.map((d) => d.total), 1)

  // Estadísticas para el informe
  const totalRegistros = filteredData.length
  const promedioAsistencia =
    filteredData.length > 0
      ? Math.round(filteredData.reduce((sum, record) => sum + record.total, 0) / filteredData.length)
      : 0
  const mayorAsistencia = filteredData.length > 0 ? Math.max(...filteredData.map((r) => r.total)) : 0
  const menorAsistencia = filteredData.length > 0 ? Math.min(...filteredData.map((r) => r.total)) : 0

  const clearDateFilters = () => {
    setFechaInicio("")
    setFechaFin("")
  }

  const setQuickDateFilter = (days: number) => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - days)

    setFechaInicio(startDate.toISOString().split("T")[0])
    setFechaFin(today.toISOString().split("T")[0])
  }

  const downloadCSV = () => {
    const headers = [
      "Fecha",
      "Servicio",
      "Ujier",
      "Hermanos",
      "Hermanas",
      "Niños",
      "Adolescentes",
      "Simpatizantes",
      "Total",
      "Simpatizantes Asistieron",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredData.map((record) =>
        [
          record.fecha,
          `"${record.servicio}"`,
          `"${record.ujier}"`,
          record.hermanos,
          record.hermanas,
          record.ninos,
          record.adolescentes,
          record.simpatizantes,
          record.total,
          `"${record.simpatizantesAsistieron?.map((s: any) => s.nombre).join("; ") || ""}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `informe_asistencia_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadReport = () => {
    const reportContent = `
INFORME DE ASISTENCIA
=====================

Filtros Aplicados:
- Servicio: ${filtroServicio === "todos" ? "Todos" : filtroServicio}
- Ujier: ${filtroUjier === "todos" ? "Todos" : filtroUjier}
- Fecha inicio: ${fechaInicio || "Sin filtro"}
- Fecha fin: ${fechaFin || "Sin filtro"}
- Fecha de generación: ${new Date().toLocaleDateString("es-ES")}

ESTADÍSTICAS GENERALES:
- Total de registros: ${totalRegistros}
- Promedio de asistencia: ${promedioAsistencia} personas
- Mayor asistencia: ${mayorAsistencia} personas
- Menor asistencia: ${menorAsistencia} personas

DETALLE DE REGISTROS:
${filteredData
  .map(
    (record) => `
Fecha: ${record.fecha}
Servicio: ${record.servicio}
Ujier: ${record.ujier}
Hermanos: ${record.hermanos} | Hermanas: ${record.hermanas} | Niños: ${record.ninos} | Adolescentes: ${record.adolescentes} | Simpatizantes: ${record.simpatizantes}
Total: ${record.total}
Simpatizantes que asistieron: ${record.simpatizantesAsistieron?.map((s: any) => s.nombre).join(", ") || "Ninguno"}
${"=".repeat(50)}
`,
  )
  .join("")}
    `.trim()

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `informe_detallado_${new Date().toISOString().split("T")[0]}.txt`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Historial de Asistencia
          </CardTitle>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              {filteredData.length} registros encontrados
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtros</span>
          </div>

          {/* Filtros básicos */}
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
                  <SelectItem value="oración y enseñanza">Oración y Enseñanza</SelectItem>
                  <SelectItem value="hermanas dorcas">Hermanas Dorcas</SelectItem>
                  <SelectItem value="evangelismo">Evangelismo</SelectItem>
                  <SelectItem value="jóvenes">Jóvenes</SelectItem>
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
                  <SelectItem value="Wilmar Rojas">Wilmar Rojas</SelectItem>
                  <SelectItem value="Juan Caldera">Juan Caldera</SelectItem>
                  <SelectItem value="Joaquin Velez">Joaquin Velez</SelectItem>
                  <SelectItem value="Yarissa Rojas">Yarissa Rojas</SelectItem>
                  <SelectItem value="Cristian Gomez">Cristian Gomez</SelectItem>
                  <SelectItem value="Hector Gaviria">Hector Gaviria</SelectItem>
                  <SelectItem value="Ivan Caro">Ivan Caro</SelectItem>
                  <SelectItem value="Jhon echavarria">Jhon echavarria</SelectItem>
                  <SelectItem value="Karen Cadavid">Karen Cadavid</SelectItem>
                  <SelectItem value="Carolina Monsalve">Carolina Monsalve</SelectItem>
                  <SelectItem value="Marta Verona">Marta Verona</SelectItem>
                  <SelectItem value="Nicolas Gömez">Nicolas Gömez</SelectItem>
                  <SelectItem value="Oraliz Fernåndez">Oraliz Fernåndez</SelectItem>
                  <SelectItem value="Santiago Graciano">Santiago Graciano</SelectItem>
                  <SelectItem value="Suri Vélez">Suri Vélez</SelectItem>
                  <SelectItem value="Wilmar Vélez">Wilmar Vélez</SelectItem>
                  <SelectItem value="Diana Suarez">Diana Suarez</SelectItem>
                  <SelectItem value="José perdomo">José perdomo</SelectItem>
                  <SelectItem value="Carolina Caro">Carolina Caro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros de fecha */}
          <div className="border-t pt-3">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filtro por Fechas</span>
            </div>

            {/* Botones de filtro rápido */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickDateFilter(7)}
                className="text-xs bg-transparent"
              >
                7 días
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickDateFilter(30)}
                className="text-xs bg-transparent"
              >
                30 días
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickDateFilter(90)}
                className="text-xs bg-transparent"
              >
                90 días
              </Button>
              <Button variant="outline" size="sm" onClick={clearDateFilters} className="text-xs bg-transparent">
                Limpiar
              </Button>
            </div>

            {/* Campos de fecha */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Fecha Inicio</label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Fecha Fin</label>
                <Input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            {/* Indicador de filtros activos */}
            {(fechaInicio || fechaFin) && (
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {fechaInicio && fechaFin
                    ? `${fechaInicio} a ${fechaFin}`
                    : fechaInicio
                      ? `Desde ${fechaInicio}`
                      : `Hasta ${fechaFin}`}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Summary */}
      {filteredData.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{promedioAsistencia}</div>
                <div className="text-slate-200 text-sm">Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{totalRegistros}</div>
                <div className="text-slate-200 text-sm">Registros</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-500">
              <div className="text-center">
                <div className="text-lg font-semibold">{mayorAsistencia}</div>
                <div className="text-slate-200 text-xs">Máximo</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{menorAsistencia}</div>
                <div className="text-slate-200 text-xs">Mínimo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Reports */}
      {filteredData.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Download className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Descargar Informes</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCSV}
                className="bg-transparent border-green-200 text-green-700 hover:bg-green-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadReport}
                className="bg-transparent border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Informe
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improved Chart */}
      {chartData.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Tendencia de Asistencia (Últimos {chartData.length} registros)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Chart */}
              <div className="relative">
                <div className="flex items-end justify-between h-40 gap-1 bg-gradient-to-t from-gray-50 to-transparent p-4 rounded-lg">
                  {chartData.map((data, index) => (
                    <div key={data.id} className="flex flex-col items-center flex-1 group">
                      <div className="relative w-full flex flex-col items-center">
                        {/* Value label on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                          {data.total} personas
                        </div>

                        {/* Bar */}
                        <div
                          className="bg-gradient-to-t from-slate-600 via-slate-500 to-slate-400 rounded-t-lg w-full transition-all duration-500 hover:from-slate-700 hover:via-slate-600 hover:to-slate-500 shadow-sm"
                          style={{
                            height: `${Math.max((data.total / maxValue) * 100, 8)}%`,
                            minHeight: "8px",
                          }}
                        ></div>
                      </div>

                      {/* Labels */}
                      <div className="text-xs text-gray-600 mt-2 text-center">
                        <div className="font-bold text-slate-700">{data.total}</div>
                        <div className="text-gray-500">
                          {new Date(data.fecha).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="text-xs text-gray-400 truncate max-w-[60px]">{data.servicio.split(" ")[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Y-axis labels */}
                <div className="absolute left-0 top-4 bottom-16 flex flex-col justify-between text-xs text-gray-400">
                  <span>{maxValue}</span>
                  <span>{Math.round(maxValue * 0.75)}</span>
                  <span>{Math.round(maxValue * 0.5)}</span>
                  <span>{Math.round(maxValue * 0.25)}</span>
                  <span>0</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex justify-center">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gradient-to-t from-slate-600 to-slate-400 rounded"></div>
                    <span>Total de Asistentes</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Registros Detallados</h3>
          {filteredData.length === 0 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              Sin resultados
            </Badge>
          )}
        </div>

        {filteredData.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron registros</h3>
              <p className="text-gray-500">Intenta ajustar los filtros para ver más resultados</p>
            </CardContent>
          </Card>
        ) : (
          filteredData.map((record) => (
            <Card
              key={record.id}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {new Date(record.fecha).toLocaleDateString("es-ES", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-sm text-gray-600">{record.ujier}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-700">{record.total}</div>
                    <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                      {record.servicio}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="text-sm font-semibold text-slate-600">{record.hermanos}</div>
                    <div className="text-xs text-gray-500">Hermanos</div>
                  </div>
                  <div className="text-center p-2 bg-rose-50 rounded-lg">
                    <div className="text-sm font-semibold text-rose-600">{record.hermanas}</div>
                    <div className="text-xs text-gray-500">Hermanas</div>
                  </div>
                  <div className="text-center p-2 bg-amber-50 rounded-lg">
                    <div className="text-sm font-semibold text-amber-600">{record.ninos}</div>
                    <div className="text-xs text-gray-500">Niños</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <div className="text-sm font-semibold text-purple-600">{record.adolescentes}</div>
                    <div className="text-xs text-gray-500">Adolesc.</div>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-lg">
                    <div className="text-sm font-semibold text-emerald-600">{record.simpatizantes}</div>
                    <div className="text-xs text-gray-500">Simpat.</div>
                  </div>
                </div>

                {/* Lista de simpatizantes que asistieron */}
                {record.simpatizantesAsistieron && record.simpatizantesAsistieron.length > 0 && (
                  <div className="mb-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="text-xs text-emerald-700 mb-1 flex items-center gap-1 font-medium">
                      <Users className="w-3 h-3" />
                      Simpatizantes que asistieron ({record.simpatizantesAsistieron.length}):
                    </div>
                    <div className="text-xs text-emerald-800">
                      {record.simpatizantesAsistieron.map((s: any, index: number) => (
                        <span key={s.id} className="inline-block bg-emerald-100 px-2 py-1 rounded mr-1 mb-1">
                          {s.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent hover:bg-slate-50"
                  onClick={() => setSelectedRecord(record)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles Completos
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white max-h-[85vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detalle del Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Fecha:</span>
                  <div className="font-semibold">{new Date(selectedRecord.fecha).toLocaleDateString("es-ES")}</div>
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
                  <div className="font-semibold text-xl text-slate-700">{selectedRecord.total}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-3 border-t">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-bold text-slate-600">{selectedRecord.hermanos}</div>
                  <div className="text-xs text-gray-500">Hermanos</div>
                </div>
                <div className="text-center p-3 bg-rose-50 rounded-lg">
                  <div className="text-lg font-bold text-rose-600">{selectedRecord.hermanas}</div>
                  <div className="text-xs text-gray-500">Hermanas</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-lg font-bold text-amber-600">{selectedRecord.ninos}</div>
                  <div className="text-xs text-gray-500">Niños</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{selectedRecord.adolescentes}</div>
                  <div className="text-xs text-gray-500">Adolesc.</div>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">{selectedRecord.simpatizantes}</div>
                  <div className="text-xs text-gray-500">Simpat.</div>
                </div>
              </div>

              {/* Detalle de simpatizantes */}
              {selectedRecord.simpatizantesAsistieron && selectedRecord.simpatizantesAsistieron.length > 0 && (
                <div className="pt-3 border-t">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Simpatizantes que Asistieron ({selectedRecord.simpatizantesAsistieron.length})
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedRecord.simpatizantesAsistieron.map((simpatizante: any) => (
                      <div
                        key={simpatizante.id}
                        className="text-sm text-gray-700 bg-emerald-50 p-2 rounded border border-emerald-100"
                      >
                        {simpatizante.nombre}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full mt-4 bg-slate-600 hover:bg-slate-700" onClick={() => setSelectedRecord(null)}>
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
