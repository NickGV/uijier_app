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
  // Anonymous sign-in
  signInAnonymously(auth).catch((err) => {
    console.error("Anonymous sign-in failed:", err)
  })

  // Enable offline persistence
  try {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log("Offline persistence enabled successfully!")
      })
      .catch((err) => {
        if (err.code === "failed-precondition") {
          console.warn(
            "Multiple tabs open, persistence could not be enabled. Data will not be persisted offline across tabs.",
          )
        } else if (err.code === "unimplemented") {
          console.warn("The current browser does not support all of the features required to enable persistence.")
        } else {
          console.error("Error enabling offline persistence:", err)
        }
      })
  } catch (error) {
    console.warn("Firestore persistence already enabled or failed to initialize:", error)
  }
}

export { db, auth }
