# 🤖 Agent Instructions — Katalog Digital STP (Solo Technopark)
> **Dokumen ini adalah Single Source of Truth (SSOT) untuk arsitektur, aturan pengkodean, dan roadmap pengembangan platform Katalog Digital STP.**

---

## 📍 Konteks Proyek

Kamu adalah Principal AI Engineer yang memimpin arsitektur dan pengembangan **Platform Katalog Digital Solo Technopark (STP)**.

Platform ini adalah **digital showcase, business matching hub, dan saluran interaksi resmi** antara Solo Technopark dengan:
- **Masyarakat umum** — edukasi produk inovasi dan riset terapan STP
- **Pelaku industri dan investor** — business matching, lisensi teknologi, kerjasama B2B/B2G
- **Akademisi dan peneliti** — kolaborasi riset dan uji coba
- **Pemerintah dan BUMN** — pengadaan produk inovasi (e-Katalog LKPP)
- **Startup dan UMKM** — program inkubasi dan mentoring STP

---

## 🔍 AUDIT SISTEM — STATUS SAAT INI (September 2026)

### ✅ Sudah Terimplementasi

| Fitur | File Utama | Status |
|-------|-----------|--------|
| Beranda Showcase + Hero | app/page.tsx | ✅ Berfungsi |
| Katalog Explorer + Filter | app/katalog/page.tsx | ✅ Berfungsi |
| Halaman Detail Inovasi | app/katalog/[slug]/ | ✅ Ada |
| Direktori Fasilitas | app/fasilitas/ | ✅ Ada |
| Direktori Tenant | app/tenant/ | ✅ Ada |
| Portal Login (Role-based) | app/portal/page.tsx | ✅ Demo login |
| Tracking Permohonan | app/tracking/page.tsx | ✅ Dengan fallback demo |
| Operator Orders Dashboard | app/operator/orders/page.tsx | ✅ Berfungsi |
| Admin Dashboard KPI | app/admin/page.tsx | ✅ Metrics + Sync DB |
| Admin Katalog Studio | app/admin/katalog/ | ✅ Ada |
| Admin Tenant Manager | app/admin/tenant/ | ✅ Ada |
| Admin Fasilitas Manager | app/admin/fasilitas/ | ✅ Ada |
| Server Actions Order | actions/order.ts | ✅ CRUD lengkap |
| Server Actions Katalog | actions/katalog.ts | ✅ CRUD lengkap |
| Server Actions Tenant | actions/tenant.ts | ✅ CRUD lengkap |
| Server Actions Facility | actions/facility.ts | ✅ CRUD lengkap |
| Server Actions Analytics | actions/analytics.ts | ✅ Dashboard metrics |
| Ekspor CSV/Excel | operator/orders/page.tsx | ✅ Berfungsi |
| WhatsApp Quick Action | operator/orders/page.tsx | ✅ Template pesan resmi |
| Types/Contracts | types/index.ts | ✅ Lengkap |
| Firestore Security Rules | firestore.rules | ✅ Dasar |
| Middleware RBAC | middleware.ts | ✅ Route protection |

### ❌ Gap Kritis — Belum Dibangun

| Fitur Penting | Prioritas | Dampak |
|---------------|-----------|--------|
| Formulir Inquiry Publik terdiferensiasi | 🔴 KRITIS | User tidak bisa berinteraksi |
| Pemisahan alur per tipe interaksi | 🔴 KRITIS | Form sama untuk semua kebutuhan |
| Sistem komunikasi resmi 2-arah | 🔴 KRITIS | Tidak ada jejak komunikasi di sistem |
| Registrasi User/Mitra Baru | 🔴 KRITIS | Tidak bisa daftar mandiri |
| TanStack Query Hooks (hooks/ kosong) | 🟠 TINGGI | Tidak ada client caching, re-fetch terus |
| CTA Terdiferensiasi di detail katalog | 🟠 TINGGI | Konversi lihat→ajukan terputus |
| Email konfirmasi otomatis saat order | 🟠 TINGGI | User tidak tahu permohonan diterima |
| Kanban Board Operator | 🟡 SEDANG | Manajemen visual kurang efisien |
| Dashboard Akun Mitra (/akun) | 🟡 SEDANG | Tidak bisa lihat semua riwayat |
| Thread Pesan Internal | 🟡 SEDANG | Bergantung sepenuhnya pada WA eksternal |
| Portal Tenant Mandiri | 🟡 SEDANG | Tenant tidak bisa input produk sendiri |
| PWA + Push Notification | 🟡 SEDANG | Mobile experience belum optimal |
| AI Recommendation Engine | 🟢 RENDAH | Nice-to-have |

---

## 👥 Arsitektur 4 Peran Pengguna

### 1. admin — Administrator STP
- Mengelola master data: katalog inovasi, riset terapan, klaster, tenant, fasilitas
- Mengatur status publikasi (draft→published→archived) dan Featured Items
- Manajemen akun dan penetapan wewenang (operator, tenant, user)
- Mengakses analitik eksekutif, audit log, dan laporan kinerja bisnis
- Konfigurasi master klaster, TRL, dan kategori fasilitas

### 2. operator — Operator Bisnis dan Layanan STP
- Mengelola seluruh antrean permohonan dari publik (semua jenis)
- Pipeline status SOP: pending→reviewed→contacted→survey→deal→completed/rejected
- Kirim notifikasi update ke pemohon (email/WA) langsung dari dashboard
- Catat log komunikasi dan notulensi di sistem (order_logs)
- Tugaskan PIC, set deadline, set prioritas per permohonan
- Ekspor laporan ke CSV/Excel/PDF
- LARANGAN: tidak bisa hapus katalog produk, tidak bisa ubah profil legalitas tenant

### 3. tenant — Inovator / Startup Binaan STP (Perlu Dibangun)
- Input produk inovasi dan riset mandiri (status draft, menunggu approval admin)
- Kelola galeri foto, video demo, brosur PDF produk sendiri
- Lihat dan respons permohonan khusus produk mereka
- Dashboard: views produk, jumlah inquiry, konversi deal

### 4. user / guest — Publik, Mitra, Akademisi, Investor
- Jelajah katalog publik dengan filter multi-dimensi (klaster, TRL, HAKI, ketersediaan)
- Lihat detail teknis, video demo, unduh brosur PDF
- Pilih jenis interaksi dengan form berbeda:
  - Pembelian Produk / Lisensi Komersial (pembelian_produk)
  - Kerjasama Riset dan Uji Coba (kerjasama_riset / uji_coba_prototipe)
  - Sewa Fasilitas Lab / Workshop (sewa_fasilitas_lab)
  - Konsultasi Inkubasi Startup (konsultasi_inkubasi)
  - Investasi / Business Matching (investasi — tambahkan ke InterestType)
- Lacak status permohonan real-time via kode resi STP-ORD-YYYYMM-XXXX
- (Opsional) Login untuk melihat riwayat semua permohonan di dashboard

---

## 🎯 ROADMAP PENGEMBANGAN DETAIL (Phase 1–5)

---

### PHASE 1: Fondasi Interaksi Publik — FORM INQUIRY TERDIFERENSIASI
Target: Sprint 1-2 | Prioritas: KRITIS
Tujuan: Publik bisa berinteraksi dengan cara yang tepat dan terstruktur per kebutuhan.

#### 1.1 Form Inquiry Multi-Tipe

5 mode form BERBEDA berdasarkan InterestType — masing-masing punya field tambahan unik:
- pembelian_produk: quantity, targetDeliveryDate, purchaseOrderRef, needsDemoFirst
- kerjasama_riset: researchScope, institutionType, researchDuration, fundingSource, expectedOutput
- uji_coba_prototipe: testingScope, labEnvironment, numberOfUnits, testingDuration
- sewa_fasilitas_lab: facilityId, rentalStartDate, rentalEndDate, purposeOfUse, numberOfParticipants
- konsultasi_inkubasi: startupStage, sectorFocus, currentTeamSize, problemStatement
- investasi (BARU di InterestType): investorType, investmentRange, portfolioUrl

File baru yang perlu dibuat:
- src/app/inquiry/page.tsx — Halaman inquiry umum tanpa produk spesifik
- src/app/inquiry/success/page.tsx — Halaman konfirmasi dengan nomor resi
- src/components/order/InquiryFormModal.tsx — Modal form dari detail produk
- src/components/order/InquiryFormPembelian.tsx
- src/components/order/InquiryFormRiset.tsx
- src/components/order/InquiryFormSewa.tsx
- src/components/order/InquiryFormInkubasi.tsx
- src/components/order/InquiryFormInvestasi.tsx

Update types/index.ts:
- Tambahkan 'investasi' ke InterestType
- Tambahkan field interestTypeMetadata, investorType, investmentRange, portfolioUrl ke OrderInquiryItem

#### 1.2 CTA Terdiferensiasi di Halaman Detail Katalog

Tombol aksi di /katalog/[slug] harus tampilkan pilihan yang jelas:
- Beli / Lisensi → Form Pembelian
- Kerjasama Riset → Form Riset
- Hubungi Langsung → WhatsApp/Email STP

#### 1.3 Konfirmasi dan Email Otomatis

- Tampilkan halaman sukses dengan nomor resi besar dan jelas setelah submit
- Kirim email konfirmasi ke pemohon via Firebase Extensions: Trigger Email
- Alert notifikasi ke operator bahwa ada permohonan baru

Update actions/order.ts:
- Tambahkan sendConfirmationEmailAction()
- Tambahkan sendOperatorAlertAction()

---

### PHASE 2: Sistem Komunikasi Resmi — DALAM SISTEM, BUKAN HANYA WHATSAPP
Target: Sprint 3-4 | Prioritas: TINGGI
Tujuan: Semua komunikasi tercatat di sistem, tidak bergantung pada WA eksternal.

#### 2.1 Thread Komunikasi Per Permohonan

Tambahkan tipe baru MessageThread ke types/index.ts:
- id, orderId, senderId, senderName, senderRole (operator/user/system)
- message, attachments[], isRead, createdAt

Firestore collection: message_threads

File baru:
- src/app/operator/orders/[orderId]/page.tsx — Detail order + thread pesan
- src/components/order/MessageThread.tsx — Komponen thread real-time
- src/actions/message.ts — Server actions kirim dan baca pesan

#### 2.2 Notifikasi Multi-Channel dari Operator

Tambahkan actionType baru di OrderLogItem:
- message_sent — pesan dalam sistem terkirim
- meeting_scheduled — jadwal meeting/survey disepakati
- document_shared — MoU/kontrak dibagikan ke pemohon

#### 2.3 Portal Tracking Diperkaya

Halaman /tracking perlu menampilkan:
- Thread komunikasi publik (pesan yang diizinkan dilihat pemohon)
- Dokumen yang dibagikan operator (MoU draft, invoice)
- Jadwal meeting/survey yang telah disepakati
- CTA untuk balas pesan (jika sudah login)

---

### PHASE 3: Manajemen Akun — DASHBOARD MITRA DAN PORTAL TENANT
Target: Sprint 5-6 | Prioritas: TINGGI
Tujuan: User bisa registrasi, pantau semua permohonan, dan tenant bisa input produk sendiri.

#### 3.1 Registrasi User/Mitra Baru

File baru:
- src/app/daftar/page.tsx — Form registrasi mitra/user baru
- Update src/lib/auth/session.ts — Tambahkan registerUserAction()

#### 3.2 Dashboard Mitra (/akun)

File baru:
- src/app/akun/page.tsx — Profil dan ringkasan akun
- src/app/akun/permohonan/page.tsx — Daftar semua permohonan user
- src/app/akun/permohonan/[orderId]/page.tsx — Detail + thread pesan
- src/app/akun/favorit/page.tsx — Watchlist produk favorit

Fitur watchlist: user bisa simpan produk ke favorit untuk referensi kemudian
Tambahkan collection user_watchlists ke Firestore

#### 3.3 Portal Tenant Mandiri (/tenant-portal)

File baru:
- src/app/tenant-portal/page.tsx — Dashboard tenant
- src/app/tenant-portal/produk/page.tsx — Kelola produk inovasi
- src/app/tenant-portal/produk/baru/page.tsx — Form tambah produk (submit ke draft)
- src/app/tenant-portal/inquiry/page.tsx — Inquiry yang masuk ke produk mereka
- src/app/tenant-portal/analytics/page.tsx — Views dan conversion rate produk

---

### PHASE 4: Operator Dashboard Diperkaya + SLA Management
Target: Sprint 7-8 | Prioritas: SEDANG-TINGGI
Tujuan: Operator lebih efisien, ada SLA tracking, ada kanban board.

#### 4.1 Kanban Board Visual

File baru:
- src/app/operator/kanban/page.tsx — Kanban view dengan drag-and-drop
- src/components/order/KanbanBoard.tsx — Board dengan kolom per status
- src/components/order/KanbanCard.tsx — Card order di kanban

Kolom: PENDING | DITINJAU | DIHUBUNGI | SURVEY | DEAL | SELESAI

#### 4.2 SLA dan Deadline Tracking

Tambahkan ke OrderInquiryItem:
- slaDeadline: string — batas waktu respons
- slaStatus: 'on_track' | 'at_risk' | 'breached'
- responseTimeHours: number — waktu dari submit ke first response

Dashboard operator wajib tampilkan indikator SLA per order (warna hijau/kuning/merah).

#### 4.3 Laporan Export Diperkaya

- Excel dengan multi-sheet: Summary, Detail Permohonan, Log Komunikasi
- PDF resume permohonan individual dengan kop surat STP
- Laporan bulanan otomatis ke email Kepala STP

---

### PHASE 5: Analytics Lanjutan + AI + PWA
Target: Sprint 9-10 | Prioritas: RENDAH-SEDANG

#### 5.1 Dashboard Analytics Eksekutif

- Grafik tren views katalog per bulan, klaster terpopuler
- Funnel konversi: views katalog→inquiry→contacted→deal
- Efisiensi operator: rata-rata response time, % penyelesaian SLA

#### 5.2 Progressive Web App (PWA)

- Konfigurasi next-pwa di next.config.ts
- Service worker + manifest untuk install di HP
- Push notification update status permohonan ke user terdaftar

#### 5.3 AI Innovation Assistant

- Semantic search via Firebase AI Logic / Vertex AI
- Input: deskripsikan kebutuhan → output: rekomendasi produk STP yang cocok
- Chatbot FAQ berbasis Gemini

---

## 🗺️ Peta Alur Interaksi Lengkap

PUBLIK / CALON MITRA / INVESTOR
→ Jelajah Beranda (/)
→ Eksplorasi Katalog (/katalog) dengan filter Klaster|TRL|HAKI
→ Halaman Detail Produk (/katalog/[slug])
  → Pilih jenis interaksi (5 pilihan berbeda)
  → Submit Form Permohonan (/inquiry)
  → Terima email konfirmasi + nomor resi
→ Lacak Status (/tracking?code=STP-ORD-...)
  → Lihat timeline + catatan operator
  → (Jika login) Balas pesan operator
→ Dashboard Akun (/akun) [Butuh login]
  → Riwayat semua permohonan
  → Thread komunikasi per permohonan
  → Watchlist produk favorit

OPERATOR STP
→ Dashboard Operator (/operator/orders atau /operator/kanban)
→ Buka detail permohonan (side drawer)
  → Update status pipeline (SOP-compliant)
  → Kirim pesan ke pemohon dalam sistem
  → Upload dokumen MoU/kontrak
  → Quick WhatsApp template
  → Jadwalkan meeting/survey
→ SLA dashboard (on-track/at-risk/breached)
→ Ekspor laporan CSV/Excel/PDF

ADMIN STP
→ Command Center (/admin) — KPI Dashboard
→ Studio Katalog (/admin/katalog) — CRUD inovasi
→ Tenant Manager (/admin/tenant) — CRUD tenant
→ Fasilitas (/admin/fasilitas) — CRUD fasilitas
→ User Management (/admin/users) — Semua akun dan role
→ Analytics (/admin/analytics)

---

## 📐 Arsitektur 6 Layer

src/
├── types/                 # Layer 1: Kontrak TypeScript murni
├── lib/
│   ├── firebase/          # Layer 2: Firebase Client dan Admin SDK
│   └── utils/             # Helper (cn, formatting, slugify, generateTrackingCode)
├── actions/               # Layer 3: Server Actions write operations
│   ├── order.ts           # CRUD orders_inquiries + order_logs
│   ├── katalog.ts         # CRUD katalog_items
│   ├── tenant.ts          # CRUD tenants
│   ├── facility.ts        # CRUD facilities
│   ├── analytics.ts       # Dashboard metrics
│   ├── message.ts         # [TODO Phase 2] Thread komunikasi
│   └── seed.ts            # Sinkronisasi data awal
├── hooks/                 # Layer 4: TanStack Query Hooks (KOSONG — PERLU DIISI!)
│   ├── useKatalog.ts      # [TODO] useKatalogItems, useKatalogDetail
│   ├── useOrders.ts       # [TODO] useOrdersList, useOrderDetail
│   ├── useMessages.ts     # [TODO] useMessageThread real-time
│   └── useFacilities.ts   # [TODO] useFacilityList
├── components/            # Layer 5: Reusable UI
│   ├── ui/                # Primitives (Button, Badge, Card, Modal, Input, Sheet)
│   ├── layout/            # Layout shell
│   ├── shared/            # Komponen umum
│   ├── katalog/           # Domain katalog dan inovasi
│   ├── order/             # Domain order dan tracking
│   │   ├── OrderTimeline.tsx       # ✅ Ada
│   │   ├── InquiryFormModal.tsx    # [TODO Phase 1]
│   │   ├── MessageThread.tsx       # [TODO Phase 2]
│   │   └── KanbanBoard.tsx         # [TODO Phase 4]
│   ├── facility/          # Domain fasilitas
│   └── tenant/            # Domain tenant dan inovator
└── app/                   # Layer 6: Next.js App Router (Thin Orchestrators)
    ├── page.tsx            # ✅ Beranda
    ├── katalog/            # ✅ Explorer + [slug] detail
    ├── fasilitas/          # ✅ Direktori fasilitas
    ├── tenant/             # ✅ Direktori tenant
    ├── tracking/           # ✅ Lacak permohonan
    ├── portal/             # ✅ Login Admin/Operator/User
    ├── inquiry/            # [TODO Phase 1] Form permohonan publik
    ├── daftar/             # [TODO Phase 3] Registrasi mitra baru
    ├── akun/               # [TODO Phase 3] Dashboard mitra
    ├── operator/
    │   ├── orders/         # ✅ Manajemen antrean list view
    │   └── kanban/         # [TODO Phase 4] Kanban board
    └── admin/              # ✅ Command Center

---

## 📱🖥️ Aturan UI: Mobile-First dan Desktop High-Tech

### Mobile (< 768px)
- Fixed Bottom Navigation Bar: Beranda | Katalog | Inquiry | Lacak | Akun
- Padding wajib: pb-24 di semua halaman konten
- Mobile Filter Sheet: Drawer bawah untuk filter klaster dan TRL
- Touch Friendly: Semua tombol utama minimal h-11 (44px)
- Form Inquiry di Mobile: Wizard step-by-step (satu field per layar)

### Desktop (>= 768px)
- Glassmorphism Header Nav: Sticky top-0 dengan efek blur
- Sticky Sidebar Filter: Filter menempel di kiri saat scroll
- Split-View Dashboard: Admin dan Operator pakai side drawer kanan
- Form Inquiry di Desktop: Dua kolom, semua field terlihat sekaligus

---

## 🛡️ Aturan Keamanan dan Basis Data

- Firebase Named Database: katalog-stp (NEXT_PUBLIC_FIREBASE_DATABASE_ID=katalog-stp)
- Firebase Storage Namespace: katalog-stp/ (NEXT_PUBLIC_FIREBASE_STORAGE_FOLDER=katalog-stp)
- No Scattered Mock Data: Dilarang hardcode array dummy di file UI — gunakan TanStack Query hooks atau clean empty state. Seluruh seed data di src/data/seedData.ts
- Fallback Data di Operator: File operator/orders/page.tsx BOLEH punya FALLBACK_ORDERS untuk demo
- Firestore Rules: Setiap collection wajib punya rules tepat — jangan allow read, write: if true
- Server Actions: Semua operasi write WAJIB di actions/*.ts dengan use server — tidak boleh di client component

## 🌐 Bahasa dan Komunikasi

- UI dan Dokumentasi: Bahasa Indonesia
- Kode (fungsi, variabel, tipe TypeScript): Bahasa Inggris
- Komentar kode: Bahasa Indonesia

---

## 🔢 Prioritas Pengerjaan Berikutnya (Backlog)

1. KRITIS — Buat /inquiry page dengan 5 form terdiferensiasi (Phase 1.1)
2. KRITIS — Integrasikan CTA di halaman detail katalog /katalog/[slug]
3. KRITIS — Isi direktori hooks/ dengan TanStack Query hooks
4. KRITIS — Buat /daftar page untuk registrasi mitra baru (Phase 3.1)
5. TINGGI — Email konfirmasi otomatis (Firebase Extensions: Trigger Email)
6. TINGGI — Thread komunikasi per permohonan (Phase 2.1)
7. TINGGI — Portal Tracking diperkaya dengan pesan operator dan dokumen
8. SEDANG — Dashboard Akun Mitra (/akun) (Phase 3.2)
9. SEDANG — Kanban Board Operator (Phase 4.1)
10. SEDANG — Portal Tenant Mandiri (Phase 3.3)

---

## 🧠 Prinsip Pengembangan Platform (Persisted dari Audit September 2026)

### Prinsip 1: Diferensiasi Interaksi adalah Prioritas Tertinggi
Jangan pernah membuat satu form umum untuk semua jenis kebutuhan pengguna.
Setiap InterestType WAJIB memiliki:
- Form dengan field unik yang relevan per tipe kebutuhan
- Alur halaman yang berbeda (wizard step di mobile, dual-column di desktop)
- Email konfirmasi dengan konten yang disesuaikan per tipe
- Pipeline tindak lanjut yang disesuaikan di sisi operator

### Prinsip 2: Audit Sebelum Build
Setiap kali diminta membangun fitur baru, selalu cek AGENTS.md bagian
"Gap Kritis" dan "Backlog" terlebih dahulu. Jangan build sesuatu yang sudah ada
atau yang bertentangan dengan arsitektur yang disepakati.

### Prinsip 3: Komunikasi Wajib Tercatat di Sistem
Fitur WhatsApp Quick Action hanya sebagai jembatan sementara.
Semua komunikasi resmi operator ke pemohon HARUS tersimpan di Firestore
collection message_threads agar ada audit trail yang bisa diaudit sewaktu-waktu.
Operator tidak boleh hanya mengandalkan WhatsApp/email eksternal.

### Prinsip 4: hooks/ Wajib Diisi Sebelum Fitur Baru
Direktori hooks/ yang kosong adalah technical debt aktif. Sebelum membangun
fitur baru yang butuh data fetching, buat TanStack Query hook dulu di hooks/.
Jangan tambahkan useEffect + direct action call di komponen baru — semua read
harus melalui hooks TanStack Query agar ada client-side caching yang efisien.

### Prinsip 5: Setiap Permohonan Punya Kode Resi Unik yang Dipromosikan
Format wajib: STP-ORD-YYYYMM-XXXX (contoh: STP-ORD-202609-F89A)
Kode ini HARUS ditampilkan besar dan jelas di:
- Halaman sukses setelah submit form
- Email konfirmasi ke pemohon
- Dashboard akun mitra
- Halaman tracking /tracking
Ini adalah satu-satunya identifier yang dipakai publik untuk melacak permohonan.

### Prinsip 6: Tema Bersih (Clean White & Royal Blue) & Desain Terpusat di globals.css
- Seluruh antarmuka Katalog Digital STP menggunakan tema dasar Putih Bersih (Clean White `#ffffff`/`#f8fafc`) dengan aksen utama Biru Royal/Sapphire (`#0066cc` / `#0284c7`) yang profesional, terang, dan elegan.
- DILARANG menggunakan background pitch-black sebagai tema utama default.
- Seluruh token warna (background, surface, border, primary, secondary, text-primary, text-muted), bayangan halus (soft elevation shadows), dan keyframe animasi WAJIB tersentralisasi di `src/app/globals.css` melalui variabel CSS `:root`.
- Komponen UI wajib mengonsumsi variabel CSS terpusat atau utility class semantik (`.stp-card`, `.stp-button`, `.glass-header-clean`), bukan hardcoding warna gelap.
