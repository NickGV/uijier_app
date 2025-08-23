"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  User,
  Phone,
  FileText,
  Calendar,
  Edit3,
  Save,
  Trash2,
} from "lucide-react";
import {
  getSimpatizanteById,
  updateSimpatizante,
  deleteSimpatizante,
} from "@/lib/utils";

interface Simpatizante {
  id: string;
  nombre: string;
  telefono?: string;
  notas?: string;
  fechaRegistro: string;
}

const SimpatizanteDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [simpatizante, setSimpatizante] = useState<Simpatizante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedData, setEditedData] = useState({
    nombre: "",
    telefono: "",
    notas: "",
  });

  useEffect(() => {
    if (id) {
      const fetchSimpatizante = async () => {
        try {
          const data = await getSimpatizanteById(id);
          setSimpatizante(data);
          setEditedData({
            nombre: data.nombre || "",
            telefono: data.telefono || "",
            notas: data.notas || "",
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
          setLoading(false);
        }
      };

      fetchSimpatizante();
    }
  }, [id]);

  const handleSave = async () => {
    if (!simpatizante) return;

    try {
      await updateSimpatizante(simpatizante.id, editedData);
      setSimpatizante({ ...simpatizante, ...editedData });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    }
  };

  const handleCancel = () => {
    if (simpatizante) {
      setEditedData({
        nombre: simpatizante.nombre || "",
        telefono: simpatizante.telefono || "",
        notas: simpatizante.notas || "",
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!simpatizante) return;

    setIsDeleting(true);
    try {
      await deleteSimpatizante(simpatizante.id);
      router.push("/simpatizantes");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Cargando información del simpatizante...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.back()} variant="outline">
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!simpatizante) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Simpatizante no encontrado
            </h2>
            <p className="text-gray-600 mb-4">
              El simpatizante que buscas no existe o ha sido eliminado.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 space-y-4 sm:space-y-6 min-h-screen max-w-full overflow-x-hidden">
      {/* Header with Back Button */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="px-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              Detalle del Simpatizante
            </CardTitle>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Card */}
      <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white border-0 shadow-lg">
        <CardContent className="p-3 sm:p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold">
              {(isEditing ? editedData.nombre : simpatizante.nombre)
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1">
            {isEditing ? editedData.nombre : simpatizante.nombre}
          </h2>
          <p className="text-slate-200">
            {isEditing ? editedData.telefono : simpatizante.telefono}
          </p>
        </CardContent>
      </Card>

      {/* Simpatizante Information */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="px-3 sm:px-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-semibold text-gray-800">
              Información Personal
            </CardTitle>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-slate-600 hover:bg-slate-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Nombre Completo
            </label>
            {isEditing ? (
              <Input
                value={editedData.nombre}
                onChange={(e) =>
                  setEditedData({ ...editedData, nombre: e.target.value })
                }
                className="rounded-lg"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                {simpatizante.nombre}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              Teléfono
            </label>
            {isEditing ? (
              <Input
                value={editedData.telefono}
                onChange={(e) =>
                  setEditedData({ ...editedData, telefono: e.target.value })
                }
                className="rounded-lg"
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                {simpatizante.telefono || "No registrado"}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              Notas
            </label>
            {isEditing ? (
              <Textarea
                value={editedData.notas}
                onChange={(e) =>
                  setEditedData({ ...editedData, notas: e.target.value })
                }
                className="rounded-lg min-h-[100px]"
                placeholder="Agregar notas sobre el simpatizante..."
              />
            ) : (
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                {simpatizante.notas || "Sin notas adicionales"}
              </p>
            )}
          </div>

          {/* Registration Date */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                Fecha de Registro
              </p>
              <p className="text-gray-600">
                {new Date(simpatizante.fechaRegistro).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registration Info */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
        <CardHeader className="px-3 sm:px-6">
          <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Información de Registro
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fecha de registro:</span>
              <Badge variant="outline">
                {new Date(simpatizante.fechaRegistro).toLocaleDateString(
                  "es-ES",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Días desde registro:
              </span>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                {Math.floor(
                  (new Date().getTime() -
                    new Date(simpatizante.fechaRegistro).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                días
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {simpatizante.telefono && (
          <Button
            className="w-full bg-slate-600 hover:bg-slate-700 text-white rounded-xl py-3"
            onClick={() => window.open(`tel:${simpatizante.telefono}`, "_self")}
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamar
          </Button>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl py-3 bg-transparent"
            onClick={() => router.back()}
          >
            Volver a la Lista
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl py-3"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar simpatizante?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente
                  la información de <strong>{simpatizante.nombre}</strong> de la
                  base de datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default SimpatizanteDetail;
