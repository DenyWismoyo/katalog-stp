# 🗺️ Roadmap Pengembangan: Katalog Digital Solo Technopark (STP)

Dokumen ini menjadi acuan strategis dan teknis bertahap (*phased rollout*) pengembangan platform **Katalog Digital Solo Technopark**, mencakup implementasi 3 peran utama (**Admin**, **Operator**, dan **User Biasa/Publik**) serta pengalaman antarmuka responsif **Mobile-First & Desktop High-Tech**.

---

## 🎯 Visi Platform
Membangun platform etalase digital (*digital showcase & business matching hub*) kelas dunia yang mempertemukan hasil riset terapan, inovasi teknologi tenant binaan, dan fasilitas pengujian modern Solo Technopark dengan pelaku industri global, investor, UMKM, dan masyarakat luas.

---

## 📅 Roadmap Bertahap (Sprint 1 — 8)

```
┌─────────────────────────┐     ┌─────────────────────────┐
│ Phase 1: Showcase & UX  │ ──► │ Phase 2: Order Pipeline │
│ (Sprint 1-2)            │     │ (Sprint 3-4)            │
│ Publik, Search, Filter  │     │ Operator & User Tracking│
└─────────────────────────┘     └─────────────────────────┘
             │                               │
             ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ Phase 3: Admin Studio   │ ──► │ Phase 4: Analytics & AI │
│ (Sprint 5-6)            │     │ (Sprint 7-8)            │
│ CRUD Katalog & Tenant   │     │ Laporan, Export, PWA    │
└─────────────────────────┘     └─────────────────────────┘
```

---

### 🚀 Phase 1: Public Discovery & High-Aesthetics Showcase (Sprint 1 — 2)
> **Fokus Utama**: Fondasi antarmuka publik yang memukau, cepat, dan intuitif di smartphone maupun desktop monitor.

- [ ] **1.1 Design System & Responsive Shell**:
  - Implementasi tema *Cyber Blue*, *Deep Tech Navy*, *Glassmorphism*, dan *Subtle Slate Borders*.
  - Navigasi responsif: **Fixed Bottom Navigation Bar** di mobile (`< 768px`) dan **Header Glass Nav** di desktop (`>= 768px`).
  - Dark & Light mode toggle dengan transisi halus.
- [ ] **1.2 Beranda Utama (Hero & Spotlight)**:
  - Hero section futuristik dengan visual produk inovasi unggulan Solo Technopark.
  - Quick Filter 8 Klaster Teknologi STP dengan icon modern.
  - Ticker metrik statistik: Total Inovasi, Tenant Binaan, Tingkat Kesiapterapan (TRL), dan Hak Paten.
- [ ] **1.3 Katalog Explorer (Pencarian & Multi-Filter)**:
  - Input pencarian cepat (*instant debounce search*) berdasarkan nama produk, tenant, atau kata kunci.
  - Drawer filter geser di HP (*Mobile Filter Sheet*) & Sidebar filter lengket (*Sticky Sidebar*) di Desktop.
  - Filter kriteria: Klaster Teknologi, Rentang TRL (1 - 9), Status HAKI, Ketersediaan Komersial.
  - Grid kartu produk responsif dengan shimmer skeleton loading.
- [ ] **1.4 Halaman Detail Inovasi & Riset (`/katalog/[slug]`)**:
  - Galeri interaktif (carousel foto beresolusi tinggi + video demo produk).
  - Spesifikasi teknis terstruktur (satuan, dimensi, daya, kapasitas produksi).
  - Indikator visual skala TRL / Katsinov 1-9 bersertifikasi.
  - Tombol aksi utama: *Unduh Brosur PDF* dan *Ajukan Kerjasama / Pemesanan*.
- [ ] **1.5 Direktori Tenant & Inovator (`/tenant` & `/tenant/[id]`)**:
  - Profil startup, IKM binaan, dan laboratorium teknologi STP.
  - Portofolio seluruh produk inovasi yang dihasilkan tenant tersebut.

---

### 💼 Phase 2: Order Pipeline & User Inquiry Tracking (Sprint 3 — 4)
> **Fokus Utama**: Membuka jalur interaksi bisnis antara industri/masyarakat dengan Solo Technopark yang dikelola oleh **Role Operator**.

- [ ] **2.1 Formulir Permohonan Kerjasama & Order Publik**:
  - Form modular terintegrasi di modal detail produk atau halaman khusus `/inquiry`.
  - Pilihan tipe kepentingan:
    1. *Pembelian Produk / Lisensi Komersial*
    2. *Kerjasama Riset & Uji Coba Lapangan*
    3. *Sewa Fasilitas Lab / Workshop CNC / Coworking Space STP*
    4. *Konsultasi Inkubasi Startup*
  - Validasi Zod form (nama pemohon, institusi/PT, kontak WhatsApp, email, uraian kebutuhan).
  - Penomoran resi unik otomatis (format: `STP-ORD-YYYYMM-XXXX`).
- [ ] **2.2 Portal Pelacakan Permohonan untuk User Publik (`/tracking`)**:
  - User dapat memasukkan kode resi order atau login untuk melihat status secara transparan.
  - Tampilan visual *Timeline Stepper Progress*:
    `Diajukan` ➔ `Ditinjau Operator` ➔ `Dihubungi` ➔ `Pertemuan Teknis/Survei` ➔ `Kesepakatan (MoU/PO)` ➔ `Selesai`.
- [ ] **2.3 Dashboard Khusus Operator STP (`/(operator)/orders`)**:
  - Tampilan tabel interaktif & papan kanban status permohonan.
  - Filter order berdasarkan status, klaster, rentang tanggal, dan PIC.
  - Modal detail order: data pemohon, produk terkait, dan riwayat interaksi.
- [ ] **2.4 Fitur Tindak Lanjut Operator (Action Log & Notes)**:
  - Operator dapat memperbarui status order dengan satu klik.
  - Input catatan internal: *Hasil telepon*, *Notulensi zoom meeting*, *Jadwal survei lab*, *Draft kontrak MoU*.
  - Penugasan PIC (Person in Charge) staf STP untuk menangani pesanan terkait.

---

### 🛠️ Phase 3: Admin Catalog Studio & Tenant Management (Sprint 5 — 6)
> **Fokus Utama**: Memberikan kontrol penuh bagi **Role Admin** untuk mengelola seluruh ekosistem data.

- [ ] **3.1 Otentikasi & RBAC (Role-Based Access Control)**:
  - Sistem login terpadu (`/login`) dengan Firebase Auth.
  - Pemisahan hak akses otomatis: Admin, Operator, Tenant, dan User Biasa.
  - Middleware Next.js untuk memproteksi rute `/(admin)/*` dan `/(operator)/*`.
- [ ] **3.2 Admin Catalog Studio (`/(admin)/katalog`)**:
  - Form Wizard multi-langkah pembuatan katalog:
    - *Langkah 1: Identitas Produk* (Judul, tagline, deskripsi rich text, klaster).
    - *Langkah 2: Spesifikasi & TRL* (Katsinov 1-9, tabel spesifikasi key-value, target pasar).
    - *Langkah 3: Media Upload* (Drag & drop cover, galeri foto multiple, brosur PDF ke Storage `katalog-stp/`).
    - *Langkah 4: Legalitas & HAKI* (Nomor pendaftaran paten, merek dagang, hak cipta).
  - Quick action: Publikasikan (*Publish*), Simpan Draft, Arsipkan (*Archive*), Jadikan Produk Unggulan (*Feature*).
- [ ] **3.3 Manajemen Tenant & Inkubator (`/(admin)/tenant`)**:
  - CRUD profil startup/IKM, status legalitas badan hukum, kontak representatif, dan link sosial media.
  - Klasifikasi status inkubasi: *Pra-Inkubasi*, *Inkubasi Aktif*, *Alumni Mandiri*, *Mitra Strategis*.
- [ ] **3.4 Manajemen Kategori, Klaster & Fasilitas STP**:
  - Konfigurasi 8 klaster teknologi, icon, dan deskripsi fokus riset.
  - Manajemen master data fasilitas fisik STP (Lab IT, Workshop Manufaktur CNC, Wet Welding Tank, Gedung Diklat).

---

### 📊 Phase 4: Enterprise Analytics, Export & Integrasi Ekosistem (Sprint 7 — 8)
> **Fokus Utama**: Analitik bisnis cerdas, pelaporan formal ke Pemkot/Direksi, dan optimasi performa tingkat lanjut.

- [ ] **4.1 Dashboard Analitik Eksekutif**:
  - Visualisasi grafik tren (Recharts): Produk paling banyak dilihat, klaster teknologi paling diminati, rasio konversi order.
  - Statistik efisiensi kerja operator: Rata-rata waktu respon permohonan industri.
- [ ] **4.2 Ekspor Laporan Resmi**:
  - Ekspor data antrean order ke Excel (`xlsx`) untuk arsip administrasi.
  - Cetak resume lembar permohonan kerjasama & katalog resmi ke PDF berstandar format Pemkot Surakarta.
- [ ] **4.3 Progressive Web App (PWA) & Mobile Enhancements**:
  - File manifest & service worker untuk instalasi di layar utama ponsel Android & iOS.
  - Push notification update status pesanan bagi pengguna terdaftar.
- [ ] **4.4 Smart AI Innovation Assistant**:
  - Asisten pencarian cerdas berbasis semantik untuk merekomendasikan produk inovasi STP yang cocok dengan kebutuhan masalah industri pemohon.

---

## 👥 Matriks Tanggung Jawab Tim

| Modul / Fitur | Lead Layer | Target Sprint | PIC Utama |
|---------------|------------|---------------|-----------|
| Shell UI & Mobile Responsive | Layer 5 (Components) | Sprint 1 | Frontend Lead |
| Discovery & Filter Katalog | Layer 4 & 6 (Hooks & Pages) | Sprint 2 | Frontend Engineer |
| Order Ingestion & Form | Layer 3 & 5 (Actions & Form) | Sprint 3 | Fullstack Engineer |
| Operator Dashboard & Kanban | Layer 5 & 6 (Components & Pages) | Sprint 4 | Fullstack Engineer |
| Admin Catalog Studio | Layer 3 & 5 (Actions & Storage) | Sprint 5 | Backend / Cloud Lead |
| RBAC & User Management | Layer 2 & Middleware | Sprint 6 | Security Engineer |
| Analytics & PDF Export | Layer 5 & Lib | Sprint 7 | Frontend Engineer |
