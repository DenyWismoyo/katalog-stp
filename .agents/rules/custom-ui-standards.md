# 🎨 Rules: Standar Desain Custom UI & Reusable Component System

Dokumen ini memuat standar tampilan visual, estetika modern, token desain, dan aturan pembuatan komponen kustom untuk **Katalog Digital STP**.

---

## 1. Filosofi Desain: High-Tech, Sleek & Premium
Platform Katalog Digital Solo Technopark wajib menampilkan citra sebagai **Pusat Inovasi Teknologi Terdepan**:
- **Bukan Template Biasa**: Hindari desain datar, kaku, atau generic. Gunakan kedalaman (*depth*), border halus (*subtle borders*), efek kaca (*glassmorphism*), dan kontras yang seimbang.
- **Tipografi Tegas & Modern**: Gunakan font sans-serif berkarakter tech seperti *Plus Jakarta Sans* atau *Inter*.
- **Aksen Solo Technopark**: Dominasi warna biru elektrik (*Cyber Blue*), aksen *Cyan/Teal Inovasi*, dengan latar belakang bernuansa *Deep Tech Navy* atau *Clean Crisp Slate*.

---

## 2. Palet Token Warna Resmi (Tailwind Tokens)

| Token Name | Hex Code | Penggunaan Utama |
|------------|----------|------------------|
| `stp-primary-500` | `#0284C7` (Sky Blue) | Tombol aksi utama, link aktif, highlight teks |
| `stp-primary-600` | `#0369A1` | Hover state tombol utama |
| `stp-navy-950` | `#0B1120` | Background dark mode / header navigasi gelap |
| `stp-navy-900` | `#0F172A` | Background kartu gelap & surface card |
| `stp-accent-cyan` | `#06B6D4` | Badge teknologi, indikator TRL/Katsinov, glow effects |
| `stp-surface-light`| `#F8FAFC` | Background light mode umum |
| `stp-border-subtle`| `rgba(255, 255, 255, 0.08)` (Dark) / `#E2E8F0` (Light) | Border pemisah kartu dan input |

---

## 3. Hirarki Komponen Reusable

### A. Atoms / Primitives (`src/components/ui/`)
- Komponen terkecil tanpa konteks bisnis STP.
- Wajib memiliki varian prop (misal: `variant="primary" | "secondary" | "outline" | "ghost"`).
- Wajib menggunakan utility `cn(...)` dari `src/lib/utils/cn.ts` untuk penggabungan class Tailwind.
- Daftar komponen wajib:
  - `Button.tsx`: Tombol serbaguna dengan loading state spinner bawaan.
  - `Badge.tsx`: Label kecil untuk kategori, status ketersediaan, atau level TRL.
  - `Card.tsx`: Wadah konten dengan efek border elegan, hover lift (`hover:-translate-y-1 hover:shadow-lg`), dan transisi halus.
  - `Input.tsx` & `Select.tsx`: Input form modern dengan fokus ring yang halus (`focus:ring-2 focus:ring-sky-500/50`).
  - `Modal.tsx` / `Dialog.tsx`: Pop-up window dengan backdrop blur dan animasi fade/zoom.
  - `Skeleton.tsx`: Placeholder visual bernyawa (*shimmer animation*) saat data sedang di-load.

### B. Molecules & Shared Components (`src/components/shared/`)
- Komponen gabungan yang dapat dipakai di berbagai halaman:
  - `SearchBar.tsx`: Input pencarian cepat dengan debounce dan tombol clear.
  - `FilterChips.tsx`: Tombol pill geser untuk filter cepat (Klaster, TRL, Kategori).
  - `EmptyState.tsx`: Ilustrasi dan pesan bersahabat jika hasil pencarian katalog nihil.
  - `Pagination.tsx`: Kontrol navigasi halaman data.
  - `StatWidget.tsx`: Widget angka statistik (Jumlah Inovasi, Tenant, Hak Paten).

### C. Domain Organisms (`src/components/katalog/` & `src/components/tenant/`)
- Komponen yang merepresentasikan fitur bisnis Katalog Digital STP:
  - `KatalogCard.tsx`: Kartu produk inovasi (gambar cover, badge klaster, nama produk, nama tenant, rating/TRL, tombol detail).
  - `KatalogGrid.tsx`: Tata letak grid responsif (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
  - `KatalogFilterSidebar.tsx` & `KatalogFilterDrawer.tsx`: Filter desktop dan drawer mobile.
  - `KatalogDetailHero.tsx`: Showcase gambar produk, brosur download, spesifikasi teknis, dan tombol hubungi inovator.
  - `InquiryFormModal.tsx`: Formulir kontak/pemesanan inovasi bagi industri yang terhubung ke Firebase.

---

## 4. Standar Responsivitas & Mobile-First
- Desain wajib diuji dan tampil sempurna pada resolusi ponsel (**360px - 430px**), tablet (**768px**), dan desktop (**1024px - 1440px+**).
- **Target Sentuh Jempol**: Tombol navigasi dan aksi di ponsel minimal setinggi `h-11` (44px).
- **Mobile Navigation**: Sediakan drawer menu atau bottom bar yang mudah dijangkau saat diakses dari smartphone.
- **Filter Mobile**: Pada layar `< 768px`, panel filter wajib beralih menjadi sliding bottom-sheet atau drawer geser.

---

## 5. Larangan Desain
- ❌ Dilarang menggunakan warna solid dasar mentah (`#FF0000`, `#00FF00`, `#0000FF`).
- ❌ Dilarang membuat layout yang menyebabkan *horizontal scrollbar* tak sengaja pada mobile.
- ❌ Dilarang mengabaikan *loading state*: Pengguna tidak boleh melihat layar kosong membeku saat data sedang diambil.
- ❌ Dilarang membuat form tanpa indikator error yang jelas di bawah input.

---

## 6. Batasan Static Prerender & `<Suspense>`
- Setiap halaman atau komponen klien yang memanfaatkan hook `useSearchParams()` **WAJIB** dibungkus oleh `<Suspense fallback={...}>`.
- Hal ini adalah syarat mutlak kompilasi `next build` agar Next.js dapat melakukan prerender halaman statis tanpa memicu `PrerenderError`.

---

## 7. Pola Navigasi Admin Studio Terpadu (`AdminNav`)
- Seluruh halaman di bawah rute `/admin/*` wajib menyertakan komponen bar navigasi tab horizontal (`AdminNav`) di bagian atas tampilan.
- Tab wajib mendeteksi rute aktif menggunakan `usePathname()` dengan styling visual kontras (*Cyan/Sky Active Glow*).
- Sediakan akses cepat silang (*Cross-Role Switcher*) ke modul operasional (misal: tombol pintas ke Antrean Order Operator `/operator/orders`).

