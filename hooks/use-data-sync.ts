"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import localforage from "localforage"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

// Define initial data structures for church data
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
    id: "gFe6IxMSWJufa64ltyDS",
    nombre: "Piedad Piedrahita",
    telefono: "",
    notas: "",
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
  {
    id: "ea0ARctfE2VjZw1JyZAv",
    fecha: "2025-07-19",
    servicio: "Oración y Enseñanza",
    ujier: "Juan Caldera",
    hermanos: 5,
    hermanas: 6,
    ninos: 5,
    adolescentes: 5,
    simpatizantes: 4,
    total: 25,
    simpatizantesAsistieron: [],
    miembrosAsistieron: {
      hermanos: [],
      hermanas: [],
      ninos: [],
      adolescentes: [],
    },
  },
  {
    id: "exeZEyHX2aXins9CI8NY",
    fecha: "2025-07-19",
    servicio: "Dominical",
    ujier: "Joaquin Velez",
    hermanos: 4,
    hermanas: 5,
    ninos: 5,
    adolescentes: 4,
    simpatizantes: 3,
    total: 21,
    simpatizantesAsistieron: [],
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
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthReady, setIsAuthReady] = useState(false)

  // --- Local Storage (IndexedDB with localforage) ---
  const saveLocalData = useCallback(async (key: string, data: any) => {
    try {
      await localforage.setItem(key, data)
      console.log(`Data for ${key} saved locally.`)
    } catch (error) {
      console.error(`Error saving ${key} to local storage:`, error)
    }
  }, [])

  const loadLocalData = useCallback(async (key: string, fallback: any[]) => {
    try {
      const data = await localforage.getItem(key)
      return data || fallback
    } catch (error) {
      console.error(`Error loading ${key} from local storage:`, error)
      return fallback
    }
  }, [])

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
      await saveLocalData("simpatizantes", [...simpatizantes, simpatizanteCompleto])

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
