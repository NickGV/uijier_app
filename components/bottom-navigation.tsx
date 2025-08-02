"use client"

import { Button } from "@/components/ui/button"
import { Calculator, Users, UserCheck, Clock, Settings, BarChart3, LogOut } from "lucide-react"

interface BottomNavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
  currentUser: any
  onLogout: () => void
}

export function BottomNavigation({ currentScreen, onScreenChange, currentUser, onLogout }: BottomNavigationProps) {
  // Navegación para administradores
  const adminNavItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "conteo", label: "Conteo", icon: Calculator },
    { id: "simpatizantes", label: "Simpatizantes", icon: Users },
    { id: "miembros", label: "Miembros", icon: UserCheck },
    { id: "historial", label: "Historial", icon: Clock },
  ]

  // Navegación para ujieres
  const ujierNavItems = [
    { id: "conteo", label: "Conteo", icon: Calculator },
    { id: "simpatizantes", label: "Simpatizantes", icon: Users },
  ]

  const navItems = currentUser?.rol === "admin" ? adminNavItems : ujierNavItems

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
      {/* User Info Bar */}
      <div className="px-2 sm:px-4 py-1 sm:py-2 border-b border-gray-100 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{currentUser?.nombre?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-800 truncate max-w-24 sm:max-w-none">
                {currentUser?.nombre}
              </div>
              <div className="text-xs text-gray-500 capitalize">{currentUser?.rol}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-1 h-6 w-6 sm:h-8 sm:w-8"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-1 sm:p-2">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentScreen === item.id

            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex flex-col items-center gap-0.5 sm:gap-1 h-auto py-1.5 sm:py-2 px-1 sm:px-3 min-w-0 flex-1 ${
                  isActive ? "text-slate-700 bg-slate-100" : "text-gray-600 hover:text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => onScreenChange(item.id)}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-700" : "text-gray-600"}`} />
                <span className={`text-xs font-medium ${isActive ? "text-slate-700" : "text-gray-600"} truncate`}>
                  {item.label}
                </span>
              </Button>
            )
          })}

          {/* Settings button for admin */}
          {currentUser?.rol === "admin" && (
            <Button
              variant="ghost"
              className={`flex flex-col items-center gap-0.5 sm:gap-1 h-auto py-1.5 sm:py-2 px-1 sm:px-3 min-w-0 flex-1 ${
                currentScreen === "ujieres"
                  ? "text-slate-700 bg-slate-100"
                  : "text-gray-600 hover:text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => onScreenChange("ujieres")}
            >
              <Settings className={`w-4 h-4 ${currentScreen === "ujieres" ? "text-slate-700" : "text-gray-600"}`} />
              <span
                className={`text-xs font-medium ${currentScreen === "ujieres" ? "text-slate-700" : "text-gray-600"} truncate`}
              >
                Usuarios
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
