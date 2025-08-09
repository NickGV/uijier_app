"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Crown, UserCog, User, Eye, EyeOff } from "lucide-react"

interface UjierDetailScreenProps {
  usuario: any
  onBack: () => void
  onUpdateUsuario: (id: string, data: any) => void
  currentUser: any
}

export function UjierDetailScreen({ usuario, onBack, onUpdateUsuario, currentUser }: UjierDetailScreenProps) {
  const [editedUsuario, setEditedUsuario] = useState({
    nombre: usuario.nombre,
    password: usuario.password,
    rol: usuario.rol,
    activo: usuario.activo,
  })

  const isAdmin = currentUser?.rol === "admin"
  const isDirectiva = currentUser?.rol === "directiva"

  // Determinar qué campos puede editar cada rol
  const canEditFullProfile = isAdmin
  const canToggleStatus = (isAdmin || isDirectiva) && !(usuario.rol === "admin" || usuario.rol === "directiva") // No se pueden desactivar admins o directiva

  const handleSave = () => {
    const dataToUpdate: any = {}

    if (canEditFullProfile) {
      // Admin puede cambiar todo
      dataToUpdate.nombre = editedUsuario.nombre
      dataToUpdate.password = editedUsuario.password
      dataToUpdate.rol = editedUsuario.rol
      dataToUpdate.activo = editedUsuario.activo
    } else if (canToggleStatus) {
      // Directiva solo puede cambiar el estado activo
      dataToUpdate.activo = editedUsuario.activo
    }

    onUpdateUsuario(usuario.id, dataToUpdate)
    onBack()
  }

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case "admin":
        return <Crown className="w-6 h-6 text-yellow-600" />
      case "directiva":
        return <UserCog className="w-6 h-6 text-blue-600" />
      default:
        return <User className="w-6 h-6 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case "admin":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "directiva":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRoleDisplayName = (rol: string) => {
    switch (rol) {
      case "admin":
        return "Administrador"
      case "directiva":
        return "Directiva"
      default:
        return "Ujier"
    }
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div className="flex items-center gap-3">
          {getRoleIcon(usuario.rol)}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{usuario.nombre}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getRoleBadgeColor(usuario.rol)}>{getRoleDisplayName(usuario.rol)}</Badge>
              <Badge variant={usuario.activo ? "default" : "secondary"}>{usuario.activo ? "Activo" : "Inactivo"}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Permission Notice */}
      {!canEditFullProfile && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <span className="text-sm font-medium">
                ⚠️{" "}
                {isDirectiva
                  ? "Permisos limitados: Solo puedes activar/desactivar usuarios regulares"
                  : "Sin permisos de edición"}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Details Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nombre */}
          <div>
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              value={editedUsuario.nombre}
              onChange={(e) => setEditedUsuario({ ...editedUsuario, nombre: e.target.value })}
              disabled={!canEditFullProfile}
              className={!canEditFullProfile ? "bg-gray-50" : ""}
            />
          </div>

          {/* Contraseña */}
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={editedUsuario.password}
              onChange={(e) => setEditedUsuario({ ...editedUsuario, password: e.target.value })}
              disabled={!canEditFullProfile}
              className={!canEditFullProfile ? "bg-gray-50" : ""}
            />
          </div>

          {/* Rol */}
          <div>
            <Label htmlFor="rol">Rol</Label>
            <Select
              value={editedUsuario.rol}
              onValueChange={(value) => setEditedUsuario({ ...editedUsuario, rol: value })}
              disabled={!canEditFullProfile}
            >
              <SelectTrigger className={!canEditFullProfile ? "bg-gray-50" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ujier">Ujier</SelectItem>
                <SelectItem value="directiva">Directiva</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estado Activo */}
          <div>
            <Label htmlFor="activo">Estado</Label>
            <Select
              value={editedUsuario.activo ? "activo" : "inactivo"}
              onValueChange={(value) => setEditedUsuario({ ...editedUsuario, activo: value === "activo" })}
              disabled={!canToggleStatus}
            >
              <SelectTrigger className={!canToggleStatus ? "bg-gray-50" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    Activo
                  </div>
                </SelectItem>
                <SelectItem value="inactivo">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-red-600" />
                    Inactivo
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {!canToggleStatus && (
              <p className="text-xs text-gray-500 mt-1">
                {usuario.rol === "admin" || usuario.rol === "directiva"
                  ? "Los administradores y directiva no pueden ser desactivados"
                  : "Sin permisos para cambiar el estado"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">ID de Usuario:</span>
            <span className="text-sm font-mono">{usuario.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Fecha de Creación:</span>
            <span className="text-sm">{usuario.fechaCreacion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Permisos:</span>
            <div className="text-sm">
              {usuario.rol === "admin" && "Acceso completo al sistema"}
              {usuario.rol === "directiva" && "Dashboard, conteo, simpatizantes, historial, usuarios (limitado)"}
              {usuario.rol === "ujier" && "Solo conteo y simpatizantes"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1" disabled={!canEditFullProfile && !canToggleStatus}>
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          Cancelar
        </Button>
      </div>
    </div>
  )
}
