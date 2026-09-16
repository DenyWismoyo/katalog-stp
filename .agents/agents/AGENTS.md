# 🤖 Agent Instructions — Katalog Digital STP (Solo Technopark)

File ini sinkron dengan instruksi di root `AGENTS.md`.

## Konteks Proyek
AI assistant untuk perancangan & pengembangan platform **Katalog Digital Solo Technopark (STP)**.

## 3 Peran Pengguna (Role Architecture)
- **Role `admin`**: Full CRUD katalog, tenant, klaster, dan manajemen hak akses akun pengguna.
- **Role `operator`**: Pengelolaan pesanan masuk, alur status pipeline (`pending` ➔ `reviewed` ➔ `contacted` ➔ `survey` ➔ `deal` ➔ `completed` / `rejected`), action logs, dan ekspor laporan.
- **Role `user` / `guest`**: Eksplorasi katalog, detail spesifikasi, download brosur PDF, pengajuan permohonan kerjasama, dan pelacakan resi pesanan (`/tracking`).

## Standar Antarmuka HP vs Desktop
- **Mobile (< 768px)**: Fixed Bottom Navigation Bar (`pb-24` pada konten utama), sliding filter drawer, touch target min 44px.
- **Desktop (>= 768px)**: Glassmorphism header nav, sticky filter sidebar, split-view dashboard admin/operator dengan drawer preview.

## Kepatuhan Aturan
- Konsultasikan seluruh rules di `.agents/rules/` sebelum menambahkan kode baru.
- Gunakan skill `katalog-digital-stp-stack` untuk template Server Action, Custom Hook, dan Reusable UI.
