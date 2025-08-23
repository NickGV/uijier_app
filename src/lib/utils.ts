import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Placeholder data fetchers. Replace with Firestore queries using db from lib/firebase.
export async function fetchSimpatizantes() {
  try {
    const querySnapshot = await getDocs(collection(db, "simpatizantes"));

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      nombre: string;
      telefono?: string;
      notas?: string;
      fechaRegistro: string;
    }>;
  } catch (error) {
    console.error("Error fetching simpatizantes:", error);
    throw error;
  }
}

export async function addSimpatizante(simpatizante: {
  nombre: string;
  telefono?: string;
  notas?: string;
  fechaRegistro: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "simpatizantes"), simpatizante);
    console.log("Simpatizante creado exitosamente:", simpatizante.nombre);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding simpatizante:", error);
    throw error;
  }
}

export async function fetchMiembros() {
  try {
    const q = query(collection(db, "miembros"), orderBy("nombre", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      nombre: string;
      telefono?: string;
      categoria: "hermano" | "hermana" | "nino" | "adolescente";
      notas?: string;
      fechaRegistro: string;
    }>;
  } catch (error) {
    console.error("Error fetching miembros:", error);
    throw error;
  }
}

export async function addMiembro(miembro: {
  nombre: string;
  telefono?: string;
  categoria: "hermano" | "hermana" | "nino" | "adolescente";
  notas?: string;
  fechaRegistro: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "miembros"), miembro);
    console.log("Miembro creado exitosamente:", miembro.nombre);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding miembro:", error);
    throw error;
  }
}

export async function fetchUjieres() {
  try {
    const q = query(collection(db, "usuarios"), orderBy("nombre", "asc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      nombre: string;
      password: string;
      rol: "admin" | "directiva" | "ujier";
      activo: boolean;
      fechaCreacion: string;
    }>;
  } catch (error) {
    console.error("Error fetching ujieres:", error);
    throw error;
  }
}

export async function addUjier(ujier: {
  nombre: string;
  password: string;
  rol: "admin" | "directiva" | "ujier";
  activo: boolean;
  fechaCreacion: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "usuarios"), ujier);
    console.log("Usuario creado exitosamente:", ujier.nombre);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding ujier:", error);
    throw error;
  }
}

export async function updateUjier(
  id: string,
  data: Partial<{
    nombre: string;
    password: string;
    rol: "admin" | "directiva" | "ujier";
    activo: boolean;
  }>
) {
  try {
    const ujierRef = doc(db, "usuarios", id);
    await updateDoc(ujierRef, data);

    console.log("Usuario actualizado exitosamente:", id);
  } catch (error) {
    console.error("Error updating ujier:", error);
    throw error;
  }
}

export async function updateSimpatizante(
  id: string,
  data: Partial<{
    nombre: string;
    telefono?: string;
    notas?: string;
  }>
) {
  try {
    const simpatizanteRef = doc(db, "simpatizantes", id);
    await updateDoc(simpatizanteRef, data);

    console.log("Simpatizante actualizado exitosamente:", id);
  } catch (error) {
    console.error("Error updating simpatizante:", error);
    throw error;
  }
}

export async function getSimpatizanteById(id: string) {
  try {
    const simpatizanteRef = doc(db, "simpatizantes", id);
    const simpatizanteSnap = await getDoc(simpatizanteRef);

    if (simpatizanteSnap.exists()) {
      return {
        id: simpatizanteSnap.id,
        ...simpatizanteSnap.data(),
      } as {
        id: string;
        nombre: string;
        telefono?: string;
        notas?: string;
        fechaRegistro: string;
      };
    } else {
      throw new Error("Simpatizante no encontrado");
    }
  } catch (error) {
    console.error("Error fetching simpatizante by id:", error);
    throw error;
  }
}

export async function deleteSimpatizante(id: string) {
  try {
    const simpatizanteRef = doc(db, "simpatizantes", id);
    await deleteDoc(simpatizanteRef);

    console.log("Simpatizante eliminado exitosamente:", id);
  } catch (error) {
    console.error("Error deleting simpatizante:", error);
    throw error;
  }
}

export async function getUjierById(id: string) {
  try {
    const ujierRef = doc(db, "usuarios", id);
    const ujierSnap = await getDoc(ujierRef);

    if (ujierSnap.exists()) {
      return {
        id: ujierSnap.id,
        ...ujierSnap.data(),
      } as {
        id: string;
        nombre: string;
        password: string;
        rol: "admin" | "directiva" | "ujier";
        activo: boolean;
        fechaCreacion: string;
      };
    } else {
      throw new Error("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error fetching ujier by id:", error);
    throw error;
  }
}

export async function fetchHistorial() {
  try {
    const q = query(collection(db, "historial"), orderBy("fecha", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{
      id: string;
      fecha: string;
      servicio: string;
      ujier: string | string[];
      hermanos: number;
      hermanas: number;
      ninos: number;
      adolescentes: number;
      simpatizantes: number;
      total: number;
      simpatizantesAsistieron?: Array<{ id: string; nombre: string }>;
      miembrosAsistieron?: {
        hermanos?: Array<{ id: string; nombre: string }>;
        hermanas?: Array<{ id: string; nombre: string }>;
        ninos?: Array<{ id: string; nombre: string }>;
        adolescentes?: Array<{ id: string; nombre: string }>;
      };
    }>;
  } catch (error) {
    console.error("Error fetching historial:", error);
    throw error;
  }
}

export async function saveConteo(conteoData: {
  fecha: string;
  servicio: string;
  ujier: string[];
  hermanos: number;
  hermanas: number;
  ninos: number;
  adolescentes: number;
  simpatizantes: number;
  total: number;
  simpatizantesAsistieron?: Array<{ id: string; nombre: string }>;
  miembrosAsistieron?: {
    hermanos?: Array<{ id: string; nombre: string }>;
    hermanas?: Array<{ id: string; nombre: string }>;
    ninos?: Array<{ id: string; nombre: string }>;
    adolescentes?: Array<{ id: string; nombre: string }>;
  };
}) {
  try {
    const docRef = await addDoc(collection(db, "historial"), conteoData);
    console.log("Conteo guardado exitosamente con ID:", docRef.id);
    return { id: docRef.id };
  } catch (error) {
    console.error("Error saving conteo:", error);
    throw error;
  }
}
