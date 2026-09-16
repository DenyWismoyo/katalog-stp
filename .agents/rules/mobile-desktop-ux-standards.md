# 📱🖥️ Rules: Standar Antarmuka Responsif Mobile-First & Desktop High-Tech

Dokumen ini memuat aturan teknis antarmuka untuk memastikan **Katalog Digital Solo Technopark** tampil memukau, responsif, dan ergonomis saat diakses dari ponsel pintar (*Mobile Phone*) maupun komputer desktop berlayar lebar.

---

## 1. Konsep Shell Navigasi Ganda (Dual-Shell Architecture)

Antarmuka menyesuaikan tata letak secara dinamis berdasarkan lebar viewport:

### A. Pengalaman Ponsel Pintar / Mobile View (`< 768px`)
- **Fixed Mobile Bottom Navigation Bar**:
  - Ditempatkan mengambang di bawah layar (*fixed bottom-0 left-0 right-0 z-50*).
  - Menggunakan efek kaca (*backdrop-blur-md bg-slate-950/80 border-t border-slate-800*).
  - 4 Menu Utama:
    1. 🏠 **Beranda**: Akses spotlight & klaster.
    2. 🔍 **Katalog**: Eksplorasi produk & filter drawer.
    3. 📦 **Lacak**: Cek status resi pemesanan secara instan.
    4. 👤 **Akun**: Portal pemohon / login operator / admin.
  - **Aturan Padding Bawah Konten**: Semua halaman di mobile wajib memiliki padding bawah minimal `pb-24` agar elemen terbawah tidak tertutup oleh bottom nav.
- **Mobile Filter Drawer (Sheet Bottom/Right)**:
  - Panel filter klaster dan TRL tidak boleh memakan ruang vertikal layar utama.
  - Gunakan tombol pemicu mengambang (*Filter Floating Action Button*) yang membuka drawer dari sisi kanan atau bawah.
- **Touch Targets & Gestures**:
  - Seluruh tombol aksi utama minimal setinggi `h-11` (44px) dengan radius nyaman (`rounded-xl`).
  - Mendukung swipe horizontal (*touch scroll with no scrollbar*) pada daftar pill klaster.

### B. Pengalaman Komputer / Desktop View (`>= 768px`)
- **Desktop Header Glass Nav**:
  - Header transparan dengan efek blur halus menempel di bagian atas layar (*sticky top-0 z-50*).
  - Menampilkan logo resmi Solo Technopark, menu link navigasi, search bar global, dan tombol CTA "Masuk Portal".
- **Katalog Explorer (Split Sticky Sidebar)**:
  - Layout dua kolom: Kolom kiri selebar 280px (*Sticky Sidebar Filter*) yang tetap berada di viewport saat user scrolling, dan kolom kanan (*Fluid Grid 3-4 kolom*) untuk kartu produk.
- **Dashboard Operator & Admin (Pro Split-View)**:
  - Menggunakan sidebar kiri permanen (*Desktop Collapsible Sidebar*).
  - Menampilkan ringkasan data dalam format tabel interaktif dengan pagination, quick filter tabs, serta *Drawer Detail Preview* di sisi kanan untuk mempercepat verifikasi pesanan tanpa pindah halaman.

---

## 2. Micro-Interactions & Visual Polish (Estetika Solo Technopark)
- **Hover Lift Effect**: Setiap kartu produk katalog wajib memiliki efek elevasi saat di-hover:
  `transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10`
- **Glowing Accent Lights**: Elemen unggulan (*Featured Items*) dihiasi aksen gradasi neon halus (*Cyber Cyan & Electric Blue*).
- **Shimmer Loading Skeleton**: Dilarang menggunakan blank spinner yang monoton. Gunakan layout skeleton beranimasi shimmer (`animate-pulse bg-slate-800/60 rounded-xl`) yang menyerupai bentuk kartu aslinya.
- **Clean Empty States**: Jika hasil pencarian nihil, tampilkan ilustrasi ikon yang relevan, teks edukatif dalam Bahasa Indonesia, dan tombol "Reset Filter".
- **Responsive Dialog & Modal (InquiryModal Standard)**:
  - Dialog pop-up wajib memiliki backdrop blur (`bg-slate-950/80 backdrop-blur-md`), container `max-w-xl` dengan scroll vertikal mandiri (`my-auto max-h-[90vh] overflow-y-auto`).
  - Menyediakan feedback sukses instan beranimasi, tampilan kode resi unik berbingkai khusus, tombol 1-klik salin (*Copy to Clipboard*), serta tautan langsung (*Deep-link*) ke portal pelacakan `/tracking?code=...`.

---

## 3. Checklist Responsivitas Wajib Sebelum Rilis
- [ ] Apakah ada horizontal overflow (halaman bisa digeser ke samping) di layar 360px - 414px? *(Wajib nol overflow!)*
- [ ] Apakah ukuran teks terbaca jelas di ponsel tanpa perlu zoom (minimal 14px untuk body teks)?
- [ ] Apakah tombol aksi pada form pemesanan mudah ditekan dengan satu tangan / jempol?
- [ ] Apakah modal dialog di mobile beralih menjadi full-screen sheet atau scrollable modal?
