'use server'

import { cookies } from 'next/headers'
import { UserRole } from '@/types'
import { SESSION_COOKIE_NAME, DEMO_ACCOUNTS, SessionData } from './constants'

/**
 * Server action untuk memvalidasi login dan menetapkan cookie sesi
 */
export async function createSessionAction(
  email: string,
  pass: string,
  selectedRole: UserRole
): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  try {
    const cleanEmail = email.trim().toLowerCase()
    const demo = DEMO_ACCOUNTS[cleanEmail]

    let authenticatedUser: SessionData | null = null

    if (demo && demo.pass === pass) {
      authenticatedUser = {
        uid: `usr-${demo.role}-${Date.now().toString(36)}`,
        email: cleanEmail,
        name: demo.name,
        role: demo.role,
      }
    } else if (cleanEmail.endsWith('@solotechpark.id') && pass.length >= 6) {
      // Fallback dev internal STP
      authenticatedUser = {
        uid: `usr-stp-${Date.now().toString(36)}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].toUpperCase(),
        role: selectedRole,
      }
    } else if (cleanEmail && pass.length >= 6 && selectedRole === 'user') {
      authenticatedUser = {
        uid: `usr-client-${Date.now().toString(36)}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'user',
      }
    }

    if (!authenticatedUser) {
      return {
        success: false,
        error: 'Email atau kata sandi tidak valid. Silakan gunakan akun demo resmi atau hubungi admin.',
      }
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(authenticatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    const redirectTo =
      authenticatedUser.role === 'admin'
        ? '/admin'
        : authenticatedUser.role === 'operator'
        ? '/operator/orders'
        : '/tracking'

    return {
      success: true,
      redirectTo,
    }
  } catch (err) {
    console.error('[createSessionAction Error]:', err)
    return {
      success: false,
      error: 'Terjadi kegagalan saat membuat sesi login.',
    }
  }
}

/**
 * Server action untuk menghapus sesi login (Logout)
 */
export async function destroySessionAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
  return { success: true }
}

/**
 * Mengambil data sesi saat ini
 */
export async function getSessionAction(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const val = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!val) return null
  try {
    return JSON.parse(val) as SessionData
  } catch {
    return null
  }
}

export interface RegisterUserPayload {
  fullName: string
  email: string
  password: string
  phone: string
  organizationName: string
  organizationType: 'pt' | 'cv' | 'bumn' | 'pemerintah' | 'akademisi' | 'perorangan'
}

/**
 * Server action untuk mendaftarkan akun Mitra / Pengguna publik baru
 */
export async function registerUserAction(
  payload: RegisterUserPayload
): Promise<{ success: boolean; error?: string; redirectTo?: string }> {
  try {
    const cleanEmail = payload.email.trim().toLowerCase()
    const cleanName = payload.fullName.trim()
    const cleanPhone = payload.phone.trim()
    const cleanOrg = payload.organizationName.trim()

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanOrg) {
      return { success: false, error: 'Semua kolom wajib diisi lengkap.' }
    }

    if (payload.password.length < 6) {
      return { success: false, error: 'Kata sandi minimal harus 6 karakter.' }
    }

    // Periksa apakah email demo
    if (DEMO_ACCOUNTS[cleanEmail]) {
      return { success: false, error: 'Email ini adalah akun demo yang sudah terdaftar.' }
    }

    const now = new Date().toISOString()
    const uid = `usr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`

    try {
      const { adminDb } = await import('@/lib/firebase/admin')
      // Simpan ke collection users
      await adminDb.collection('users').doc(uid).set({
        uid,
        email: cleanEmail,
        displayName: cleanName,
        phoneNumber: cleanPhone,
        organizationName: cleanOrg,
        organizationType: payload.organizationType || 'pt',
        role: 'user',
        isActive: true,
        createdAt: now,
        updatedAt: now,
      })
    } catch (dbErr) {
      console.warn('[registerUserAction DB notice - fallback dev mode]:', dbErr)
    }

    // Buat sesi login otomatis
    const authenticatedUser: SessionData = {
      uid,
      email: cleanEmail,
      name: cleanName,
      role: 'user',
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(authenticatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      success: true,
      redirectTo: '/tracking',
    }
  } catch (err) {
    console.error('[registerUserAction Error]:', err)
    return {
      success: false,
      error: 'Terjadi kegagalan saat mendaftarkan akun pengguna.',
    }
  }
}
