# 🎨 UI Motion & Design System Standards — Katalog Digital STP

> Aturan teknis implementasi UI, animasi, dan design system.
> Berlaku untuk semua pekerjaan UI/frontend di proyek ini.

---

## 1. Sentralisasi Design System di globals.css

- **Single Source of Truth**: Semua token warna, spacing, radius, easing, shadow, dan keyframe WAJIB di `src/app/globals.css` sebagai CSS custom properties di `:root`
- **Dilarang hardcode** nilai warna/shadow langsung di komponen (misal `shadow-[0_10px_rgba(2,132,199,0.2)]`)
- **Pola konsumsi**: Komponen konsumsi via:
  - Utility class semantik: `.stp-card`, `.glass-header-clean`, `.stp-label-eyebrow`, dll
  - Tailwind `text-[var(--text-title)]` atau `bg-[var(--bg-canvas)]`
- **Update globals.css** dulu sebelum membuat utility baru di komponen

## 2. Framer Motion — File Sentral Variants

- **Wajib**: Semua Framer Motion variants didefinisikan di `src/lib/utils/motionVariants.ts`
- **Dilarang**: Mendefinisikan variants inline di komponen (kecuali satu-liner sederhana seperti `whileTap={{ scale: 0.97 }}`)
- **Stagger**: Setiap list/grid item muncul bersama WAJIB `staggerChildren` (0.05–0.12s per item)
- **Spring Physics**: Interaksi user (hover, click, active indicator) → `type: 'spring'` bukan `tween`
- **`layoutId`**: Jangan toggle background color biasa untuk active pills/nav → pakai `motion.span` + `layoutId` agar indicator berpindah fluid
- **`AnimatePresence`**: Wajib untuk semua elemen yang mount/unmount dari DOM (modal, drawer, dropdown, conditional UI)
- **`useInView`**: Untuk scroll-triggered animation → pakai `useInView` dari `framer-motion`, bukan CSS animation statis

## 3. Mobile-First Borderless Experience

- **Safe Area Insets**: Komponen yang menyentuh edge layar WAJIB gunakan `env(safe-area-inset-bottom)` / `env(safe-area-inset-top)`:
  ```css
  padding-bottom: max(env(safe-area-inset-bottom), 0.5rem);
  ```
- **Bottom Nav**: Padding bawah halaman di mobile: class `.main-with-bottom-nav`
- **Touch Targets**: Semua tombol interaktif minimal `44px × 44px` (WCAG)
- **Gunakan `100dvh`** bukan `100vh` untuk full-height pada mobile dengan browser chrome

## 4. Google Fonts — Wajib via next/font/google

```
DILARANG: @import url('https://fonts.googleapis.com/...') di globals.css
WAJIB: next/font/google di src/app/layout.tsx

Font yang dipakai:
  - Inter (body): weights 400,500,600,700,800,900 → var(--font-inter)
  - Plus Jakarta Sans (heading/display): weights 600,700,800 (Catatan: weight 900 tidak didukung Google Fonts untuk font ini) → var(--font-jakarta)
```

## 5. Skeleton Loading — WAJIB Warna Terang

- Skeleton/loading placeholder WAJIB warna **terang** sesuai tema putih bersih:
  - Gunakan class `.skeleton` dari globals.css
  - Background: `bg-slate-100` atau `bg-slate-200`
  - Shimmer: linear-gradient putih (sudah ada di `.skeleton::after`)
- **DILARANG**: `bg-slate-800`, `bg-slate-900`, atau kelas gelap apapun di skeleton

## 6. Typography Classes Wajib

Gunakan utility class semantik, bukan Tailwind arbitrary:

| Kegunaan | Class |
|---------|-------|
| Hero heading | `.stp-heading-display` |
| Section heading besar | `.stp-heading-xl` |
| Section heading sedang | `.stp-heading-lg` |
| Label eyebrow di atas heading | `.stp-label-eyebrow` |
| Body text | `.stp-text-body` |
| Text muted/caption | `.stp-text-muted` |
| Text gradient biru brand | `.gradient-text-brand` |

## 7. Shared Components Wajib Pakai

Sebelum build fitur yang butuh animasi/scroll, pastikan pakai dari:
- `src/components/shared/PageTransition.tsx` — page transition wrapper
- `src/components/shared/ScrollReveal.tsx` — scroll-triggered reveal
- `src/components/shared/CountUp.tsx` — angka count-up saat viewport masuk

## 8. CTA Section

Selalu gunakan class `.cta-gradient-card` dari globals.css untuk CTA biru gradient.
Jangan buat gradient ad-hoc di halaman.

---

*Rule ini berlaku untuk semua pekerjaan UI frontend Katalog Digital STP.*
