'use server'

import { adminDb } from '@/lib/firebase/admin'
import { SEED_FACILITIES } from '@/data/seedData'
import { FacilityItem, FacilityCategory, ServerActionResult } from '@/types'

export interface FacilityFilterParams {
  category?: FacilityCategory | 'all'
  search?: string
}

/**
 * Mengambil daftar fasilitas & laboratorium riset bersama Solo Technopark
 */
export async function getFacilitiesAction(
  filters?: FacilityFilterParams
): Promise<ServerActionResult<FacilityItem[]>> {
  try {
    let queryRef = adminDb.collection('facilities') as FirebaseFirestore.Query

    if (filters?.category && filters.category !== 'all') {
      queryRef = queryRef.where('category', '==', filters.category)
    }

    const snapshot = await queryRef.get()

    let items: FacilityItem[] = []
    if (!snapshot.empty) {
      items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FacilityItem[]
    } else {
      items = [...SEED_FACILITIES]
      if (filters?.category && filters.category !== 'all') {
        items = items.filter((f) => f.category === filters.category)
      }
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim()
      items = items.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.tagline.toLowerCase().includes(q) ||
          f.location.toLowerCase().includes(q) ||
          f.equipmentList.some((eq) => eq.toLowerCase().includes(q))
      )
    }

    return {
      success: true,
      data: items,
    }
  } catch (error) {
    console.error('[getFacilitiesAction Error]:', error)
    return {
      success: true,
      data: SEED_FACILITIES,
    }
  }
}

/**
 * Mengambil detail fasilitas berdasarkan slug
 */
export async function getFacilityBySlugAction(
  slug: string
): Promise<ServerActionResult<FacilityItem>> {
  try {
    const cleanSlug = slug.trim().toLowerCase()
    if (!cleanSlug) {
      return { success: false, error: 'Slug fasilitas wajib disediakan.' }
    }

    const snapshot = await adminDb
      .collection('facilities')
      .where('slug', '==', cleanSlug)
      .limit(1)
      .get()

    if (!snapshot.empty) {
      const doc = snapshot.docs[0]
      return {
        success: true,
        data: { id: doc.id, ...doc.data() } as FacilityItem,
      }
    }

    const seed = SEED_FACILITIES.find((f) => f.slug === cleanSlug)
    if (seed) {
      return { success: true, data: seed }
    }

    return {
      success: false,
      error: `Fasilitas "${cleanSlug}" tidak ditemukan.`,
    }
  } catch (error) {
    console.error('[getFacilityBySlugAction Error]:', error)
    const seed = SEED_FACILITIES.find((f) => f.slug === slug)
    if (seed) return { success: true, data: seed }
    return { success: false, error: 'Gagal memuat data fasilitas.' }
  }
}

export interface CreateFacilityPayload {
  name: string
  slug?: string
  category: FacilityCategory
  categoryLabel?: string
  tagline: string
  description: string
  location: string
  capacity: string
  equipmentList: string[]
  specifications: { key: string; value: string }[]
  coverUrl: string
  galleryUrls?: string[]
  ratePerHour?: string
  ratePerDay?: string
  status: 'available' | 'maintenance' | 'booked'
  contactPerson?: string
}

const CATEGORY_LABELS: Record<FacilityCategory, string> = {
  manufaktur_cnc: 'Manufaktur Presisi & CNC',
  wet_welding: 'Underwater Wet Welding',
  ai_iot_lab: 'AI & Cyber Security Lab',
  diklat_hall: 'Gedung Diklat & Convention',
  studio_kreatif: 'Studio Game & Multimedia',
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Menambahkan data fasilitas / laboratorium baru ke Firestore
 */
export async function createFacilityAction(
  payload: CreateFacilityPayload
): Promise<ServerActionResult<{ id: string; slug: string }>> {
  try {
    if (!payload.name || !payload.category || !payload.location) {
      return { success: false, error: 'Nama fasilitas, kategori, dan lokasi wajib diisi.' }
    }

    const slug = payload.slug?.trim() ? generateSlug(payload.slug) : generateSlug(payload.name)
    const now = new Date().toISOString()

    const newFacility: Omit<FacilityItem, 'id'> = {
      name: payload.name.trim(),
      slug,
      category: payload.category,
      categoryLabel: payload.categoryLabel || CATEGORY_LABELS[payload.category] || 'Laboratorium STP',
      tagline: payload.tagline.trim(),
      description: payload.description.trim(),
      location: payload.location.trim(),
      capacity: payload.capacity.trim() || '20 Orang',
      equipmentList: payload.equipmentList.length > 0 ? payload.equipmentList : ['Peralatan Standar Industri'],
      specifications: payload.specifications || [],
      coverUrl: payload.coverUrl.trim() || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop',
      galleryUrls: payload.galleryUrls || [],
      ratePerHour: payload.ratePerHour?.trim() || '',
      ratePerDay: payload.ratePerDay?.trim() || '',
      status: payload.status || 'available',
      contactPerson: payload.contactPerson?.trim() || 'Layanan Lab STP (+62 812-3456-7890)',
      createdAt: now,
      updatedAt: now,
    }

    const docRef = await adminDb.collection('facilities').add(newFacility)

    return {
      success: true,
      data: { id: docRef.id, slug },
    }
  } catch (error) {
    console.error('[createFacilityAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menambahkan fasilitas.',
    }
  }
}

/**
 * Memperbarui data fasilitas laboratorium di Firestore
 */
export async function updateFacilityAction(
  id: string,
  payload: Partial<CreateFacilityPayload>
): Promise<ServerActionResult<{ id: string }>> {
  try {
    if (!id) {
      return { success: false, error: 'ID fasilitas wajib disediakan.' }
    }

    const docRef = adminDb.collection('facilities').doc(id)
    const docSnap = await docRef.get()

    if (!docSnap.exists) {
      // Jika dokumen belum ada di Firestore (misal data SEED), buat dokumen
      const seed = SEED_FACILITIES.find((f) => f.id === id)
      const now = new Date().toISOString()
      const initialData: Omit<FacilityItem, 'id'> = {
        name: payload.name || seed?.name || 'Fasilitas STP',
        slug: payload.slug || seed?.slug || generateSlug(payload.name || 'fasilitas'),
        category: payload.category || seed?.category || 'manufaktur_cnc',
        categoryLabel: payload.categoryLabel || seed?.categoryLabel || 'Fasilitas Riset STP',
        tagline: payload.tagline || seed?.tagline || '',
        description: payload.description || seed?.description || '',
        location: payload.location || seed?.location || 'Solo Technopark',
        capacity: payload.capacity || seed?.capacity || '30 Orang',
        equipmentList: payload.equipmentList || seed?.equipmentList || [],
        specifications: payload.specifications || seed?.specifications || [],
        coverUrl: payload.coverUrl || seed?.coverUrl || '',
        galleryUrls: payload.galleryUrls || seed?.galleryUrls || [],
        ratePerHour: payload.ratePerHour ?? seed?.ratePerHour ?? '',
        ratePerDay: payload.ratePerDay ?? seed?.ratePerDay ?? '',
        status: payload.status || seed?.status || 'available',
        contactPerson: payload.contactPerson ?? seed?.contactPerson ?? '',
        createdAt: seed?.createdAt || now,
        updatedAt: now,
      }
      await docRef.set(initialData)
      return { success: true, data: { id } }
    }

    const updateData: Record<string, any> = {
      ...payload,
      updatedAt: new Date().toISOString(),
    }

    if (payload.name && !payload.slug) {
      updateData.slug = generateSlug(payload.name)
    }

    if (payload.category && !payload.categoryLabel) {
      updateData.categoryLabel = CATEGORY_LABELS[payload.category] || 'Laboratorium STP'
    }

    await docRef.update(updateData)

    return {
      success: true,
      data: { id },
    }
  } catch (error) {
    console.error('[updateFacilityAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal memperbarui data fasilitas.',
    }
  }
}

/**
 * Menghapus data fasilitas dari Firestore
 */
export async function deleteFacilityAction(
  id: string
): Promise<ServerActionResult<{ deleted: boolean }>> {
  try {
    if (!id) {
      return { success: false, error: 'ID fasilitas wajib disediakan.' }
    }

    await adminDb.collection('facilities').doc(id).delete()
    return {
      success: true,
      data: { deleted: true },
    }
  } catch (error) {
    console.error('[deleteFacilityAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus fasilitas.',
    }
  }
}
