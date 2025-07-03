"use client"

import { Button } from "@/components/ui/button"
import { Calculator, Clock, Users, Lock } from "lucide-react"

interface BottomNavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
  isAdminAuthenticated: boolean
}

export function BottomNavigation({ currentScreen, onScreenChange, isAdminAuthenticated }: BottomNavigationProps) {
  const navItems = [
    { id: "conteo", label: "Conteo", icon: Calculator },
    {
      id: "historial",
      label: "Historial",
      icon: isAdminAuthenticated ? Clock : Lock,
      requiresAuth: true,
    },
    { id: "simpatizantes", label: "Simpatizantes", icon: Users },
  ]

  return (
    <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-2 shadow-lg">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentScreen === item.id
          const isLocked = item.requiresAuth && !isAdminAuthenticated

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
                isActive
                  ? "text-slate-700 bg-slate-100"
                  : isLocked
                    ? "text-gray-400"
                    : "text-gray-600 hover:text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => onScreenChange(item.id)}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-slate-700" : isLocked ? "text-gray-400" : "text-gray-600"}`}
              />
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-slate-700" : isLocked ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
              {isLocked && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
