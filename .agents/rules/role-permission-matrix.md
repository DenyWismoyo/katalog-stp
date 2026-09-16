# 🛡️ Rules: Matriks Hak Akses & Peran (Role & Permission Matrix)

Dokumen ini mendefinisikan aturan baku pembagian peran (*Role-Based Access Control / RBAC*) dan batasan wewenang data pada sistem **Katalog Digital Solo Technopark (STP)**.

---

## 1. Definisi Peran Sistem

### A. Role: `admin` (Administrator Sistem STP)
- **Profil**: Pimpinan teknologi, kepala divisi inovasi, atau administrator IT resmi Solo Technopark.
- **Tujuan**: Memastikan keabsahan data inovasi, kurasi konten publik, manajemen tenant, dan tata kelola akun.
- **Wewenang Khusus**:
  - Full CRUD seluruh data katalog (`katalog`).
  - Mengubah status publikasi: `draft` ➔ `published` ➔ `archived`.
  - Menandai produk sebagai *Featured / Unggulan*.
  - Full CRUD data profil tenant dan startup inkubasi (`tenant`).
  - Mengelola master data 8 Klaster Teknologi dan kategori fasilitas STP.
  - Mengelola akun pengguna (menaikkan role user menjadi operator atau tenant manager).
  - Mengakses seluruh audit log dan analitik eksekutif.

### B. Role: `operator` (Operator Bisnis & Layanan STP)
- **Profil**: Tim business development, customer relation, staf teknis laboratorium, atau sekretariat layanan STP.
- **Tujuan**: Menangani pesanan masuk, memfasilitasi komunikasi industri dengan tenant, dan memperbarui status kerjasama.
- **Wewenang Khusus**:
  - Read-Only pada data katalog dan tenant.
  - Full CRUD pada antrean pesanan/permohonan kerjasama (`orders_inquiries`).
  - Memperbarui status alur pesanan: `pending` ➔ `reviewed` ➔ `contacted` ➔ `survey` ➔ `deal` ➔ `completed` / `rejected`.
  - Menulis catatan tindak lanjut internal (`order_logs`): notulensi telepon, hasil pertemuan, unggah draft penawaran harga/MoU.
  - Menetapkan PIC penanggung jawab permohonan.
  - Mengunduh rekap laporan pesanan ke format Excel / PDF.
  - **Larangan**: Operator *tidak berwenang* menghapus data produk katalog atau mengubah data profil legalitas tenant.

### C. Role: `user` (Pengguna Terdaftar / Pemohon Akun)
- **Profil**: Perwakilan perusahaan industri, akademisi, peneliti, mahasiswa, atau masyarakat umum yang membuat akun di portal.
- **Tujuan**: Mengajukan permohonan pemesanan, permohonan lisensi HAKI, atau permohonan uji coba fasilitas, serta memantau progresnya secara berkala.
- **Wewenang Khusus**:
  - Menjelajah seluruh katalog publik (`status == 'published'`).
  - Membuat pesanan/permohonan baru (`create order`).
  - Mengakses portal tracking pribadi (`/dashboard/my-orders`) untuk melihat daftar pesanan miliknya sendiri.
  - Membaca timeline progress dan status tindak lanjut yang dibagikan oleh operator.
  - Mengunggah berkas lampiran pendukung (Proposal Kebutuhan, NDA, Surat Resmi Perusahaan) maksimal 10 MB.
  - **Larangan**: User *tidak dapat* melihat pesanan milik user lain, tidak dapat mengubah status pesanan, dan tidak dapat mengakses dashboard admin/operator.

### D. Role: `guest` (Pengunjung Publik Tanpa Login)
- **Profil**: Masyarakat umum, pencari riset, dan calon mitra yang baru pertama kali mengunjungi website.
- **Tujuan**: Menemukan informasi inovasi teknologi STP secara cepat dan bebas hambatan.
- **Wewenang**:
  - Akses penuh melihat beranda, daftar katalog, filter klaster/TRL, dan halaman detail produk.
  - Mengunduh brosur publik produk (PDF).
  - Mengisi formulir kontak cepat / order awal (akan dibuatkan kode resi pelacakan publik).
  - Melacak status pesanan melalui halaman pelacakan dengan memasukkan Nomor Resi Unik + Email pemohon.

---

## 2. Matriks Wewenang Matriks Lengkap (CRUD Matrix)

| Modul / Fitur | Guest | User Terdaftar | Operator STP | Admin STP |
|---------------|:-----:|:--------------:|:------------:|:---------:|
| **Lihat Katalog Published** | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| **Lihat Katalog Draft/Archive**| ❌ | ❌ | ❌ | ✅ Read |
| **Buat / Edit / Hapus Katalog**| ❌ | ❌ | ❌ | ✅ Full CRUD |
| **Lihat Direktori Tenant** | ✅ Read | ✅ Read | ✅ Read | ✅ Read |
| **Edit Data Tenant** | ❌ | ❌ | ❌ | ✅ Full CRUD |
| **Kirim Permohonan Order** | ✅ Create | ✅ Create | ❌ | ❌ |
| **Lacak Pesanan Sendiri** | ✅ (Via Resi) | ✅ (Via Portal) | ✅ Read All | ✅ Read All |
| **Update Status Pipeline Order**| ❌ | ❌ | ✅ Update | ✅ Update |
| **Tulis Log Tindak Lanjut** | ❌ | ❌ | ✅ Create | ✅ Create |
| **Ekspor Rekap Laporan** | ❌ | ❌ | ✅ Export | ✅ Export |
| **Manajemen User & Hak Akses**| ❌ | ❌ | ❌ | ✅ Full CRUD |

---

## 3. Penegakan Keamanan (Security Enforcement)

1. **Middleware Next.js (`src/middleware.ts`)**:
   - Memproteksi rute `/(admin)/*` hanya untuk user dengan `role === 'admin'`.
   - Memproteksi rute `/(operator)/*` hanya untuk user dengan `role in ['admin', 'operator']`.
   - Memproteksi rute `/(portal)/*` untuk seluruh authenticated user (`request.auth != null`).
2. **Firestore Security Rules**:
   - Menolak operasi `write` pada koleksi `katalog` dan `tenant` jika token custom claims bukan admin.
   - Mengizinkan `update` status pesanan pada koleksi `orders_inquiries` hanya jika token claims adalah `operator` atau `admin`.
   - User hanya memiliki izin `read` dokumen pesanan jika `resource.data.userId == request.auth.uid`.
3. **Server Actions Guard (`src/actions/`)**:
   - Setiap Server Action mutasi wajib memverifikasi sesi dan hak akses melalui fungsi helper `assertRole(['admin'])` atau `assertRole(['operator', 'admin'])`.
