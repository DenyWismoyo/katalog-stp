'use client'

import React from 'react'
import { InterestType, OrderInquiryItem } from '@/types'
import { Input } from '@/components/ui/Input'
import {
  User,
  Building2,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  GraduationCap,
  FileBadge,
  CreditCard,
  Globe,
  Tag,
  Factory,
  Wrench,
} from 'lucide-react'

export interface ApplicantFormData {
  senderName: string
  senderEmail: string
  senderPhone: string
  organizationName: string
  organizationType: OrderInquiryItem['organizationType']
  senderRoleOrPosition?: string
  senderDepartment?: string
  senderLocationCity?: string
  senderIdentityNumber?: string
  senderCategory?: string
  investorType?: 'angel' | 'vc' | 'corporate' | 'strategic'
  portfolioUrl?: string
}

interface InquiryApplicantFieldsProps {
  interestType: InterestType
  formData: ApplicantFormData
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquiryApplicantFields({
  interestType,
  formData,
  onChange,
  disabled = false,
}: InquiryApplicantFieldsProps) {
  // 1. PEMBELIAN PRODUK / LISENSI KOMERSIAL (Persona: Tim Pengadaan / Direksi)
  if (interestType === 'pembelian_produk') {
    return (
      <div className="space-y-4">
        <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900">
          <Briefcase className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            <strong>Formulir PIC Pengadaan:</strong> Lengkapi data penanggung jawab resmi pengadaan barang/lisensi untuk penerbitan surat penawaran harga resmi (Quotation) dan Purchase Order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama PIC Pengadaan / Penanggung Jawab PO *"
            placeholder="Contoh: Ir. Budi Santoso"
            icon={<User className="h-4 w-4 text-slate-400" />}
            value={formData.senderName}
            onChange={(e) => onChange('senderName', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Jabatan / Divisi di Perusahaan *"
            placeholder="Contoh: Head of Procurement / GM Operasional"
            icon={<Briefcase className="h-4 w-4 text-slate-400" />}
            value={formData.senderRoleOrPosition || ''}
            onChange={(e) => onChange('senderRoleOrPosition', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="email"
            label="Alamat Email Resmi Perusahaan *"
            placeholder="pengadaan@perusahaan.co.id"
            icon={<Mail className="h-4 w-4 text-slate-400" />}
            value={formData.senderEmail}
            onChange={(e) => onChange('senderEmail', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            type="tel"
            label="Nomor WhatsApp / Telp Langsung PIC *"
            placeholder="081234567890"
            icon={<Phone className="h-4 w-4 text-slate-400" />}
            value={formData.senderPhone}
            onChange={(e) => onChange('senderPhone', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Perusahaan Pembeli / Instansi *"
            placeholder="Contoh: PT. Industri Presisi Nusantara"
            icon={<Building2 className="h-4 w-4 text-slate-400" />}
            value={formData.organizationName}
            onChange={(e) => onChange('organizationName', e.target.value)}
            required
            disabled={disabled}
          />
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Bentuk Badan Usaha *
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              value={formData.organizationType}
              onChange={(e) => onChange('organizationType', e.target.value)}
              disabled={disabled}
            >
              <option value="pt">Perseroan Terbatas (PT)</option>
              <option value="cv">CV / Firma / Koperasi</option>
              <option value="bumn">BUMN / BUMD</option>
              <option value="pemerintah">Instansi Pemerintah / Kementerian / Dinas</option>
              <option value="perorangan">Perusahaan Perorangan / Swasta Lainnya</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Kota / Lokasi Kantor & Pabrik Pengiriman *"
            placeholder="Contoh: Cikarang, Kab. Bekasi, Jawa Barat"
            icon={<MapPin className="h-4 w-4 text-slate-400" />}
            value={formData.senderLocationCity || ''}
            onChange={(e) => onChange('senderLocationCity', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Divisi / Departemen Internal (Opsional)"
            placeholder="Contoh: Divisi Supply Chain & Purchasing"
            icon={<Tag className="h-4 w-4 text-slate-400" />}
            value={formData.senderDepartment || ''}
            onChange={(e) => onChange('senderDepartment', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  // 2. KERJASAMA RISET (Persona: Dosen / Peneliti Utama / Lab)
  if (interestType === 'kerjasama_riset') {
    return (
      <div className="space-y-4">
        <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200/80 flex items-start gap-2.5 text-xs text-sky-900">
          <GraduationCap className="h-4 w-4 text-sky-700 shrink-0 mt-0.5" />
          <p>
            <strong>Formulir Peneliti Utama:</strong> Data afiliasi akademik dan kontak ketua periset untuk penyusunan proposal bersama serta penandatanganan Perjanjian Kerjasama (PKS / MoU).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap Ketua Peneliti (beserta Gelar) *"
            placeholder="Contoh: Prof. Dr. Agus Prasetyo, M.T."
            icon={<User className="h-4 w-4 text-slate-400" />}
            value={formData.senderName}
            onChange={(e) => onChange('senderName', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Jabatan Akademik / Peran Riset *"
            placeholder="Contoh: Dosen Peneliti Utama / Kepala Lab Mekatronika"
            icon={<Briefcase className="h-4 w-4 text-slate-400" />}
            value={formData.senderRoleOrPosition || ''}
            onChange={(e) => onChange('senderRoleOrPosition', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="email"
            label="Alamat Email Institusi / Kampus *"
            placeholder="agus.prasetyo@uns.ac.id"
            icon={<Mail className="h-4 w-4 text-slate-400" />}
            value={formData.senderEmail}
            onChange={(e) => onChange('senderEmail', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            type="tel"
            label="Nomor WhatsApp / Telp Peneliti *"
            placeholder="081234567890"
            icon={<Phone className="h-4 w-4 text-slate-400" />}
            value={formData.senderPhone}
            onChange={(e) => onChange('senderPhone', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Asal Perguruan Tinggi / Lembaga Riset *"
            placeholder="Contoh: Universitas Sebelas Maret / BRIN"
            icon={<Building2 className="h-4 w-4 text-slate-400" />}
            value={formData.organizationName}
            onChange={(e) => onChange('organizationName', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Fakultas / Program Studi / Laboratorium *"
            placeholder="Contoh: Fakultas Teknik / Lab Mekatronika"
            icon={<GraduationCap className="h-4 w-4 text-slate-400" />}
            value={formData.senderDepartment || ''}
            onChange={(e) => onChange('senderDepartment', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="NIDN / NIP / ID Sinta Peneliti (Opsional)"
            placeholder="Contoh: NIDN 0612088501"
            icon={<FileBadge className="h-4 w-4 text-slate-400" />}
            value={formData.senderIdentityNumber || ''}
            onChange={(e) => onChange('senderIdentityNumber', e.target.value)}
            disabled={disabled}
          />
          <Input
            label="Kota Domisili Kampus / Laboratorium *"
            placeholder="Contoh: Surakarta, Jawa Tengah"
            icon={<MapPin className="h-4 w-4 text-slate-400" />}
            value={formData.senderLocationCity || ''}
            onChange={(e) => onChange('senderLocationCity', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  // 3. PENGAJUAN MASALAH (Persona: Kepala Pabrik / Pelapor Lapangan)
  if (interestType === 'pengajuan_masalah') {
    return (
      <div className="space-y-4">
        <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
          <Factory className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Formulir Pelapor Masalah Lapangan:</strong> Data kontak penanggung jawab di lini operasional untuk verifikasi awal kendala teknis bersama tim ahli teknologi Solo Technopark.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Penanggung Jawab Lapangan / PIC *"
            placeholder="Contoh: Hendro Prasetyo"
            icon={<User className="h-4 w-4 text-slate-400" />}
            value={formData.senderName}
            onChange={(e) => onChange('senderName', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Posisi / Tanggung Jawab Lapangan *"
            placeholder="Contoh: Kepala Pabrik / Factory Manager / Supervisor Produksi"
            icon={<Briefcase className="h-4 w-4 text-slate-400" />}
            value={formData.senderRoleOrPosition || ''}
            onChange={(e) => onChange('senderRoleOrPosition', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="email"
            label="Alamat Email Aktif *"
            placeholder="hendro@pabriktekstil.com"
            icon={<Mail className="h-4 w-4 text-slate-400" />}
            value={formData.senderEmail}
            onChange={(e) => onChange('senderEmail', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            type="tel"
            label="Nomor WhatsApp Lapangan (Aktif) *"
            placeholder="081234567890"
            icon={<Phone className="h-4 w-4 text-slate-400" />}
            value={formData.senderPhone}
            onChange={(e) => onChange('senderPhone', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Pabrik / Industri / UMKM / Kelompok Tani *"
            placeholder="Contoh: PT. Tekstil Maju Sentosa / Kelompok Tani Makmur"
            icon={<Factory className="h-4 w-4 text-slate-400" />}
            value={formData.organizationName}
            onChange={(e) => onChange('organizationName', e.target.value)}
            required
            disabled={disabled}
          />
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Kategori Entitas Pelapor *
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              value={formData.organizationType}
              onChange={(e) => onChange('organizationType', e.target.value)}
              disabled={disabled}
            >
              <option value="pt">Pabrik Industri Skala Menengah / Besar (PT)</option>
              <option value="cv">UMKM / Bengkel Produksi (CV/Firma)</option>
              <option value="perorangan">Kelompok Tani / Koperasi / Sentra Pengrajin</option>
              <option value="pemerintah">Instansi Pemerintah Daerah / Dinas</option>
              <option value="bumn">BUMDes / BUMN / BUMD</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Lokasi Pabrik / Lahan yang Mengalami Masalah (Kota/Kab) *"
            placeholder="Contoh: Sukoharjo, Jawa Tengah"
            icon={<MapPin className="h-4 w-4 text-slate-400" />}
            value={formData.senderLocationCity || ''}
            onChange={(e) => onChange('senderLocationCity', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Bagian / Lini Operasional yang Terdampak *"
            placeholder="Contoh: Lini Pewarnaan & Pengeringan Mesin 02"
            icon={<Tag className="h-4 w-4 text-slate-400" />}
            value={formData.senderDepartment || ''}
            onChange={(e) => onChange('senderDepartment', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  // 4. SEWA FASILITAS LAB & WORKSHOP (Persona: Mahasiswa, Dosen, Teknisi, Komunitas)
  if (interestType === 'sewa_fasilitas_lab') {
    return (
      <div className="space-y-4">
        <div className="p-3.5 bg-indigo-50/80 rounded-xl border border-indigo-200 flex items-start gap-2.5 text-xs text-indigo-900">
          <Wrench className="h-4 w-4 text-indigo-700 shrink-0 mt-0.5" />
          <p>
            <strong>Formulir Pemohon Fasilitas:</strong> Data penanggung jawab kegiatan untuk penerbitan surat izin penggunaan laboratorium/mesin presisi serta registrasi akses gerbang Solo Technopark.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap Pemohon / Penanggung Jawab Alat *"
            placeholder="Contoh: Satria Dharmawan"
            icon={<User className="h-4 w-4 text-slate-400" />}
            value={formData.senderName}
            onChange={(e) => onChange('senderName', e.target.value)}
            required
            disabled={disabled}
          />
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Kategori Pengguna Fasilitas *
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              value={formData.senderCategory || 'mahasiswa'}
              onChange={(e) => onChange('senderCategory', e.target.value)}
              disabled={disabled}
            >
              <option value="mahasiswa">Mahasiswa / Siswa SMK</option>
              <option value="dosen">Dosen / Peneliti Kampus</option>
              <option value="startup">Startup Binaan STP / Inkubasi</option>
              <option value="industri">Industri Komersial / Perusahaan Swasta</option>
              <option value="komunitas">Komunitas Kreatif / Maker Mandiri</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="email"
            label="Alamat Email Aktif Pemohon *"
            placeholder="satria.dh@gmail.com"
            icon={<Mail className="h-4 w-4 text-slate-400" />}
            value={formData.senderEmail}
            onChange={(e) => onChange('senderEmail', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            type="tel"
            label="Nomor WhatsApp Pemohon (Wajib Aktif) *"
            placeholder="081234567890"
            icon={<Phone className="h-4 w-4 text-slate-400" />}
            value={formData.senderPhone}
            onChange={(e) => onChange('senderPhone', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Asal Kampus / Sekolah / Perusahaan / Komunitas *"
            placeholder="Contoh: SMK Warga Surakarta / PT Mekatronika Presisi"
            icon={<Building2 className="h-4 w-4 text-slate-400" />}
            value={formData.organizationName}
            onChange={(e) => onChange('organizationName', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Nomor Identitas KTP / KTM / NIK (Akses Masuk Gate STP) *"
            placeholder="Contoh: 3372012304950001 / NIM Mahasiswa"
            icon={<CreditCard className="h-4 w-4 text-slate-400" />}
            value={formData.senderIdentityNumber || ''}
            onChange={(e) => onChange('senderIdentityNumber', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Jurusan / Departemen / Divisi (Opsional)"
            placeholder="Contoh: Teknik Mesin & Manufaktur Presisi"
            icon={<Tag className="h-4 w-4 text-slate-400" />}
            value={formData.senderDepartment || ''}
            onChange={(e) => onChange('senderDepartment', e.target.value)}
            disabled={disabled}
          />
          <Input
            label="Kota Domisili Pemohon *"
            placeholder="Contoh: Surakarta, Jawa Tengah"
            icon={<MapPin className="h-4 w-4 text-slate-400" />}
            value={formData.senderLocationCity || ''}
            onChange={(e) => onChange('senderLocationCity', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  // 5. KONSULTASI INKUBASI STARTUP (Persona: Founder / Co-Founder)
  if (interestType === 'konsultasi_inkubasi') {
    return (
      <div className="space-y-4">
        <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
          <User className="h-4 w-4 text-purple-700 shrink-0 mt-0.5" />
          <p>
            <strong>Formulir Profil Founder:</strong> Data perwakilan tim inisiator inovasi untuk kurasi profil tim pendiri sebelum sesi pitch wawancara program inkubator bisnis STP.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap Founder / Inovator Utama *"
            placeholder="Contoh: Kevin Wijaya"
            icon={<User className="h-4 w-4 text-slate-400" />}
            value={formData.senderName}
            onChange={(e) => onChange('senderName', e.target.value)}
            required
            disabled={disabled}
          />
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Peran / Jabatan di Startup *
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              value={formData.senderRoleOrPosition || 'ceo'}
              onChange={(e) => onChange('senderRoleOrPosition', e.target.value)}
              disabled={disabled}
            >
              <option value="Chief Executive Officer (CEO)">Chief Executive Officer (CEO)</option>
              <option value="Chief Technology Officer (CTO)">Chief Technology Officer (CTO)</option>
              <option value="Chief Operating Officer (COO)">Chief Operating Officer (COO)</option>
              <option value="Solo Founder / Inisiator">Solo Founder / Inisiator</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="email"
            label="Alamat Email Utama Founder *"
            placeholder="kevin@solusync.id"
            icon={<Mail className="h-4 w-4 text-slate-400" />}
            value={formData.senderEmail}
            onChange={(e) => onChange('senderEmail', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            type="tel"
            label="Nomor WhatsApp Founder (Aktif) *"
            placeholder="081234567890"
            icon={<Phone className="h-4 w-4 text-slate-400" />}
            value={formData.senderPhone}
            onChange={(e) => onChange('senderPhone', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Startup / Calon Brand Inovasi *"
            placeholder="Contoh: SoluSync Technologies Indonesia"
            icon={<Building2 className="h-4 w-4 text-slate-400" />}
            value={formData.organizationName}
            onChange={(e) => onChange('organizationName', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Kota Domisili Operasional Tim *"
            placeholder="Contoh: Surakarta, Jawa Tengah"
            icon={<MapPin className="h-4 w-4 text-slate-400" />}
            value={formData.senderLocationCity || ''}
            onChange={(e) => onChange('senderLocationCity', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Link LinkedIn Founder / Profil Tim (Opsional)"
            placeholder="https://linkedin.com/in/kevinwijaya"
            icon={<Globe className="h-4 w-4 text-slate-400" />}
            value={formData.portfolioUrl || ''}
            onChange={(e) => onChange('portfolioUrl', e.target.value)}
            disabled={disabled}
          />
          <Input
            label="Latar Belakang Keahlian Tim (Opsional)"
            placeholder="Contoh: Teknik Informatika & Desain Mekatronika"
            icon={<GraduationCap className="h-4 w-4 text-slate-400" />}
            value={formData.senderDepartment || ''}
            onChange={(e) => onChange('senderDepartment', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  // 6. INVESTASI & BUSINESS MATCHING (Persona: Investment Partner / Lead)
  if (interestType === 'investasi') {
    return (
      <div className="space-y-4">
        <div className="p-3.5 bg-rose-50/80 rounded-xl border border-rose-200 flex items-start gap-2.5 text-xs text-rose-900">
          <Briefcase className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
          <p>
            <strong>Formulir Investment Partner:</strong> Kredensial perwakilan pemodal ventura untuk sesi business matching tertutup dengan startup binaan terkurasi Solo Technopark.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Lengkap Investment Partner / Lead *"
            placeholder="Contoh: David Tan"
            icon={<User className="h-4 w-4 text-slate-400" />}
            value={formData.senderName}
            onChange={(e) => onChange('senderName', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Jabatan di Lembaga Investasi *"
            placeholder="Contoh: General Partner / Investment Associate / Angel Lead"
            icon={<Briefcase className="h-4 w-4 text-slate-400" />}
            value={formData.senderRoleOrPosition || ''}
            onChange={(e) => onChange('senderRoleOrPosition', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="email"
            label="Alamat Email Korporat Resmi *"
            placeholder="david.tan@nusantaravc.id"
            icon={<Mail className="h-4 w-4 text-slate-400" />}
            value={formData.senderEmail}
            onChange={(e) => onChange('senderEmail', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            type="tel"
            label="Nomor WhatsApp / Kontak Partner *"
            placeholder="081234567890"
            icon={<Phone className="h-4 w-4 text-slate-400" />}
            value={formData.senderPhone}
            onChange={(e) => onChange('senderPhone', e.target.value)}
            required
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Firma Modal Ventura / Lembaga Pemodal *"
            placeholder="Contoh: Nusantara Venture Partners / Angel Syndicate"
            icon={<Building2 className="h-4 w-4 text-slate-400" />}
            value={formData.organizationName}
            onChange={(e) => onChange('organizationName', e.target.value)}
            required
            disabled={disabled}
          />
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">
              Tipe Lembaga Pemodal *
            </label>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
              value={formData.investorType || 'vc'}
              onChange={(e) => onChange('investorType', e.target.value)}
              disabled={disabled}
            >
              <option value="vc">Venture Capital (VC Fund)</option>
              <option value="angel">Angel Investor / Angel Syndicate</option>
              <option value="corporate">Corporate Venture Capital (CVC)</option>
              <option value="strategic">Family Office / Strategic Corporate Investor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Website Resmi Lembaga / Portofolio *"
            placeholder="https://nusantaravc.id"
            icon={<Globe className="h-4 w-4 text-slate-400" />}
            value={formData.portfolioUrl || ''}
            onChange={(e) => onChange('portfolioUrl', e.target.value)}
            required
            disabled={disabled}
          />
          <Input
            label="Kantor Pusat / Wilayah Basis *"
            placeholder="Contoh: Jakarta / Singapura"
            icon={<MapPin className="h-4 w-4 text-slate-400" />}
            value={formData.senderLocationCity || ''}
            onChange={(e) => onChange('senderLocationCity', e.target.value)}
            required
            disabled={disabled}
          />
        </div>
      </div>
    )
  }

  // 7. UJI COBA PROTOTIPE & VALIDASI LAB (Persona: Lead Engineer / Inovator)
  return (
    <div className="space-y-4">
      <div className="p-3.5 bg-cyan-50/80 rounded-xl border border-cyan-200 flex items-start gap-2.5 text-xs text-cyan-900">
        <Wrench className="h-4 w-4 text-cyan-700 shrink-0 mt-0.5" />
        <p>
          <strong>Formulir Lead Engineer:</strong> Data teknisi penanggung jawab spesimen uji untuk penyusunan prosedur keamanan laboratorium dan berita acara uji coba.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Lead Engineer / Pembuat Alat *"
          placeholder="Contoh: Bambang Irawan, S.T."
          icon={<User className="h-4 w-4 text-slate-400" />}
          value={formData.senderName}
          onChange={(e) => onChange('senderName', e.target.value)}
          required
          disabled={disabled}
        />
        <Input
          label="Peran Teknis di Proyek *"
          placeholder="Contoh: Lead Hardware Engineer / Lead IoT Developer"
          icon={<Briefcase className="h-4 w-4 text-slate-400" />}
          value={formData.senderRoleOrPosition || ''}
          onChange={(e) => onChange('senderRoleOrPosition', e.target.value)}
          required
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="email"
          label="Alamat Email Resmi *"
          placeholder="bambang@rekayasamesin.id"
          icon={<Mail className="h-4 w-4 text-slate-400" />}
          value={formData.senderEmail}
          onChange={(e) => onChange('senderEmail', e.target.value)}
          required
          disabled={disabled}
        />
        <Input
          type="tel"
          label="Nomor WhatsApp Tim Pengembang *"
          placeholder="081234567890"
          icon={<Phone className="h-4 w-4 text-slate-400" />}
          value={formData.senderPhone}
          onChange={(e) => onChange('senderPhone', e.target.value)}
          required
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nama Perusahaan / Startup / Lab Pemilik Alat *"
          placeholder="Contoh: CV. Rekayasa Mesin Presisi"
          icon={<Building2 className="h-4 w-4 text-slate-400" />}
          value={formData.organizationName}
          onChange={(e) => onChange('organizationName', e.target.value)}
          required
          disabled={disabled}
        />
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Kategori Instansi Pengembang *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            value={formData.organizationType}
            onChange={(e) => onChange('organizationType', e.target.value)}
            disabled={disabled}
          >
            <option value="pt">Perusahaan Swasta / Korporasi (PT)</option>
            <option value="cv">Startup Hardware / Bengkel R&D (CV)</option>
            <option value="akademisi">Tim Peneliti Kampus / Lab Universitas</option>
            <option value="perorangan">Inovator Mandiri / Komunitas Maker</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Kota Asal Bengkel / Laboratorium *"
          placeholder="Contoh: Klaten, Jawa Tengah"
          icon={<MapPin className="h-4 w-4 text-slate-400" />}
          value={formData.senderLocationCity || ''}
          onChange={(e) => onChange('senderLocationCity', e.target.value)}
          required
          disabled={disabled}
        />
        <Input
          label="Spesialisasi Domain Prototipe (Opsional)"
          placeholder="Contoh: Mekatronika & Internet of Things"
          icon={<Tag className="h-4 w-4 text-slate-400" />}
          value={formData.senderDepartment || ''}
          onChange={(e) => onChange('senderDepartment', e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
