"use client"

import { useState } from "react"
import { ConteoScreen } from "@/components/conteo-screen"
import { HistorialScreen } from "@/components/historial-screen"
import { SimpatizantesScreen } from "@/components/simpatizantes-screen"
import { SimpatizanteDetailScreen } from "@/components/simpatizante-detail-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function UjierApp() {
  const [currentScreen, setCurrentScreen] = useState("conteo")
  const [selectedSimpatizante, setSelectedSimpatizante] = useState<any>(null)

  const renderScreen = () => {
    switch (currentScreen) {
      case "conteo":
        return <ConteoScreen />
      case "historial":
        return <HistorialScreen />
      case "simpatizantes":
        return <SimpatizantesScreen onSelectSimpatizante={setSelectedSimpatizante} />
      case "simpatizante-detail":
        return (
          <SimpatizanteDetailScreen
            simpatizante={selectedSimpatizante}
            onBack={() => setCurrentScreen("simpatizantes")}
          />
        )
      default:
        return <ConteoScreen />
    }
  }

  const handleSimpatizanteSelect = (simpatizante: any) => {
    setSelectedSimpatizante(simpatizante)
    setCurrentScreen("simpatizante-detail")
  }

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-blue-50 to-green-50 min-h-screen">
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          {currentScreen === "simpatizantes" ? (
            <SimpatizantesScreen onSelectSimpatizante={handleSimpatizanteSelect} />
          ) : (
            renderScreen()
          )}
        </div>
        {currentScreen !== "simpatizante-detail" && (
          <BottomNavigation currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
        )}
      </div>
    </div>
  )
}
