"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit3, Save, Phone, Calendar, FileText } from "lucide-react"

interface SimpatizanteDetailScreenProps {
  simpatizante: any
  onBack: () => void
  onUpdateSimpatizante: (id: number, data: any) => void
}

export function SimpatizanteDetailScreen({
  simpatizante,
  onBack,
  onUpdateSimpatizante,
}: SimpatizanteDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    nombre: simpatizante?.nombre || "",
    telefono: simpatizante?.telefono || "",
    notas: simpatizante?.notas || "",
  })

  const handleSave = () => {
    onUpdateSimpatizante(simpatizante.id, editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({
      nombre: simpatizante?.nombre || "",
      telefono: simpatizante?.telefono || "",
      notas: simpatizante?.notas || "",
    })
    setIsEditing(false)
  }

  if (!simpatizante) return null

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-lg font-semibold text-gray-800">Detalle del Simpatizante</CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Card */}
      <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold">
              {(isEditing ? editedData.nombre : simpatizante.nombre).charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">{isEditing ? editedData.nombre : simpatizante.nombre}</h2>
          <p className="text-slate-200">{isEditing ? editedData.telefono : simpatizante.telefono}</p>
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
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{simpatizante.nombre}</p>
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
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{simpatizante.telefono}</p>
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
                placeholder="Agregar notas sobre el simpatizante..."
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                {simpatizante.notas || "Sin notas adicionales"}
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
                {new Date(simpatizante.fechaRegistro).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Días desde registro:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {Math.floor(
                  (new Date().getTime() - new Date(simpatizante.fechaRegistro).getTime()) / (1000 * 60 * 60 * 24),
                )}{" "}
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
