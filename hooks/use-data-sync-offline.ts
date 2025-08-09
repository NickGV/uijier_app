"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import localforage from "localforage"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// Función simple de encriptación (puedes usar bcrypt en producción)
const encryptPassword = (password: string): string => {
  // Usando btoa para encoding base64 simple + un salt
  const salt = "ujier_salt_2025"
  return btoa(password + salt)
}

const verifyPassword = (password: string, encryptedPassword: string): boolean => {
  const salt = "ujier_salt_2025"
  return btoa(password + salt) === encryptedPassword
}

// Lista de ujieres del sistema
const ujieresDelSistema = [
  "Wilmar Rojas",
  "Juan Caldera", 
  "Joaquin Velez",
  "Yarissa Rojas",
  "Cristian Gomez",
  "Hector Gaviria",
  "Ivan Caro",
  "Jhon echavarria",
  "Karen Cadavid",
  "Carolina Monsalve",
  "Marta Verona",
  "Nicolas Gomez Velez",
  "Oraliz Fernandez",
  "Santiago Graciano",
  "Suri Velez",
  "Wilmar Velez",
  "Diana Suarez",
  "Cristian Gomez Velez",
  "Jose Perdomo",
  "Carolina Caro",
  "Jose Abeldaño",
  "Gilberto Castaño",
]

// Función para generar usuarios con contraseñas encriptadas
const generateInitialUsuarios = () => {
  const usuarios: any[] = []

  // Admins específicos (siempre activos)
  const admins = ["Wilmar Rojas", "Nicolas Gomez Velez", "Juan Caldera", "Jose Abeldaño", "Gilberto Castaño"]

  // Generar usuarios para cada ujier - SIN auto-completar password
  ujieresDelSistema.forEach((nombre, index) => {
    const primerNombre = nombre.split(" ")[0].toLowerCase()
    
    // Normalizar caracteres especiales para la contraseña base
    const nombreParaPassword = primerNombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
      .replace(/[^a-z]/g, "") // Solo letras minúsculas

    // Password base (usuario puede cambiarlo)
    const basePassword = nombreParaPassword + "."
    
    usuarios.push({
      id: `ujier-${index + 1}`,
      nombre: nombre,
      password: encryptPassword(basePassword), // Encriptar la contraseña base
      rol: admins.includes(nombre) ? "admin" : "ujier",
      activo: true,
      fechaCreacion: "2024-01-01",
    })
  })

  return usuarios
}

const initialUsuarios = generateInitialUsuarios()

// Define initial data structures with real church data
const initialSimpatizantes = [
  {
    id: "81LGlvTNGSgoxqE0Kx1W",
    nombre: "Leidy",
    telefono: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "BNJpHFoxTQy6LPhAWjku",
    nombre: "Marissa Martinez",
    telefono: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "MhAhjQcGRsXE8HfLs5Ik",
    nombre: "Yessica",
    telefono: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "WLK59J1UnLPKSPrWkomY",
    nombre: "Oscar Isaza",
    telefono: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "Zeu5BlAXKTfILqtxj8r8",
    nombre: "Tiago Martinez",
    telefono: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "f4X4bb4eqLicslC7pHxl",
    nombre: "Sergio Peña",
    telefono: "",
    notas: "Alto",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "okrJGOuMzWyOSu7a4pEC",
    nombre: "Eugenia Delas Aguas",
    telefono: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "uZOUJvUcvZTcma2KRwce",
    nombre: "Michel",
    telefono: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
]

const initialMiembros = [
  {
    id: "YoyIh5bqpJSopkEka5EE",
    nombre: "Gilberto Castaño (Pastor)",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "XeHN6ixJ3lFmUvjgK5uc",
    nombre: "Nicolas Gomez Velez",
    telefono: "3046619628",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "wAohxiiFFqjos0jpHZ4W",
    nombre: "Wilmar Rojas",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "lPqxtQ5302Pi1FWHelEI",
    nombre: "Juan Caldera",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "pyJTumu2pXX7eVyg0tYT",
    nombre: "Juan Jose Avendaño Velez",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "r0HiJ1jd17hVoXeQNBDf",
    nombre: "Juan Monsalve",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "tCXrTwwq2a9u9eUwDChV",
    nombre: "Juan Diego Ramirez",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "uVbedU4JmWePUbmO4IX5",
    nombre: "John Fredy Ramirez",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "KNaIebAKma4QJd9JFptX",
    nombre: "Willy Hincapie",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "DTfMsn7e9ymGQdfX2ChV",
    nombre: "Wilmar Velez",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "JeqRBHvz4NiFVY7HuC5e",
    nombre: "Alejo Henao",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "es7WMnToubRLJSzYBcyL",
    nombre: "Johan Henao",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "LGfpkjraOW18oD9YC9mo",
    nombre: "Cristian Gomez Velez",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "3IEGlcwsqB1yqBlPHjRG",
    nombre: "Geraldo Restrepo",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "PKgFHpt002fxUBZbsai6",
    nombre: "Fernando Arias",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "R7GVjOfCjZfq2iDMlBLq",
    nombre: "Hector Alzate Ortiz",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "KnPcLYlHmdXwBgrQQDWr",
    nombre: "Hector Gaviria",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "LvGdq2OOoRYAt3bBJpqD",
    nombre: "Hector",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "XFu3SQoFUdvXANuywLNB",
    nombre: "Ivan Caro",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "kQTx66FErEVFmM8fcjPb",
    nombre: "Jhon Echavarria",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "5bD8JoX3cYS3hJ95qhT9",
    nombre: "Josue",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "8M8e2Df63KgIrj1beyst",
    nombre: "Yojan",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "nVUdRrKc5JtaeWYcRTxz",
    nombre: "Sebastian",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "nqEbTQumTZT37sMscWNE",
    nombre: "ESteban",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "VFNpycuZHbHMTjJCYvPD",
    nombre: "Tiberio",
    telefono: "",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  // Hermanas
  {
    id: "1ixWLDAMyPq1MPJA4vP5",
    nombre: "Marbel",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "1nA5WQSs1um7q5gagwO2",
    nombre: "Nicol Henao",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "23JHG6kRmdthU2CkZHSg",
    nombre: "Estella",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "37DTQcPNmkqbETbMRnGn",
    nombre: "Jenny",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "3y5oIeHmBUM6MR8BjWAT",
    nombre: "Jhojana Giraldo",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "8E32VtVJXbH1ENspSFep",
    nombre: "Lucia Gomez",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "ARLBVDFhXA9UF07A8WEs",
    nombre: "Nelly",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "CnN7RXWLHg33lSMWHncq",
    nombre: "Oraliz",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "DZhgs7bRHlctBcCRT98I",
    nombre: "Doris Delgado",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "DdPbzo3aGKhDqfMJmxys",
    nombre: "Evelin",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "DkscS3X0tCztEwOnuoHM",
    nombre: "Marina Parra",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "EXUdV1j3SPnWVmVV92ns",
    nombre: "Nuvia",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "FWDHVjZEvsU36DDcOSyV",
    nombre: "Carolina Monzalve",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "LKRtqrK442vqKovUh5Qj",
    nombre: "Diana Suarez",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "M2aWXuXgKguFrNQi4ZBs",
    nombre: "Catherine",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "NN56MCvLkMjw5MTdWgvw",
    nombre: "Julieth Correa",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "NNpKhD66Oko9sZVu3KYy",
    nombre: "Martha Verona",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "OUlzIbFwo0rUHZThvZbB",
    nombre: "Maria Elena",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "RkJTpRiz7dCysqNA5hTf",
    nombre: "Yariza",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "SLzfRQCyUOepuMQlnDgw",
    nombre: "Yury",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "VoRlOINtRUsCeAQ31UUC",
    nombre: "Yamile",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "WzwgpcVTK5tzrs5l5CtL",
    nombre: "Sury Maribel Velez Parra",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "Ye9svdD5Jl9KRbUn2jkO",
    nombre: "Dora Vergara",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "ZQj6CN0eYuknP6Lga2kF",
    nombre: "Karen",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "ZQliERM49b5sj1hLEUXc",
    nombre: "Clara",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "b7yd3gONKqebdJGjF1pF",
    nombre: "Lili",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "eSAK2aFf2mfpu0UE84xr",
    nombre: "Patricia",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "fDVwgfOTf5Fej5kI5Jla",
    nombre: "Diana Velez",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "fyxbQnyBQ3yuz11Qj2eg",
    nombre: "Elvia Ruiz",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "hj24uBNkrMbXLJCX2ODc",
    nombre: "Sonia Osorio",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "hrl1iBCRtlG6OahhzQ4v",
    nombre: "Beatriz Suarez",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "lukUmVuOBya2qjLxyR62",
    nombre: "Dina",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "riurM4XTNIinChGXguna",
    nombre: "Natlaia",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "q5cSOV1ygrrCkbK6sM2m",
    nombre: "Sandra",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "yR57UMEHArnNCxj7G3d9",
    nombre: "Carmen",
    telefono: "",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  // Adolescente
  {
    id: "MmV8hzAEIGuaEqWakgi3",
    nombre: "Sarai Margarita Londoño Velez",
    telefono: "",
    categoria: "adolescente",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
]

const initialHistorial = [
  {}
]

export function useDataSync() {
  // Start with empty arrays to avoid hydration issues, then load initial data
  const [simpatizantes, setSimpatizantes] = useState<any[]>([])
  const [miembros, setMiembros] = useState<any[]>([])
  const [historial, setHistorial] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<any[]>([]) // Added usuarios state
  const [isOnline, setIsOnline] = useState(false) // Start offline-first
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [pendingSync, setPendingSync] = useState<any[]>([]) // Queue for offline operations

  // Handle mounting and initialize data
  useEffect(() => {
    setIsMounted(true)
    initializeApp()
  }, [])

  // Initialize app with local data first
  const initializeApp = useCallback(async () => {
    try {
      // Load local data immediately for offline-first experience
      const localSimpatizantes = await loadLocalData("simpatizantes")
      const localMiembros = await loadLocalData("miembros") 
      const localHistorial = await loadLocalData("historial")
      const localUsuarios = await loadLocalData("usuarios") // Added usuarios loading
      const pendingSyncData = await loadLocalData("pendingSync")

      // Set data with fallbacks
      setSimpatizantes(Array.isArray(localSimpatizantes) && localSimpatizantes.length > 0 ? localSimpatizantes : initialSimpatizantes)
      setMiembros(Array.isArray(localMiembros) && localMiembros.length > 0 ? localMiembros : initialMiembros)
      setHistorial(Array.isArray(localHistorial) && localHistorial.length > 0 ? localHistorial : initialHistorial)
      setUsuarios(Array.isArray(localUsuarios) && localUsuarios.length > 0 ? localUsuarios : initialUsuarios) // Added usuarios initialization
      setPendingSync(Array.isArray(pendingSyncData) ? pendingSyncData : [])

      console.log("✅ App initialized with local data - Ready to use offline!")
      
      // Mark as ready immediately - don't wait for authentication
      setIsLoading(false)

      // Try to go online in background - don't block the app
      setTimeout(() => {
        checkOnlineStatus()
      }, 1000)
    } catch (error) {
      console.error("Error initializing app:", error)
      // If everything fails, use initial data but still make app usable
      setSimpatizantes(initialSimpatizantes)
      setMiembros(initialMiembros)
      setHistorial(initialHistorial)
      setUsuarios(initialUsuarios) // Added usuarios fallback
      setIsLoading(false) // Always set to false so app is usable
    }
  }, [])

  // Enhanced online/offline detection - runs in background, doesn't block app
  const checkOnlineStatus = useCallback(async () => {
    if (!isMounted) return

    try {
      // Check if we can actually connect to Firebase
      const online = navigator.onLine
      
      if (online) {
        console.log("🌐 Detected internet connection, trying to authenticate...")
        setIsOnline(true)
        
        // Verificar que auth esté disponible antes de intentar autenticación
        if (!auth) {
          console.warn("⚠️ Firebase auth not available, staying offline")
          setIsOnline(false)
          setIsAuthReady(false)
          setSyncError("Firebase no está configurado correctamente")
          return
        }
        
        // Try to authenticate and sync in background
        try {
          // Wait for auth state with timeout
          const authPromise = new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
              unsubscribe()
              resolve(user)
            })
          })

          const user = await Promise.race([
            authPromise,
            new Promise((_, reject) => setTimeout(() => reject(new Error("Auth timeout")), 3000))
          ])

          if (user) {
            console.log("🔐 Firebase authentication successful")
            setIsAuthReady(true)
            setSyncError(null)
            
            // Process pending sync operations
            await processPendingSync()
            // Set up real-time listeners
            setupFirebaseListeners()
          } else {
            console.log("❌ Firebase authentication failed")
            setIsAuthReady(false)
          }
        } catch (error) {
          console.log("⚠️ Auth failed, but app continues working offline:", error)
          setIsOnline(false)
          setIsAuthReady(false)
          setSyncError("No se pudo conectar con el servidor")
        }
      } else {
        console.log("📴 No internet connection detected")
        setIsOnline(false)
        setIsAuthReady(false)
      }
    } catch (error) {
      console.log("⚠️ Online check failed, staying offline:", error)
      setIsOnline(false)
      setIsAuthReady(false)
    }
  }, [isMounted])

  // Online/offline event listeners
  useEffect(() => {
    if (!isMounted) return

    const handleOnline = () => {
      console.log("Connection restored")
      checkOnlineStatus()
    }

    const handleOffline = () => {
      console.log("Connection lost, switching to offline mode")
      setIsOnline(false)
      setIsAuthReady(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isMounted, checkOnlineStatus])

  // Enhanced local storage with multiple fallbacks
  const saveLocalData = useCallback(async (key: string, data: any) => {
    if (!isMounted) return

    try {
      // Primary: IndexedDB via localforage
      await localforage.setItem(key, data)
      console.log(`✅ ${key} saved to IndexedDB`)
    } catch (error) {
      console.warn(`⚠️ IndexedDB failed for ${key}, trying localStorage:`, error)
      
      try {
        // Fallback: localStorage
        localStorage.setItem(key, JSON.stringify(data))
        localStorage.setItem(`${key}_timestamp`, Date.now().toString())
        console.log(`✅ ${key} saved to localStorage`)
      } catch (lsError) {
        console.error(`❌ All storage methods failed for ${key}:`, lsError)
      }
    }
  }, [isMounted])

  const loadLocalData = useCallback(async (key: string) => {
    if (!isMounted) return null

    try {
      // Try IndexedDB first
      const data = await localforage.getItem(key)
      if (data) {
        console.log(`📖 ${key} loaded from IndexedDB`)
        return data
      }
    } catch (error) {
      console.warn(`⚠️ IndexedDB failed for ${key}, trying localStorage:`, error)
    }

    try {
      // Fallback to localStorage
      const lsData = localStorage.getItem(key)
      if (lsData) {
        const parsedData = JSON.parse(lsData)
        console.log(`📖 ${key} loaded from localStorage`)
        return parsedData
      }
    } catch (error) {
      console.warn(`⚠️ localStorage failed for ${key}:`, error)
    }

    return null
  }, [isMounted])

  // Queue operations for later sync
  const queueOperation = useCallback(async (operation: any) => {
    const newPending = [...pendingSync, { ...operation, timestamp: Date.now() }]
    setPendingSync(newPending)
    await saveLocalData("pendingSync", newPending)
    console.log("🔄 Operation queued for sync:", operation.type)
  }, [pendingSync, saveLocalData])

  // Process pending sync operations when online
  const processPendingSync = useCallback(async () => {
    if (!isOnline || !isAuthReady || pendingSync.length === 0) return

    setIsSyncing(true)
    console.log(`🔄 Processing ${pendingSync.length} pending operations...`)

    const processedOperations: any[] = []

    for (const operation of pendingSync) {
      try {
        switch (operation.type) {
          case "addSimpatizante":
            const { id: simId, ...simData } = operation.data
            await addDoc(collection(db, "simpatizantes"), simData)
            processedOperations.push(operation)
            break

          case "updateSimpatizante":
            await updateDoc(doc(db, "simpatizantes", operation.id), operation.data)
            processedOperations.push(operation)
            break

          case "addMiembro":
            const { id: memId, ...memData } = operation.data
            await addDoc(collection(db, "miembros"), memData)
            processedOperations.push(operation)
            break

          case "updateMiembro":
            await updateDoc(doc(db, "miembros", operation.id), operation.data)
            processedOperations.push(operation)
            break

          case "saveConteo":
            const { id: conId, ...conData } = operation.data
            await addDoc(collection(db, "historial"), conData)
            processedOperations.push(operation)
            break
        }
      } catch (error) {
        console.error(`❌ Failed to sync operation:`, operation, error)
      }
    }

    // Remove processed operations
    const remainingOperations = pendingSync.filter(op => !processedOperations.includes(op))
    setPendingSync(remainingOperations)
    await saveLocalData("pendingSync", remainingOperations)

    console.log(`✅ Processed ${processedOperations.length} operations, ${remainingOperations.length} remaining`)
    setIsSyncing(false)
  }, [isOnline, isAuthReady, pendingSync, saveLocalData])

  // Setup Firebase real-time listeners
  const setupFirebaseListeners = useCallback(() => {
    if (!isAuthReady) return

    console.log("🔗 Setting up Firebase listeners...")

    const unsubscribers: (() => void)[] = []

    try {
      // Simpatizantes listener
      const unsubSimpatizantes = onSnapshot(
        query(collection(db, "simpatizantes"), orderBy("fechaRegistro", "desc")),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          if (data.length > 0) {
            setSimpatizantes(data)
            saveLocalData("simpatizantes", data)
            console.log("🔄 Simpatizantes updated from Firebase")
          }
        },
        (error) => {
          console.warn("⚠️ Simpatizantes listener error:", error)
          setSyncError("Error de conexión con simpatizantes")
        }
      )
      unsubscribers.push(unsubSimpatizantes)

      // Miembros listener
      const unsubMiembros = onSnapshot(
        query(collection(db, "miembros"), orderBy("fechaRegistro", "desc")),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          if (data.length > 0) {
            setMiembros(data)
            saveLocalData("miembros", data)
            console.log("🔄 Miembros updated from Firebase")
          }
        },
        (error) => {
          console.warn("⚠️ Miembros listener error:", error)
          setSyncError("Error de conexión con miembros")
        }
      )
      unsubscribers.push(unsubMiembros)

      // Historial listener
      const unsubHistorial = onSnapshot(
        query(collection(db, "historial"), orderBy("fecha", "desc")),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          if (data.length > 0) {
            setHistorial(data)
            saveLocalData("historial", data)
            console.log("🔄 Historial updated from Firebase")
          }
        },
        (error) => {
          console.warn("⚠️ Historial listener error:", error)
          setSyncError("Error de conexión con historial")
        }
      )
      unsubscribers.push(unsubHistorial)

      // Usuarios listener - solo sincronizar desde Firebase, no subir automáticamente
      const unsubUsuarios = onSnapshot(
        collection(db, "usuarios"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          if (data.length > 0) {
            setUsuarios(data)
            saveLocalData("usuarios", data)
            console.log("🔄 Usuarios updated from Firebase")
          } else {
            console.log("📭 No hay usuarios en Firebase - manteniendo locales")
          }
        },
        (error) => {
          console.warn("⚠️ Usuarios listener error:", error)
          setSyncError("Error de conexión con usuarios")
        }
      )
      unsubscribers.push(unsubUsuarios)

      // Cleanup function
      return () => {
        unsubscribers.forEach(unsub => unsub())
      }
    } catch (error) {
      console.error("❌ Error setting up listeners:", error)
    }
  }, [isAuthReady, saveLocalData])

  // Data operations - always work offline immediately
  const addSimpatizante = useCallback(async (newSimpatizanteData: any) => {
    const tempId = Date.now().toString()
    const simpatizanteCompleto = {
      ...newSimpatizanteData,
      id: tempId,
      fechaRegistro: new Date().toISOString().split("T")[0],
    }

    // ALWAYS update local state immediately - no conditions
    const updatedSimpatizantes = [...simpatizantes, simpatizanteCompleto]
    setSimpatizantes(updatedSimpatizantes)
    
    // Save locally immediately
    try {
      await saveLocalData("simpatizantes", updatedSimpatizantes)
      console.log("✅ Simpatizante added locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync (always queue regardless of online status)
    try {
      await queueOperation({ type: "addSimpatizante", data: simpatizanteCompleto })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }

    // If we're online AND authenticated, try to sync immediately as bonus
    if (isOnline && isAuthReady) {
      try {
        const { id, ...dataToSave } = simpatizanteCompleto
        await addDoc(collection(db, "simpatizantes"), dataToSave)
        console.log("🔄 Simpatizante synced to Firebase immediately")
      } catch (error) {
        console.warn("⚠️ Immediate sync failed, but already queued for later:", error)
      }
    }

    return simpatizanteCompleto
  }, [simpatizantes, saveLocalData, isOnline, isAuthReady, queueOperation])

  const updateSimpatizante = useCallback(async (id: string, updatedData: any) => {
    // ALWAYS update local state immediately - no conditions
    const updatedSimpatizantes = simpatizantes.map((s) => 
      s.id === id ? { ...s, ...updatedData } : s
    )
    setSimpatizantes(updatedSimpatizantes)
    
    // Save locally immediately
    try {
      await saveLocalData("simpatizantes", updatedSimpatizantes)
      console.log("✅ Simpatizante updated locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync (always queue)
    try {
      await queueOperation({ type: "updateSimpatizante", id, data: updatedData })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }

    // If online and authenticated, try immediate sync
    if (isOnline && isAuthReady) {
      try {
        await updateDoc(doc(db, "simpatizantes", id), updatedData)
        console.log("🔄 Simpatizante update synced to Firebase immediately")
      } catch (error) {
        console.warn("⚠️ Immediate sync failed, but already queued for later:", error)
      }
    }
  }, [simpatizantes, saveLocalData, isOnline, isAuthReady, queueOperation])

  const addMiembro = useCallback(async (newMiembroData: any) => {
    const tempId = Date.now().toString()
    const miembroCompleto = {
      ...newMiembroData,
      id: tempId,
      fechaRegistro: new Date().toISOString().split("T")[0],
    }

    // ALWAYS update local state immediately - no conditions
    const updatedMiembros = [...miembros, miembroCompleto]
    setMiembros(updatedMiembros)
    
    // Save locally immediately
    try {
      await saveLocalData("miembros", updatedMiembros)
      console.log("✅ Miembro added locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync (always queue)
    try {
      await queueOperation({ type: "addMiembro", data: miembroCompleto })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }

    // If online and authenticated, try immediate sync
    if (isOnline && isAuthReady) {
      try {
        const { id, ...dataToSave } = miembroCompleto
        await addDoc(collection(db, "miembros"), dataToSave)
        console.log("🔄 Miembro synced to Firebase immediately")
      } catch (error) {
        console.warn("⚠️ Immediate sync failed, but already queued for later:", error)
      }
    }

    return miembroCompleto
  }, [miembros, saveLocalData, isOnline, isAuthReady, queueOperation])

  const updateMiembro = useCallback(async (id: string, updatedData: any) => {
    // ALWAYS update local state immediately - no conditions
    const updatedMiembros = miembros.map((m) => 
      m.id === id ? { ...m, ...updatedData } : m
    )
    setMiembros(updatedMiembros)
    
    // Save locally immediately
    try {
      await saveLocalData("miembros", updatedMiembros)
      console.log("✅ Miembro updated locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync (always queue)
    try {
      await queueOperation({ type: "updateMiembro", id, data: updatedData })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }

    // If online and authenticated, try immediate sync
    if (isOnline && isAuthReady) {
      try {
        await updateDoc(doc(db, "miembros", id), updatedData)
        console.log("🔄 Miembro update synced to Firebase immediately")
      } catch (error) {
        console.warn("⚠️ Immediate sync failed, but already queued for later:", error)
      }
    }
  }, [miembros, saveLocalData, isOnline, isAuthReady, queueOperation])

  const saveConteo = useCallback(async (conteoData: any) => {
    const tempId = Date.now().toString()
    const nuevoRegistro = {
      ...conteoData,
      id: tempId,
      total: conteoData.hermanos + conteoData.hermanas + conteoData.ninos + conteoData.adolescentes + conteoData.simpatizantes,
    }

    // ALWAYS update local state immediately - no conditions
    const updatedHistorial = [nuevoRegistro, ...historial]
    setHistorial(updatedHistorial)
    
    // Save locally immediately
    try {
      await saveLocalData("historial", updatedHistorial)
      console.log("✅ Conteo saved locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync (always queue)
    try {
      await queueOperation({ type: "saveConteo", data: nuevoRegistro })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }

    // If online and authenticated, try immediate sync
    if (isOnline && isAuthReady) {
      try {
        const { id, ...dataToSave } = nuevoRegistro
        await addDoc(collection(db, "historial"), dataToSave)
        console.log("🔄 Conteo synced to Firebase immediately")
      } catch (error) {
        console.warn("⚠️ Immediate sync failed, but already queued for later:", error)
      }
    }

    return nuevoRegistro
  }, [historial, saveLocalData, isOnline, isAuthReady, queueOperation])

  // User management functions
  const addUsuario = useCallback(async (newUsuarioData: any) => {
    const tempId = Date.now().toString()
    const usuarioCompleto = {
      ...newUsuarioData,
      id: tempId,
      password: encryptPassword(newUsuarioData.password), // Encriptar password
      fechaCreacion: new Date().toISOString().split("T")[0],
      activo: true,
    }

    // Update local state immediately
    const updatedUsuarios = [...usuarios, usuarioCompleto]
    setUsuarios(updatedUsuarios)
    
    try {
      await saveLocalData("usuarios", updatedUsuarios)
      console.log("✅ Usuario added locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync
    try {
      await queueOperation({ type: "addUsuario", data: usuarioCompleto })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }

    return usuarioCompleto
  }, [usuarios, saveLocalData, queueOperation])

  const updateUsuario = useCallback(async (id: string, updatedData: any) => {
    // Si se está actualizando la password, encriptarla
    if (updatedData.password) {
      updatedData.password = encryptPassword(updatedData.password)
    }

    // Los admins siempre deben mantenerse activos
    const usuario = usuarios.find((u) => u.id === id)
    if (usuario?.rol === "admin" && updatedData.hasOwnProperty("activo")) {
      updatedData.activo = true
    }

    const updatedUsuarios = usuarios.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
    setUsuarios(updatedUsuarios)
    
    try {
      await saveLocalData("usuarios", updatedUsuarios)
      console.log("✅ Usuario updated locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync
    try {
      await queueOperation({ type: "updateUsuario", id, data: updatedData })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }
  }, [usuarios, saveLocalData, queueOperation])

  const deleteUsuario = useCallback(async (id: string) => {
    // No permitir eliminar admins
    const usuario = usuarios.find((u) => u.id === id)
    if (usuario?.rol === "admin") {
      console.log("No se puede eliminar un administrador")
      return
    }

    const updatedUsuarios = usuarios.filter((u) => u.id !== id)
    setUsuarios(updatedUsuarios)
    
    try {
      await saveLocalData("usuarios", updatedUsuarios)
      console.log("✅ Usuario deleted locally (offline mode)")
    } catch (error) {
      console.error("❌ Failed to save locally:", error)
    }

    // Queue for sync
    try {
      await queueOperation({ type: "deleteUsuario", id })
    } catch (error) {
      console.error("❌ Failed to queue operation:", error)
    }
  }, [usuarios, saveLocalData, queueOperation])

  // Authentication function with encrypted password verification
  const authenticateUser = useCallback((nombre: string, password: string) => {
    console.log("=== DEBUG AUTENTICACIÓN ENCRIPTADA ===")
    console.log("Nombre ingresado:", `"${nombre}"`)
    console.log("Password ingresado:", `"${password}"`)
    
    // Buscar usuario por nombre exacto (case-sensitive)
    const user = usuarios.find((u) => {
      const nombreMatch = u.nombre === nombre
      const passwordMatch = verifyPassword(password, u.password) // Verificar password encriptado
      console.log(`Comparando con ${u.nombre}:`, { nombreMatch, passwordMatch })
      return nombreMatch && passwordMatch
    })

    console.log("Usuario encontrado:", user)
    console.log("=== FIN DEBUG ===")

    if (!user) {
      return { success: false, message: "Credenciales incorrectas" }
    }
    if (!user.activo && user.rol !== "admin") {
      return { success: false, message: "Usuario desactivado. Contacte al administrador." }
    }
    return { success: true, user }
  }, [usuarios])

  return {
    simpatizantes: simpatizantes || [],
    miembros: miembros || [],
    historial: historial || [],
    usuarios: usuarios || [], // Added usuarios
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
    isAuthReady,
    pendingSyncCount: pendingSync.length,
  }
}
