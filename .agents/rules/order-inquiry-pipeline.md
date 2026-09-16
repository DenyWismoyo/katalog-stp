# 📦 Rules: Alur & Manajemen Pemesanan (Order & Inquiry Pipeline)

Dokumen ini mendefinisikan aturan baku untuk siklus hidup pesanan, permohonan kerjasama inovasi, dan pemanfaatan fasilitas Solo Technopark yang dikelola oleh **Role Operator**.

---

## 1. Siklus Hidup & Status Pipeline Pesanan

Setiap pesanan atau permohonan kerjasama melewati 6 tahapan status standar:

```
[ pending ] ──► Permohonan baru masuk dari publik / calon mitra
     │
     ▼
[ reviewed ] ──► Operator memvalidasi kelengkapan data & profil pemohon
     │
     ▼
[ contacted ] ──► Operator menghubungi pemohon via WhatsApp / Email resmi STP
     │
     ▼
[ survey ] ──► Tahap pembahasan teknis, demo prototipe, atau survei lokasi lab
     │
     ▼
[ deal ] ──► Kesepakatan tercapai (Penerbitan PO, Kontrak Lisensi, atau MoU)
     │
     ├──► [ completed ] (Layanan/Produk berhasil diserahkan & selesai)
     └──► [ rejected / cancelled ] (Tidak tercapai kesepakatan / dibatalkan)
```

### Matriks Validasi Transisi Status (State Machine Guardrail):
Setiap perubahan status wajib mematuhi matriks transisi berikut (dilarang loncat status secara tidak wajar):
```typescript
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['reviewed', 'rejected'],
  reviewed: ['contacted', 'rejected'],
  contacted: ['survey', 'deal', 'rejected'],
  survey: ['deal', 'rejected'],
  deal: ['completed', 'rejected'],
  completed: [],
  rejected: [],
}
```

---

## 2. Penomoran Resi Unik Pemesanan (Order Tracking Code)
Setiap pesanan wajib memiliki nomor registrasi unik yang mudah dibaca dan dilacak oleh pemohon:
- **Format**: `STP-[KODE_KLASTER]-[TAHUN_BULAN]-[4_DIGIT_ACAK]`
- **Contoh**:
  - `STP-AI-202609-8472` (Inquiry Klaster AI & Software)
  - `STP-CNC-202609-3190` (Inquiry Klaster Manufaktur & CNC)
  - `STP-FAS-202609-5512` (Permohonan Sewa Fasilitas / Lab)

Nomor ini diberikan langsung di layar konfirmasi dan dikirimkan via email konfirmasi kepada pemohon.

---

## 3. Struktur Koleksi Firestore: `orders_inquiries`
Path: `orders_inquiries/{orderId}`

```typescript
interface OrderInquiryDocument {
  id: string                    // UUID internal Firestore
  trackingCode: string          // Contoh: "STP-AI-202609-8472"
  
  // Referensi Objek
  katalogId?: string            // ID produk (jika dari halaman katalog)
  katalogTitle?: string         // Denormalisasi nama produk
  tenantId?: string             // ID tenant pemilik inovasi
  tenantName?: string           // Denormalisasi nama tenant
  facilityId?: string           // ID fasilitas STP (jika sewa sarana)

  // Data Pemohon
  userId?: string               // UID akun (jika user login)
  senderName: string            // Nama lengkap penanggung jawab
  senderEmail: string           // Email korespondensi
  senderPhone: string           // Nomor WhatsApp aktif (+62...)
  organizationName: string      // Nama PT, CV, Instansi, atau Universitas
  organizationType: 'pt' | 'cv' | 'bumn' | 'pemerintah' | 'akademisi' | 'perorangan'
  
  // Detail Kebutuhan
  interestType: 
    | 'pembelian_produk'        // Beli lisensi / unit komersial
    | 'kerjasama_riset'         // Joint R&D / Co-development
    | 'uji_coba_prototipe'      // Piloting / Sandbox testing
    | 'sewa_fasilitas_lab'      // Penggunaan CNC, Welding Tank, Studio
    | 'konsultasi_inkubasi'     // Pendaftaran tenant baru
  message: string               // Uraian spesifikasi kebutuhan
  attachmentUrls?: string[]     // Dokumen TOR / NDA / Surat Resmi (Storage katalog-stp/)
  estimatedBudget?: string      // Perkiraan alokasi anggaran (opsional)

  // Manajemen Operator
  status: 'pending' | 'reviewed' | 'contacted' | 'survey' | 'deal' | 'completed' | 'rejected'
  assignedOperatorId?: string   // UID operator yang ditugaskan
  assignedOperatorName?: string // Nama operator
  priority: 'normal' | 'high' | 'urgent'
  
  // Timestamp
  createdAt: string             // ISO 8601 UTC
  updatedAt: string             // ISO 8601 UTC
  closedAt?: string             // Tanggal status deal/completed/rejected
}
```

---

## 4. Struktur Sub-Koleksi: `order_logs` (Riwayat Tindak Lanjut)
Path: `orders_inquiries/{orderId}/logs/{logId}`

Setiap kali operator mengubah status atau melakukan kontak dengan pemohon, wajib mencatat log:

```typescript
interface OrderLogItem {
  id: string
  orderId: string
  operatorId: string
  operatorName: string
  actionType: 'status_change' | 'whatsapp_contact' | 'email_sent' | 'meeting_held' | 'document_uploaded'
  previousStatus?: string
  newStatus?: string
  notes: string                 // Catatan hasil komunikasi atau alasan penolakan
  isPublicToUser: boolean       // True jika catatan ini boleh dibaca oleh pemohon di portal tracking
  createdAt: string             // ISO 8601 UTC
}
```

---

## 5. Standar Responsivitas Operator (SLA Kerja)
- **Status `pending` ➔ `reviewed`**: Maksimal **1 x 24 jam** hari kerja.
- **Kontak Pertama ke Pemohon**: Maksimal **2 x 24 jam** sejak permohonan masuk.
- Operator dilarang menutup pesanan (*status `rejected`*) tanpa menyertakan alasan tertulis yang dapat dipertanggungjawabkan pada log tindak lanjut.

---

## 6. Adapter Inquiry Polimorfik Lintas Modul
- Komponen `InquiryModal` wajib mendukung permohonan yang berasal dari produk inovasi (`katalogItem`) maupun sarana laboratorium (`facilityItem`).
- Modul pemanggil wajib meneruskan `initialInterestType` yang relevan (misal: `'sewa_fasilitas_lab'` untuk fasilitas atau `'kerjasama_riset'` untuk produk katalog).
- Seluruh permohonan menghasilkan kode resi unik berstandar nasional `STP-ORD-YYYYMM-XXXX` yang dapat dilacak oleh pelanggan di portal `/tracking`.
