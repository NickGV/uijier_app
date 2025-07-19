"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import localforage from "localforage"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// Define initial data structures for fallback and type safety
export function useDataSync() {
  // Initialize with empty arrays to avoid hydration mismatch
  const [simpatizantes, setSimpatizantes] = useState<any[]>([])
  const [miembros, setMiembros] = useState<any[]>([])
  const [historial, setHistorial] = useState<any[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
    // Only set initial data after mounting to avoid hydration mismatch
  }, [])

  // Initialize online status only in browser
  useEffect(() => {
    if (!isMounted) return

    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [isMounted])

  // --- Local Storage (IndexedDB with localforage) ---
  const saveLocalData = useCallback(async (key: string, data: any) => {
    if (!isMounted) return
    
    try {
      await localforage.setItem(key, data)
      console.log(`Data for ${key} saved locally.`)
    } catch (error) {
      console.error(`Error saving ${key} to local storage:`, error)
    }
  }, [isMounted])

  const loadLocalData = useCallback(async (key: string) => {
    if (!isMounted) return null
    
    try {
      const data = await localforage.getItem(key)
      console.log(`Data for ${key} loaded from local storage.`)
      return data
    } catch (error) {
      console.error(`Error loading ${key} from local storage:`, error)
      return null
    }
  }, [isMounted])

  // Firebase sync function
  const syncWithFirebase = useCallback(async () => {
    if (!isAuthReady || !isOnline || !isMounted) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      // Sync simpatizantes
      const simpatizantesSnapshot = await getDocs(
        query(collection(db, "simpatizantes"), orderBy("fechaRegistro", "desc"))
      )
      const simpatizantesData = simpatizantesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sync miembros
      const miembrosSnapshot = await getDocs(
        query(collection(db, "miembros"), orderBy("fechaRegistro", "desc"))
      )
      const miembrosData = miembrosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Sync historial
      const historialSnapshot = await getDocs(
        query(collection(db, "historial"), orderBy("fecha", "desc"))
      )
      const historialData = historialSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Update state with Firebase data if we have data
      if (simpatizantesData.length > 0) {
        setSimpatizantes(simpatizantesData)
        await saveLocalData("simpatizantes", simpatizantesData)
      }
      
      if (miembrosData.length > 0) {
        setMiembros(miembrosData)
        await saveLocalData("miembros", miembrosData)
      }
      
      if (historialData.length > 0) {
        setHistorial(historialData)
        await saveLocalData("historial", historialData)
      }

      console.log("Firebase sync completed successfully")
    } catch (error) {
      console.error("Error syncing with Firebase:", error)
      setSyncError("Error syncing with Firebase")
    } finally {
      setIsSyncing(false)
    }
  }, [isAuthReady, isOnline, isMounted, saveLocalData])

  // Auth state listener
  useEffect(() => {
    if (!isMounted) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "signed in" : "signed out")
      setIsAuthReady(!!user)
    })

    return () => unsubscribe()
  }, [isMounted])

  // Load initial data
  useEffect(() => {
    if (!isMounted) return

    const loadData = async () => {
      try {
        // Load from local storage first
        const localSimpatizantes = await loadLocalData("simpatizantes")
        const localMiembros = await loadLocalData("miembros")
        const localHistorial = await loadLocalData("historial")

        // Update with local data if available and is array
        if (Array.isArray(localSimpatizantes) && localSimpatizantes.length > 0) {
          setSimpatizantes(localSimpatizantes)
        }
        if (Array.isArray(localMiembros) && localMiembros.length > 0) {
          setMiembros(localMiembros)
        }
        if (Array.isArray(localHistorial) && localHistorial.length > 0) {
          setHistorial(localHistorial)
        }

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
    } else {
      // Set loading to false after timeout if auth doesn't initialize
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isAuthReady, isOnline, isMounted, loadLocalData, syncWithFirebase])

  // Set up real-time listeners
  useEffect(() => {
    if (!isAuthReady || !isMounted) return

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
          }
        },
        (error) => {
          console.error("Error listening to simpatizantes:", error)
          setSyncError("Error de conexión con simpatizantes.")
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
          }
        },
        (error) => {
          console.error("Error listening to miembros:", error)
          setSyncError("Error de conexión con miembros.")
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
          }
        },
        (error) => {
          console.error("Error listening to historial:", error)
          setSyncError("Error de conexión con historial.")
        }
      )
      unsubscribers.push(unsubHistorial)
    } catch (error) {
      console.error("Error setting up listeners:", error)
    }

    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [isAuthReady, isMounted, saveLocalData])

  // --- Data Operations ---
  const addSimpatizante = useCallback(async (newSimpatizanteData: any) => {
    if (!isMounted) return

    const tempId = Date.now().toString()
    const simpatizanteCompleto = {
      ...newSimpatizanteData,
      id: tempId,
      fechaRegistro: new Date().toISOString().split("T")[0],
    }
    
    const updatedSimpatizantes = [...simpatizantes, simpatizanteCompleto]
    setSimpatizantes(updatedSimpatizantes)
    await saveLocalData("simpatizantes", updatedSimpatizantes)

    try {
      if (isOnline && isAuthReady) {
        const { id, ...dataToSave } = simpatizanteCompleto
        const docRef = await addDoc(collection(db, "simpatizantes"), dataToSave)
        console.log("Simpatizante added to Firebase with ID:", docRef.id)
      }
    } catch (error) {
      console.error("Error adding simpatizante to Firebase:", error)
      setSyncError("Error al agregar simpatizante a Firebase.")
    }
    
    return simpatizanteCompleto
  }, [simpatizantes, saveLocalData, isOnline, isAuthReady, isMounted])

  const updateSimpatizante = useCallback(async (id: string, updatedData: any) => {
    if (!isMounted) return

    const updatedSimpatizantes = simpatizantes.map((s) => 
      s.id === id ? { ...s, ...updatedData } : s
    )
    setSimpatizantes(updatedSimpatizantes)
    await saveLocalData("simpatizantes", updatedSimpatizantes)

    try {
      if (isOnline && isAuthReady) {
        await updateDoc(doc(db, "simpatizantes", id), updatedData)
        console.log("Simpatizante updated in Firebase:", id)
      }
    } catch (error) {
      console.error("Error updating simpatizante in Firebase:", error)
      setSyncError("Error al actualizar simpatizante en Firebase.")
    }
  }, [simpatizantes, saveLocalData, isOnline, isAuthReady, isMounted])

  const addMiembro = useCallback(async (newMiembroData: any) => {
    if (!isMounted) return

    const tempId = Date.now().toString()
    const miembroCompleto = {
      ...newMiembroData,
      id: tempId,
      fechaRegistro: new Date().toISOString().split("T")[0],
    }
    
    const updatedMiembros = [...miembros, miembroCompleto]
    setMiembros(updatedMiembros)
    await saveLocalData("miembros", updatedMiembros)

    try {
      if (isOnline && isAuthReady) {
        const { id, ...dataToSave } = miembroCompleto
        const docRef = await addDoc(collection(db, "miembros"), dataToSave)
        console.log("Miembro added to Firebase with ID:", docRef.id)
      }
    } catch (error) {
      console.error("Error adding miembro to Firebase:", error)
      setSyncError("Error al agregar miembro a Firebase.")
    }
    
    return miembroCompleto
  }, [miembros, saveLocalData, isOnline, isAuthReady, isMounted])

  const updateMiembro = useCallback(async (id: string, updatedData: any) => {
    if (!isMounted) return

    const updatedMiembros = miembros.map((m) => 
      m.id === id ? { ...m, ...updatedData } : m
    )
    setMiembros(updatedMiembros)
    await saveLocalData("miembros", updatedMiembros)

    try {
      if (isOnline && isAuthReady) {
        await updateDoc(doc(db, "miembros", id), updatedData)
        console.log("Miembro updated in Firebase:", id)
      }
    } catch (error) {
      console.error("Error updating miembro in Firebase:", error)
      setSyncError("Error al actualizar miembro en Firebase.")
    }
  }, [miembros, saveLocalData, isOnline, isAuthReady, isMounted])

  const saveConteo = useCallback(async (conteoData: any) => {
    if (!isMounted) return

    const tempId = Date.now().toString()
    const nuevoRegistro = {
      ...conteoData,
      id: tempId,
      total: conteoData.hermanos + conteoData.hermanas + conteoData.ninos + conteoData.adolescentes + conteoData.simpatizantes,
    }
    
    const updatedHistorial = [nuevoRegistro, ...historial]
    setHistorial(updatedHistorial)
    await saveLocalData("historial", updatedHistorial)

    try {
      if (isOnline && isAuthReady) {
        const { id, ...dataToSave } = nuevoRegistro
        const docRef = await addDoc(collection(db, "historial"), dataToSave)
        console.log("Conteo saved to Firebase with ID:", docRef.id)
      }
    } catch (error) {
      console.error("Error saving conteo to Firebase:", error)
      setSyncError("Error al guardar conteo en Firebase.")
    }
  }, [historial, saveLocalData, isOnline, isAuthReady, isMounted])

  return {
    simpatizantes: simpatizantes || [],
    miembros: miembros || [],
    historial: historial || [],
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
