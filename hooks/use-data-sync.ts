"use client"

// hooks/use-data-sync.ts
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

// Define initial data structures for fallback and type safety
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
    telefono: "3004855961",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "lPqxtQ5302Pi1FWHelEI",
    nombre: "Juan Caldera",
    telefono: "3136318288",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "pyJTumu2pXX7eVyg0tYT",
    nombre: "Juan Jose Avendaño Velez",
    telefono: "3242665600",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "r0HiJ1jd17hVoXeQNBDf",
    nombre: "Juan Monsalve",
    telefono: "3166005002",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "tCXrTwwq2a9u9eUwDChV",
    nombre: "Juan Diego Ramirez",
    telefono: "3013279126",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "uVbedU4JmWePUbmO4IX5",
    nombre: "John Fredy Ramirez",
    telefono: "3113230046",
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
    telefono: "3117803579",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "JeqRBHvz4NiFVY7HuC5e",
    nombre: "Alejo Henao",
    telefono: "3244727951",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "es7WMnToubRLJSzYBcyL",
    nombre: "Johan Henao",
    telefono: "3044126296",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "LGfpkjraOW18oD9YC9mo",
    nombre: "Cristian Gomez Velez",
    telefono: "3012871882",
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
    telefono: "3106409441",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "R7GVjOfCjZfq2iDMlBLq",
    nombre: "Hector Alzate Ortiz",
    telefono: "3046739922",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "KnPcLYlHmdXwBgrQQDWr",
    nombre: "Hector Gaviria",
    telefono: "3192594946",
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
    telefono: "3195843327",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "kQTx66FErEVFmM8fcjPb",
    nombre: "Jhon Echavarria",
    telefono: "300535551",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "5bD8JoX3cYS3hJ95qhT9",
    nombre: "Josue",
    telefono: "3138308082",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "8M8e2Df63KgIrj1beyst",
    nombre: "Yojan",
    telefono: "3003357863",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "nVUdRrKc5JtaeWYcRTxz",
    nombre: "Sebastian",
    telefono: "3003182173",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "nqEbTQumTZT37sMscWNE",
    nombre: "Jaime Esteban Gutierrez",
    telefono: "3137371156",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "VFNpycuZHbHMTjJCYvPD",
    nombre: "Tiberio",
    telefono: "3015664815",
    categoria: "hermano",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  // Hermanas
  {
    id: "1ixWLDAMyPq1MPJA4vP5",
    nombre: "Marbel",
    telefono: "3145382161",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "1nA5WQSs1um7q5gagwO2",
    nombre: "Nicol Henao",
    telefono: "3013211310",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "23JHG6kRmdthU2CkZHSg",
    nombre: "Estella",
    telefono: "3192594946",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "37DTQcPNmkqbETbMRnGn",
    nombre: "Jenny",
    telefono: "3013037044",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "3y5oIeHmBUM6MR8BjWAT",
    nombre: "Jhojana Giraldo",
    telefono: "3185872558",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "8E32VtVJXbH1ENspSFep",
    nombre: "Lucia Gomez",
    telefono: "3122941284",
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
    telefono: "3044991299",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "DZhgs7bRHlctBcCRT98I",
    nombre: "Doris Delgado",
    telefono: "3163449506",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "DdPbzo3aGKhDqfMJmxys",
    nombre: "Evelin",
    telefono: "3145812980",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "DkscS3X0tCztEwOnuoHM",
    nombre: "Marina Parra",
    telefono: "3124457461",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "EXUdV1j3SPnWVmVV92ns",
    nombre: "Nuvia",
    telefono: "3046804602",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "FWDHVjZEvsU36DDcOSyV",
    nombre: "Carolina Monzalve",
    telefono: "3217796273",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "LKRtqrK442vqKovUh5Qj",
    nombre: "Diana Suarez",
    telefono: "3142363275",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "M2aWXuXgKguFrNQi4ZBs",
    nombre: "Catherine",
    telefono: "3045918252",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "NN56MCvLkMjw5MTdWgvw",
    nombre: "Julieth Correa",
    telefono: "3013037044",
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
    telefono: "3023893497",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "SLzfRQCyUOepuMQlnDgw",
    nombre: "Yury",
    telefono: "3016376417",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "VoRlOINtRUsCeAQ31UUC",
    nombre: "Yamile",
    telefono: "3014335291",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "WzwgpcVTK5tzrs5l5CtL",
    nombre: "Sury Maribel Velez Parra",
    telefono: "3003403807",
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
    telefono: "3009874443",
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
    telefono: "3242007506",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "fDVwgfOTf5Fej5kI5Jla",
    nombre: "Diana Velez",
    telefono: "3014033128",
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
    telefono: "3195140525",
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
    telefono: "3234807145",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "riurM4XTNIinChGXguna",
    nombre: "Natlaia",
    telefono: "3003701217",
    categoria: "hermana",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "q5cSOV1ygrrCkbK6sM2m",
    nombre: "Sandra",
    telefono: "3017243384",
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
    telefono: "3243414473",
    categoria: "adolescente",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "1940989f66064f7b686e",
    nombre: "Paula Andrea Henao Gil",
    telefono: "3016747590",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "e578c2e1c95e4f48b993",
    nombre: "Adriana María Vélez",
    telefono: "3014725968",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "721c172ee1c24ec2ae3a",
    nombre: "Gonzalo Marín",
    telefono: "3147737794",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "0d5c14e0474b413c9e6d",
    nombre: "Carlos Enrique B",
    telefono: "3043397242",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "7d1637c355fb4d82b4a3",
    nombre: "Bibiana María Uribe Henao",
    telefono: "3013211310",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "125ee4b31a2c4e5e8e8e",
    nombre: "Joaquin Emilio Vélez Molina",
    telefono: "",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "2c73300486c84c1f93ce",
    nombre: "Carmen Cecilia Rodríguez",
    telefono: "",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "d9e83a7c64a1443685e8",
    nombre: "Alveiro De Jesús alex",
    telefono: "31470105204",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "3d5b5465e90040e5bb97",
    nombre: "Ramón Octavio Avendaño Sacerquia",
    telefono: "3014725968",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "5798e3b8b1a54130a095",
    nombre: "Eduardo José Aguilar Cano",
    telefono: "3505194393",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "24a1b8c191a34c56ba85",
    nombre: "Omaira Berta Rodríguez",
    telefono: "3103823457",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "e445037fb6d14902b489",
    nombre: "Jorge Luis Sánchez",
    telefono: "3103823497",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "b452601ff3a647d6ba2f",
    nombre: "María Junia Osorio González",
    telefono: "3195140525",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "d8e3b2b8c54c4c9e8841",
    nombre: "José Perdomo",
    telefono: "3143577098",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "3e6f9d3434674312b9d2",
    nombre: "Carlos Arturo Giraldo Posada",
    telefono: "3147262151",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "167c69994c6f49ce8859",
    nombre: "Blanca Nubia Ramirez Cespedes",
    telefono: "3163449506",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "5b1c5506a74b48ed9257",
    nombre: "Jose Javier Delgado Ramirez",
    telefono: "3042100584",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "d41280d52a20436d9d1b",
    nombre: "Gloria Helena Delgado Ramirez",
    telefono: "3163449506",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "6e2e5050f24e4d7e824d",
    nombre: "Sergio Hernan Delgado Ramirez",
    telefono: "3163449506",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
  {
    id: "e033f7c352a94f1e94d8",
    nombre: "Naver Santiago Graciano Rojas",
    telefono: "3158123729",
    categoria: "",
    notas: "",
    fechaRegistro: "2025-07-19",
  },
]

const initialHistorial = [
  {}
]

// Lista de ujieres del sistema - USANDO LA LISTA ORIGINAL
const ujieresDelSistema = [
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
  "Oraliz Fernandez",
  "Santiago Graciano",
  "Suri Velez",
  "Wilmar Velez",
  "Diana Suarez",
  "Jose Perdomo", 
  "Carolina Caro",
  "Juan Jose Abeldaño",
  "Gilberto Castaño",
  "Nicolas Gomez Velez",
  "Cristian Gomez Velez",
  "Wilmar Rojas"
]

// Función para generar usuarios basados en la lista de ujieres
const generateInitialUsuarios = () => {
  const usuarios: any[] = []

  // Admins específicos (siempre activos)
  const admins = ["Wilmar Rojas", "Jaime Esteban Gutierrez", "Juan Caldera", "Juan Jose Abeldaño", "Nicolas Gomez Velez", "Gilberto Castaño"]

  // Generar usuarios para cada ujier con contraseñas encriptadas
  ujieresDelSistema.forEach((nombre, index) => {
    const primerNombre = nombre.split(" ")[0].toLowerCase()
    // Normalizar caracteres especiales para la contraseña
    const nombreParaPassword = primerNombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar tildes
      .replace(/[^a-z]/g, "") // Solo letras minúsculas

    const basePassword = nombreParaPassword + "."

    usuarios.push({
      id: `ujier-${index + 1}`,
      nombre: nombre,
      password: encryptPassword(basePassword), // Encriptar la contraseña
      rol: admins.includes(nombre) ? "admin" : "ujier",
      activo: true, // Todos empiezan activos
      fechaCreacion: "2024-01-01",
    })
  })

  return usuarios
}

const initialUsuarios = generateInitialUsuarios()


export function useDataSync() {
  const [simpatizantes, setSimpatizantes] = useState<any[]>(initialSimpatizantes)
  const [miembros, setMiembros] = useState<any[]>(initialMiembros)
  const [historial, setHistorial] = useState<any[]>(initialHistorial)
  const [usuarios, setUsuarios] = useState<any[]>(initialUsuarios)
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
        const q = query(colRef, orderBy("fechaRegistro", "desc"))

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
    // Verificar que auth no sea null antes de usarlo
    if (!auth) {
      console.warn("⚠️ Firebase auth not available, skipping auth state listener")
      setIsAuthReady(false) // Marcar como no autenticado
      return
    }

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
      const loadedUsuarios = await loadLocalData("usuarios", initialUsuarios)

      setSimpatizantes(loadedSimpatizantes)
      setMiembros(loadedMiembros)
      setHistorial(loadedHistorial)
      setUsuarios(loadedUsuarios)

       if (!db) {
        console.warn("⚠️ Firebase db not available, skipping listeners")
        setIsLoading(false)
        return
      }

      // Set up real-time listeners for Firebase
      const unsubSimpatizantes = onSnapshot(
        collection(db, "simpatizantes"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          if (data.length > 0) {
            // Solo actualizar si hay datos
            setSimpatizantes(data)
            saveLocalData("simpatizantes", data)
          }
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
          if (data.length > 0) {
            // Solo actualizar si hay datos
            setMiembros(data)
            saveLocalData("miembros", data)
          }
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
          if (data.length > 0) {
            // Solo actualizar si hay datos
            setHistorial(data)
            saveLocalData("historial", data)
          }
        },
        (error) => {
          console.error("Error listening to historial:", error)
          setSyncError("Error de conexión con historial.")
        },
      )

      // Listener para usuarios - subir con contraseñas encriptadas si Firebase está vacío
      const unsubUsuarios = onSnapshot(
        collection(db, "usuarios"),
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          console.log("Firebase usuarios data:", data.length, "items")

          if (data.length > 0) {
            // Si hay datos en Firebase, usarlos
            setUsuarios(data)
            saveLocalData("usuarios", data)
            console.log("✅ Usuarios sincronizados desde Firebase")
          } else {
            // Si Firebase está vacío, subir usuarios con contraseñas encriptadas
            console.log("� Subiendo usuarios iniciales con contraseñas encriptadas...")
            initialUsuarios.forEach(async (usuario) => {
              try {
                const { id, ...dataWithoutId } = usuario
                await addDoc(collection(db, "usuarios"), dataWithoutId)
                console.log(`👤 Usuario ${usuario.nombre} subido a Firebase (password encriptada)`)
              } catch (error) {
                console.error(`❌ Error subiendo usuario ${usuario.nombre}:`, error)
              }
            })
          }
        },
        (error) => {
          console.error("Error listening to usuarios:", error)
          setSyncError("Error de conexión con usuarios.")
        },
      )

      setIsLoading(false)

      return () => {
        unsubSimpatizantes()
        unsubMiembros()
        unsubHistorial()
        unsubUsuarios()
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
      // No sincronizar usuarios automáticamente para evitar sobrescribir
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

  // --- Usuario Operations ---
  const addUsuario = useCallback(
    async (newUsuarioData: any) => {
      const tempId = Date.now().toString()
      const usuarioCompleto = {
        ...newUsuarioData,
        id: tempId,
        password: encryptPassword(newUsuarioData.password), // Encriptar la contraseña
        fechaCreacion: new Date().toISOString().split("T")[0],
      }
      setUsuarios((prev) => [...prev, usuarioCompleto])
      await saveLocalData("usuarios", [...usuarios, usuarioCompleto])

      try {
        const { id, ...dataToSave } = usuarioCompleto
        const docRef = await addDoc(collection(db, "usuarios"), dataToSave)
        console.log("Usuario added to Firebase with ID:", docRef.id)
      } catch (error) {
        console.error("Error adding usuario to Firebase:", error)
        setSyncError("Error al agregar usuario a Firebase.")
      }
      return usuarioCompleto
    },
    [usuarios, saveLocalData],
  )

  const updateUsuario = useCallback(
    async (id: string, updatedData: any) => {
      // Si se está actualizando la contraseña, encriptarla
      if (updatedData.password) {
        updatedData.password = encryptPassword(updatedData.password)
      }

      // Los admins siempre deben mantenerse activos
      const usuario = usuarios.find((u) => u.id === id)
      if (usuario?.rol === "admin" && updatedData.hasOwnProperty("activo")) {
        updatedData.activo = true
      }

      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u)))
      await saveLocalData(
        "usuarios",
        usuarios.map((u) => (u.id === id ? { ...u, ...updatedData } : u)),
      )

      try {
        await updateDoc(doc(db, "usuarios", id), updatedData)
        console.log("Usuario updated in Firebase:", id)
      } catch (error) {
        console.error("Error updating usuario in Firebase:", error)
        setSyncError("Error al actualizar usuario en Firebase.")
      }
    },
    [usuarios, saveLocalData],
  )

  const deleteUsuario = useCallback(
    async (id: string) => {
      // No permitir eliminar admins
      const usuario = usuarios.find((u) => u.id === id)
      if (usuario?.rol === "admin") {
        console.log("No se puede eliminar un administrador")
        return
      }

      setUsuarios((prev) => prev.filter((u) => u.id !== id))
      await saveLocalData(
        "usuarios",
        usuarios.filter((u) => u.id !== id),
      )

      try {
        // In a real app, you might want to soft delete instead
        // await deleteDoc(doc(db, "usuarios", id))
        // For now, we'll just mark as inactive
        await updateDoc(doc(db, "usuarios", id), { activo: false })
        console.log("Usuario deactivated in Firebase:", id)
      } catch (error) {
        console.error("Error deactivating usuario in Firebase:", error)
        setSyncError("Error al desactivar usuario en Firebase.")
      }
    },
    [usuarios, saveLocalData],
  )

  // FUNCIÓN DE AUTENTICACIÓN CON CONTRASEÑAS ENCRIPTADAS
  const authenticateUser = useCallback(
    (nombre: string, password: string) => {
      console.log("=== DEBUG AUTENTICACIÓN ENCRIPTADA ===")
      console.log("Nombre ingresado:", `"${nombre}"`)
      console.log("Password ingresado:", `"${password}"`)

      console.log("Usuarios en el sistema:", usuarios.length)
      
      // Buscar usuario por nombre exacto (case-sensitive)
      const user = usuarios.find((u) => {
        const nombreMatch = u.nombre === nombre
        const passwordMatch = verifyPassword(password, u.password) // Verificar contraseña encriptada
        console.log(`Comparando con ${u.nombre}:`, { nombreMatch, passwordMatch })
        return nombreMatch && passwordMatch
      })

      console.log("Usuario encontrado:", user)
      console.log("=== FIN DEBUG ===")

      if (!user) {
        return { success: false, message: "Credenciales incorrectas" }
      }
      if (!user.activo && user.rol !== "admin") {
        // Los admins siempre están activos
        return { success: false, message: "Usuario desactivado. Contacte al administrador." }
      }
      return { success: true, user }
    },
    [usuarios],
  )

  return {
    simpatizantes,
    miembros,
    historial,
    usuarios,
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
  }
}
