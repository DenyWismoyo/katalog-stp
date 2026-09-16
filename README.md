# 🌐 Katalog Digital Solo Technopark (STP)

Platform showcase dan direktori digital resmi untuk mempublikasikan portofolio produk inovasi teknologi, hasil riset terapan, profil tenant/startup inkubasi, serta fasilitas laboratorium di **Kawasan Sains dan Teknologi Solo Technopark (STP)**, Surakarta.

---

## 🏛️ Arsitektur 6 Layer

Proyek ini dirancang dengan prinsip pemisahan tanggung jawab yang ketat (*Separation of Concerns*):

```
src/
├── types/                 # Layer 1: Definisi Kontrak & Tipe TypeScript
├── lib/
│   ├── firebase/          # Layer 2: Driver Firebase Client & Admin SDK
│   └── utils/             # Helper fungsi (cn, formatTanggal, slugify)
├── actions/               # Layer 3: Server Actions untuk Write (Mutasi data)
├── hooks/                 # Layer 4: TanStack React Query Hooks untuk Read
├── components/            # Layer 5: Reusable Custom UI Components
│   ├── ui/                # Primitives murni (Button, Badge, Card, Modal, Input)
│   ├── layout/            # Kerangka tata letak (Navbar, Footer, MobileNav)
│   ├── shared/            # Komponen umum (SearchBar, FilterChips, EmptyState)
│   ├── katalog/           # Komponen domain produk & inovasi STP
│   └── tenant/            # Komponen domain profil inovator & tenant
└── app/                   # Layer 6: Next.js App Router (Thin Orchestrators)
```

---

## 🚀 Tech Stack Utama
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS v3 + Custom UI Design System
- **Database & Storage**: Firebase Firestore & Firebase Storage
- **Otentikasi**: Firebase Authentication
- **State Management**: TanStack Query v5
- **Forms & Validasi**: React Hook Form + Zod
- **Ikon**: Lucide React
- **Package Manager**: pnpm

---

## 📁 Panduan Agent & Rules Antigravity
Aturan dan referensi teknis telah didokumentasikan di dalam direktori proyek:
- `AGENTS.md` — Instruksi dasar agen AI dan domain Solo Technopark.
- `.agents/rules/architecture-layers.md` — Standar baku batas tanggung jawab 6 layer.
- `.agents/rules/custom-ui-standards.md` — Pedoman token desain, palet warna STP, dan komponen reusable.
- `.agents/rules/katalog-stp-domain.md` — Referensi 8 klaster teknologi dan skala TRL/Katsinov STP.
- `.agents/rules/firebase-firestore-standard.md` — Skema koleksi Firestore dan alokasi Storage.
- `.agents/skills/katalog-digital-stp-stack/SKILL.md` — Cheatsheet pola kode (Action, Hook, UI Component).

---

## 🛠️ Menjalankan Proyek Secara Lokal

1. Salin konfigurasi environment:
   ```bash
   cp .env.local.example .env.local
   ```
2. Pasang dependensi:
   ```bash
   pnpm install
   ```
3. Jalankan server pengembangan:
   ```bash
   pnpm run dev
   ```
4. Buka di peramban: `http://localhost:3000`
