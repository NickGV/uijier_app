"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LogIn, User, Lock, Eye, EyeOff, AlertCircle, ChevronDown } from "lucide-react"

interface LoginScreenProps {
  usuarios: any[]
  onLogin: (user: any) => void
  onAuthenticate: (nombre: string, password: string) => { success: boolean; message?: string; user?: any }
}

export function LoginScreen({ usuarios, onLogin, onAuthenticate }: LoginScreenProps) {
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showUserList, setShowUserList] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Solo usuarios activos para el autocompletado, pero los admins siempre están disponibles
  const usuariosDisponibles = usuarios.filter((u) => u.activo || u.rol === "admin")

  // Debug: mostrar usuarios disponibles en consola
  useEffect(() => {
    console.log(
      "Usuarios disponibles:",
      usuariosDisponibles.map((u) => ({ nombre: u.nombre, password: u.password, rol: u.rol, activo: u.activo })),
    )
  }, [usuariosDisponibles])

  const handleLogin = async () => {
    if (!nombre.trim() || !password.trim()) {
      setError("Por favor complete todos los campos")
      return
    }

    setIsLoading(true)
    setError("")

    console.log("Intentando login con:", { nombre: nombre.trim(), password: password.trim() })

    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      const result = onAuthenticate(nombre.trim(), password.trim())
      console.log("Resultado de autenticación:", result)

      if (result.success) {
        onLogin(result.user)
      } else {
        setError(result.message || "Error de autenticación")
      }
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  const handleNombreSelect = (selectedNombre: string) => {
    setNombre(selectedNombre)
    setPassword("")
    setError("")
    setShowUserList(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNombre(value)
    setShowUserList(value.length > 0)
    setError("") // Limpiar error al escribir
  }

  const handleInputFocus = () => {
    if (nombre.length > 0 || usuariosDisponibles.length > 0) {
      setShowUserList(true)
    }
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowUserList(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredUsuarios = usuariosDisponibles.filter((u) => u.nombre.toLowerCase().includes(nombre.toLowerCase()))

  // Mostrar todos los usuarios disponibles si no hay texto de búsqueda
  const usuariosAMostrar = nombre.length === 0 ? usuariosDisponibles : filteredUsuarios

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 flex items-start justify-center p-2 sm:p-4 pt-4 sm:pt-8">
      <div className="w-full max-w-xs sm:max-w-sm space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Bienvenido</h1>
          <p className="text-gray-600 text-xs sm:text-sm">Sistema de Conteo de Asistencia</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 text-center">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            {/* Nombre Field */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre
              </label>
              <div className="relative">
                <Input
                  ref={inputRef}
                  placeholder="Escriba o seleccione su nombre"
                  value={nombre}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="h-10 sm:h-12 pr-10 text-sm sm:text-base"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowUserList(!showUserList)}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showUserList ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {/* User List Dropdown */}
              {showUserList && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-64 overflow-y-auto">
                  {usuariosAMostrar.length > 0 ? (
                    usuariosAMostrar.map((usuario) => (
                      <div
                        key={usuario.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => handleNombreSelect(usuario.nombre)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800 flex items-center gap-2">
                              {usuario.nombre}
                              {usuario.nombre === "admin" && <span className="text-yellow-500">⭐</span>}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                usuario.rol === "admin"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                              }`}
                            >
                              {usuario.rol}
                            </Badge>
                            {!usuario.activo && usuario.rol !== "admin" && (
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                Inactivo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">No se encontraron usuarios</div>
                  )}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-10 sm:h-12 pr-12 text-sm sm:text-base"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={isLoading || !nombre.trim() || !password.trim()}
              className="w-full h-10 sm:h-12 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold rounded-xl shadow-lg text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">¿Problemas para acceder? Contacte al administrador</p>
          <p className="text-xs text-gray-400 mt-1">Admin de emergencia: admin / admin123</p>
        </div>

        {/* Stats */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-slate-700">{usuariosDisponibles.length}</div>
                <div className="text-xs text-gray-500">Usuarios Disponibles</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-700">
                  {usuariosDisponibles.filter((u) => u.rol === "admin").length}
                </div>
                <div className="text-xs text-gray-500">Administradores</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
