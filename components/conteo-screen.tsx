"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Minus,
  Edit3,
  UserPlus,
  Calendar,
  User,
  Clock,
  Search,
  X,
  Save,
  Users,
  Trash2,
  Copy,
  Eye,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ConteoScreenProps {
  simpatizantes: any[]
  miembros: any[]
  onAddSimpatizante: (simpatizante: any) => any
  onAddMiembro: (miembro: any) => any
  onSaveConteo: (conteo: any) => void
}

export function ConteoScreen({
  simpatizantes,
  miembros,
  onAddSimpatizante,
  onAddMiembro,
  onSaveConteo,
}: ConteoScreenProps) {
  const [hermanos, setHermanos] = useState(0)
  const [hermanas, setHermanas] = useState(0)
  const [ninos, setNinos] = useState(0)
  const [adolescentes, setAdolescentes] = useState(0)
  const [simpatizantesCount, setSimpatizantesCount] = useState(0)
  const [editingCounter, setEditingCounter] = useState<string | null>(null)
  const [tempValue, setTempValue] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Estados para simpatizantes del día
  const [simpatizantesDelDia, setSimpatizantesDelDia] = useState<any[]>([])

  // Estados para el diálogo de simpatizantes
  const [searchTerm, setSearchTerm] = useState("")
  const [showNewForm, setShowNewForm] = useState(false)
  const [newSimpatizante, setNewSimpatizante] = useState({
    nombre: "",
    telefono: "",
    notas: "",
  })

  // Campos editables
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [tipoServicio, setTipoServicio] = useState("dominical")
  const [ujierSeleccionado, setUjierSeleccionado] = useState("")
  const [ujierPersonalizado, setUjierPersonalizado] = useState("")

  // Estados para miembros del día por categoría
  const [hermanosDelDia, setHermanosDelDia] = useState<any[]>([])
  const [hermanasDelDia, setHermanasDelDia] = useState<any[]>([])
  const [ninosDelDia, setNinosDelDia] = useState<any[]>([])
  const [adolescentesDelDia, setAdolescentesDelDia] = useState<any[]>([])
  const [showAsistentesDialog, setShowAsistentesDialog] = useState(false)
  const [showMiembrosDialog, setShowMiembrosDialog] = useState(false)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")

  const [modoConsecutivo, setModoConsecutivo] = useState(false)
  const [datosEvangelismo, setDatosEvangelismo] = useState<any>(null)
  const [showContinuarDialog, setShowContinuarDialog] = useState(false)

  const servicios = [
    { value: "dominical", label: "Dominical" },
    { value: "oracion", label: "Oración y Enseñanza" },
    { value: "dorcas", label: "Hermanas Dorcas" },
    { value: "evangelismo", label: "Evangelismo" },
    { value: "jovenes", label: "Jóvenes" },
  ]

  const ujieres = [
    "Wilmar Rojas",
    "Juan Caldera",
    "Joaquin Velez",
    "Yarissa Rojas",
    "Cristian Gomez",
    "Hector Gaviria",
    "Ivan Caro",
    "Jhon echavarria",
    "Karen Cadavid",
    "Carolina Monsalve",
    "Marta Verona",
    "Nicolas Gömez",
    "Oraliz Fernåndez",
    "Santiago Graciano",
    "Suri Vélez",
    "Wilmar Vélez",
    "Diana Suarez",
    "José perdomo",
    "Carolina Caro",
  ]

  const handleCounterEdit = (type: string, value: number) => {
    setEditingCounter(type)
    setTempValue(value.toString())
  }

  const saveCounterEdit = () => {
    const newValue = Number.parseInt(tempValue) || 0
    switch (editingCounter) {
      case "hermanos":
        setHermanos(newValue)
        break
      case "hermanas":
        setHermanas(newValue)
        break
      case "ninos":
        setNinos(newValue)
        break
      case "adolescentes":
        setAdolescentes(newValue)
        break
      case "simpatizantes":
        setSimpatizantesCount(newValue)
        break
    }
    setEditingCounter(null)
    setTempValue("")
  }

  const selectExistingSimpatizante = (simpatizante: any) => {
    // Verificar si ya está en la lista del día
    if (simpatizantesDelDia.find((s) => s.id === simpatizante.id)) {
      alert("Este simpatizante ya fue agregado hoy")
      return
    }

    setSimpatizantesDelDia((prev) => [...prev, simpatizante])
    setShowAddDialog(false)
    setSearchTerm("")
    setShowNewForm(false)
  }

  const addNewSimpatizante = () => {
    if (newSimpatizante.nombre.trim()) {
      const nuevoSimpatizante = onAddSimpatizante(newSimpatizante)
      setSimpatizantesDelDia((prev) => [...prev, nuevoSimpatizante])
      setNewSimpatizante({ nombre: "", telefono: "", notas: "" })
      setShowAddDialog(false)
      setSearchTerm("")
      setShowNewForm(false)
    }
  }

  const removeSimpatizanteDelDia = (simpatizanteId: number) => {
    setSimpatizantesDelDia((prev) => prev.filter((s) => s.id !== simpatizanteId))
  }

  const closeDialog = () => {
    setShowAddDialog(false)
    setSearchTerm("")
    setShowNewForm(false)
    setNewSimpatizante({ nombre: "", telefono: "", notas: "" })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Nombre copiado al portapapeles")
    })
  }

  const selectMiembro = (miembro: any, categoria: string) => {
    const setterMap = {
      hermanos: setHermanosDelDia,
      hermanas: setHermanasDelDia,
      ninos: setNinosDelDia,
      adolescentes: setAdolescentesDelDia,
    }

    const currentList =
      {
        hermanos: hermanosDelDia,
        hermanas: hermanasDelDia,
        ninos: ninosDelDia,
        adolescentes: adolescentesDelDia,
      }[categoria] || []

    if (currentList.find((m: any) => m.id === miembro.id)) {
      alert("Este miembro ya fue agregado hoy")
      return
    }

    setterMap[categoria]?.((prev: any[]) => [...prev, miembro])
    setShowMiembrosDialog(false)
  }

  const removeMiembroDelDia = (miembroId: number, categoria: string) => {
    const setterMap = {
      hermanos: setHermanosDelDia,
      hermanas: setHermanasDelDia,
      ninos: setNinosDelDia,
      adolescentes: setAdolescentesDelDia,
    }

    setterMap[categoria]?.((prev: any[]) => prev.filter((m: any) => m.id !== miembroId))
  }

  const openMiembrosDialog = (categoria: string) => {
    setCategoriaSeleccionada(categoria)
    setShowMiembrosDialog(true)
  }

  const getMiembrosPorCategoria = (categoria: string) => {
    return miembros.filter((m) => {
      if (categoria === "ninos") return m.categoria === "nino"
      if (categoria === "adolescentes") return m.categoria === "adolescente"
      return m.categoria === categoria.slice(0, -1) // remove 's' from end
    })
  }

  const handleSaveConteo = () => {
    const nombreUjier = ujierSeleccionado === "otro" ? ujierPersonalizado : ujierSeleccionado

    if (!nombreUjier.trim()) {
      alert("Por favor seleccione o ingrese el nombre del ujier")
      return
    }

    const totalSimpatizantes = simpatizantesCount + simpatizantesDelDia.length
    const totalHermanos = hermanos + hermanosDelDia.length
    const totalHermanas = hermanas + hermanasDelDia.length
    const totalNinos = ninos + ninosDelDia.length
    const totalAdolescentes = adolescentes + adolescentesDelDia.length

    const conteoData = {
      fecha,
      servicio: servicios.find((s) => s.value === tipoServicio)?.label || tipoServicio,
      ujier: nombreUjier,
      hermanos: totalHermanos,
      hermanas: totalHermanas,
      ninos: totalNinos,
      adolescentes: totalAdolescentes,
      simpatizantes: totalSimpatizantes,
      simpatizantesAsistieron: simpatizantesDelDia.map((s) => ({ id: s.id, nombre: s.nombre })),
      miembrosAsistieron: {
        hermanos: hermanosDelDia.map((m) => ({ id: m.id, nombre: m.nombre })),
        hermanas: hermanasDelDia.map((m) => ({ id: m.id, nombre: m.nombre })),
        ninos: ninosDelDia.map((m) => ({ id: m.id, nombre: m.nombre })),
        adolescentes: adolescentesDelDia.map((m) => ({ id: m.id, nombre: m.nombre })),
      },
    }

    // Verificar si es domingo y evangelismo (y no estamos en modo consecutivo)
    const fechaObj = new Date(fecha)
    const esDomingo = fechaObj.getDay() === 0
    const esEvangelismo = tipoServicio === "evangelismo"

    if (esDomingo && esEvangelismo && !modoConsecutivo) {
      // Guardar datos del evangelismo y preguntar si continuar
      onSaveConteo(conteoData)
      setDatosEvangelismo(conteoData)
      setShowContinuarDialog(true)
      return
    }

    if (modoConsecutivo) {
      // Estamos guardando el dominical después del evangelismo
      onSaveConteo(conteoData)
      resetearFormulario()
      setModoConsecutivo(false)
      setDatosEvangelismo(null)
      alert("Conteo dominical guardado exitosamente")
    } else {
      // Guardado normal
      onSaveConteo(conteoData)
      resetearFormulario()
      alert("Conteo guardado exitosamente")
    }
  }

  const resetearFormulario = () => {
    setHermanos(0)
    setHermanas(0)
    setNinos(0)
    setAdolescentes(0)
    setSimpatizantesCount(0)
    setSimpatizantesDelDia([])
    setHermanosDelDia([])
    setHermanasDelDia([])
    setNinosDelDia([])
    setAdolescentesDelDia([])
    setFecha(new Date().toISOString().split("T")[0])
    setTipoServicio("dominical")
    setUjierSeleccionado("")
    setUjierPersonalizado("")
  }

  const continuarConDominical = () => {
    setModoConsecutivo(true)
    setTipoServicio("dominical")
    setShowContinuarDialog(false)
    // Los contadores y listas se mantienen como están
    alert("Continuando con el servicio dominical. Los asistentes del evangelismo se mantienen como base.")
  }

  const noContinarConDominical = () => {
    setShowContinuarDialog(false)
    setDatosEvangelismo(null)
    resetearFormulario()
    alert("Conteo de evangelismo guardado exitosamente")
  }

  const filteredSimpatizantes = simpatizantes.filter(
    (s) =>
      s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && !simpatizantesDelDia.find((sd) => sd.id === s.id),
  )

  const totalSimpatizantes = simpatizantesCount + simpatizantesDelDia.length
  const total = hermanos + hermanas + ninos + adolescentes + totalSimpatizantes

  const counters = [
    {
      key: "hermanos",
      label: "Hermanos",
      value: hermanos,
      setter: setHermanos,
      color: "bg-slate-600",
      miembrosDelDia: hermanosDelDia,
      categoria: "hermanos",
    },
    {
      key: "hermanas",
      label: "Hermanas",
      value: hermanas,
      setter: setHermanas,
      color: "bg-rose-600",
      miembrosDelDia: hermanasDelDia,
      categoria: "hermanas",
    },
    {
      key: "ninos",
      label: "Niños",
      value: ninos,
      setter: setNinos,
      color: "bg-amber-600",
      miembrosDelDia: ninosDelDia,
      categoria: "ninos",
    },
    {
      key: "adolescentes",
      label: "Adolescentes",
      value: adolescentes,
      setter: setAdolescentes,
      color: "bg-purple-600",
      miembrosDelDia: adolescentesDelDia,
      categoria: "adolescentes",
    },
    {
      key: "simpatizantes",
      label: "Simpatizantes",
      value: simpatizantesCount,
      setter: setSimpatizantesCount,
      color: "bg-emerald-600",
      categoria: "simpatizantes", // Agregar esta línea
    },
  ]

  return (
    <div className="p-4 space-y-6 min-h-screen">
      {/* Header */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800">Conteo de Asistencia</CardTitle>

          {/* Campos editables */}
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Fecha
                </label>
                <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="h-9 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Servicio
                </label>
                <Select value={tipoServicio} onValueChange={setTipoServicio}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {servicios.map((servicio) => (
                      <SelectItem key={servicio.value} value={servicio.value}>
                        {servicio.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 mb-1 block flex items-center gap-1">
                <User className="w-3 h-3" />
                Nombre del Ujier
              </label>
              <Select value={ujierSeleccionado} onValueChange={setUjierSeleccionado}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Seleccione un ujier" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {ujieres.map((ujier) => (
                    <SelectItem key={ujier} value={ujier} className="flex items-center justify-between">
                      <div className="flex items-center justify-between w-full">
                        <span>{ujier}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(ujier)
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="otro">Otro (escribir nombre)</SelectItem>
                </SelectContent>
              </Select>

              {ujierSeleccionado === "otro" && (
                <Input
                  placeholder="Escriba el nombre del ujier"
                  value={ujierPersonalizado}
                  onChange={(e) => setUjierPersonalizado(e.target.value)}
                  className="h-9 text-sm mt-2"
                />
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              {servicios.find((s) => s.value === tipoServicio)?.label}
            </Badge>
            {ujierSeleccionado && ujierSeleccionado !== "otro" && (
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                {ujierSeleccionado}
              </Badge>
            )}
            {ujierSeleccionado === "otro" && ujierPersonalizado && (
              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                {ujierPersonalizado}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {modoConsecutivo && datosEvangelismo && (
        <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">Modo Consecutivo: Dominical</span>
            </div>
            <div className="text-emerald-100 text-sm">Base del Evangelismo: {datosEvangelismo.total} asistentes</div>
            <div className="text-emerald-200 text-xs mt-1">
              Los contadores actuales se sumarán a la base del evangelismo
            </div>
          </CardContent>
        </Card>
      )}

      {/* Total Counter */}
      <Card className="bg-gradient-to-r from-slate-700 to-slate-800 text-white border-0 shadow-lg">
        <CardContent className="p-6 text-center">
          <h2 className="text-3xl font-bold">{total}</h2>
          <p className="text-slate-200">Total de Asistentes</p>
        </CardContent>
      </Card>

      {/* Counters */}
      <div className="space-y-4">
        {counters.map((counter) => (
          <Card key={counter.key} className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${counter.color} rounded-full`}></div>
                  <span className="font-medium text-gray-800">{counter.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {counter.categoria && (
                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-full bg-transparent border-gray-300"
                        onClick={() =>
                          counter.categoria === "simpatizantes"
                            ? setShowAddDialog(true)
                            : openMiembrosDialog(counter.categoria)
                        }
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                      {/* Indicador de cantidad */}
                      {((counter.categoria === "hermanos" && hermanosDelDia.length > 0) ||
                        (counter.categoria === "hermanas" && hermanasDelDia.length > 0) ||
                        (counter.categoria === "ninos" && ninosDelDia.length > 0) ||
                        (counter.categoria === "adolescentes" && adolescentesDelDia.length > 0) ||
                        (counter.categoria === "simpatizantes" && simpatizantesDelDia.length > 0)) && (
                        <div className="absolute -top-2 -right-1 bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                          {counter.categoria === "hermanos" && hermanosDelDia.length}
                          {counter.categoria === "hermanas" && hermanasDelDia.length}
                          {counter.categoria === "ninos" && ninosDelDia.length}
                          {counter.categoria === "adolescentes" && adolescentesDelDia.length}
                          {counter.categoria === "simpatizantes" && simpatizantesDelDia.length}
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full bg-transparent border-gray-300"
                    onClick={() => counter.setter(Math.max(0, counter.value - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  {editingCounter === counter.key ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-16 h-8 text-center"
                        type="number"
                      />
                      <Button size="sm" onClick={saveCounterEdit} className="h-8 bg-slate-600 hover:bg-slate-700">
                        ✓
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-semibold w-8 text-center">
                        {counter.key === "simpatizantes"
                          ? totalSimpatizantes
                          : counter.miembrosDelDia
                            ? counter.value + counter.miembrosDelDia.length
                            : counter.value}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 p-0"
                        onClick={() => handleCounterEdit(counter.key, counter.value)}
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full bg-transparent border-gray-300"
                    onClick={() => counter.setter(counter.value + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ver Lista Asistentes Button */}
      {(hermanosDelDia.length > 0 ||
        hermanasDelDia.length > 0 ||
        ninosDelDia.length > 0 ||
        adolescentesDelDia.length > 0 ||
        simpatizantesDelDia.length > 0) && (
        <Button
          variant="outline"
          className="w-full bg-transparent border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl py-3"
          onClick={() => setShowAsistentesDialog(true)}
        >
          <Eye className="w-5 h-5 mr-2" />
          Ver Lista de Asistentes (
          {hermanosDelDia.length +
            hermanasDelDia.length +
            ninosDelDia.length +
            adolescentesDelDia.length +
            simpatizantesDelDia.length}
          )
        </Button>
      )}

      {/* Simpatizantes del día */}
      {simpatizantesDelDia.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Simpatizantes con Nombre ({simpatizantesDelDia.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {simpatizantesDelDia.map((simpatizante) => (
              <div key={simpatizante.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-sm">{simpatizante.nombre}</div>
                  {simpatizante.telefono && <div className="text-xs text-gray-500">{simpatizante.telefono}</div>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeSimpatizanteDelDia(simpatizante.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add Simpatizante Dialog (no longer triggered by a dedicated button) */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>Agregar Simpatizante</DialogTitle>
              <Button variant="ghost" size="sm" onClick={closeDialog}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {!showNewForm ? (
              <>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar simpatizante existente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Lista de simpatizantes existentes */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredSimpatizantes.length > 0 ? (
                    filteredSimpatizantes.map((simpatizante) => (
                      <div
                        key={simpatizante.id}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => selectExistingSimpatizante(simpatizante)}
                      >
                        <div className="font-medium text-sm">{simpatizante.nombre}</div>
                        <div className="text-xs text-gray-500">{simpatizante.telefono}</div>
                        {simpatizante.notas && <div className="text-xs text-gray-400 mt-1">{simpatizante.notas}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      {searchTerm ? "No se encontraron simpatizantes disponibles" : "No hay simpatizantes disponibles"}
                    </div>
                  )}
                </div>

                {/* Botón para agregar nuevo */}
                <div className="pt-3 border-t">
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowNewForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Nuevo Simpatizante
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Formulario para nuevo simpatizante */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre Completo *</label>
                    <Input
                      placeholder="Nombre del simpatizante"
                      value={newSimpatizante.nombre}
                      onChange={(e) => setNewSimpatizante({ ...newSimpatizante, nombre: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Teléfono</label>
                    <Input
                      placeholder="Número de teléfono"
                      value={newSimpatizante.telefono}
                      onChange={(e) => setNewSimpatizante({ ...newSimpatizante, telefono: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Notas</label>
                    <Input
                      placeholder="Notas adicionales"
                      value={newSimpatizante.notas}
                      onChange={(e) => setNewSimpatizante({ ...newSimpatizante, notas: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowNewForm(false)}>
                    Volver
                  </Button>
                  <Button
                    className="flex-1 bg-slate-600 hover:bg-slate-700"
                    onClick={addNewSimpatizante}
                    disabled={!newSimpatizante.nombre.trim()}
                  >
                    Agregar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para seleccionar miembros */}
      <Dialog open={showMiembrosDialog} onOpenChange={setShowMiembrosDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Seleccionar {categoriaSeleccionada}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getMiembrosPorCategoria(categoriaSeleccionada).map((miembro) => (
              <div
                key={miembro.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => selectMiembro(miembro, categoriaSeleccionada)}
              >
                <div className="font-medium text-sm">{miembro.nombre}</div>
                <div className="text-xs text-gray-500">{miembro.telefono}</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver lista de asistentes */}
      <Dialog open={showAsistentesDialog} onOpenChange={setShowAsistentesDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lista de Asistentes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {hermanosDelDia.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Hermanos ({hermanosDelDia.length})</h4>
                {hermanosDelDia.map((miembro) => (
                  <div key={miembro.id} className="flex items-center justify-between p-2 bg-slate-50 rounded mb-1">
                    <span className="text-sm">{miembro.nombre}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeMiembroDelDia(miembro.id, "hermanos")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {hermanasDelDia.length > 0 && (
              <div>
                <h4 className="font-semibold text-rose-700 mb-2">Hermanas ({hermanasDelDia.length})</h4>
                {hermanasDelDia.map((miembro) => (
                  <div key={miembro.id} className="flex items-center justify-between p-2 bg-rose-50 rounded mb-1">
                    <span className="text-sm">{miembro.nombre}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeMiembroDelDia(miembro.id, "hermanas")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {ninosDelDia.length > 0 && (
              <div>
                <h4 className="font-semibold text-amber-700 mb-2">Niños ({ninosDelDia.length})</h4>
                {ninosDelDia.map((miembro) => (
                  <div key={miembro.id} className="flex items-center justify-between p-2 bg-amber-50 rounded mb-1">
                    <span className="text-sm">{miembro.nombre}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeMiembroDelDia(miembro.id, "ninos")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {adolescentesDelDia.length > 0 && (
              <div>
                <h4 className="font-semibold text-purple-700 mb-2">Adolescentes ({adolescentesDelDia.length})</h4>
                {adolescentesDelDia.map((miembro) => (
                  <div key={miembro.id} className="flex items-center justify-between p-2 bg-purple-50 rounded mb-1">
                    <span className="text-sm">{miembro.nombre}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeMiembroDelDia(miembro.id, "adolescentes")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {simpatizantesDelDia.length > 0 && (
              <div>
                <h4 className="font-semibold text-emerald-700 mb-2">Simpatizantes ({simpatizantesDelDia.length})</h4>
                {simpatizantesDelDia.map((simpatizante) => (
                  <div
                    key={simpatizante.id}
                    className="flex items-center justify-between p-2 bg-emerald-50 rounded mb-1"
                  >
                    <span className="text-sm">{simpatizante.nombre}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeSimpatizanteDelDia(simpatizante.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Button */}
      <Button
        onClick={handleSaveConteo}
        className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl py-4 shadow-lg text-lg font-semibold mb-4"
      >
        <Save className="w-5 h-5 mr-2" />
        {modoConsecutivo ? "Guardar Conteo Dominical" : "Guardar Conteo de Asistencia"}
      </Button>

      {/* Dialog para continuar con dominical */}
      {showContinuarDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Servicio Dominical</h3>
              <p className="text-sm text-gray-600 mt-2">
                El conteo del evangelismo ha sido guardado. ¿Desea continuar con el conteo del servicio dominical
                manteniendo los asistentes actuales como base?
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={continuarConDominical}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Sí, Continuar con Dominical
              </Button>
              <Button
                variant="outline"
                onClick={noContinarConDominical}
                className="w-full bg-transparent rounded-xl py-3"
              >
                No, Solo Evangelismo
              </Button>
            </div>

            {datosEvangelismo && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Resumen Evangelismo:</div>
                <div className="text-sm font-medium text-gray-800">Total: {datosEvangelismo.total} asistentes</div>
                <div className="text-xs text-gray-500">
                  H: {datosEvangelismo.hermanos} | M: {datosEvangelismo.hermanas} | N: {datosEvangelismo.ninos} | A:{" "}
                  {datosEvangelismo.adolescentes} | S: {datosEvangelismo.simpatizantes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
