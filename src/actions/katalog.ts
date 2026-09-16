'use server'

import { adminDb } from '@/lib/firebase/admin'
import { SEED_KATALOG } from '@/data/seedData'
import {
  KatalogItem,
  KatalogFilterParams,
  ServerActionResult,
} from '@/types'
import { revalidatePath } from 'next/cache'

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export type CreateKatalogPayload = Omit<KatalogItem, 'id' | 'slug' | 'createdAt' | 'updatedAt'>

/**
 * Membuat data inovasi/produk katalog baru (Admin STP)
 */
export async function createKatalogItemAction(
  payload: CreateKatalogPayload
): Promise<ServerActionResult<{ id: string; slug: string }>> {
  try {
    if (!payload.title || !payload.description || !payload.tenantName) {
      return { success: false, error: 'Judul, deskripsi, dan nama tenant wajib diisi.' }
    }

    const baseSlug = slugify(payload.title)
    const randomSuffix = Math.random().toString(36).substring(2, 6)
    const slug = `${baseSlug}-${randomSuffix}`
    const now = new Date().toISOString()

    const newItem: Omit<KatalogItem, 'id'> = {
      ...payload,
      slug,
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb.collection('katalog_items').add(newItem)

    revalidatePath('/katalog')
    revalidatePath('/')

    return {
      success: true,
      data: { id: docRef.id, slug },
    }
  } catch (error) {
    console.error('[createKatalogItemAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menambahkan produk katalog.',
    }
  }
}

/**
 * Mengambil daftar katalog inovasi dari Firestore dengan fallback ke SEED data
 */
export async function getKatalogItemsAction(
  filters?: KatalogFilterParams
): Promise<ServerActionResult<KatalogItem[]>> {
  try {
    let queryRef = adminDb.collection('katalog_items') as FirebaseFirestore.Query

    if (filters?.klasterId && filters.klasterId !== 'all') {
      queryRef = queryRef.where('klasterId', '==', filters.klasterId)
    }
    if (filters?.hakiStatus && filters.hakiStatus !== 'all') {
      queryRef = queryRef.where('hakiStatus', '==', filters.hakiStatus)
    }
    if (filters?.onlyFeatured) {
      queryRef = queryRef.where('isFeatured', '==', true)
    }

    const snapshot = await queryRef.get()

    let items: KatalogItem[] = []
    if (!snapshot.empty) {
      items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as KatalogItem[]
    } else {
      // Jika Firestore belum memiliki dokumen katalog, sediakan fallback master seed
      items = [...SEED_KATALOG]
      if (filters?.klasterId && filters.klasterId !== 'all') {
        items = items.filter((item) => item.klasterId === filters.klasterId)
      }
      if (filters?.hakiStatus && filters.hakiStatus !== 'all') {
        items = items.filter((item) => item.hakiStatus === filters.hakiStatus)
      }
      if (filters?.onlyFeatured) {
        items = items.filter((item) => item.isFeatured)
      }
    }

    // Client/In-memory Search filter jika ada kata kunci pencarian
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      items = items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.tagline.toLowerCase().includes(q) ||
          it.tenantName.toLowerCase().includes(q) ||
          (it.targetMarket && it.targetMarket.some((t: string) => t.toLowerCase().includes(q)))
      )
    }

    return {
      success: true,
      data: items,
    }
  } catch (error) {
    console.error('[getKatalogItemsAction Error]:', error)
    // Jika terjadi error koneksi, tetap sediakan data seed agar antarmuka tidak blank
    return {
      success: true,
      data: SEED_KATALOG,
    }
  }
}

/**
 * Mengambil satu produk katalog berdasarkan slug unik
 */
export async function getKatalogItemBySlugAction(
  slug: string
): Promise<ServerActionResult<KatalogItem>> {
  try {
    const cleanSlug = slug.trim().toLowerCase()
    if (!cleanSlug) {
      return { success: false, error: 'Slug produk wajib disediakan.' }
    }

    // Cari di Firestore
    const snapshot = await adminDb
      .collection('katalog_items')
      .where('slug', '==', cleanSlug)
      .limit(1)
      .get()

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return {
        success: true,
        data: { id: doc.id, ...doc.data() } as KatalogItem,
      }
    }

    // Fallback ke SEED_KATALOG
    const seedItem = SEED_KATALOG.find((k) => k.slug === cleanSlug)
    if (seedItem) {
      return {
        success: true,
        data: seedItem,
      }
    }

    return {
      success: false,
      error: `Produk dengan slug "${cleanSlug}" tidak ditemukan.`,
    }
  } catch (error) {
    console.error('[getKatalogItemBySlugAction Error]:', error)
    const seedItem = SEED_KATALOG.find((k) => k.slug === slug)
    if (seedItem) {
      return { success: true, data: seedItem }
    }
    return {
      success: false,
      error: 'Terjadi kesalahan saat memuat produk katalog.',
    }
  }
}

export type UpdateKatalogPayload = Partial<Omit<KatalogItem, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Memperbarui data inovasi/produk katalog yang sudah ada (Admin STP)
 */
export async function updateKatalogItemAction(
  id: string,
  payload: UpdateKatalogPayload
): Promise<ServerActionResult<{ id: string; updated: boolean }>> {
  try {
    if (!id) {
      return { success: false, error: 'ID produk wajib diisi.' }
    }

    const docRef = adminDb.collection('katalog_items').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      return { success: false, error: 'Produk katalog tidak ditemukan di Firestore.' }
    }

    const now = new Date().toISOString()
    const updateData: any = {
      ...payload,
      updatedAt: now,
    }

    await docRef.update(updateData)

    revalidatePath('/katalog')
    revalidatePath('/')
    if (payload.slug) {
      revalidatePath(`/katalog/${payload.slug}`)
    }

    return {
      success: true,
      data: { id, updated: true },
    }
  } catch (error) {
    console.error('[updateKatalogItemAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui produk katalog.',
    }
  }
}

/**
 * Menghapus katalog inovasi (Admin Only)
 */
export async function deleteKatalogItemAction(
  id: string
): Promise<ServerActionResult<{ deleted: boolean }>> {
  try {
    await adminDb.collection('katalog_items').doc(id).delete()
    revalidatePath('/katalog')
    revalidatePath('/')
    return { success: true, data: { deleted: true } }
  } catch (error) {
    console.error('[deleteKatalogItemAction Error]:', error)
    return { success: false, error: 'Gagal menghapus produk katalog.' }
  }
}

