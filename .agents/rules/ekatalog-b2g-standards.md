# 🏛️ Rules: Standar e-Katalog Inovasi B2G Solo Technopark (STP)

Dokumen ini memuat standar teknis dan UX untuk platform **Katalog Digital STP** sebagai etalase produk riset dan inovasi kawasan sains berstandar enterprise B2G/B2B (pendamping sistem e-Katalog Inaproc nasional).

---

## 1. Lima Pilar Kelengkapan Produk e-Katalog

Setiap entri produk inovasi pada platform wajib memenuhi kriteria berikut:

1. **Visual & Galeri Multi-Foto**:
   - Gambar sampul (*cover*) beresolusi tajam (16:10 / 16:9).
   - Minimal 2 foto galeri pendukung dengan fitur pratinjau thumbnail / lightbox.
   - Pemutar video demonstrasi tersemat (*embedded*) jika memiliki media uji coba prototipe atau rekaman operasional.

2. **Tingkat Kesiapterapan Teknologi (TRL / Katsinov Visual)**:
   - Wajib mencantumkan skala TRL 1–9.
   - Tampilan visual wajib memiliki indikator level warna:
     - **TRL 1–3**: Fase Riset & Laboratorium (Cyan/Blue)
     - **TRL 4–6**: Fase Pengembangan & Purwarupa (Amber/Orange)
     - **TRL 7–9**: Fase Komersialisasi & Siap Pasar (Emerald/Green)
   - Disertai tooltip/penjelasan arti kesiapan teknologi bagi calon pembeli/mitra pemerintah.

3. **Status HAKI & Legalitas**:
   - Status legalitas paten/hak cipta wajib ditegaskan:
     - `granted`: Paten/HAKI telah terbit resmi.
     - `terdaftar`: Permohonan paten/HAKI dalam proses di DJKI.
     - `belum`: Masih dalam perlindungan rahasia dagang / tahap perancangan.

4. **Spesifikasi Teknis Terstruktur**:
   - Data spesifikasi wajib disajikan dalam pasangan *Key-Value* terstruktur (contoh: Kecepatan, Akurasi, Material, Standar Sertifikasi ISO/AWS/SNI), bukan sekadar teks paragraf.

5. **Keterhubungan Tenant & Fasilitas**:
   - Setiap produk terhubung ke entitas Tenant (`/tenant/[id]`) dan dapat menautkan ke Lab/Fasilitas pengujian di STP.

---

## 2. Alur Transaksi & Pelacakan Resi (Inquiry Pipeline)

1. **Pengajuan Inquiry Mandiri**:
   - Pengunjung publik maupun perwakilan instansi B2G/B2B dapat mengajukan minat/pemesanan langsung via `InquiryModal`.
   - Sistem secara otomatis menerbitkan **Nomor Resi Unik** format `STP-ORD-YYYYMM-XXXX`.

2. **Portal Pelacakan Publik (`/tracking`)**:
   - Pengunjung dapat memeriksa kemajuan tindak lanjut permohonan menggunakan nomor resi tanpa perlu login akun.
   - Seluruh log tindak lanjut berlabel `isPublicToUser: true` dapat dibaca oleh pemohon secara real-time.

3. **SOP Status Transisi Layanan STP**:
   - Transisi status wajib mematuhi matriks resmi:
     `pending` → `reviewed` → `contacted` → `survey` → `deal` → `completed` (atau `rejected`).

---

## 3. Proteksi Akses & Autentikasi

- Rute Publik: `/`, `/katalog`, `/katalog/*`, `/tenant`, `/tenant/*`, `/tracking`, `/portal`.
- Rute Terproteksi:
  - `/operator/*` (Operator Layanan Bisnis STP)
  - `/admin/*` (Pengelola & Administrator Sistem STP)
- Seluruh rute terproteksi wajib divalidasi oleh `middleware.ts` berbasis session cookie `stp_session`.

---

## 4. Pilar Etalase Fasilitas & Lab STP (`/fasilitas`)

- Platform e-Katalog STP tidak hanya memuat produk inovasi jadi, namun juga infrastruktur laboratorium riset dan permesinan presisi yang dapat disewa oleh industri/pemerintah (*Shared Infrastructure*).
- Setiap entri fasilitas wajib memuat:
  1. Spesifikasi alat/mesin (misal: CNC 5-Axis, Wet Welding Tank, AI Supercomputer, Studio Mockup).
  2. Kapasitas, lokasi gedung, dan estimasi tarif sewa (*Rate per Hour / Day*).
  3. Ketersediaan status operasional (`available`, `maintenance`, `booked`).
  4. Alur inquiry khusus peminjaman/sewa fasilitas lab (`interestType: 'sewa_fasilitas_lab'`).

