"use client"

import { Button } from "@/components/ui/button"
import { Calculator, Clock, Users } from "lucide-react"

interface BottomNavigationProps {
  currentScreen: string
  onScreenChange: (screen: string) => void
}

export function BottomNavigation({ currentScreen, onScreenChange }: BottomNavigationProps) {
  const navItems = [
    { id: "conteo", label: "Conteo", icon: Calculator },
    { id: "historial", label: "Historial", icon: Clock },
    { id: "simpatizantes", label: "Simpatizantes", icon: Users },
  ]

  return (
    <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-2">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentScreen === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-4 ${
                isActive ? "text-slate-700 bg-slate-100" : "text-gray-600 hover:text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => onScreenChange(item.id)}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-slate-700" : "text-gray-600"}`} />
              <span className={`text-xs font-medium ${isActive ? "text-slate-700" : "text-gray-600"}`}>
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
