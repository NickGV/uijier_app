"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import localforage from "localforage"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// Define initial data structures for fallback and type safety
const initialSimpatizantes = [
  {
    id: "1",
    nombre: "Ana López",
    telefono: "+34 612 345 678",
    notas: "Interesada en estudios bíblicos",
    fechaRegistro: "2024-01-07",
  },
  {
    id: "2",
    nombre: "Carlos Mendoza",
    telefono: "+34 623 456 789",
    notas: "Vino con su familia",
    fechaRegistro: "2024-01-03",
  },
  {
    id: "3",
    nombre: "María Fernández",
    telefono: "+34 634 567 890",
    notas: "Primera visita",
    fechaRegistro: "2023-12-31",
  },
  {
    id: "4",
    nombre: "José Ramírez",
    telefono: "+34 645 678 901",
    notas: "Conoce a hermano Pedro",
    fechaRegistro: "2023-12-24",
  },
  {
    id: "5",
    nombre: "Laura Sánchez",
    telefono: "+34 656 789 012",
    notas: "Interesada en bautismo",
    fechaRegistro: "2023-12-20",
  },
]

const initialMiembros = [
  {
    id: "1",
    nombre: "Pedro González",
    telefono: "+34 611 111 111",
    categoria: "hermano",
    fechaRegistro: "2023-01-15",
    notas: "Líder de grupo",
  },
  {
    id: "2",
    nombre: "María Rodríguez",
    telefono: "+34 622 222 222",
    categoria: "hermana",
    fechaRegistro: "2023-02-20",
    notas: "Ministerio de alabanza",
  },
  {
    id: "3",
    nombre: "Luis Martínez",
    telefono: "+34 633 333 333",
    categoria: "hermano",
    fechaRegistro: "2023-03-10",
    notas: "Ujier principal",
  },
  {
    id: "4",
    nombre: "Carmen Silva",
    telefono: "+34 644 444 444",
    categoria: "hermana",
    fechaRegistro: "2023-04-05",
    notas: "Ministerio infantil",
  },
  {
    id: "5",
    nombre: "Sofía Pérez",
    telefono: "+34 655 555 555",
    categoria: "nino",
    fechaRegistro: "2023-05-12",
    notas: "8 años",
  },
  {
    id: "6",
    nombre: "Diego López",
    telefono: "+34 666 666 666",
    categoria: "adolescente",
    fechaRegistro: "2023-06-18",
    notas: "15 años, grupo de jóvenes",
  },
]

const initialHistorial = [
  {
    id: "1",
    fecha: "2024-01-07",
    servicio: "Dominical",
    ujier: "Wilmar Rojas",
    hermanos: 45,
    hermanas: 52,
    ninos: 18,
    adolescentes: 12,
    simpatizantes: 2,
    total: 129,
    simpatizantesAsistieron: [
      { id: "1", nombre: "Ana López" },
      { id: "2", nombre: "Carlos Mendoza" },
    ],
    miembrosAsistieron: {
      hermanos: [],
      hermanas: [],
      ninos: [],
      adolescentes: [],
    },
  },
  {
    id: "2",
    fecha: "2024-01-03",
    servicio: "Oración y Enseñanza",
    ujier: "Juan Caldera",
    hermanos: 32,
    hermanas: 38,
    ninos: 8,
    adolescentes: 6,
    simpatizantes: 1,
    total: 85,
    simpatizantesAsistieron: [{ id: "3", nombre: "María Fernández" }],
    miembrosAsistieron: {
      hermanos: [],
      hermanas: [],
      ninos: [],
      adolescentes: [],
    },
  },
  {
    id: "3",
    fecha: "2023-12-31",
    servicio: "Dominical",
    ujier: "Joaquin Velez",
    hermanos: 48,
    hermanas: 55,
    ninos: 22,
    adolescentes: 15,
    simpatizantes: 3,
    total: 143,
    simpatizantesAsistieron: [
      { id: "1", nombre: "Ana López" },
      { id: "4", nombre: "José Ramírez" },
      { id: "5", nombre: "Laura Sánchez" },
    ],
    miembrosAsistieron: {
      hermanos: [],
      hermanas: [],
      ninos: [],
      adolescentes: [],
    },
  },
]

export function useDataSync() {
  const [simpatizantes, setSimpatizantes] = useState<any[]>(initialSimpatizantes)
  const [miembros, setMiembros] = useState<any[]>(initialMiembros)
  const [historial, setHistorial] = useState<any[]>(initialHistorial)
  const [isOnline, setIsOnline] = useState(true) // Default to true for SSR
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthReady, setIsAuthReady] = useState(false)

  // Initialize online status only in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine)
      
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)
      
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
      
      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  // --- Local Storage (IndexedDB with localforage) ---
  const saveLocalData = useCallback(async (key: string, data: any) => {
    if (typeof window === "undefined") return // Skip during SSR
    
    try {
      await localforage.setItem(key, data)
      console.log(`Data for ${key} saved locally.`)
    } catch (error) {
      console.error(`Error saving ${key} to local storage:`, error)
    }
  }, [])

  const loadLocalData = useCallback(async (key: string) => {
    if (typeof window === "undefined") return null // Skip during SSR
    
    try {
      const data = await localforage.getItem(key)
      console.log(`Data for ${key} loaded from local storage.`)
      return data
    } catch (error) {
      console.error(`Error loading ${key} from local storage:`, error)
      return null
    }
  }, [])

  // Auth state listener
  useEffect(() => {
    if (typeof window === "undefined") return // Skip during SSR
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "signed in" : "signed out")
      setIsAuthReady(true)
    })

    return () => unsubscribe()
  }, [])

  // Load initial data
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const loadData = async () => {
      try {
        // Load from local storage first
        const localSimpatizantes = await loadLocalData("simpatizantes")
        const localMiembros = await loadLocalData("miembros")
        const localHistorial = await loadLocalData("historial")

        if (localSimpatizantes) setSimpatizantes(localSimpatizantes)
        if (localMiembros) setMiembros(localMiembros)
        if (localHistorial) setHistorial(localHistorial)

        setIsLoading(false)

        // Then try to sync with Firebase if online and auth is ready
        if (isOnline && isAuthReady) {
          await syncWithFirebase()
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
        setIsLoading(false)
      }
    }

    if (isAuthReady) {
      loadData()
    }
  }, [isAuthReady, isOnline, loadLocalData])

  // --- Firebase Synchronization ---
  const syncCollection = useCallback(
    async (collectionName: string, localData: any[], setLocalData: (data: any[]) => void) => {
      setIsSyncing(true)
      setSyncError(null)
      try {
        const colRef = collection(db, collectionName)
        const q = query(colRef, orderBy("fechaRegistro", "desc")) // Assuming a timestamp for ordering

        // Fetch data from Firebase
        const snapshot = await getDocs(q)
        const firebaseData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

        // Simple conflict resolution: Firebase data takes precedence for existing items,
        // but local new items are added.
        const mergedDataMap = new Map(firebaseData.map((item) => [item.id, item]))

        for (const localItem of localData) {
          if (!mergedDataMap.has(localItem.id)) {
            // If local item is not in Firebase, it's a new local item, add it to Firebase
            const { id, ...dataWithoutId } = localItem
            await addDoc(colRef, dataWithoutId) // Firestore generates new ID
            console.log(`Added new local item to Firebase: ${collectionName}/${localItem.id}`)
          }
          // For existing items, Firebase data is already in mergedDataMap
        }

        // Update local state with merged data (Firebase + newly added local items)
        const updatedSnapshot = await getDocs(q) // Re-fetch to get newly added items with Firebase IDs
        const finalData = updatedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setLocalData(finalData)
        await saveLocalData(collectionName, finalData) // Save merged data back to local storage

        console.log(`Collection ${collectionName} synchronized with Firebase.`)
      } catch (error) {
        console.error(`Error syncing ${collectionName} with Firebase:`, error)
        setSyncError(`Error al sincronizar ${collectionName}.`)
      } finally {
        setIsSyncing(false)
      }
    },
    [saveLocalData],
  )

  /* NEW – wait for anonymous auth to finish before loading any Firestore data */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setIsAuthReady(true)
    })
    return () => unsub()
  }, [])

  // Initial data load and setup listeners
  useEffect(() => {
    if (!isAuthReady) return

    const loadAndSync = async () => {
      setIsLoading(true)
      // Load from local storage first for immediate access
      const loadedSimpatizantes = await loadLocalData("simpatizantes", initialSimpatizantes)
      const loadedMiembros = await loadLocalData("miembros", initialMiembros)
      const loadedHistorial = await loadLocalData("historial", initialHistorial)

      setSimpatizantes(loadedSimpatizantes)
      setMiembros(loadedMiembros)
      setHistorial(loadedHistorial)

      // Set up real-time listeners for Firebase
      const unsubSimpatizantes = onSnapshot(
        collection(db, "simpatizantes"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setSimpatizantes(data)
          saveLocalData("simpatizantes", data)
        },
        (error) => {
          console.error("Error listening to simpatizantes:", error)
          setSyncError("Error de conexión con simpatizantes.")
        },
      )

      const unsubMiembros = onSnapshot(
        collection(db, "miembros"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setMiembros(data)
          saveLocalData("miembros", data)
        },
        (error) => {
          console.error("Error listening to miembros:", error)
          setSyncError("Error de conexión con miembros.")
        },
      )

      const unsubHistorial = onSnapshot(
        query(collection(db, "historial"), orderBy("fecha", "desc")),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          setHistorial(data)
          saveLocalData("historial", data)
        },
        (error) => {
          console.error("Error listening to historial:", error)
          setSyncError("Error de conexión con historial.")
        },
      )

      setIsLoading(false)

      return () => {
        unsubSimpatizantes()
        unsubMiembros()
        unsubHistorial()
      }
    }

    loadAndSync()

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      console.log("App is online. Attempting to sync data...")
      // Trigger a sync when coming online
      syncCollection("simpatizantes", simpatizantes, setSimpatizantes)
      syncCollection("miembros", miembros, setMiembros)
      syncCollection("historial", historial, setHistorial)
    }
    const handleOffline = () => {
      setIsOnline(false)
      console.log("App is offline. Data will be saved locally.")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isAuthReady, loadLocalData, saveLocalData, syncCollection]) // Dependencies for useEffect

  // --- Data Operations (to be called from components) ---

  const addSimpatizante = useCallback(
    async (newSimpatizanteData: any) => {
      const tempId = Date.now().toString() // Temporary ID for local state
      const simpatizanteCompleto = {
        ...newSimpatizanteData,
        id: tempId,
        fechaRegistro: new Date().toISOString().split("T")[0],
      }
      setSimpatizantes((prev) => [...prev, simpatizanteCompleto])
      await saveLocalData("simpatizantes", [...simpatizantes, simpatianteCompleto])

      try {
        // Extract id before sending to Firestore
        const { id, ...dataToSave } = simpatizanteCompleto
        const docRef = await addDoc(collection(db, "simpatizantes"), dataToSave)
        console.log("Simpatizante added to Firebase with ID:", docRef.id)
        // Firestore listener will update local state with the real ID
      } catch (error) {
        console.error("Error adding simpatizante to Firebase:", error)
        setSyncError("Error al agregar simpatizante a Firebase.")
      }
      return simpatizanteCompleto // Return the locally added item
    },
    [simpatizantes, saveLocalData],
  )

  const updateSimpatizante = useCallback(
    async (id: string, updatedData: any) => {
      setSimpatizantes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)))
      await saveLocalData(
        "simpatizantes",
        simpatizantes.map((s) => (s.id === id ? { ...s, ...updatedData } : s)),
      )

      try {
        await updateDoc(doc(db, "simpatizantes", id), updatedData)
        console.log("Simpatizante updated in Firebase:", id)
      } catch (error) {
        console.error("Error updating simpatizante in Firebase:", error)
        setSyncError("Error al actualizar simpatizante en Firebase.")
      }
    },
    [simpatizantes, saveLocalData],
  )

  const addMiembro = useCallback(
    async (newMiembroData: any) => {
      const tempId = Date.now().toString() // Temporary ID for local state
      const miembroCompleto = {
        ...newMiembroData,
        id: tempId,
        fechaRegistro: new Date().toISOString().split("T")[0],
      }
      setMiembros((prev) => [...prev, miembroCompleto])
      await saveLocalData("miembros", [...miembros, miembroCompleto])

      try {
        // Extract id before sending to Firestore
        const { id, ...dataToSave } = miembroCompleto
        const docRef = await addDoc(collection(db, "miembros"), dataToSave)
        console.log("Miembro added to Firebase with ID:", docRef.id)
      } catch (error) {
        console.error("Error adding miembro to Firebase:", error)
        setSyncError("Error al agregar miembro a Firebase.")
      }
      return miembroCompleto
    },
    [miembros, saveLocalData],
  )

  const updateMiembro = useCallback(
    async (id: string, updatedData: any) => {
      setMiembros((prev) => prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m)))
      await saveLocalData(
        "miembros",
        miembros.map((m) => (m.id === id ? { ...m, ...updatedData } : m)),
      )

      try {
        await updateDoc(doc(db, "miembros", id), updatedData)
        console.log("Miembro updated in Firebase:", id)
      } catch (error) {
        console.error("Error updating miembro in Firebase:", error)
        setSyncError("Error al actualizar miembro en Firebase.")
      }
    },
    [miembros, saveLocalData],
  )

  const saveConteo = useCallback(
    async (conteoData: any) => {
      const tempId = Date.now().toString() // Temporary ID for local state
      const nuevoRegistro = {
        ...conteoData,
        id: tempId,
        total:
          conteoData.hermanos +
          conteoData.hermanas +
          conteoData.ninos +
          conteoData.adolescentes +
          conteoData.simpatizantes,
      }
      setHistorial((prev) => [nuevoRegistro, ...prev])
      await saveLocalData("historial", [nuevoRegistro, ...historial])

      try {
        // Extract id before sending to Firestore
        const { id, ...dataToSave } = nuevoRegistro
        const docRef = await addDoc(collection(db, "historial"), dataToSave)
        console.log("Conteo saved to Firebase with ID:", docRef.id)
      } catch (error) {
        console.error("Error saving conteo to Firebase:", error)
        setSyncError("Error al guardar conteo en Firebase.")
      }
    },
    [historial, saveLocalData],
  )

  return {
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
    isAuthReady,
  }
}
