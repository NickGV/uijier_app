"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface AdminPasswordInputProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AdminPasswordInput({ onSuccess, onCancel }: AdminPasswordInputProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const ADMIN_PASSWORD = "admin123" // Puedes cambiar esta clave

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      onSuccess()
      setError("")
    } else {
      setError("Clave incorrecta")
      setPassword("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Clave de administrador"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-10"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button
          onClick={handleLogin}
          className="flex-1 bg-slate-600 hover:bg-slate-700 text-white"
          disabled={!password.trim()}
        >
          Acceder
        </Button>
      </div>
    </div>
  )
}
