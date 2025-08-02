"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, UserCheck, Calendar, TrendingUp, Clock, Settings, Activity, Shield, Eye } from "lucide-react"

interface DashboardScreenProps {
  historial: any[]
  simpatizantes: any[]
  miembros: any[]
  usuarios: any[]
  currentUser: any
  onNavigate: (screen: string) => void
}

export function DashboardScreen({
  historial,
  simpatizantes,
  miembros,
  usuarios,
  currentUser,
  onNavigate,
}: DashboardScreenProps) {
  // Estadísticas generales
  const totalRegistros = historial.length
  const ultimoMes = historial.filter((h) => {
    const fecha = new Date(h.fecha)
    const haceUnMes = new Date()
    haceUnMes.setMonth(haceUnMes.getMonth() - 1)
    return fecha >= haceUnMes
  })

  const promedioAsistencia =
    ultimoMes.length > 0 ? Math.round(ultimoMes.reduce((sum, h) => sum + h.total, 0) / ultimoMes.length) : 0

  const usuariosActivos = usuarios.filter((u) => u.activo).length
  const usuariosInactivos = usuarios.filter((u) => !u.activo).length

  // Últimos registros
  const ultimosRegistros = historial.slice(0, 3)

  // Servicios más frecuentes
  const serviciosFrecuencia = historial.reduce(
    (acc, h) => {
      acc[h.servicio] = (acc[h.servicio] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const servicioMasFrecuente = Object.entries(serviciosFrecuencia).sort(([, a], [, b]) => b - a)[0]

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Panel de Administración</h1>
              <p className="text-slate-200 text-sm">Bienvenido, {currentUser.nombre}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-white/20 text-white border-white/30 text-xs">Administrador</Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              <Activity className="w-3 h-3 mr-1" />
              Activo
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-slate-700">{totalRegistros}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Registros</div>
            <div className="text-xs text-gray-500 mt-1">Histórico completo</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-700">{promedioAsistencia}</div>
            <div className="text-xs sm:text-sm text-gray-600">Promedio Mensual</div>
            <div className="text-xs text-gray-500 mt-1">Último mes</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-emerald-700">{simpatizantes.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Simpatizantes</div>
            <div className="text-xs text-gray-500 mt-1">Registrados</div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-700">{miembros.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Miembros</div>
            <div className="text-xs text-gray-500 mt-1">Iglesia</div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Stats */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Gestión de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">{usuariosActivos}</div>
              <div className="text-xs text-gray-600">Activos</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-700">{usuariosInactivos}</div>
              <div className="text-xs text-gray-600">Inactivos</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">{usuarios.filter((u) => u.rol === "admin").length}</div>
              <div className="text-xs text-gray-600">Admins</div>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onNavigate("ujieres")}>
            <Settings className="w-4 h-4 mr-2" />
            Gestionar Usuarios
          </Button>
        </CardContent>
      </Card>

      {/* Service Stats */}
      {servicioMasFrecuente && (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estadísticas de Servicios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">Servicio más frecuente</div>
                <div className="text-sm text-gray-600">{servicioMasFrecuente[0]}</div>
              </div>
              <Badge variant="outline" className="bg-slate-100 text-slate-700">
                {servicioMasFrecuente[1]} veces
              </Badge>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={() => onNavigate("historial")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Análisis Completo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ultimosRegistros.length > 0 ? (
            ultimosRegistros.map((registro) => (
              <div key={registro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm text-gray-800">{registro.servicio}</div>
                  <div className="text-xs text-gray-600">
                    {new Date(registro.fecha).toLocaleDateString("es-ES")} •{" "}
                    {Array.isArray(registro.ujier) ? registro.ujier.join(", ") : registro.ujier}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-700">{registro.total}</div>
                  <div className="text-xs text-gray-500">asistentes</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No hay registros recientes</p>
            </div>
          )}
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onNavigate("historial")}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Todo el Historial
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-gray-800">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="bg-transparent border-blue-200 text-blue-700 hover:bg-blue-50 text-xs sm:text-sm h-10 sm:h-12"
              onClick={() => onNavigate("conteo")}
            >
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Nuevo Conteo
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs sm:text-sm h-10 sm:h-12"
              onClick={() => onNavigate("simpatizantes")}
            >
              <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Simpatizantes
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-purple-200 text-purple-700 hover:bg-purple-50 text-xs sm:text-sm h-10 sm:h-12"
              onClick={() => onNavigate("miembros")}
            >
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Miembros
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm h-10 sm:h-12"
              onClick={() => onNavigate("ujieres")}
            >
              <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Usuarios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
