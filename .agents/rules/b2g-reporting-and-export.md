# Standar Ekspor Laporan B2G (Business-to-Government)

Platform Katalog Digital Solo Technopark menyediakan fitur ekspor data untuk arsip birokrasi dan audit pengadaan pemerintah. Setiap fitur ekspor data tabular (CSV) wajib memenuhi kaidah berikut:

1. **Enkoding UTF-8 BOM Wajib (`\uFEFF`)**:
   - Selalu sertakan Byte Order Mark `\uFEFF` di awal string CSV sebelum di-blob.
   - Tanpa UTF-8 BOM, Microsoft Excel versi Windows default (locale Indonesia) akan gagal mengenali karakter aksen atau simbol, menghasilkan tampilan teks rusak.
   
   ```typescript
   const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
   ```

2. **Sanitasi Kolom String Multiline**:
   - Kolom yang berpotensi mengandung jeda baris (misal: pesan kebutuhan, catatan operator) wajib dibersihkan dari karakter `\r` dan `\n` (diganti spasi) serta diapit tanda kutip ganda (`"..."`).
   - Tanda kutip di dalam nilai wajib diescape menjadi ganda (`""`).

3. **Format Tanggal & Nilai Moneter**:
   - Tanggal diformat ke format standar lokal: `DD MMMM YYYY, HH:mm WIB` atau `YYYY-MM-DD HH:mm`.
   - Estimasi anggaran dan tarif diformat eksplisit dengan awalan mata uang `Rp`.
