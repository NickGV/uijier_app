"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit3, Save, Calendar, Shield, User, Key, ToggleLeft, ToggleRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UjierDetailScreenProps {
  usuario: any
  onBack: () => void
  onUpdateUsuario: (id: string, data: any) => void
}

export function UjierDetailScreen({ usuario, onBack, onUpdateUsuario }: UjierDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    nombre: usuario?.nombre || "",
    rol: usuario?.rol || "ujier",
    activo: usuario?.activo || true,
  })

  const handleSave = () => {
    // Regenerar password si cambió el nombre
    const primerNombre = editedData.nombre.split(" ")[0].toLowerCase()
    const dataToSave = {
      ...editedData,
      password: primerNombre + ".",
    }
    onUpdateUsuario(usuario.id, dataToSave)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({
      nombre: usuario?.nombre || "",
      rol: usuario?.rol || "ujier",
      activo: usuario?.activo || true,
    })
    setIsEditing(false)
  }

  const toggleEstado = () => {
    const newEstado = !editedData.activo
    setEditedData({ ...editedData, activo: newEstado })
    if (!isEditing) {
      onUpdateUsuario(usuario.id, { activo: newEstado })
    }
  }

  const getRolIcon = (rol: string) => {
    return rol === "admin" ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />
  }

  const getRolColor = (rol: string) => {
    return rol === "admin" ? "from-blue-600 to-blue-700" : "from-green-600 to-green-700"
  }

  const getRolLabel = (rol: string) => {
    return rol === "admin" ? "Administrador" : "Ujier"
  }

  if (!usuario) return null

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-lg font-semibold text-gray-800">Detalle del Usuario</CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Card */}
      <Card
        className={`bg-gradient-to-r ${getRolColor(isEditing ? editedData.rol : usuario.rol)} text-white border-0 shadow-lg`}
      >
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            {getRolIcon(isEditing ? editedData.rol : usuario.rol)}
          </div>
          <h2 className="text-xl font-bold mb-1">{isEditing ? editedData.nombre : usuario.nombre}</h2>
          <p className="text-white/80">{getRolLabel(isEditing ? editedData.rol : usuario.rol)}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge
              className={`${(isEditing ? editedData.activo : usuario.activo) ? "bg-emerald-500" : "bg-red-500"} text-white border-0`}
            >
              {(isEditing ? editedData.activo : usuario.activo) ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Información del Usuario</CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave} className="bg-slate-600 hover:bg-slate-700">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Nombre Completo
            </label>
            {isEditing ? (
              <Input
                value={editedData.nombre}
                onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                className="rounded-lg"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{usuario.nombre}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              Rol
            </label>
            {isEditing ? (
              <Select value={editedData.rol} onValueChange={(value) => setEditedData({ ...editedData, rol: value })}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ujier">Ujier</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{getRolLabel(usuario.rol)}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Key className="w-4 h-4" />
              Contraseña
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-800 font-mono">
                {isEditing ? editedData.nombre.split(" ")[0].toLowerCase() + "." : usuario.password}
              </p>
              <p className="text-xs text-gray-500 mt-1">Se genera automáticamente: primer nombre + punto</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">Estado del Usuario</label>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-800">
                  {(isEditing ? editedData.activo : usuario.activo) ? "Activo" : "Inactivo"}
                </div>
                <div className="text-xs text-gray-500">
                  {(isEditing ? editedData.activo : usuario.activo)
                    ? "Puede iniciar sesión en la aplicación"
                    : "No puede acceder a la aplicación"}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleEstado}
                className={`${
                  (isEditing ? editedData.activo : usuario.activo)
                    ? "border-red-200 text-red-700 hover:bg-red-50"
                    : "border-green-200 text-green-700 hover:bg-green-50"
                }`}
              >
                {(isEditing ? editedData.activo : usuario.activo) ? (
                  <ToggleRight className="w-4 h-4 mr-2" />
                ) : (
                  <ToggleLeft className="w-4 h-4 mr-2" />
                )}
                {(isEditing ? editedData.activo : usuario.activo) ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Información de Registro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fecha de creación:</span>
              <Badge variant="outline">
                {new Date(usuario.fechaCreacion).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Días desde creación:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {Math.floor((new Date().getTime() - new Date(usuario.fechaCreacion).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                días
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
