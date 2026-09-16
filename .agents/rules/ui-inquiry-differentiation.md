# 📋 Standar Baku Diferensiasi Formulir Permohonan (Inquiry Engine) STP

> Dokumen SSOT acuan baku implementasi seluruh alur formulir permohonan, wizard interaksi, dan inquiry modal pada platform Katalog Digital Solo Technopark.

---

## 1. Prinsip Invarian: Dilarang Form Generik Tanpa Konteks
Formulir pengajuan adalah pintu gerbang konversi bisnis dan riset di Solo Technopark. DILARANG membuat formulir yang terlihat generik atau seragam di setiap langkah:

1. **Langkah 1 (Kategori Kebutuhan)**:
   - Wajib menampilkan selector visual interaktif lengkap dengan ikon, badge kategori, dan penjelasan tujuan.
2. **Langkah 2 (Informasi Pemohon & Instansi)**:
   - **Wajib ada Banner Penunjuk Kategori** dengan warna aksen spesifik (Emerald untuk Pembelian, Sky untuk Riset, Amber untuk Tantangan Masalah, Indigo untuk Sewa Lab, Purple untuk Inkubasi, Rose untuk Investasi).
   - **Label dan placeholder wajib terpersonalisasi dinamis** (contoh: PIC Pengadaan vs Ketua Peneliti R&D vs Penanggung Jawab Masalah Pabrik vs Founder Startup vs Investment Partner).
3. **Langkah 3 (Spesifikasi Teknis)**:
   - Subform spesifik wajib aktif dan wajib menampilkan seluruh parameter unik dari ke-7 tipe interaksi (Pembelian, Riset, Tantangan Masalah, Uji Coba Lab, Sewa Fasilitas, Inkubasi, Investasi).
4. **Langkah 4 (Konfirmasi Ringkasan)**:
   - **Wajib merangkum seluruh parameter teknis spesifik** yang telah diisi di Langkah 3, bukan hanya data kontak umum. Pengguna harus melihat bukti bahwa data teknis mereka tercatat dengan baik sebelum submit.
