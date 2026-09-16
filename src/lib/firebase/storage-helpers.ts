/**
 * Helper untuk membangun path berkas Firebase Storage
 * Namespace terisolasi sesuai NEXT_PUBLIC_FIREBASE_STORAGE_FOLDER ('katalog-stp')
 */

const STORAGE_ROOT = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_FOLDER || 'katalog-stp'

export interface StoragePathOptions {
  katalogId?: string
  tenantId?: string
  filename: string
}

export const storagePaths = {
  /** Path untuk cover utama produk katalog: katalog-stp/katalog/{katalogId}/cover-{filename} */
  katalogCover: (katalogId: string, filename: string) => {
    return `${STORAGE_ROOT}/katalog/${katalogId}/cover-${Date.now()}-${filename}`
  },

  /** Path untuk galeri produk katalog: katalog-stp/katalog/{katalogId}/gallery/{filename} */
  katalogGallery: (katalogId: string, filename: string) => {
    return `${STORAGE_ROOT}/katalog/${katalogId}/gallery/${Date.now()}-${filename}`
  },

  /** Path untuk brosur teknis PDF: katalog-stp/katalog/{katalogId}/brochure/{filename} */
  katalogBrochure: (katalogId: string, filename: string) => {
    return `${STORAGE_ROOT}/katalog/${katalogId}/brochure/${filename}`
  },

  /** Path untuk logo tenant: katalog-stp/tenant/{tenantId}/logo-{filename} */
  tenantLogo: (tenantId: string, filename: string) => {
    return `${STORAGE_ROOT}/tenant/${tenantId}/logo-${Date.now()}-${filename}`
  },
}
