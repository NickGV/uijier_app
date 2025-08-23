"use client"

import { useState, useEffect } from "react"
import { ConteoScreen } from "@/components/conteo-screen"
import { HistorialScreen } from "@/components/historial-screen"
import { SimpatizantesScreen } from "@/components/simpatizantes-screen"
import { SimpatizanteDetailScreen } from "@/components/simpatizante-detail-screen"
import { MiembrosScreen } from "@/components/miembros-screen"
import { MiembroDetailScreen } from "@/components/miembro-detail-screen"
import { BottomNavigation } from "@/components/bottom-navigation"
import { AdminPasswordInput } from "@/components/admin-password-input"
import { Lock, WifiOff, Cloud, CheckCircle, XCircle } from "lucide-react"
import { useDataSync } from "@/hooks/use-data-sync-offline" // Updated import

export default function UjierApp() {
  const {
    simpatizantes,
    miembros,
    historial,
    addSimpatizante,
    updateSimpatizante,
    addMiembro,
    updateMiembro,
    saveConteo,
    isOnline,
    isSyncing,
    syncError,
    isLoading,
    pendingSyncCount,
  } = useDataSync() // Use the offline-first data sync hook

  const [currentScreen, setCurrentScreen] = useState("conteo")
  const [selectedSimpatizante, setSelectedSimpatizante] = useState<any>(null)
  const [selectedMiembro, setSelectedMiembro] = useState<any>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [requestedScreen, setRequestedScreen] = useState("")

  // Register service worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)
        })
        .catch((registrationError) => {
          console.log('Service Worker registration failed:', registrationError)
        })
    }
  }, [])

  const handleScreenChange = (screen: string) => {
    if ((screen === "historial" || screen === "miembros") && !isAdminAuthenticated) {
      setRequestedScreen(screen)
      setShowAdminDialog(true)
      return
    }
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "conteo":
        return (
          <ConteoScreen
            simpatizantes={simpatizantes}
            miembros={miembros}
            onAddSimpatizante={addSimpatizante}
            onAddMiembro={addMiembro}
            onSaveConteo={saveConteo}
          />
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
      case "miembros":
        return <MiembrosScreen miembros={miembros} onSelectMiembro={setSelectedMiembro} onAddMiembro={addMiembro} />
      case "simpatizante-detail":
        return (
          <SimpatizanteDetailScreen
            simpatizante={selectedSimpatizante}
            onBack={() => setCurrentScreen("simpatizantes")}
            onUpdateSimpatizante={updateSimpatizante}
          />
        )
      case "miembro-detail":
        return (
          <MiembroDetailScreen
            miembro={selectedMiembro}
            onBack={() => setCurrentScreen("miembros")}
            onUpdateMiembro={updateMiembro}
          />
        )
      default:
        return (
          <ConteoScreen
            simpatizantes={simpatizantes}
            miembros={miembros}
            onAddSimpatizante={addSimpatizante}
            onAddMiembro={addMiembro}
            onSaveConteo={saveConteo}
          />
        )
    }
  }

  const handleSimpatizanteSelect = (simpatizante: any) => {
    setSelectedSimpatizante(simpatizante)
    setCurrentScreen("simpatizante-detail")
  }

  const handleMiembroSelect = (miembro: any) => {
    setSelectedMiembro(miembro)
    setCurrentScreen("miembro-detail")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
        <div className="text-center text-gray-600 p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
            <Cloud className="w-8 h-8 animate-pulse text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Inicializando Ujier App</h2>
          <p className="text-sm text-gray-500 mb-4">Cargando datos locales...</p>
          <div className="flex items-center justify-center gap-2 text-xs">
            <WifiOff className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600">Funciona sin internet</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen">
      {/* Sync Status Indicator */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white/90 backdrop-blur-sm p-2 text-center text-xs text-gray-600 flex items-center justify-center gap-2 shadow-sm z-50">
        {isOnline ? (
          isSyncing ? (
            <>
              <Cloud className="w-4 h-4 animate-pulse text-blue-500" />
              <span className="text-blue-600">Sincronizando...</span>
            </>
          ) : syncError ? (
            <>
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Error de sincronización</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Online y sincronizado</span>
            </>
          )
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-orange-500" />
            <span className="text-orange-600">
              Offline - Funciona sin internet
              {pendingSyncCount > 0 && ` (${pendingSyncCount} pendientes)`}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col min-h-screen pt-10">
        {" "}
        {/* Add padding-top to account for status bar */}
        <div className="flex-1 pb-20">
          {currentScreen === "simpatizantes" ? (
            <SimpatizantesScreen
              simpatizantes={simpatizantes}
              onSelectSimpatizante={handleSimpatizanteSelect}
              onAddSimpatizante={addSimpatizante}
            />
          ) : currentScreen === "miembros" ? (
            <MiembrosScreen miembros={miembros} onSelectMiembro={handleMiembroSelect} onAddMiembro={addMiembro} />
          ) : (
            renderScreen()
          )}
        </div>
        {currentScreen !== "simpatizante-detail" && currentScreen !== "miembro-detail" && (
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
              <p className="text-sm text-gray-600 mt-2">Ingrese la clave para acceder a esta sección</p>
            </div>

            <AdminPasswordInput
              onSuccess={() => {
                setIsAdminAuthenticated(true)
                setShowAdminDialog(false)
                setCurrentScreen(requestedScreen)
                setRequestedScreen("")
              }}
              onCancel={() => {
                setShowAdminDialog(false)
                setRequestedScreen("")
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
