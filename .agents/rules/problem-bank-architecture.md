# 🧩 Standar Arsitektur: Bank Masalah & Inovasi Terbuka (Reverse Pitching) — STP

> Dokumen acuan baku arsitektur modul Bank Masalah & Tantangan Industri Terbuka pada Platform Katalog Digital Solo Technopark.

---

## 1. Konsep Demand-Driven Innovation (Dua Arah)

Platform Katalog Digital Solo Technopark memfasilitasi dua arah pertukaran inovasi:
1. **Supply-Driven (Katalog Produk Inovasi `/katalog`)**:
   - Menampilkan hasil riset terapan, prototipe siap uji, dan produk komersial buatan tenant dan laboratorium STP untuk ditawarkan ke pasar.
2. **Demand-Driven (Bank Masalah & Tantangan Industri `/tantangan`)**:
   - Menampung tantangan nyata dan hambatan teknis/operasional dari mitra industri, instansi pemerintah, BUMN, rumah sakit, dan UMKM.
   - Mengundang tenant, startup binaan, dan laboratorium STP untuk mengajukan konsep solusi (*solution pitching*).

---

## 2. Siklus Hidup Permasalahan (Problem Lifecycle)

Setiap tantangan masalah memiliki alur status baku:
```
draft (baru diajukan)
  └─► open_for_solutions (dikurasi & terbit di papan publik)
        └─► reviewing_solutions (proposal solusi dari tenant/lab sedang diseleksi)
              └─► matched (terjadi kesepakatan kerjasama / MoU riset / pilot project)
                    └─► solved (solusi berhasil diimplementasikan di industri)
                          (atau archived jika dibatalkan)
```

---

## 3. Penomoran Kode Resi Tantangan

- Seluruh pengajuan tantangan masalah wajib menghasilkan kode resi pelacakan publik berformat:
  `STP-PRB-YYYYMM-XXXX` (contoh: `STP-PRB-202609-F89A`).
- Kode resi dapat dilacak melalui sistem pelacakan terpadu `/tracking`.

---

## 4. Perlindungan Kerahasiaan Industri (Anonymity)

- Pihak pengaju masalah diberikan opsi `isAnonymous: boolean`.
- Jika aktif, nama perusahaan/instansi disamarkan di etalase publik (misal: *"Perusahaan Manufaktur Otomotif - Jawa Tengah"*), namun tetap dapat diakses oleh operator dan tim kurasi STP.

---

## 5. Partisipasi Tenant & Peneliti (Solution Pitching)

- Setiap tantangan yang berstatus `open_for_solutions` memiliki CTA **"Ajukan Solusi Inovasi"**.
- Tenant, startup, dan laboratorium STP dapat mengajukan proposal ringkas (*executive summary, metodologi, estimasi waktu, dan estimasi biaya*).
- Operator STP bertindak sebagai fasilitator *business matching* resmi antara penantang (*problem owner*) dan pemecah masalah (*solution solver*).
