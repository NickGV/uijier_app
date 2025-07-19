"use client"

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getAuth, signInAnonymously } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

// Only run in browser environment
if (typeof window !== "undefined") {
  // Anonymous sign-in with retry
  const signInWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await signInAnonymously(auth)
        console.log("Anonymous sign-in successful")
        break
      } catch (err) {
        console.error(`Anonymous sign-in attempt ${i + 1} failed:`, err)
        if (i === retries - 1) {
          console.error("All anonymous sign-in attempts failed")
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
        }
      }
    }
  }

  signInWithRetry()

  // Enable offline persistence with better error handling
  const enablePersistence = async () => {
    try {
      await enableIndexedDbPersistence(db)
      console.log("Offline persistence enabled successfully!")
    } catch (err: any) {
      if (err.code === "failed-precondition") {
        console.warn("Multiple tabs open, persistence could not be enabled.")
      } else if (err.code === "unimplemented") {
        console.warn("Browser does not support persistence features.")
      } else if (err.code === "already-enabled") {
        console.log("Persistence already enabled")
      } else {
        console.error("Error enabling offline persistence:", err)
      }
    }
  }

  // Wait a bit for auth to initialize before enabling persistence
  setTimeout(enablePersistence, 1000)
}

export { db, auth }
