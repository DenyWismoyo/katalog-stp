# 🏛️ Rules: Arsitektur 6 Layer & Pemisahan Tanggung Jawab (Separation of Concerns)

Dokumen ini mendefinisikan aturan ketat pemisahan layer kode pada proyek **Katalog Digital STP**. Setiap pengembang atau agen AI wajib mematuhi batasan tanggung jawab antar layer berikut.

---

## Diagram Alur Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Type Contract & Entities (src/types/)             │
│  - Murni deklarasi tipe TypeScript, DTOs, dan Enums         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Digunakan oleh seluruh layer
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Infrastructure / Cloud Driver (src/lib/firebase/) │
│  - Firebase Client SDK (Auth, Firestore, Storage)           │
│  - Firebase Admin SDK (Server-only driver)                  │
└──────────────────┬───────────────────────┬──────────────────┘
                   │ Digunakan saat Write   │ Digunakan saat Read
                   ▼                       ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│ Layer 3: Server Actions      │ │ Layer 4: Custom Hooks       │
│ (src/actions/)               │ │ (src/hooks/)                │
│ - Mutasi (Create/Update/Del) │ │ - Read / Data Fetching      │
│ - 'use server' & Zod validasi│ │ - TanStack React Query v5   │
│ - Menghasilkan revalidatePath│ │ - queryKey caching strategy │
└──────────────┬───────────────┘ └──────────────┬──────────────┘
               │                                │
               └───────────────┬────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 5: Reusable UI Components (src/components/)          │
│  - ui/: Primitives atomik murni (Button, Input, Card, Modal)│
│  - shared/: Komponen pembantu (Search, Filter, EmptyState)  │
│  - katalog/ & tenant/: Komponen spesifik domain bisnis      │
│  - layout/: Shell navigasi (Navbar, Footer, MobileNav)      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 6: Page Orchestration (src/app/)                     │
│  - Next.js App Router (page.tsx, layout.tsx, loading.tsx)   │
│  - Thin Orchestrator: Hanya memanggil hooks/components      │
│  - Pengaturan SEO metadata, breadcrumbs, dan routing params │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Layer 1: Type Contract (`src/types/`)
- **Tanggung Jawab**: Mendefinisikan kontrak data tunggal (*Single Source of Truth*) untuk model entitas, filter query, form values, dan respon server.
- **Batasan**:
  - Dilarang mengimpor React, JSX, Tailwind, atau Firebase SDK di dalam layer ini.
  - File utama: `src/types/index.ts` (dapat dipecah menjadi `katalog.ts`, `tenant.ts`, `layanan.ts`).

## 2. Layer 2: Infrastructure Driver (`src/lib/firebase/`)
- **Tanggung Jawab**: Inisialisasi koneksi Firebase, konfigurasi client auth/firestore/storage, dan server admin SDK.
- **Batasan**:
  - `src/lib/firebase/config.ts`: Client-side safe, hanya menggunakan env `NEXT_PUBLIC_*`.
  - `src/lib/firebase/admin.ts`: Server-only safe, dilarang di-bundle ke client component.
  - `src/lib/firebase/storage-helpers.ts`: Generator path berkas dan kompresi/validasi berkas media.

## 3. Layer 3: Server Actions (`src/actions/`)
- **Tanggung Jawab**: Menangani seluruh operasi **WRITE** (Create, Update, Delete, Upload media metadata, Kirim Inquiry).
- **Batasan**:
  - Wajib diawali direktif `'use server'`.
  - Wajib memvalidasi input payload menggunakan skema **Zod**.
  - Dilarang mengembalikan objek React atau state UI. Selalu kembalikan respons terstruktur:
    ```typescript
    type ActionResult<T> = {
      success: boolean
      data?: T
      error?: string
    }
    ```
  - **Pemisahan Konstanta**: File yang memiliki direktif `'use server'` **HANYA BOLEH** mengekspor fungsi `async`. Dilarang mengekspor konstanta, objek, atau variabel non-fungsi dari file `'use server'`. Konstanta bersama (seperti nama cookie, konfigurasi akun demo, enum) wajib dipisahkan ke berkas non-server (misal `constants.ts`) agar dapat diimpor aman oleh Client Components, Edge Middleware, dan Server Actions tanpa memicu kegagalan build Turbopack.
  - Lakukan `revalidatePath()` jika memodifikasi halaman yang di-cache Next.js.

## 4. Layer 4: Custom Hooks (`src/hooks/`)
- **Tanggung Jawab**: Menangani seluruh operasi **READ** dan manajemen cache client-side.
- **Batasan**:
  - Wajib menggunakan `@tanstack/react-query` (`useQuery`, `useInfiniteQuery`).
  - Dilarang menulis perintah `setDoc`, `updateDoc`, atau `deleteDoc` di dalam hook read.
  - Setiap hook wajib memiliki konvensi `queryKey` yang konsisten:
    - `['katalog', 'list', filters]`
    - `['katalog', 'detail', slugOrId]`
    - `['tenant', 'list']`
    - `['klaster', 'list']`
  - Wajib mengekspos: `data`, `isLoading`, `isError`, `error`, dan `refetch`.

## 5. Layer 5: Reusable UI Components (`src/components/`)
- **Tanggung Jawab**: Menampilkan antarmuka dan interaksi pengguna.
- **Struktur Pembagian**:
  - `ui/`: Primitives dasar independen dari bisnis STP. Contoh: `Button.tsx`, `Badge.tsx`, `Card.tsx`, `Input.tsx`, `Modal.tsx`, `Skeleton.tsx`.
  - `shared/`: Komponen pembantu yang dapat dipakai lintas halaman. Contoh: `SearchBar.tsx`, `FilterChips.tsx`, `EmptyState.tsx`, `Pagination.tsx`.
  - `katalog/`: Komponen domain produk inovasi STP. Contoh: `KatalogCard.tsx`, `KatalogGrid.tsx`, `KatalogFilterDrawer.tsx`, `KatalogDetailSpecs.tsx`.
  - `tenant/`: Komponen domain profil inovator. Contoh: `TenantCard.tsx`, `TenantProfileHeader.tsx`.
  - `layout/`: Kerangka layout. Contoh: `Navbar.tsx`, `Footer.tsx`, `MobileNav.tsx`.
- **Batasan**:
  - Komponen `ui/` dilarang memanggil hooks data-fetching. Mereka murni menerima props (*dumb/presentational components*).
  - Dilarang menaruh mock data statis langsung di dalam komponen. Gunakan data dari props atau hooks.

## 6. Layer 6: Page Orchestration (`src/app/`)
- **Tanggung Jawab**: Titik masuk routing Next.js App Router (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **Batasan**:
  - Page harus berukuran **tipis (thin orchestrator)**, idealnya kurang dari 120 baris.
  - Page tidak boleh berisi implementasi styling kartu atau form panjang; page hanya merakit (*assemble*) komponen dari Layer 5 dan menyuplai parameter route/search params.
  - Manfaatkan Server Components untuk initial render & SEO meta tags (`generateMetadata`).

---

## Checklist Evaluasi Kode (Code Review Guard)
- [ ] Apakah ada panggilan Firestore langsung di file `page.tsx`? (Jika ya, pindahkan ke Server Action atau Custom Hook).
- [ ] Apakah komponen tombol atau input ditulis ulang dari awal di halaman fitur alih-alih memakai `src/components/ui/`? (Jika ya, refactor ke reusable UI).
- [ ] Apakah ada state loading yang hilang saat fetch data? (Pastikan selalu ada `Skeleton` atau loading indicator).
- [ ] Apakah error ditampilkan dengan pesan ramah dalam Bahasa Indonesia?
