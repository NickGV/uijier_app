"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Users, UserCheck, Clock, Settings, Calendar, TrendingUp, Info, User } from "lucide-react"

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
  const isAdmin = currentUser?.rol === "admin"
  const isDirectiva = currentUser?.rol === "directiva"

  // Estadísticas
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

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case "admin":
        return "from-red-500 to-red-600"
      case "directiva":
        return "from-blue-500 to-blue-600"
      default:
        return "from-green-500 to-green-600"
    }
  }

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case "admin":
        return "Administrador"
      case "directiva":
        return "Directiva"
      default:
        return "Ujier"
    }
  }

  const getWelcomeMessage = (rol: string) => {
    switch (rol) {
      case "admin":
        return "Tiene acceso completo a todas las funciones del sistema"
      case "directiva":
        return "Puede ver reportes y gestionar usuarios de forma limitada"
      default:
        return "Puede registrar asistencia y gestionar simpatizantes"
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">


      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Acciones Principales
          </CardTitle>
          <p className="text-sm text-gray-600">Acceda rápidamente a las funciones más utilizadas</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => onNavigate("conteo")}
              className="h-16 flex flex-col items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800"
            >
              <Calculator className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Nuevo Conteo</div>
                <div className="text-xs opacity-90">Registrar asistencia</div>
              </div>
            </Button>

            <Button
              onClick={() => onNavigate("simpatizantes")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Users className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Simpatizantes</div>
                <div className="text-xs text-gray-500">Gestionar visitantes</div>
              </div>
            </Button>

            {isAdmin && (
              <Button
                onClick={() => onNavigate("miembros")}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center gap-2"
              >
                <UserCheck className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Miembros</div>
                  <div className="text-xs text-gray-500">Gestionar miembros</div>
                </div>
              </Button>
            )}

            <Button
              onClick={() => onNavigate("historial")}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Clock className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Historial</div>
                <div className="text-xs text-gray-500">Ver registros</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Resumen de Estadísticas
          </CardTitle>
          <p className="text-sm text-gray-600">Vista general de los datos del sistema</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{promedioAsistencia}</div>
              <div className="text-sm text-blue-600">Promedio Mensual</div>
              <div className="text-xs text-gray-500 mt-1">Asistencia promedio</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">{simpatizantes.length}</div>
              <div className="text-sm text-green-600">Simpatizantes</div>
              <div className="text-xs text-gray-500 mt-1">Total registrados</div>
            </div>
            {isAdmin && (
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">{miembros.length}</div>
                <div className="text-sm text-purple-600">Miembros</div>
                <div className="text-xs text-gray-500 mt-1">Miembros oficiales</div>
              </div>
            )}
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-700">{totalRegistros}</div>
              <div className="text-sm text-orange-600">Servicios</div>
              <div className="text-xs text-gray-500 mt-1">Total registrados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      {(isAdmin || isDirectiva) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Gestión de Usuarios
            </CardTitle>
            <p className="text-sm text-gray-600">
              {isAdmin ? "Administre todos los usuarios del sistema" : "Gestión limitada de usuarios"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="text-xl font-bold text-red-700">{usuarios.filter((u) => u.rol === "admin").length}</div>
                <div className="text-sm text-red-600">Administradores</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xl font-bold text-blue-700">
                  {usuarios.filter((u) => u.rol === "directiva").length}
                </div>
                <div className="text-sm text-blue-600">Directiva</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xl font-bold text-green-700">
                  {usuarios.filter((u) => u.rol === "ujier").length}
                </div>
                <div className="text-sm text-green-600">Ujieres</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-xl font-bold text-emerald-700">{usuariosActivos}</div>
                <div className="text-sm text-emerald-600">Activos</div>
              </div>
            </div>
            <Button onClick={() => onNavigate("ujieres")} variant="outline" className="w-full">
              <Settings className="w-4 h-4 mr-2" />
              {isAdmin ? "Gestionar Usuarios" : "Ver Usuarios"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Actividad Reciente
          </CardTitle>
          <p className="text-sm text-gray-600">Últimos registros de asistencia</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historial.slice(0, 3).map((registro) => (
              <div
                key={registro.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{registro.servicio}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(registro.fecha).toLocaleDateString("es-ES", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    • {Array.isArray(registro.ujier) ? registro.ujier.join(", ") : registro.ujier}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-xl font-bold text-gray-900">{registro.total}</div>
                  <div className="text-sm text-gray-500">asistentes</div>
                </div>
              </div>
            ))}
            {historial.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No hay registros recientes</p>
                <p className="text-sm">Comience registrando la asistencia de un servicio</p>
              </div>
            )}
          </div>
          <Button onClick={() => onNavigate("historial")} variant="outline" className="w-full mt-4">
            <Clock className="w-4 h-4 mr-2" />
            Ver Todo el Historial
          </Button>
        </CardContent>
      </Card>

      {/* Role Information */}
      {!isAdmin && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-orange-900 mb-1">Información sobre su rol</h3>
                <p className="text-sm text-orange-800">
                  <strong>Como {getRoleLabel(currentUser?.rol)}:</strong>{" "}
                  {isDirectiva
                    ? "Tiene acceso a la mayoría de funciones excepto gestión completa de miembros. Puede gestionar usuarios de forma limitada."
                    : "Su acceso está limitado a las funciones esenciales de conteo de asistencia y gestión de simpatizantes."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Consejos Rápidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>Navegación:</strong> Use la barra inferior para moverse entre secciones
            </p>
            <p>
              • <strong>Conteo:</strong> Registre la asistencia inmediatamente después de cada servicio
            </p>
            <p>
              • <strong>Simpatizantes:</strong> Agregue nombres específicos para mejor seguimiento
            </p>
            <p>
              • <strong>Respaldo:</strong> Los datos se guardan automáticamente en la nube
            </p>
            {isAdmin && (
              <p>
                • <strong>Usuarios:</strong> Revise periódicamente los permisos de acceso
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
