"use client"

import { Button } from "@/components/ui/button"
import { Calculator, Users, UserCheck, Clock, Settings, LogOut, Home } from "lucide-react"

interface BottomNavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
  currentUser: any
  onLogout: () => void
}

export function BottomNavigation({ currentScreen, onScreenChange, currentUser, onLogout }: BottomNavigationProps) {
  const adminNavItems = [
    { id: "dashboard", label: "Inicio", icon: Home, description: "Panel principal" },
    { id: "conteo", label: "Conteo", icon: Calculator, description: "Registrar asistencia" },
    { id: "simpatizantes", label: "Simpatizantes", icon: Users, description: "Gestionar visitantes" },
    { id: "miembros", label: "Miembros", icon: UserCheck, description: "Gestionar miembros" },
    { id: "historial", label: "Historial", icon: Clock, description: "Ver registros" },
    { id: "ujieres", label: "Usuarios", icon: Settings, description: "Gestionar usuarios" },
  ]

  const directivaNavItems = [
    { id: "dashboard", label: "Inicio", icon: Home, description: "Panel principal" },
    { id: "conteo", label: "Conteo", icon: Calculator, description: "Registrar asistencia" },
    { id: "simpatizantes", label: "Simpatizantes", icon: Users, description: "Gestionar visitantes" },
    { id: "historial", label: "Historial", icon: Clock, description: "Ver registros" },
    { id: "ujieres", label: "Usuarios", icon: Settings, description: "Ver usuarios" },
  ]

  const ujierNavItems = [
    { id: "conteo", label: "Conteo", icon: Calculator, description: "Registrar asistencia" },
    { id: "simpatizantes", label: "Simpatizantes", icon: Users, description: "Gestionar visitantes" },
  ]

  const getNavItems = () => {
    switch (currentUser?.rol) {
      case "admin":
        return adminNavItems
      case "directiva":
        return directivaNavItems
      case "ujier":
        return ujierNavItems
      default:
        return ujierNavItems
    }
  }

  const navItems = getNavItems()

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case "admin":
        return "bg-red-50 text-red-700 border-red-200"
      case "directiva":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-green-50 text-green-700 border-green-200"
    }
  }

  const getRoleLabel = (rol: string) => {
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
    <div className="bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm bg-white/95">
      {/* User Info */}
      <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{currentUser?.nombre?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-900">{currentUser?.nombre}</div>
              <div className={`text-xs px-1.5 py-0.5 rounded-full border ${getRoleColor(currentUser?.rol)}`}>
                {getRoleLabel(currentUser?.rol)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1"
            title="Cerrar sesión"
          >
            <LogOut className="w-3 h-3" />
            <span className="ml-1 text-xs">Salir</span>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentScreen === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex-1 flex flex-col items-center gap-1 h-14 rounded-none border-r border-gray-100 last:border-r-0 ${
                isActive
                  ? "text-gray-900 bg-gray-100 border-t-2 border-t-gray-900"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => onScreenChange(item.id)}
              title={item.description}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
