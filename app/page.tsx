"use client"

import { useState } from "react"
import { ConteoScreen } from "@/components/conteo-screen"
import { HistorialScreen } from "@/components/historial-screen"
import { SimpatizantesScreen } from "@/components/simpatizantes-screen"
import { SimpatizanteDetailScreen } from "@/components/simpatizante-detail-screen"
import { MiembrosScreen } from "@/components/miembros-screen"
import { MiembroDetailScreen } from "@/components/miembro-detail-screen"
import { LoginScreen } from "@/components/login-screen"
import { DashboardScreen } from "@/components/dashboard-screen"
import { UjieresScreen } from "@/components/ujieres-screen"
import { UjierDetailScreen } from "@/components/ujier-detail-screen"
import { BottomNavigation } from "@/components/bottom-navigation"
import { WifiOff, Cloud, CheckCircle, XCircle } from "lucide-react"
import { useDataSync } from "@/hooks/use-data-sync"

export default function UjierApp() {
  const {
    simpatizantes,
    miembros,
    historial,
    usuarios,
    addSimpatizante,
    updateSimpatizante,
    addMiembro,
    updateMiembro,
    saveConteo,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    authenticateUser,
    isOnline,
    isSyncing,
    syncError,
    isLoading,
  } = useDataSync()

  // Authentication state
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Navigation state
  const [currentScreen, setCurrentScreen] = useState("dashboard")
  const [selectedSimpatizante, setSelectedSimpatizante] = useState<any>(null)
  const [selectedMiembro, setSelectedMiembro] = useState<any>(null)
  const [selectedUsuario, setSelectedUsuario] = useState<any>(null)

  // --- Estado del Conteo (levantado a app/page.tsx) ---
  const [hermanos, setHermanos] = useState(0)
  const [hermanas, setHermanas] = useState(0)
  const [ninos, setNinos] = useState(0)
  const [adolescentes, setAdolescentes] = useState(0)
  const [simpatizantesCount, setSimpatizantesCount] = useState(0)
  const [simpatizantesDelDia, setSimpatizantesDelDia] = useState<any[]>([])
  const [hermanosDelDia, setHermanosDelDia] = useState<any[]>([])
  const [hermanasDelDia, setHermanasDelDia] = useState<any[]>([])
  const [ninosDelDia, setNinosDelDia] = useState<any[]>([])
  const [adolescentesDelDia, setAdolescentesDelDia] = useState<any[]>([])
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0])
  const [tipoServicio, setTipoServicio] = useState("dominical")
  const [ujierSeleccionado, setUjierSeleccionado] = useState("")
  const [ujierPersonalizado, setUjierPersonalizado] = useState("")
  const [modoConsecutivo, setModoConsecutivo] = useState(false)
  const [datosServicioBase, setDatosServicioBase] = useState<any>(null)

  // Resetear el formulario de conteo
  const resetConteoForm = () => {
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
    setModoConsecutivo(false)
    setDatosServicioBase(null)
  }

  const handleLogin = (user: any) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
    // Set initial screen based on role
    setCurrentScreen(user.rol === "admin" ? "dashboard" : "conteo")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    setCurrentScreen("dashboard")
    // Reset all state
    resetConteoForm()
    setSelectedSimpatizante(null)
    setSelectedMiembro(null)
    setSelectedUsuario(null)
  }

  const handleScreenChange = (screen: string) => {
    // Check permissions
    if (currentUser?.rol === "ujier" && !["conteo", "simpatizantes"].includes(screen)) {
      return // Ujier can only access conteo and simpatizantes
    }
    setCurrentScreen(screen)
  }

  const renderScreen = () => {
    if (!isAuthenticated) {
      return <LoginScreen usuarios={usuarios} onLogin={handleLogin} onAuthenticate={authenticateUser} />
    }

    switch (currentScreen) {
      case "dashboard":
        return currentUser?.rol === "admin" ? (
          <DashboardScreen
            historial={historial}
            simpatizantes={simpatizantes}
            miembros={miembros}
            usuarios={usuarios}
            currentUser={currentUser}
            onNavigate={handleScreenChange}
          />
        ) : (
          <ConteoScreen
            simpatizantes={simpatizantes}
            miembros={miembros}
            onAddSimpatizante={addSimpatizante}
            onAddMiembro={addMiembro}
            onSaveConteo={saveConteo}
            hermanos={hermanos}
            setHermanos={setHermanos}
            hermanas={hermanas}
            setHermanas={setHermanas}
            ninos={ninos}
            setNinos={setNinos}
            adolescentes={adolescentes}
            setAdolescentes={setAdolescentes}
            simpatizantesCount={simpatizantesCount}
            setSimpatizantesCount={setSimpatizantesCount}
            simpatizantesDelDia={simpatizantesDelDia}
            setSimpatizantesDelDia={setSimpatizantesDelDia}
            hermanosDelDia={hermanosDelDia}
            setHermanosDelDia={setHermanosDelDia}
            hermanasDelDia={hermanasDelDia}
            setHermanasDelDia={setHermanasDelDia}
            ninosDelDia={ninosDelDia}
            setNinosDelDia={setNinosDelDia}
            adolescentesDelDia={adolescentesDelDia}
            setAdolescentesDelDia={setAdolescentesDelDia}
            fecha={fecha}
            setFecha={setFecha}
            tipoServicio={tipoServicio}
            setTipoServicio={setTipoServicio}
            ujierSeleccionado={ujierSeleccionado}
            setUjierSeleccionado={setUjierSeleccionado}
            ujierPersonalizado={ujierPersonalizado}
            setUjierPersonalizado={setUjierPersonalizado}
            modoConsecutivo={modoConsecutivo}
            setModoConsecutivo={setModoConsecutivo}
            datosServicioBase={datosServicioBase}
            setDatosServicioBase={setDatosServicioBase}
            resetConteoForm={resetConteoForm}
          />
        )
      case "conteo":
        return (
          <ConteoScreen
            simpatizantes={simpatizantes}
            miembros={miembros}
            onAddSimpatizante={addSimpatizante}
            onAddMiembro={addMiembro}
            onSaveConteo={saveConteo}
            hermanos={hermanos}
            setHermanos={setHermanos}
            hermanas={hermanas}
            setHermanas={setHermanas}
            ninos={ninos}
            setNinos={setNinos}
            adolescentes={adolescentes}
            setAdolescentes={setAdolescentes}
            simpatizantesCount={simpatizantesCount}
            setSimpatizantesCount={setSimpatizantesCount}
            simpatizantesDelDia={simpatizantesDelDia}
            setSimpatizantesDelDia={setSimpatizantesDelDia}
            hermanosDelDia={hermanosDelDia}
            setHermanosDelDia={setHermanosDelDia}
            hermanasDelDia={hermanasDelDia}
            setHermanasDelDia={setHermanasDelDia}
            ninosDelDia={ninosDelDia}
            setNinosDelDia={setNinosDelDia}
            adolescentesDelDia={adolescentesDelDia}
            setAdolescentesDelDia={setAdolescentesDelDia}
            fecha={fecha}
            setFecha={setFecha}
            tipoServicio={tipoServicio}
            setTipoServicio={setTipoServicio}
            ujierSeleccionado={ujierSeleccionado}
            setUjierSeleccionado={setUjierSeleccionado}
            ujierPersonalizado={ujierPersonalizado}
            setUjierPersonalizado={setUjierPersonalizado}
            modoConsecutivo={modoConsecutivo}
            setModoConsecutivo={setModoConsecutivo}
            datosServicioBase={datosServicioBase}
            setDatosServicioBase={setDatosServicioBase}
            resetConteoForm={resetConteoForm}
          />
        )
      case "historial":
        return <HistorialScreen historial={historial} />
      case "simpatizantes":
        return (
          <SimpatizantesScreen
            simpatizantes={simpatizantes}
            onSelectSimpatizante={handleSimpatizanteSelect}
            onAddSimpatizante={addSimpatizante}
          />
        )
      case "miembros":
        return <MiembrosScreen miembros={miembros} onSelectMiembro={handleMiembroSelect} onAddMiembro={addMiembro} />
      case "ujieres":
        return (
          <UjieresScreen
            usuarios={usuarios}
            onSelectUsuario={handleUsuarioSelect}
            onAddUsuario={addUsuario}
            onUpdateUsuario={updateUsuario}
            currentUser={currentUser}
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
      case "miembro-detail":
        return (
          <MiembroDetailScreen
            miembro={selectedMiembro}
            onBack={() => setCurrentScreen("miembros")}
            onUpdateMiembro={updateMiembro}
          />
        )
      case "ujier-detail":
        return (
          <UjierDetailScreen
            usuario={selectedUsuario}
            onBack={() => setCurrentScreen("ujieres")}
            onUpdateUsuario={updateUsuario}
          />
        )
      default:
        return currentUser?.rol === "admin" ? (
          <DashboardScreen
            historial={historial}
            simpatizantes={simpatizantes}
            miembros={miembros}
            usuarios={usuarios}
            currentUser={currentUser}
            onNavigate={handleScreenChange}
          />
        ) : (
          <ConteoScreen
            simpatizantes={simpatizantes}
            miembros={miembros}
            onAddSimpatizante={addSimpatizante}
            onAddMiembro={addMiembro}
            onSaveConteo={saveConteo}
            hermanos={hermanos}
            setHermanos={setHermanos}
            hermanas={hermanas}
            setHermanas={setHermanas}
            ninos={ninos}
            setNinos={setNinos}
            adolescentes={adolescentes}
            setAdolescentes={setAdolescentes}
            simpatizantesCount={simpatizantesCount}
            setSimpatizantesCount={setSimpatizantesCount}
            simpatizantesDelDia={simpatizantesDelDia}
            setSimpatizantesDelDia={setSimpatizantesDelDia}
            hermanosDelDia={hermanosDelDia}
            setHermanosDelDia={setHermanosDelDia}
            hermanasDelDia={hermanasDelDia}
            setHermanasDelDia={setHermanasDelDia}
            ninosDelDia={ninosDelDia}
            setNinosDelDia={setNinosDelDia}
            adolescentesDelDia={adolescentesDelDia}
            setAdolescentesDelDia={setAdolescentesDelDia}
            fecha={fecha}
            setFecha={setFecha}
            tipoServicio={tipoServicio}
            setTipoServicio={setTipoServicio}
            ujierSeleccionado={ujierSeleccionado}
            setUjierSeleccionado={setUjierSeleccionado}
            ujierPersonalizado={ujierPersonalizado}
            setUjierPersonalizado={setUjierPersonalizado}
            modoConsecutivo={modoConsecutivo}
            setModoConsecutivo={setModoConsecutivo}
            datosServicioBase={datosServicioBase}
            setDatosServicioBase={setDatosServicioBase}
            resetConteoForm={resetConteoForm}
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

  const handleUsuarioSelect = (usuario: any) => {
    setSelectedUsuario(usuario)
    setCurrentScreen("ujier-detail")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
        <div className="text-center text-gray-600">
          <Cloud className="w-12 h-12 mx-auto animate-pulse text-slate-500" />
          <p className="mt-4 text-lg font-semibold">Cargando datos...</p>
          <p className="text-sm text-gray-500">Esto puede tardar un momento.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return renderScreen()
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-gradient-to-b from-slate-50 to-gray-100 min-h-screen">
      {/* Sync Status Indicator */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white/90 backdrop-blur-sm p-1 sm:p-2 text-center text-xs text-gray-600 flex items-center justify-center gap-1 sm:gap-2 shadow-sm z-50">
        {isOnline ? (
          isSyncing ? (
            <>
              <Cloud className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse text-blue-500" />
              <span className="text-blue-600 text-xs">Sincronizando...</span>
            </>
          ) : syncError ? (
            <>
              <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
              <span className="text-red-600 text-xs">Error de sincronización</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
              <span className="text-green-600 text-xs">Online y sincronizado</span>
            </>
          )
        ) : (
          <>
            <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
            <span className="text-orange-600 text-xs">Offline (guardando localmente)</span>
          </>
        )}
      </div>

       <div className="flex flex-col min-h-screen pt-8 sm:pt-10">
        <div className="flex-1 pb-24 sm:pb-32 safe-area-bottom">{renderScreen()}</div>
        {!["simpatizante-detail", "miembro-detail", "ujier-detail"].includes(currentScreen) && (
          <div className="fixed bottom-0 left-0 right-0 w-full max-w-sm z-20 safe-area-bottom">
            <BottomNavigation
              currentScreen={currentScreen}
              onScreenChange={handleScreenChange}
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>
    </div>
  )
}
