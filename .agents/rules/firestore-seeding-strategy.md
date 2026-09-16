# Standar Inisialisasi & Sinkronisasi Data Firestore

Untuk mendukung proses demonstrasi pameran, audit, dan evaluasi pemangku kepentingan (*stakeholders*), sistem menyediakan aksi sinkronisasi database satu klik (`syncInitialDataAction`):

1. **Prinsip Idempotensi**:
   - Selalu gunakan `doc(id).set(data, { merge: true })` berdasarkan ID tetap pada seed data.
   - Jangan menggunakan operasi `.add()` murni saat menyuntikkan master data seed agar tidak terjadi duplikasi rekaman jika tombol ditekan berulang kali.

2. **Cakupan Koleksi Inti**:
   - `katalog_items`: Inovasi teruji dengan tingkat TRL dan data HAKI.
   - `tenant`: Profil startup binaan, nama badan usaha (PT/CV), dan status inkubasi.
   - `facilities`: Laboratorium bersama dan permesinan presisi STP beserta tarif sewa.
   - `orders_inquiries` & `order_logs`: Permohonan demo aktif untuk pengujian alur operator.
