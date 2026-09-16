'use server'

import { adminDb } from '@/lib/firebase/admin'
import { SEED_TENANTS, SEED_KATALOG } from '@/data/seedData'
import { TenantItem, KatalogItem, ServerActionResult, KlasterId } from '@/types'

export interface TenantFilterParams {
  search?: string
  klasterId?: KlasterId | 'all'
  incubationStatus?: TenantItem['incubationStatus'] | 'all'
}

/**
 * Mengambil daftar tenant dari Firestore dengan fallback ke SEED_TENANTS
 */
export async function getTenantsAction(
  filters?: TenantFilterParams
): Promise<ServerActionResult<TenantItem[]>> {
  try {
    let queryRef = adminDb.collection('tenant') as FirebaseFirestore.Query

    if (filters?.klasterId && filters.klasterId !== 'all') {
      queryRef = queryRef.where('klasterId', '==', filters.klasterId)
    }
    if (filters?.incubationStatus && filters.incubationStatus !== 'all') {
      queryRef = queryRef.where('incubationStatus', '==', filters.incubationStatus)
    }

    const snapshot = await queryRef.get()

    let items: TenantItem[] = []
    if (!snapshot.empty) {
      items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TenantItem[]
    } else {
      items = [...SEED_TENANTS]
      if (filters?.klasterId && filters.klasterId !== 'all') {
        items = items.filter((item) => item.klasterId === filters.klasterId)
      }
      if (filters?.incubationStatus && filters.incubationStatus !== 'all') {
        items = items.filter((item) => item.incubationStatus === filters.incubationStatus)
      }
    }

    // Filter pencarian berdasarkan nama atau bidang riset
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim()
      items = items.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          (it.legalName && it.legalName.toLowerCase().includes(q)) ||
          it.about.toLowerCase().includes(q)
      )
    }

    return {
      success: true,
      data: items,
    }
  } catch (error) {
    console.error('[getTenantsAction Error]:', error)
    return {
      success: true,
      data: SEED_TENANTS,
    }
  }
}

/**
 * Mengambil detail profil tenant beserta seluruh produk katalog buatannya
 */
export async function getTenantByIdAction(
  id: string
): Promise<ServerActionResult<{ tenant: TenantItem; products: KatalogItem[] }>> {
  try {
    const cleanId = id.trim()
    let tenant: TenantItem | null = null

    // Coba ambil dari Firestore
    const docRef = adminDb.collection('tenant').doc(cleanId)
    const docSnap = await docRef.get()

    if (docSnap.exists) {
      tenant = { id: docSnap.id, ...docSnap.data() } as TenantItem
    } else {
      // Cek apakah ada di SEED_TENANTS
      tenant = SEED_TENANTS.find((t) => t.id === cleanId) || null
    }

    if (!tenant) {
      return {
        success: false,
        error: 'Tenant inovator tidak ditemukan.',
      }
    }

    // Ambil produk yang dibuat oleh tenant ini dari katalog_items
    let products: KatalogItem[] = []
    const prodSnapshot = await adminDb
      .collection('katalog_items')
      .where('tenantId', '==', tenant.id)
      .get()

    if (!prodSnapshot.empty) {
      products = prodSnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as KatalogItem[]
    } else {
      // Fallback ke SEED_KATALOG
      products = SEED_KATALOG.filter((k) => k.tenantId === tenant!.id)
    }

    return {
      success: true,
      data: { tenant, products },
    }
  } catch (error) {
    console.error('[getTenantByIdAction Error]:', error)
    const tenant = SEED_TENANTS.find((t) => t.id === id)
    if (tenant) {
      const products = SEED_KATALOG.filter((k) => k.tenantId === tenant.id)
      return {
        success: true,
        data: { tenant, products },
      }
    }
    return {
      success: false,
      error: 'Gagal memuat profil tenant.',
    }
  }
}

export interface CreateTenantPayload {
  name: string
  legalName?: string
  logoUrl: string
  bannerUrl?: string
  klasterId: KlasterId
  about: string
  website?: string
  email: string
  phone?: string
  address?: string
  incubationStatus: TenantItem['incubationStatus']
  batchYear?: number
  socialLinks?: {
    linkedin?: string
    instagram?: string
    github?: string
  }
  isActive: boolean
}

/**
 * Menambahkan profil tenant / startup binaan baru ke Firestore
 */
export async function createTenantAction(
  payload: CreateTenantPayload
): Promise<ServerActionResult<{ id: string }>> {
  try {
    if (!payload.name || !payload.email || !payload.about) {
      return { success: false, error: 'Nama tenant, email resmi, dan deskripsi singkat wajib diisi.' }
    }

    const now = new Date().toISOString()
    const docData: Omit<TenantItem, 'id'> = {
      name: payload.name.trim(),
      legalName: payload.legalName?.trim() || '',
      logoUrl: payload.logoUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
      bannerUrl: payload.bannerUrl?.trim() || '',
      klasterId: payload.klasterId || 'ai-software',
      about: payload.about.trim(),
      website: payload.website?.trim() || '',
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || '',
      address: payload.address?.trim() || '',
      incubationStatus: payload.incubationStatus || 'inkubasi',
      batchYear: payload.batchYear || new Date().getFullYear(),
      socialLinks: payload.socialLinks || {},
      isActive: payload.isActive !== false,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb.collection('tenant').add(docData)
    return {
      success: true,
      data: { id: docRef.id },
    }
  } catch (error) {
    console.error('[createTenantAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menambahkan profil tenant.',
    }
  }
}

/**
 * Memperbarui profil tenant yang sudah ada di Firestore
 */
export async function updateTenantAction(
  id: string,
  payload: Partial<CreateTenantPayload>
): Promise<ServerActionResult<{ id: string }>> {
  try {
    if (!id) {
      return { success: false, error: 'ID tenant wajib disediakan.' }
    }

    const docRef = adminDb.collection('tenant').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      // Jika belum ada di Firestore (misal data seed), buat dokumen dengan ID tersebut
      const seedTenant = SEED_TENANTS.find((t) => t.id === id)
      const now = new Date().toISOString()
      const initialData: Omit<TenantItem, 'id'> = {
        name: payload.name || seedTenant?.name || 'Tenant STP',
        legalName: payload.legalName ?? seedTenant?.legalName ?? '',
        logoUrl: payload.logoUrl || seedTenant?.logoUrl || '',
        bannerUrl: payload.bannerUrl ?? seedTenant?.bannerUrl ?? '',
        klasterId: payload.klasterId || seedTenant?.klasterId || 'ai-software',
        about: payload.about || seedTenant?.about || '',
        website: payload.website ?? seedTenant?.website ?? '',
        email: payload.email || seedTenant?.email || '',
        phone: payload.phone ?? seedTenant?.phone ?? '',
        address: payload.address ?? seedTenant?.address ?? '',
        incubationStatus: payload.incubationStatus || seedTenant?.incubationStatus || 'inkubasi',
        batchYear: payload.batchYear ?? seedTenant?.batchYear ?? 2025,
        socialLinks: payload.socialLinks || seedTenant?.socialLinks || {},
        isActive: payload.isActive ?? seedTenant?.isActive ?? true,
        createdAt: seedTenant?.createdAt || now,
        updatedAt: now,
      }
      await docRef.set(initialData)
      return { success: true, data: { id } }
    }

    const updateData: Record<string, any> = {
      ...payload,
      updatedAt: new Date().toISOString(),
    }

    await docRef.update(updateData)
    return {
      success: true,
      data: { id },
    }
  } catch (error) {
    console.error('[updateTenantAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui data tenant.',
    }
  }
}

/**
 * Menghapus tenant dari Firestore
 */
export async function deleteTenantAction(
  id: string
): Promise<ServerActionResult<{ deleted: boolean }>> {
  try {
    if (!id) {
      return { success: false, error: 'ID tenant wajib diisi.' }
    }

    await adminDb.collection('tenant').doc(id).delete()
    return {
      success: true,
      data: { deleted: true },
    }
  } catch (error) {
    console.error('[deleteTenantAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus tenant.',
    }
  }
}
