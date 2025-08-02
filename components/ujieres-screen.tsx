"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, Plus, Shield, User, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UjieresScreenProps {
  usuarios: any[]
  onSelectUsuario: (usuario: any) => void
  onAddUsuario: (usuario: any) => any
  onUpdateUsuario: (id: string, data: any) => void
}

export function UjieresScreen({ usuarios, onSelectUsuario, onAddUsuario, onUpdateUsuario }: UjieresScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroRol, setFiltroRol] = useState("todos")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newUsuario, setNewUsuario] = useState({
    nombre: "",
    rol: "ujier",
    activo: true,
  })

  const filteredUsuarios = usuarios.filter((usuario) => {
    const nombreMatch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const rolMatch = filtroRol === "todos" || usuario.rol === filtroRol
    const estadoMatch =
      filtroEstado === "todos" ||
      (filtroEstado === "activo" && usuario.activo) ||
      (filtroEstado === "inactivo" && !usuario.activo)
    return nombreMatch && rolMatch && estadoMatch
  })

  const addNewUsuario = () => {
    if (newUsuario.nombre.trim()) {
      const primerNombre = newUsuario.nombre.split(" ")[0].toLowerCase()
      const usuarioCompleto = {
        ...newUsuario,
        password: primerNombre + ".",
      }
      onAddUsuario(usuarioCompleto)
      setNewUsuario({ nombre: "", rol: "ujier", activo: true })
      setShowAddDialog(false)
    }
  }

  const toggleUsuarioEstado = (usuario: any) => {
    onUpdateUsuario(usuario.id, { activo: !usuario.activo })
  }

  const getRolIcon = (rol: string) => {
    return rol === "admin" ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />
  }

  const getRolColor = (rol: string) => {
    return rol === "admin" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"
  }

  const getEstadoColor = (activo: boolean) => {
    return activo ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"
  }

  const contarPorRol = (rol: string) => {
    return usuarios.filter((u) => u.rol === rol).length
  }

  const contarPorEstado = (activo: boolean) => {
    return usuarios.filter((u) => u.activo === activo).length
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestión de Usuarios
          </CardTitle>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              {filteredUsuarios.length} usuarios encontrados
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-lg font-bold">{contarPorRol("admin")}</div>
              <div className="text-slate-200 text-xs">Admins</div>
            </div>
            <div>
              <div className="text-lg font-bold">{contarPorRol("ujier")}</div>
              <div className="text-slate-200 text-xs">Ujieres</div>
            </div>
            <div>
              <div className="text-lg font-bold">{contarPorEstado(true)}</div>
              <div className="text-slate-200 text-xs">Activos</div>
            </div>
            <div>
              <div className="text-lg font-bold">{contarPorEstado(false)}</div>
              <div className="text-slate-200 text-xs">Inactivos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Rol</label>
              <Select value={filtroRol} onValueChange={setFiltroRol}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="ujier">Ujieres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block">Estado</label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Button */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl py-3 shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Nuevo Usuario
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre Completo *</label>
              <Input
                placeholder="Nombre del usuario"
                value={newUsuario.nombre}
                onChange={(e) => setNewUsuario({ ...newUsuario, nombre: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Rol *</label>
              <Select value={newUsuario.rol} onValueChange={(value) => setNewUsuario({ ...newUsuario, rol: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ujier">Ujier</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-gray-700">Estado inicial</div>
                <div className="text-xs text-gray-500">El usuario estará activo por defecto</div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Activo</Badge>
            </div>

            {newUsuario.nombre && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">Contraseña generada:</div>
                <div className="text-sm text-blue-700 font-mono">{newUsuario.nombre.split(" ")[0].toLowerCase()}.</div>
                <div className="text-xs text-blue-600 mt-1">Se genera automáticamente: primer nombre + punto</div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-slate-600 hover:bg-slate-700"
                onClick={addNewUsuario}
                disabled={!newUsuario.nombre.trim()}
              >
                Agregar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsuarios.map((usuario) => (
          <Card key={usuario.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getRolIcon(usuario.rol)}
                    <h3 className="font-semibold text-gray-800">{usuario.nombre}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`text-xs ${getRolColor(usuario.rol)}`}>
                      {usuario.rol === "admin" ? "Administrador" : "Ujier"}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getEstadoColor(usuario.activo)}`}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    Creado: {new Date(usuario.fechaCreacion).toLocaleDateString("es-ES")}
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-1">Contraseña: {usuario.password}</div>
                </div>
                <div className="flex flex-col gap-2 ml-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => onSelectUsuario(usuario)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`bg-transparent ${
                      usuario.activo
                        ? "border-red-200 text-red-700 hover:bg-red-50"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                    onClick={() => toggleUsuarioEstado(usuario)}
                  >
                    {usuario.activo ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsuarios.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron usuarios</h3>
            <p className="text-gray-500">
              {searchTerm || filtroRol !== "todos" || filtroEstado !== "todos"
                ? "Intenta con filtros diferentes"
                : "Aún no hay usuarios registrados"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
