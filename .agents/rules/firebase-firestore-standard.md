# 🔥 Rules: Standar Data Flow Firebase & Firestore

Dokumen ini memuat standar skema basis data Firestore, konvensi nama koleksi, alur Firebase Storage, serta aturan otentikasi pada proyek **Katalog Digital STP**.

---

## 1. Konfigurasi Environment Firebase
Proyek ini terhubung ke Firebase Project `teknopark-surakarta` dengan **Named Database** dan **Storage Namespace** terisolasi agar tidak bercampur dengan aplikasi lain (misal Presensi ASN):

```env
# Client-side Safe (NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=teknopark-surakarta.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=teknopark-surakarta
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=teknopark-surakarta.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=831800993201
NEXT_PUBLIC_FIREBASE_APP_ID=1:831800993201:web:...
NEXT_PUBLIC_FIREBASE_DATABASE_ID=katalog-stp
NEXT_PUBLIC_FIREBASE_STORAGE_FOLDER=katalog-stp

# Server-only (Private Admin SDK)
FIREBASE_ADMIN_PROJECT_ID=teknopark-surakarta
FIREBASE_DATABASE_ID=katalog-stp
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-...@teknopark-surakarta.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 2. Struktur Koleksi Firestore Utama

### A. Koleksi `katalog_items` (Produk Inovasi & Riset)
Path: `katalog_items/{katalogId}`
- `id`: string (slug-friendly unik, contoh: `drone-pemantau-panen-ai`)
- `title`: string
- `slug`: string (digunakan untuk route `/katalog/[slug]`)
- `tagline`: string
- `description`: string (markdown/rich-text)
- `klasterId`: string (`ai-software`, `manufaktur-cnc`, `robotika`, dll)
- `tenantId`: string (referensi ke koleksi `tenant`)
- `tenantName`: string (denormalisasi untuk performa render cepat)
- `trl`: number (1 - 9)
- `coverUrl`: string
- `galleryUrls`: string[]
- `brochurePdfUrl`?: string
- `videoUrl`?: string
- `specifications`: Array<{ key: string, value: string }>
- `targetMarket`: string[]
- `hakiStatus`: `'belum'` | `'terdaftar'` | `'granted'` (Paten, Hak Cipta, Merek)
- `status`: `'draft'` | `'published'` | `'archived'`
- `isFeatured`: boolean
- `viewCount`: number
- `createdAt`: string (ISO 8601)
- `updatedAt`: string (ISO 8601)

### B. Koleksi `tenant` (Inovator & Startup Binaan)
Path: `tenant/{tenantId}`
- `id`: string (slug)
- `name`: string
- `legalName`: string (PT / CV / Koperasi)
- `logoUrl`: string
- `bannerUrl`: string
- `klasterId`: string
- `about`: string
- `website`: string
- `email`: string
- `phone`: string
- `address`: string
- `socialLinks`: { linkedin?: string, instagram?: string, github?: string }
- `incubationStatus`: `'pra-inkubasi'` | `'inkubasi'` | `'alumni'` | `'mitra-industri'`
- `batchYear`: number
- `isActive`: boolean
- `createdAt`: string
- `updatedAt`: string

### C. Koleksi `orders_inquiries` (Permohonan Kerjasama & Pemesanan)
Path: `orders_inquiries/{orderId}`
- `id`: string (UUID / Auto ID)
- `trackingCode`: string (format: `STP-ORD-YYYYMM-XXXX`)
- `katalogId`: string
- `katalogTitle`: string
- `tenantId`: string
- `tenantName`: string
- `senderName`: string
- `senderEmail`: string
- `senderPhone`: string
- `organizationName`: string
- `organizationType`: `'pt'` | `'cv'` | `'bumn'` | `'pemerintah'` | `'akademisi'` | `'perorangan'`
- `interestType`: `'pembelian_produk'` | `'kerjasama_riset'` | `'uji_coba_prototipe'` | `'sewa_fasilitas_lab'` | `'konsultasi_inkubasi'`
- `message`: string
- `estimatedBudget`?: string
- `status`: `'pending'` | `'reviewed'` | `'contacted'` | `'survey'` | `'deal'` | `'completed'` | `'rejected'`
- `assignedOperatorId`?: string
- `assignedOperatorName`?: string
- `priority`: `'normal'` | `'high'` | `'urgent'`
- `createdAt`: string (ISO 8601)
- `updatedAt`: string (ISO 8601)

### D. Koleksi `order_logs` (Histori Tindak Lanjut & Audit Trail)
Path: `order_logs/{logId}`
- `id`: string
- `orderId`: string
- `operatorId`: string
- `operatorName`: string
- `actionType`: `'status_change'` | `'whatsapp_contact'` | `'email_sent'` | `'meeting_held'` | `'document_uploaded'`
- `previousStatus`?: OrderStatus
- `newStatus`?: OrderStatus
- `notes`: string
- `isPublicToUser`: boolean
- `createdAt`: string (ISO 8601)

---

## 3. Konvensi Firebase Storage
Media wajib disimpan di dalam namespace `katalog-stp/` (sesuai `NEXT_PUBLIC_FIREBASE_STORAGE_FOLDER`):
- Gambar sampul katalog: `katalog-stp/katalog/{katalogId}/cover-{timestamp}.webp`
- Galeri foto katalog: `katalog-stp/katalog/{katalogId}/gallery/{filename}`
- Brosur teknis PDF: `katalog-stp/katalog/{katalogId}/brochure/{filename}.pdf`
- Logo tenant: `katalog-stp/tenant/{tenantId}/logo-{timestamp}.webp`

**Ketentuan Unggahan**:
- Gambar sampul wajib dikompresi (format modern `.webp` atau `.jpg`, maksimal ukuran **2 MB**).
- Dokumen PDF dibatasi maksimal **10 MB**.
- Seluruh berkas di bawah path `katalog-stp/**` bersifat publik untuk keperluan showcase website.

---

## 4. Prinsip Firestore Security Rules
- Publik (tanpa login): Hanya memiliki izin `read` untuk dokumen dengan `status == 'published'` dan `tenant` dengan `isActive == true`.
- Pengelola/Admin STP: Izin penuh `read` dan `write` pada seluruh koleksi.
- Tenant: Izin `update` hanya pada dokumen katalog dan profil tenant miliknya sendiri.
