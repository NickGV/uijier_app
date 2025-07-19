"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit3, Save, Phone, Calendar, FileText, User, Users, Baby, Zap } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MiembroDetailScreenProps {
  miembro: any
  onBack: () => void
  onUpdateMiembro: (id: number, data: any) => void
}

export function MiembroDetailScreen({ miembro, onBack, onUpdateMiembro }: MiembroDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    nombre: miembro?.nombre || "",
    telefono: miembro?.telefono || "",
    categoria: miembro?.categoria || "hermano",
    notas: miembro?.notas || "",
  })

  const handleSave = () => {
    onUpdateMiembro(miembro.id, editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({
      nombre: miembro?.nombre || "",
      telefono: miembro?.telefono || "",
      categoria: miembro?.categoria || "hermano",
      notas: miembro?.notas || "",
    })
    setIsEditing(false)
  }

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case "hermano":
        return <User className="w-6 h-6" />
      case "hermana":
        return <Users className="w-6 h-6" />
      case "nino":
        return <Baby className="w-6 h-6" />
      case "adolescente":
        return <Zap className="w-6 h-6" />
      default:
        return <User className="w-6 h-6" />
    }
  }

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "hermano":
        return "from-slate-600 to-slate-700"
      case "hermana":
        return "from-rose-600 to-rose-700"
      case "nino":
        return "from-amber-600 to-amber-700"
      case "adolescente":
        return "from-purple-600 to-purple-700"
      default:
        return "from-slate-600 to-slate-700"
    }
  }

  const getCategoriaLabel = (categoria: string) => {
    switch (categoria) {
      case "hermano":
        return "Hermano"
      case "hermana":
        return "Hermana"
      case "nino":
        return "Niño"
      case "adolescente":
        return "Adolescente"
      default:
        return categoria
    }
  }

  if (!miembro) return null

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-lg font-semibold text-gray-800">Detalle del Miembro</CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Card */}
      <Card
        className={`bg-gradient-to-r ${getCategoriaColor(isEditing ? editedData.categoria : miembro.categoria)} text-white border-0 shadow-lg`}
      >
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            {getCategoriaIcon(isEditing ? editedData.categoria : miembro.categoria)}
          </div>
          <h2 className="text-xl font-bold mb-1">{isEditing ? editedData.nombre : miembro.nombre}</h2>
          <p className="text-white/80">{getCategoriaLabel(isEditing ? editedData.categoria : miembro.categoria)}</p>
          <p className="text-white/70 text-sm">{isEditing ? editedData.telefono : miembro.telefono}</p>
        </CardContent>
      </Card>

      {/* Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">Información Personal</CardTitle>
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
              <FileText className="w-4 h-4" />
              Nombre Completo
            </label>
            {isEditing ? (
              <Input
                value={editedData.nombre}
                onChange={(e) => setEditedData({ ...editedData, nombre: e.target.value })}
                className="rounded-lg"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{miembro.nombre}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Categoría
            </label>
            {isEditing ? (
              <Select
                value={editedData.categoria}
                onValueChange={(value) => setEditedData({ ...editedData, categoria: value })}
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hermano">Hermano</SelectItem>
                  <SelectItem value="hermana">Hermana</SelectItem>
                  <SelectItem value="nino">Niño</SelectItem>
                  <SelectItem value="adolescente">Adolescente</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{getCategoriaLabel(miembro.categoria)}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              Teléfono
            </label>
            {isEditing ? (
              <Input
                value={editedData.telefono}
                onChange={(e) => setEditedData({ ...editedData, telefono: e.target.value })}
                className="rounded-lg"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{miembro.telefono}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Notas
            </label>
            {isEditing ? (
              <Textarea
                value={editedData.notas}
                onChange={(e) => setEditedData({ ...editedData, notas: e.target.value })}
                className="rounded-lg min-h-[100px]"
                placeholder="Agregar notas sobre el miembro..."
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                {miembro.notas || "Sin notas adicionales"}
              </p>
            )}
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
              <span className="text-sm text-gray-600">Fecha de registro:</span>
              <Badge variant="outline">
                {new Date(miembro.fechaRegistro).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Días desde registro:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {Math.floor((new Date().getTime() - new Date(miembro.fechaRegistro).getTime()) / (1000 * 60 * 60 * 24))}{" "}
                días
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-slate-600 hover:bg-slate-700 text-white rounded-xl py-3">
          <Phone className="w-5 h-5 mr-2" />
          Llamar
        </Button>
        <Button variant="outline" className="w-full rounded-xl py-3 bg-transparent">
          Enviar Mensaje
        </Button>
      </div>
    </div>
  )
}
