"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import localforage from "localforage"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// ...existing initial data...

export function useDataSync() {
  const [simpatizantes, setSimpatizantes] = useState<any[]>(initialSimpatizantes || [])
  const [miembros, setMiembros] = useState<any[]>(initialMiembros || [])
  const [historial, setHistorial] = useState<any[]>(initialHistorial || [])
  const [isOnline, setIsOnline] = useState(true)
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

  // Local Storage functions
  const saveLocalData = useCallback(async (key: string, data: any) => {
    if (typeof window === "undefined") return
    
    try {
      await localforage.setItem(key, data)
      console.log(`Data for ${key} saved locally.`)
    } catch (error) {
      console.error(`Error saving ${key} to local storage:`, error)
    }
  }, [])

  const loadLocalData = useCallback(async (key: string) => {
    if (typeof window === "undefined") return null
    
    try {
      const data = await localforage.getItem(key)
      console.log(`Data for ${key} loaded from local storage.`)
      return data
    } catch (error) {
      console.error(`Error loading ${key} from local storage:`, error)
      return null
    }
  }, [])

  // MISSING FUNCTION: syncWithFirebase
  const syncWithFirebase = useCallback(async () => {
    if (!isAuthReady || !isOnline) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      // Sync simpatizantes
      const simpatizantesSnapshot = await getDocs(
        query(collection(db, "simpatizantes"), orderBy("createdAt", "desc"))
      )
      const simpatizantesData = simpatizantesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sync miembros
      const miembrosSnapshot = await getDocs(
        query(collection(db, "miembros"), orderBy("createdAt", "desc"))
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

      // Update state with Firebase data
      setSimpatizantes(simpatizantesData)
      setMiembros(miembrosData)
      setHistorial(historialData)

      // Save to local storage
      await saveLocalData("simpatizantes", simpatizantesData)
      await saveLocalData("miembros", miembrosData)
      await saveLocalData("historial", historialData)

      console.log("Firebase sync completed successfully")
    } catch (error) {
      console.error("Error syncing with Firebase:", error)
      setSyncError("Error syncing with Firebase")
    } finally {
      setIsSyncing(false)
    }
  }, [isAuthReady, isOnline, saveLocalData])

  // Auth state listener
  useEffect(() => {
    if (typeof window === "undefined") return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? "signed in" : "signed out")
      setIsAuthReady(!!user) // Only set ready when user exists
    })

    return () => unsubscribe()
  }, [])

  // Load initial data with better error handling
  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false)
      return
    }

    const loadData = async () => {
      try {
        // Load from local storage first with fallbacks
        const localSimpatizantes = await loadLocalData("simpatizantes")
        const localMiembros = await loadLocalData("miembros")
        const localHistorial = await loadLocalData("historial")

        // Ensure data is always an array
        if (Array.isArray(localSimpatizantes)) setSimpatizantes(localSimpatizantes)
        if (Array.isArray(localMiembros)) setMiembros(localMiembros)
        if (Array.isArray(localHistorial)) setHistorial(localHistorial)

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
    } else if (!isAuthReady) {
      // Set loading to false after a timeout if auth doesn't initialize
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 5000)
      return () => clearTimeout(timeout)
    }
  }, [isAuthReady, isOnline, loadLocalData, syncWithFirebase])

  // MISSING FUNCTIONS: Add/Update methods
  const addSimpatizante = useCallback(async (simpatizante: any) => {
    try {
      const newSimpatizante = {
        ...simpatizante,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      // Update local state
      const updatedSimpatizantes = [newSimpatizante, ...simpatizantes]
      setSimpatizantes(updatedSimpatizantes)
      await saveLocalData("simpatizantes", updatedSimpatizantes)

      // Sync to Firebase if online
      if (isOnline && isAuthReady) {
        await addDoc(collection(db, "simpatizantes"), newSimpatizante)
      }

      return newSimpatizante
    } catch (error) {
      console.error("Error adding simpatizante:", error)
      throw error
    }
  }, [simpatizantes, isOnline, isAuthReady, saveLocalData])

  const updateSimpatizante = useCallback(async (id: string, updates: any) => {
    try {
      const updatedSimpatizantes = simpatizantes.map(s => 
        s.id === id ? { ...s, ...updates, updatedAt: new Date() } : s
      )
      
      setSimpatizantes(updatedSimpatizantes)
      await saveLocalData("simpatizantes", updatedSimpatizantes)

      if (isOnline && isAuthReady) {
        await updateDoc(doc(db, "simpatizantes", id), { ...updates, updatedAt: new Date() })
      }
    } catch (error) {
      console.error("Error updating simpatizante:", error)
      throw error
    }
  }, [simpatizantes, isOnline, isAuthReady, saveLocalData])

  const addMiembro = useCallback(async (miembro: any) => {
    try {
      const newMiembro = {
        ...miembro,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const updatedMiembros = [newMiembro, ...miembros]
      setMiembros(updatedMiembros)
      await saveLocalData("miembros", updatedMiembros)

      if (isOnline && isAuthReady) {
        await addDoc(collection(db, "miembros"), newMiembro)
      }

      return newMiembro
    } catch (error) {
      console.error("Error adding miembro:", error)
      throw error
    }
  }, [miembros, isOnline, isAuthReady, saveLocalData])

  const updateMiembro = useCallback(async (id: string, updates: any) => {
    try {
      const updatedMiembros = miembros.map(m => 
        m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
      )
      
      setMiembros(updatedMiembros)
      await saveLocalData("miembros", updatedMiembros)

      if (isOnline && isAuthReady) {
        await updateDoc(doc(db, "miembros", id), { ...updates, updatedAt: new Date() })
      }
    } catch (error) {
      console.error("Error updating miembro:", error)
      throw error
    }
  }, [miembros, isOnline, isAuthReady, saveLocalData])

  const saveConteo = useCallback(async (conteoData: any) => {
    try {
      const newConteo = {
        ...conteoData,
        id: Date.now().toString(),
        fecha: new Date(),
        createdAt: new Date()
      }

      const updatedHistorial = [newConteo, ...historial]
      setHistorial(updatedHistorial)
      await saveLocalData("historial", updatedHistorial)

      if (isOnline && isAuthReady) {
        await addDoc(collection(db, "historial"), newConteo)
      }

      return newConteo
    } catch (error) {
      console.error("Error saving conteo:", error)
      throw error
    }
  }, [historial, isOnline, isAuthReady, saveLocalData])

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