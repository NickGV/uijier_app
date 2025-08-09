import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth" // 1. Importar getAuth y Auth

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCjRKevP0Hyjl1qTjROuNjytoHOVdkVjKA",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "serujier-645cb.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "serujier-645cb",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "serujier-645cb.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "245323967896",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:245323967896:web:62f102f99b50b6d399cfed",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-S71EVS7HNX",
}

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredValues = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId,
    firebaseConfig.measurementId,
  ]

  const missingValues = requiredValues.filter((value) => !value || value === "")

  if (missingValues.length > 0) {
    console.warn("⚠️ Firebase configuration incomplete. Missing values in firebaseConfig")
    return false
  }

  console.log("✅ Firebase configuration validated successfully")
  return true
}

// Initialize Firebase
let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null // 2. Declarar la variable auth

try {
  if (validateFirebaseConfig()) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig)
      console.log("✅ Firebase initialized successfully")
    } else {
      app = getApps()[0]
    }

    if (app) {
      db = getFirestore(app)
      auth = getAuth(app) // 3. Inicializar auth
    }
  } else {
    console.log("📱 Running in local-only mode (Firebase not configured)")
  }
} catch (error) {
  console.error("❌ Firebase initialization error:", error)
}

// Export Firebase instances
export { db, auth }

// Export Firebase status
export const getFirebaseStatus = () => {
  return {
    isConfigured: validateFirebaseConfig(),
    isConnected: !!db && !!auth,
    app,
    db,
    auth,
  }
}

export { validateFirebaseConfig }
