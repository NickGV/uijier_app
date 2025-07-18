"use client"

import { useState } from "react"
import { ConteoScreen } from "@/components/conteo-screen"
import { HistorialScreen } from "@/components/historial-screen"
import { SimpatizantesScreen } from "@/components/simpatizantes-screen"
import { SimpatizanteDetailScreen } from "@/components/simpatizante-detail-screen"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AdminPasswordInput } from "@/components/admin-password-input"
import { Lock } from "lucide-react"

// Estado inicial de simpatizantes
const initialSimpatizantes = [
  {
    id: 1,
    nombre: "Ana López",
    telefono: "+34 612 345 678",
    notas: "Interesada en estudios bíblicos",
    fechaRegistro: "2024-01-07",
  },
  {
    id: 2,
    nombre: "Carlos Mendoza",
    telefono: "+34 623 456 789",
    notas: "Vino con su familia",
    fechaRegistro: "2024-01-03",
  },
  {
    id: 3,
    nombre: "María Fernández",
    telefono: "+34 634 567 890",
    notas: "Primera visita",
    fechaRegistro: "2023-12-31",
  },
  {
    id: 4,
    nombre: "José Ramírez",
    telefono: "+34 645 678 901",
    notas: "Conoce a hermano Pedro",
    fechaRegistro: "2023-12-24",
  },
  {
    id: 5,
    nombre: "Laura Sánchez",
    telefono: "+34 656 789 012",
    notas: "Interesada en bautismo",
    fechaRegistro: "2023-12-20",
  },
]

// Historial inicial con simpatizantes específicos
const initialHistorial = [
  {
    id: 1,
    fecha: "2024-01-07",
    servicio: "Dominical",
    ujier: "Wilmar Rojas",
    hermanos: 45,
    hermanas: 52,
    ninos: 18,
    adolescentes: 12,
    simpatizantes: 2,
    total: 129,
    simpatizantesAsistieron: [
      { id: 1, nombre: "Ana López" },
      { id: 2, nombre: "Carlos Mendoza" },
    ],
  },
  {
    id: 2,
    fecha: "2024-01-03",
    servicio: "Oración y Enseñanza",
    ujier: "Juan Caldera",
    hermanos: 32,
    hermanas: 38,
    ninos: 8,
    adolescentes: 6,
    simpatizantes: 1,
    total: 85,
    simpatizantesAsistieron: [{ id: 3, nombre: "María Fernández" }],
  },
  {
    id: 3,
    fecha: "2023-12-31",
    servicio: "Dominical",
    ujier: "Joaquin Velez",
    hermanos: 48,
    hermanas: 55,
    ninos: 22,
    adolescentes: 15,
    simpatizantes: 3,
    total: 143,
    simpatizantesAsistieron: [
      { id: 1, nombre: "Ana López" },
      { id: 4, nombre: "José Ramírez" },
      { id: 5, nombre: "Laura Sánchez" },
    ],
  },
]

export default function UjierApp() {
  const [currentScreen, setCurrentScreen] = useState("conteo")
  const [selectedSimpatizante, setSelectedSimpatizante] = useState<any>(null)
  const [simpatizantes, setSimpatizantes] = useState(initialSimpatizantes)
  const [historial, setHistorial] = useState(initialHistorial)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)

  const addSimpatizante = (nuevoSimpatizante: any) => {
    const newId = Math.max(...simpatizantes.map((s) => s.id)) + 1
    const simpatizanteCompleto = {
      ...nuevoSimpatizante,
      id: newId,
      fechaRegistro: new Date().toISOString().split("T")[0],
    }
    setSimpatizantes((prev) => [...prev, simpatizanteCompleto])
    return simpatizanteCompleto
  }

  const updateSimpatizante = (id: number, datosActualizados: any) => {
    setSimpatizantes((prev) => prev.map((s) => (s.id === id ? { ...s, ...datosActualizados } : s)))
  }

  const saveConteo = (conteoData: any) => {
    const newId = Math.max(...historial.map((h) => h.id), 0) + 1
    const nuevoRegistro = {
      ...conteoData,
      id: newId,
      total:
        conteoData.hermanos +
        conteoData.hermanas +
        conteoData.ninos +
        conteoData.adolescentes +
        conteoData.simpatizantes,
    }
    setHistorial((prev) => [nuevoRegistro, ...prev])
  }

  const handleScreenChange = (screen: string) => {
    if (screen === "historial" && !isAdminAuthenticated) {
      setShowAdminDialog(true)
      return
    }
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "conteo":
        return (
          <ConteoScreen simpatizantes={simpatizantes} onAddSimpatizante={addSimpatizante} onSaveConteo={saveConteo} />
        )
      case "historial":
        return <HistorialScreen historial={historial} />
      case "simpatizantes":
        return (
          <SimpatizantesScreen
            simpatizantes={simpatizantes}
            onSelectSimpatizante={setSelectedSimpatizante}
            onAddSimpatizante={addSimpatizante}
          />
        )
      case "simpatizante-detail":
        return (
          <SimpatizanteDetailScreen
            simpatizante={selectedSimpatizante}
            onBack={() => setCurrentScreen("simpatizantes")}
            onUpdateSimpatizante={updateSimpatizante}
          />
        )
      default:
        return (
          <ConteoScreen simpatizantes={simpatizantes} onAddSimpatizante={addSimpatizante} onSaveConteo={saveConteo} />
        )
    }
  }

  const handleSimpatizanteSelect = (simpatizante: any) => {
    setSelectedSimpatizante(simpatizante)
    setCurrentScreen("simpatizante-detail")
  }

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen">
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 pb-20">
          {currentScreen === "simpatizantes" ? (
            <SimpatizantesScreen
              simpatizantes={simpatizantes}
              onSelectSimpatizante={handleSimpatizanteSelect}
              onAddSimpatizante={addSimpatizante}
            />
          ) : (
            renderScreen()
          )}
        </div>
        {currentScreen !== "simpatizante-detail" && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-50">
            <BottomNavigation
              currentScreen={currentScreen}
              onScreenChange={handleScreenChange}
              isAdminAuthenticated={isAdminAuthenticated}
            />
          </div>
        )}
      </div>
      {/* Admin Dialog */}
      {showAdminDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Acceso de Administrador</h3>
              <p className="text-sm text-gray-600 mt-2">Ingrese la clave para acceder al historial</p>
            </div>

            <AdminPasswordInput
              onSuccess={() => {
                setIsAdminAuthenticated(true)
                setShowAdminDialog(false)
                setCurrentScreen("historial")
              }}
              onCancel={() => setShowAdminDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
