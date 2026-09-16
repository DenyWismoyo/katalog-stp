'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  InterestType,
  OrderInquiryItem,
  KlasterId,
  UrgencyLevel,
  INTEREST_TYPE_LABELS,
  URGENCY_LABELS,
} from '@/types'
import { submitOrderAction, SubmitOrderPayload } from '@/actions/order'
import { submitProblemAction } from '@/actions/problem'
import { useKatalogDetail } from '@/hooks/useKatalog'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { InquiryTypeSelector } from '@/components/order/InquiryTypeSelector'
import { InquiryPembelianFields } from '@/components/order/subforms/InquiryPembelianFields'
import { InquiryRisetFields } from '@/components/order/subforms/InquiryRisetFields'
import { InquiryUjiCobaFields } from '@/components/order/subforms/InquiryUjiCobaFields'
import { InquirySewaFields } from '@/components/order/subforms/InquirySewaFields'
import { InquiryInkubasiFields } from '@/components/order/subforms/InquiryInkubasiFields'
import { InquiryInvestasiFields } from '@/components/order/subforms/InquiryInvestasiFields'
import { InquiryProblemFields } from '@/components/order/subforms/InquiryProblemFields'
import { InquiryApplicantFields } from '@/components/order/subforms/InquiryApplicantFields'
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Loader2,
  AlertCircle,
  Sparkles,
  Building2,
  CheckCircle2,
  FileText,
  User,
  Lightbulb,
  ShoppingCart,
  Microscope,
  FlaskConical,
  Rocket,
  Briefcase,
  Shield,
  Calendar,
  Layers,
  Coins,
} from 'lucide-react'

interface CategoryContextConfig {
  title: string
  badge: string
  badgeColor: string
  bannerBg: string
  bannerBorder: string
  icon: React.ElementType
  step2Title: string
  step2Subtitle: string
  messageLabel: string
  messagePlaceholder: string
  guidanceText: string
}

const CATEGORY_CONTEXT: Record<InterestType, CategoryContextConfig> = {
  pembelian_produk: {
    title: 'Pembelian Produk Inovasi & Lisensi Komersial',
    badge: 'Komersial / PO',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bannerBg: 'bg-emerald-50/80',
    bannerBorder: 'border-emerald-200',
    icon: ShoppingCart,
    step2Title: 'Profil PIC Pengadaan & Instansi Pembeli',
    step2Subtitle: 'Data resmi penanggung jawab pengadaan barang/lisensi untuk penerbitan penawaran resmi (Quotation) dan Purchase Order.',
    messageLabel: 'Catatan Spesifikasi Pengadaan, Delivery & Kebutuhan Demo Unit *',
    messagePlaceholder: 'Tuliskan rincian kebutuhan delivery date, alamat pengiriman, permintaan demo teknis, atau sertifikasi produk yang dibutuhkan...',
    guidanceText: 'Permohonan pengadaan akan diteruskan langsung ke Divisi Bisnis & Komersialisasi STP untuk penerbitan surat penawaran resmi (Quotation) dan terms of payment.',
  },
  kerjasama_riset: {
    title: 'Kerjasama Riset Terapan & Lisensi Paten',
    badge: 'R&D & Lisensi Teknologi',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    bannerBg: 'bg-sky-50/80',
    bannerBorder: 'border-sky-200',
    icon: Microscope,
    step2Title: 'Identitas Ketua Peneliti & Afiliasi Akademik',
    step2Subtitle: 'Data afiliasi akademik dan kontak ketua periset untuk penyusunan proposal bersama serta Perjanjian Kerjasama (PKS / MoU).',
    messageLabel: 'Uraian Ringkas Roadmap & Harapan Kerjasama Riset *',
    messagePlaceholder: 'Jelaskan tujuan transfer teknologi, target luaran publikasi/paten, dan jadwal temu teknis bersama peneliti STP...',
    guidanceText: 'Permohonan riset akan dievaluasi oleh Komite Etik & Riset Terapan STP untuk pencocokan tenaga ahli dan fasilitas lab pendamping.',
  },
  pengajuan_masalah: {
    title: 'Pengajuan Tantangan Masalah Industri (Problem Bank STP)',
    badge: 'Open Innovation Challenge',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    bannerBg: 'bg-amber-50/90',
    bannerBorder: 'border-amber-200',
    icon: Lightbulb,
    step2Title: 'Identitas Pelapor Masalah & Penanggung Jawab Lapangan',
    step2Subtitle: 'Kontak penanggung jawab teknis di lini operasional untuk verifikasi awal kendala lapangan bersama tim ahli STP.',
    messageLabel: 'Uraian Komprehensif Masalah Lapangan yang Ingin Dipecahkan *',
    messagePlaceholder: 'Jelaskan kronologi masalah, kondisi lapangan, serta kendala alat/software yang dihadapi saat ini...',
    guidanceText: 'Tantangan masalah akan dikurasi oleh Tim Teknis STP sebelum diterbitkan ke Papan Tantangan Terbuka untuk direspon oleh inovator dan startup binaan.',
  },
  uji_coba_prototipe: {
    title: 'Pengujian Validasi Prototipe & Sertifikasi Lab',
    badge: 'Validasi & Uji Laboratorium',
    badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    bannerBg: 'bg-cyan-50/80',
    bannerBorder: 'border-cyan-200',
    icon: FlaskConical,
    step2Title: 'Identitas Lead Engineer & Pemilik Spesimen Prototipe',
    step2Subtitle: 'Data insinyur penanggung jawab pengujian alat untuk penyusunan prosedur keselamatan lab dan berita acara.',
    messageLabel: 'Uraian Parameter Teknis & Spesifikasi Pengujian *',
    messagePlaceholder: 'Sebutkan standar pengujian yang diinginkan (SNI, ISO), lingkungan lab, dan kriteria lolos uji...',
    guidanceText: 'Pengujian akan dijadwalkan di laboratorium uji terakreditasi STP dengan pengawasan staf ahli bersertifikasi.',
  },
  sewa_fasilitas_lab: {
    title: 'Peminjaman / Sewa Fasilitas Lab & Bengkel Presisi',
    badge: 'Fasilitas & Mesin STP',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    bannerBg: 'bg-indigo-50/80',
    bannerBorder: 'border-indigo-200',
    icon: Building2,
    step2Title: 'Identitas Pemohon Fasilitas & Penanggung Jawab Penggunaan',
    step2Subtitle: 'Data penanggung jawab teknis penggunaan alat lab, perbengkelan, dan izin registrasi gerbang Solo Technopark.',
    messageLabel: 'Uraian Agenda Kegiatan, Jumlah Alat & Kebutuhan Khusus *',
    messagePlaceholder: 'Rincikan agenda workshop, jam operasional mesin, kebutuhan instruktur pendamping, dll...',
    guidanceText: 'Tim Fasilitas STP akan memeriksa ketersediaan slot jadwal dan kesiapan teknis alat lab yang diajukan.',
  },
  konsultasi_inkubasi: {
    title: 'Konsultasi Program Inkubasi & Akselerasi Startup STP',
    badge: 'Inkubasi Bisnis & Startup',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    bannerBg: 'bg-purple-50/80',
    bannerBorder: 'border-purple-200',
    icon: Rocket,
    step2Title: 'Profil Founder & Tim Pengembang Inovasi',
    step2Subtitle: 'Identitas perwakilan tim founder untuk kurasi profil sebelum sesi pitch wawancara inkubasi teknologi STP.',
    messageLabel: 'Uraian Ide Bisnis, Solusi Unik & Hambatan yang Ingin Dibina *',
    messagePlaceholder: 'Jelaskan inovasi produk, target pengguna, traksi awal jika ada, dan kebutuhan mentoring teknologi...',
    guidanceText: 'Tim Inkubator Bisnis STP akan mengundang founder untuk sesi wawancara dan kurasi batch inkubasi teknologi.',
  },
  investasi: {
    title: 'Penjajakan Investasi & Business Matching Startup',
    badge: 'Investasi & Venture Capital',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    bannerBg: 'bg-rose-50/80',
    bannerBorder: 'border-rose-200',
    icon: Briefcase,
    step2Title: 'Profil Investment Lead & Entitas Pemodal',
    step2Subtitle: 'Kredensial representatif investor untuk pencocokan privat dengan portofolio startup tenant terkurasi STP.',
    messageLabel: 'Kriteria Portofolio & Minat Sektor yang Dicari *',
    messagePlaceholder: 'Tuliskan tesis investasi, klaster teknologi yang diminati, tahap startup target (Seed/Series A), dll...',
    guidanceText: 'Tim Investasi STP akan menyusun kurasi startup binaan terverifikasi yang cocok dengan kriteria portofolio pemodal.',
  },
}

function InquiryWizard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialKatalogSlug = searchParams.get('slug') || ''
  const initialType = (searchParams.get('type') as InterestType) || 'kerjasama_riset'

  const { data: katalogItem } = useKatalogDetail(initialKatalogSlug)

  const [currentStep, setCurrentStep] = useState<number>(1)
  const [interestType, setInterestType] = useState<InterestType>(initialType)

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    organizationName: '',
    organizationType: 'pt' as OrderInquiryItem['organizationType'],
    estimatedBudget: '',
    message: '',

    // Profil Persona Pengisi
    senderRoleOrPosition: '',
    senderDepartment: '',
    senderLocationCity: '',
    senderIdentityNumber: '',
    senderCategory: 'mahasiswa',

    // Subform fields
    quantity: undefined as number | undefined,
    targetDeliveryDate: '',
    purchaseOrderRef: '',
    needsDemoFirst: false,

    researchScope: 'co_development',
    institutionType: 'industri_swasta',
    researchDuration: '3-6_bulan',
    fundingSource: '',
    expectedOutput: '',

    testingScope: 'fungsional_kinerja',
    labEnvironment: 'manufaktur_cnc',
    numberOfUnits: undefined as number | undefined,
    testingDuration: '',

    facilityId: '',
    rentalStartDate: '',
    rentalEndDate: '',
    purposeOfUse: 'pelatihan_workshop',
    numberOfParticipants: undefined as number | undefined,

    startupStage: 'ideation_concept',
    sectorFocus: 'ai_software',
    currentTeamSize: undefined as number | undefined,
    problemStatement: '',

    investorType: 'angel' as 'angel' | 'vc' | 'corporate' | 'strategic',
    investmentRange: '100jt-500jt',
    portfolioUrl: '',

    // Problem Challenge fields
    problemTitle: '',
    problemKlasterId: 'ai-software' as KlasterId,
    impactStatement: '',
    expectedSolutionType: '',
    collaborationScheme: 'pilot_project' as const,
    urgency: 'sedang' as UrgencyLevel,
    targetTimeline: '',
    isAnonymous: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('type')) {
      setInterestType(searchParams.get('type') as InterestType)
    }
  }, [searchParams])

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const currentContext = CATEGORY_CONTEXT[interestType] || CATEGORY_CONTEXT.kerjasama_riset
  const CategoryIcon = currentContext.icon

  // Validasi sebelum pindah langkah
  const validateStep = (step: number): boolean => {
    setErrorMessage(null)
    if (step === 1) {
      if (!interestType) {
        setErrorMessage('Silakan pilih salah satu jenis kebutuhan interaksi.')
        return false
      }
      return true
    }
    if (step === 2) {
      if (!formData.senderName.trim() || !formData.senderEmail.trim() || !formData.senderPhone.trim()) {
        setErrorMessage('Nama pemohon / PIC, alamat email resmi, dan nomor telepon/WhatsApp wajib diisi.')
        return false
      }
      if (!formData.organizationName.trim()) {
        setErrorMessage('Nama lembaga, instansi, atau perusahaan wajib diisi.')
        return false
      }
      if (interestType === 'sewa_fasilitas_lab' && !formData.senderIdentityNumber?.trim()) {
        setErrorMessage('Nomor identitas (KTP / KTM / NIK) wajib diisi untuk izin akses fasilitas STP.')
        return false
      }
      if (interestType === 'investasi' && !formData.portfolioUrl?.trim()) {
        setErrorMessage('Website resmi lembaga pemodal / tautan portofolio investasi wajib diisi.')
        return false
      }
      if (!formData.senderLocationCity?.trim()) {
        setErrorMessage('Kota / lokasi domisili pemohon wajib diisi.')
        return false
      }
      return true
    }
    if (step === 3) {
      if (!formData.message.trim()) {
        setErrorMessage('Uraian deskripsi kebutuhan kerjasama wajib diisi secara jelas.')
        return false
      }
      if (interestType === 'pembelian_produk' && (!formData.quantity || formData.quantity < 1)) {
        setErrorMessage('Jumlah kuantitas pembelian wajib diisi minimal 1 unit.')
        return false
      }
      if (interestType === 'sewa_fasilitas_lab' && (!formData.rentalStartDate || !formData.rentalEndDate)) {
        setErrorMessage('Tanggal mulai dan berakhir sewa fasilitas wajib dipilih.')
        return false
      }
      if (interestType === 'pengajuan_masalah' && (!formData.problemTitle.trim() || !formData.impactStatement.trim())) {
        setErrorMessage('Judul masalah dan uraian dampak hambatan operasional wajib diisi.')
        return false
      }
      return true
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      if (interestType === 'pengajuan_masalah') {
        // Alur khusus submit tantangan masalah industri ke Problem Bank
        const probRes = await submitProblemAction({
          title: formData.problemTitle || formData.message.slice(0, 60),
          klasterId: formData.problemKlasterId || 'ai-software',
          organizationName: formData.organizationName,
          organizationType: formData.organizationType,
          isAnonymous: formData.isAnonymous,
          contactPerson: formData.senderName,
          contactEmail: formData.senderEmail,
          contactPhone: formData.senderPhone,
          description: formData.message,
          impactStatement: formData.impactStatement,
          expectedSolutionType: formData.expectedSolutionType,
          collaborationScheme: formData.collaborationScheme,
          estimatedBudget: formData.estimatedBudget,
          urgency: formData.urgency,
          targetTimeline: formData.targetTimeline,
        })

        if (probRes.success && probRes.data) {
          router.push(`/inquiry/success?code=${probRes.data.trackingCode}`)
        } else {
          setErrorMessage(probRes.error || 'Gagal mengirimkan tantangan masalah.')
          setIsSubmitting(false)
        }
      } else {
        // Alur submit order standar
        const payload: SubmitOrderPayload = {
          katalogId: katalogItem?.id,
          katalogTitle: katalogItem?.title || 'Inquiry Layanan Umum STP',
          tenantId: katalogItem?.tenantId,
          tenantName: katalogItem?.tenantName || 'Solo Technopark',
          senderName: formData.senderName,
          senderEmail: formData.senderEmail,
          senderPhone: formData.senderPhone,
          organizationName: formData.organizationName,
          organizationType: formData.organizationType,
          senderRoleOrPosition: formData.senderRoleOrPosition,
          senderDepartment: formData.senderDepartment,
          senderLocationCity: formData.senderLocationCity,
          senderIdentityNumber: formData.senderIdentityNumber,
          senderCategory: formData.senderCategory,
          interestType,
          estimatedBudget: formData.estimatedBudget,
          message: formData.message,

          quantity: formData.quantity,
          targetDeliveryDate: formData.targetDeliveryDate,
          purchaseOrderRef: formData.purchaseOrderRef,
          needsDemoFirst: formData.needsDemoFirst,

          researchScope: formData.researchScope,
          institutionType: formData.institutionType,
          researchDuration: formData.researchDuration,
          fundingSource: formData.fundingSource,
          expectedOutput: formData.expectedOutput,

          testingScope: formData.testingScope,
          labEnvironment: formData.labEnvironment,
          numberOfUnits: formData.numberOfUnits,
          testingDuration: formData.testingDuration,

          facilityId: formData.facilityId,
          rentalStartDate: formData.rentalStartDate,
          rentalEndDate: formData.rentalEndDate,
          purposeOfUse: formData.purposeOfUse,
          numberOfParticipants: formData.numberOfParticipants,

          startupStage: formData.startupStage,
          sectorFocus: formData.sectorFocus,
          currentTeamSize: formData.currentTeamSize,
          problemStatement: formData.problemStatement,

          investorType: formData.investorType,
          investmentRange: formData.investmentRange,
          portfolioUrl: formData.portfolioUrl,
        }

        const res = await submitOrderAction(payload)

        if (res.success && res.data) {
          router.push(`/inquiry/success?code=${res.data.trackingCode}`)
        } else {
          setErrorMessage(res.error || 'Terjadi kegagalan saat mengirim permohonan.')
          setIsSubmitting(false)
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Kesalahan sistem saat pengiriman.')
      setIsSubmitting(false)
    }
  }

  const stepLabels = [
    { num: 1, label: 'Kategori Kebutuhan' },
    { num: 2, label: 'Data Pemohon' },
    { num: 3, label: 'Spesifikasi Teknis' },
    { num: 4, label: 'Konfirmasi Pengajuan' },
  ]

  return (
    <div className="space-y-8">
      {/* Progress Bar Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-4 gap-2 text-center">
          {stepLabels.map((s) => {
            const isCompleted = s.num < currentStep
            const isCurrent = s.num === currentStep

            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : isCurrent
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/25'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                </div>
                <span
                  className={`mt-1.5 text-[11px] sm:text-xs font-medium truncate max-w-full ${
                    isCurrent ? 'text-sky-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Target Product Context (Jika Diajukan dari Halaman Produk Tertentu) */}
      {katalogItem && (
        <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold text-xs shrink-0">
              TRL {katalogItem.trl}
            </div>
            <div>
              <span className="text-[11px] text-sky-700 font-semibold uppercase tracking-wider block">
                Terkait Produk Inovasi
              </span>
              <h4 className="text-sm font-bold text-slate-900">{katalogItem.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">Oleh: {katalogItem.tenantName}</p>
            </div>
          </div>
          <Link
            href={`/katalog/${katalogItem.slug}`}
            className="text-xs text-sky-600 hover:text-sky-700 underline font-semibold shrink-0"
          >
            Lihat Produk
          </Link>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Pilih Kategori */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200/90 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Langkah 1: Pilih Kategori Interaksi / Layanan
            </h3>
            <p className="text-xs text-slate-600">
              Tentukan saluran kerjasama yang sesuai dengan kebutuhan spesifik instansi atau bisnis Anda
            </p>
          </div>

          <InquiryTypeSelector
            selectedType={interestType}
            onSelectType={(t) => setInterestType(t)}
          />

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <Button variant="primary" size="md" onClick={nextStep} className="gap-2">
              <span>Lanjut: Data Pemohon</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Data Pemohon Terpersonalisasi */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200/90 space-y-6 shadow-sm">
          {/* Banner Konteks Kategori Terpilih */}
          <div className={`p-4.5 rounded-2xl border ${currentContext.bannerBg} ${currentContext.bannerBorder} flex items-start gap-3.5`}>
            <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
              <CategoryIcon className="h-5 w-5 text-sky-700" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${currentContext.badgeColor}`}>
                  {currentContext.badge}
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {currentContext.title}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentContext.guidanceText}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Langkah 2: {currentContext.step2Title}
            </h3>
            <p className="text-xs text-slate-600">
              {currentContext.step2Subtitle}
            </p>
          </div>

          {/* Subform Pengisi Terdiferensiasi Sesuai Persona Kategori (Murni Identitas, Bebas Anggaran) */}
          <InquiryApplicantFields
            interestType={interestType}
            formData={{
              senderName: formData.senderName,
              senderEmail: formData.senderEmail,
              senderPhone: formData.senderPhone,
              organizationName: formData.organizationName,
              organizationType: formData.organizationType,
              senderRoleOrPosition: formData.senderRoleOrPosition,
              senderDepartment: formData.senderDepartment,
              senderLocationCity: formData.senderLocationCity,
              senderIdentityNumber: formData.senderIdentityNumber,
              senderCategory: formData.senderCategory,
              investorType: formData.investorType,
              portfolioUrl: formData.portfolioUrl,
            }}
            onChange={handleFieldChange}
          />

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <Button variant="ghost" size="md" onClick={prevStep} className="gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Ganti Kategori</span>
            </Button>
            <Button variant="primary" size="md" onClick={nextStep} className="gap-2">
              <span>Lanjut: Spesifikasi Teknis</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Spesifikasi Teknis Sesuai Tipe */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200/90 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Langkah 3: Parameter & Spesifikasi Kebutuhan Teknis
            </h3>
            <p className="text-xs text-slate-600">
              Parameter eksklusif untuk layanan:{' '}
              <strong className="text-sky-700">{INTEREST_TYPE_LABELS[interestType]}</strong>
            </p>
          </div>

          {/* Subform Dinamis Eksklusif per Kategori */}
          {interestType === 'pembelian_produk' && (
            <InquiryPembelianFields
              values={{
                quantity: formData.quantity,
                targetDeliveryDate: formData.targetDeliveryDate,
                purchaseOrderRef: formData.purchaseOrderRef,
                needsDemoFirst: formData.needsDemoFirst,
              }}
              onChange={handleFieldChange}
            />
          )}

          {interestType === 'kerjasama_riset' && (
            <InquiryRisetFields
              values={{
                researchScope: formData.researchScope,
                institutionType: formData.institutionType,
                researchDuration: formData.researchDuration,
                fundingSource: formData.fundingSource,
                expectedOutput: formData.expectedOutput,
              }}
              onChange={handleFieldChange}
            />
          )}

          {interestType === 'pengajuan_masalah' && (
            <InquiryProblemFields
              values={{
                problemTitle: formData.problemTitle,
                problemKlasterId: formData.problemKlasterId,
                impactStatement: formData.impactStatement,
                expectedSolutionType: formData.expectedSolutionType,
                collaborationScheme: formData.collaborationScheme,
                urgency: formData.urgency,
                targetTimeline: formData.targetTimeline,
                isAnonymous: formData.isAnonymous,
              }}
              onChange={handleFieldChange}
            />
          )}

          {interestType === 'uji_coba_prototipe' && (
            <InquiryUjiCobaFields
              values={{
                testingScope: formData.testingScope,
                labEnvironment: formData.labEnvironment,
                numberOfUnits: formData.numberOfUnits,
                testingDuration: formData.testingDuration,
              }}
              onChange={handleFieldChange}
            />
          )}

          {interestType === 'sewa_fasilitas_lab' && (
            <InquirySewaFields
              values={{
                facilityId: formData.facilityId,
                rentalStartDate: formData.rentalStartDate,
                rentalEndDate: formData.rentalEndDate,
                purposeOfUse: formData.purposeOfUse,
                numberOfParticipants: formData.numberOfParticipants,
              }}
              onChange={handleFieldChange}
            />
          )}

          {interestType === 'konsultasi_inkubasi' && (
            <InquiryInkubasiFields
              values={{
                startupStage: formData.startupStage,
                sectorFocus: formData.sectorFocus,
                currentTeamSize: formData.currentTeamSize,
                problemStatement: formData.problemStatement,
              }}
              onChange={handleFieldChange}
            />
          )}

          {interestType === 'investasi' && (
            <InquiryInvestasiFields
              values={{
                investorType: formData.investorType,
                investmentRange: formData.investmentRange,
                portfolioUrl: formData.portfolioUrl,
              }}
              onChange={handleFieldChange}
            />
          )}

          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1.5">
              {currentContext.messageLabel}
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-colors"
              placeholder={currentContext.messagePlaceholder}
              value={formData.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              required
            />
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <Button variant="ghost" size="md" onClick={prevStep} className="gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Button>
            <Button variant="primary" size="md" onClick={nextStep} className="gap-2">
              <span>Lanjut: Konfirmasi & Kirim</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: Konfirmasi Ringkasan Berbeda & Transparan */}
      {currentStep === 4 && (
        <Card className="p-6 sm:p-8 bg-white border-slate-200/90 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Langkah 4: Konfirmasi Ringkasan Permohonan
            </h3>
            <p className="text-xs text-slate-600">
              Periksa kembali seluruh parameter teknis dan data pemohon sebelum mengirimkan berkas resmi ke Solo Technopark
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-5 text-xs">
            {/* Header Ringkasan Kategori */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <CategoryIcon className="h-4 w-4 text-sky-600" />
                <span className="text-slate-500 font-medium">Kategori Permohonan:</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full font-bold border ${currentContext.badgeColor}`}>
                {INTEREST_TYPE_LABELS[interestType]}
              </span>
            </div>

            {/* Identitas Pemohon Terdiferensiasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-3 border-b border-slate-200">
              <div>
                <span className="text-slate-500 block mb-0.5">Nama Pemohon / PIC:</span>
                <strong className="text-slate-900 font-bold">
                  {formData.senderName}
                  {formData.senderRoleOrPosition ? ` (${formData.senderRoleOrPosition})` : ''}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Lembaga / Instansi / Perusahaan:</span>
                <strong className="text-slate-900 font-bold">
                  {formData.organizationName}
                  {formData.senderDepartment ? ` — ${formData.senderDepartment}` : ''}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Alamat Email Resmi:</span>
                <span className="text-slate-900 font-medium">{formData.senderEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Nomor WhatsApp / Telp:</span>
                <span className="text-slate-900 font-medium">{formData.senderPhone}</span>
              </div>
              {formData.senderLocationCity && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Kota / Lokasi Domisili:</span>
                  <span className="text-slate-900 font-medium">{formData.senderLocationCity}</span>
                </div>
              )}
              {formData.senderIdentityNumber && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Nomor Identitas (KTP / KTM / NIDN):</span>
                  <span className="text-slate-900 font-medium">{formData.senderIdentityNumber}</span>
                </div>
              )}
              {formData.portfolioUrl && (
                <div>
                  <span className="text-slate-500 block mb-0.5">Website / Portofolio:</span>
                  <span className="text-sky-700 font-medium">{formData.portfolioUrl}</span>
                </div>
              )}
            </div>

            {/* BLOK KHUSUS: Rangkuman Parameter Spesifik Hasil Input Langkah 3 */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sky-800 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100 pb-2">
                <FileText className="h-3.5 w-3.5 text-sky-600" />
                <span>Parameter Kebutuhan Teknis ({INTEREST_TYPE_LABELS[interestType]})</span>
              </div>

              {/* Rangkuman Pembelian */}
              {interestType === 'pembelian_produk' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Jumlah Kuantitas:</span>
                    <strong className="text-slate-900 font-bold">{formData.quantity || 1} Unit</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Pengiriman:</span>
                    <strong className="text-slate-900">{formData.targetDeliveryDate || 'Fleksibel'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Referensi PO:</span>
                    <span className="text-slate-900">{formData.purchaseOrderRef || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Kebutuhan Demo Unit:</span>
                    <span className="text-slate-900 font-medium">{formData.needsDemoFirst ? 'Ya, Butuh Demo Fisik Terlebih Dahulu' : 'Tidak, Langsung Pengadaan'}</span>
                  </div>
                </div>
              )}

              {/* Rangkuman Riset */}
              {interestType === 'kerjasama_riset' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Bentuk Kerjasama Riset:</span>
                    <strong className="text-slate-900 font-bold capitalize">{formData.researchScope.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Rencana Durasi Riset:</span>
                    <strong className="text-slate-900">{formData.researchDuration.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sumber Skema Dana:</span>
                    <span className="text-slate-900">{formData.fundingSource || 'Mandiri / Negosiasi'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Output Luaran:</span>
                    <span className="text-slate-900 font-medium">{formData.expectedOutput || 'Prototipe TRL 7+ / Paten'}</span>
                  </div>
                </div>
              )}

              {/* Rangkuman Pengajuan Masalah */}
              {interestType === 'pengajuan_masalah' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-slate-500 block">Judul Masalah:</span>
                      <strong className="text-amber-900 font-bold">{formData.problemTitle}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Klaster Terkait:</span>
                      <strong className="text-slate-900 capitalize">{formData.problemKlasterId.replace('-', ' ')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tingkat Urgensi:</span>
                      <span className="font-bold text-amber-800">{URGENCY_LABELS[formData.urgency]}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Perlindungan Anonimitas:</span>
                      <span className="text-slate-900 font-medium">
                        {formData.isAnonymous ? 'Nama Perusahaan Disamarkan di Publik' : 'Tampil Terbuka'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dampak Kerugian Operasional:</span>
                    <p className="text-slate-800 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60 font-medium">
                      {formData.impactStatement}
                    </p>
                  </div>
                </div>
              )}

              {/* Rangkuman Uji Coba */}
              {interestType === 'uji_coba_prototipe' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Lingkup Pengujian:</span>
                    <strong className="text-slate-900 capitalize">{formData.testingScope.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lingkungan Lab:</span>
                    <strong className="text-slate-900 capitalize">{formData.labEnvironment.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Jumlah Sampel Unit:</span>
                    <span className="text-slate-900">{formData.numberOfUnits || '1 Unit'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Waktu Pengujian:</span>
                    <span className="text-slate-900">{formData.testingDuration || '1-2 Minggu'}</span>
                  </div>
                </div>
              )}

              {/* Rangkuman Sewa Lab */}
              {interestType === 'sewa_fasilitas_lab' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Jadwal Sewa:</span>
                    <strong className="text-slate-900">{formData.rentalStartDate} s.d. {formData.rentalEndDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tujuan Penggunaan:</span>
                    <strong className="text-slate-900 capitalize">{formData.purposeOfUse.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Jumlah Peserta/Operator:</span>
                    <span className="text-slate-900">{formData.numberOfParticipants || '-'} Orang</span>
                  </div>
                </div>
              )}

              {/* Rangkuman Inkubasi */}
              {interestType === 'konsultasi_inkubasi' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Tahapan Startup:</span>
                    <strong className="text-slate-900 capitalize">{formData.startupStage.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fokus Sektor:</span>
                    <strong className="text-slate-900 capitalize">{formData.sectorFocus.replace('_', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ukuran Tim Saat Ini:</span>
                    <span className="text-slate-900">{formData.currentTeamSize || '2-5'} Anggota</span>
                  </div>
                </div>
              )}

              {/* Rangkuman Investasi */}
              {interestType === 'investasi' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500 block">Tipe Pemodal:</span>
                    <strong className="text-slate-900 uppercase">{formData.investorType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Rentang Tiket Investasi:</span>
                    <strong className="text-slate-900">{formData.investmentRange}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Website Portofolio:</span>
                    <span className="text-slate-900">{formData.portfolioUrl || '-'}</span>
                  </div>
                </div>
              )}
            </div>

            {formData.estimatedBudget && (
              <div className="pb-2 border-b border-slate-200">
                <span className="text-slate-500 block mb-0.5">Estimasi Alokasi Anggaran:</span>
                <span className="text-emerald-700 font-bold">{formData.estimatedBudget}</span>
              </div>
            )}

            <div>
              <span className="text-slate-500 block mb-1 font-medium">Uraian Kebutuhan Lengkap:</span>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {formData.message}
              </p>
            </div>
          </div>

          <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3.5 text-xs text-slate-700 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              Setelah dikirimkan, sistem Solo Technopark akan menerbitkan <strong>Nomor Resi Pelacakan Resmi</strong>. Tim layanan teknis STP akan memproses permohonan sesuai SOP dalam waktu maksimal 1x24 jam kerja.
            </span>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              size="md"
              onClick={prevStep}
              disabled={isSubmitting}
              className="gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Ubah Parameter</span>
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mengirimkan ke Sistem STP...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Kirim Permohonan Resmi</span>
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

export default function InquiryPage() {
  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl pb-28">
      {/* Navigation */}
      <Link
        href="/katalog"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Kembali ke Eksplorasi Katalog</span>
      </Link>

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 mb-1 shadow-2xs">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Portal Formulir Layanan & Kemitraan STP
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Saluran terpadu pengadaan inovasi, kerjasama riset terapan, tantangan masalah industri, sewa lab, konsultasi inkubasi, dan penjajakan investasi Solo Technopark.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-sm">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-sky-600" />
            <span>Memuat formulir layanan STP...</span>
          </div>
        }
      >
        <InquiryWizard />
      </Suspense>
    </main>
  )
}
