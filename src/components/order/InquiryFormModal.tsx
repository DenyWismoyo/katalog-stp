'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { KatalogItem, OrderInquiryItem, InterestType } from '@/types'
import { submitOrderAction, SubmitOrderPayload } from '@/actions/order'
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
import { submitProblemAction } from '@/actions/problem'
import { KlasterId, UrgencyLevel } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { overlayVariants, modalVariants } from '@/lib/utils/motionVariants'
import {
  X,
  Handshake,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Building2,
  Send,
  Loader2,
  FileCheck2,
} from 'lucide-react'

interface InquiryFormModalProps {
  isOpen: boolean
  onClose: () => void
  katalogItem?: KatalogItem
  initialInterestType?: InterestType
}

export function InquiryFormModal({
  isOpen,
  onClose,
  katalogItem,
  initialInterestType = 'kerjasama_riset',
}: InquiryFormModalProps) {
  const [interestType, setInterestType] = useState<InterestType>(initialInterestType)

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

    // Specific fields
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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ orderId: string; trackingCode: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (initialInterestType) {
      setInterestType(initialInterestType)
    }
  }, [initialInterestType, isOpen])

  const handleCopy = () => {
    if (result?.trackingCode) {
      navigator.clipboard.writeText(result.trackingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: SubmitOrderPayload = {
        katalogId: katalogItem?.id,
        katalogTitle: katalogItem?.title,
        tenantId: katalogItem?.tenantId,
        tenantName: katalogItem?.tenantName,
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

        // Differentiated fields
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

        // Problem fields
        problemTitle: formData.problemTitle,
        problemKlasterId: formData.problemKlasterId,
        problemDescription: formData.message,
        impactStatement: formData.impactStatement,
        expectedSolutionType: formData.expectedSolutionType,
        collaborationScheme: formData.collaborationScheme,
        isAnonymous: formData.isAnonymous,
        urgency: formData.urgency,
      }

      let res: { success: boolean; data?: { orderId?: string; trackingCode: string }; error?: string }

      if (interestType === 'pengajuan_masalah') {
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
        res = {
          success: probRes.success,
          data: probRes.data ? { orderId: probRes.data.problemId, trackingCode: probRes.data.trackingCode } : undefined,
          error: probRes.error,
        }
      } else {
        res = await submitOrderAction(payload)
      }

      if (res.success && res.data) {
        setResult({ orderId: res.data.orderId || '', trackingCode: res.data.trackingCode })
      } else {
        setError(res.error || 'Gagal mengirim formulir permohonan.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleReset}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Permohonan Interaksi & Kerjasama
              </h3>
              <p className="text-xs text-slate-500">
                Layanan Terpadu Riset, Pengadaan, Lab & Kemitraan Solo Technopark
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {result ? (
            /* Sukses State */
            <div className="text-center py-6 space-y-5">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">Permohonan Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Permohonan kerjasama Anda telah masuk ke antrean operator Solo Technopark.
                  Simpan kode resi di bawah ini untuk melacak status dan progres tindak lanjut.
                </p>
              </div>

              {/* Box Nomor Resi */}
              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-md mx-auto">
                <div className="text-left">
                  <span className="text-[10px] text-sky-700 uppercase tracking-wider font-bold">
                    Nomor Resi Pelacakan Resmi
                  </span>
                  <div className="text-lg sm:text-xl font-mono font-black text-sky-700">
                    {result.trackingCode}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 text-xs text-sky-700 border-sky-300 hover:bg-sky-50"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto">
                <Link
                  href={`/inquiry/success?code=${result.trackingCode}`}
                  className="w-full sm:w-auto flex-1"
                >
                  <Button variant="primary" size="md" className="w-full gap-2">
                    <FileCheck2 className="h-4 w-4" />
                    <span>Lihat Halaman Konfirmasi</span>
                  </Button>
                </Link>
                <Link
                  href={`/tracking?code=${result.trackingCode}`}
                  className="w-full sm:w-auto flex-1"
                >
                  <Button variant="outline" size="md" className="w-full gap-2">
                    <span>Lacak Status Resi</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            /* Form Input State */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Target Katalog Context (Jika Ada) */}
              {katalogItem && (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 font-bold text-xs">
                      TRL {katalogItem.trl}
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-[11px] text-sky-700 block font-semibold truncate">
                        {katalogItem.tenantName}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{katalogItem.title}</h5>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 shrink-0">
                    Produk Terpilih
                  </span>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 flex items-start gap-2.5 text-rose-700 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Selector 6 Jenis Interaksi */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-2">
                  Pilih Jenis Interaksi / Kebutuhan Kerjasama *
                </label>
                <InquiryTypeSelector
                  selectedType={interestType}
                  onSelectType={(t) => setInterestType(t)}
                  disabled={loading}
                />
              </div>

              {/* Subform Spesifik Kebutuhan */}
              {interestType === 'pembelian_produk' && (
                <InquiryPembelianFields
                  values={{
                    quantity: formData.quantity,
                    targetDeliveryDate: formData.targetDeliveryDate,
                    purchaseOrderRef: formData.purchaseOrderRef,
                    needsDemoFirst: formData.needsDemoFirst,
                  }}
                  onChange={handleFieldChange}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              )}

              {/* Identitas Pemohon Terdiferensiasi Sesuai Persona Kategori (Murni Identitas, Bebas Anggaran) */}
              <div className="space-y-3.5 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900">
                  Identitas Pemohon & Instansi
                </h4>

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
                  disabled={loading}
                />
              </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1.5">
                    Uraian Kebutuhan & Catatan Tambahan *
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-colors"
                    placeholder="Tuliskan rincian spesifikasi teknis, ekspektasi jadwal, atau pertanyaan yang ingin dikonsultasikan..."
                    value={formData.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={onClose}
                  disabled={loading}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengirim Permohonan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Kirim Permohonan Resmi</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
