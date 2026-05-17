import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// Force long polling — definitively sidesteps the WebChannel handshake
// loop that some browser/network combos trigger (third-party cookie
// blocking, ad-blockers, corporate proxies, etc.). Slightly higher
// latency than WebChannel but stable everywhere.
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
})

// Debug exposure — read these from console:
//   __nsdebug.auth.currentUser?.uid  → current anon user id (or undefined)
//   __nsdebug.db                     → firestore instance
if (typeof window !== 'undefined') {
  window.__nsdebug = { auth, db, app }
}
