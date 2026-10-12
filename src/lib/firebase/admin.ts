import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { getStorage } from 'firebase-admin/storage'

let adminApp: App

function validateAdminCredentials(): void {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      '[Firebase Admin] Kredensial Firebase Admin tidak lengkap di .env.local. ' +
        'Pastikan FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, dan FIREBASE_ADMIN_PRIVATE_KEY telah diisi.'
    )
  }

  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('[Firebase Admin] Format FIREBASE_ADMIN_PRIVATE_KEY harus dimulai dengan -----BEGIN PRIVATE KEY-----.')
  }
}

export function isFirebaseAdminConfigured(): boolean {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      privateKey &&
      privateKey.includes('-----BEGIN PRIVATE KEY-----')
  )
}

function getAdminApp(): App {
  if (getApps().length === 0) {
    validateAdminCredentials()
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  } else {
    adminApp = getApps()[0]
  }
  return adminApp
}

// Database khusus atau (default)
const rawDatabaseId = process.env.FIREBASE_DATABASE_ID || '(default)'
const databaseId = rawDatabaseId === '(default)' ? undefined : rawDatabaseId

export const adminDb = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(_target, prop) {
    const db = databaseId ? getFirestore(getAdminApp(), databaseId) : getFirestore(getAdminApp())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (db as any)[prop]
    return typeof val === 'function' ? val.bind(db) : val
  },
})

export const adminAuth = new Proxy({} as ReturnType<typeof getAuth>, {
  get(_target, prop) {
    const auth = getAuth(getAdminApp())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (auth as any)[prop]
    return typeof val === 'function' ? val.bind(auth) : val
  },
})

export const adminStorage = new Proxy({} as ReturnType<typeof getStorage>, {
  get(_target, prop) {
    const storage = getStorage(getAdminApp())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (storage as any)[prop]
    return typeof val === 'function' ? val.bind(storage) : val
  },
})
