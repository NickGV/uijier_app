// Placeholder data fetchers. Replace with Firestore queries using db from lib/firebase.
export async function fetchSimpatizantes() {
  return [] as Array<{ id: string; name: string }>;
}

export async function fetchMiembros() {
  return [] as Array<{ id: string; name: string }>;
}

export async function fetchUjieres() {
  return [] as Array<{ id: string; name: string; active?: boolean }>;
}
