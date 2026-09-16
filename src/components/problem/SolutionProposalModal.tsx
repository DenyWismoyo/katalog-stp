'use client'

import React, { useState } from 'react'
import { ProblemChallengeItem, SolutionProposalItem } from '@/types'
import { submitSolutionProposalAction } from '@/actions/problem'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'
import { overlayVariants, modalVariants } from '@/lib/utils/motionVariants'
import {
  X,
  Rocket,
  CheckCircle2,
  AlertCircle,
  Send,
  Loader2,
  Clock,
  Coins,
  FileCheck2,
} from 'lucide-react'

interface SolutionProposalModalProps {
  isOpen: boolean
  onClose: () => void
  problem: ProblemChallengeItem
}

export function SolutionProposalModal({
  isOpen,
  onClose,
  problem,
}: SolutionProposalModalProps) {
  const [formData, setFormData] = useState({
    solverType: 'tenant' as SolutionProposalItem['solverType'],
    solverName: '',
    solverEmail: '',
    solverPhone: '',
    solutionSummary: '',
    methodology: '',
    proposedTimeline: '',
    estimatedCost: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await submitSolutionProposalAction({
        problemId: problem.id,
        problemTitle: problem.title,
        solverType: formData.solverType,
        solverName: formData.solverName,
        solverEmail: formData.solverEmail,
        solverPhone: formData.solverPhone,
        solutionSummary: formData.solutionSummary,
        methodology: formData.methodology,
        proposedTimeline: formData.proposedTimeline,
        estimatedCost: formData.estimatedCost,
      })

      if (res.success) {
        setIsSuccess(true)
      } else {
        setError(res.error || 'Gagal mengirimkan proposal solusi.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
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
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-sm"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
                  <Rocket className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    Pitching Solusi Inovasi
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    Ajukan konsep solusi untuk tantangan: {problem.title}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {isSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-xl font-bold text-slate-900">
                      Proposal Solusi Berhasil Diajukan!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      Konsep solusi Anda telah tercatat di antrean kurasi Solo Technopark.
                      Tim Bisnis STP akan mengkaji kecocokan metodologi dan mengagendakan
                      sesi business matching bersama penantang ({problem.isAnonymous ? 'Mitra Industri' : problem.organizationName}).
                    </p>
                  </div>
                  <div className="pt-3">
                    <Button variant="primary" size="md" onClick={handleClose}>
                      Selesai & Tutup
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Context Tantangan */}
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      Tantangan Target:
                    </span>
                    <span className="font-bold text-slate-900">{problem.title}</span>
                    <span className="text-slate-600 text-[11px] line-clamp-1">
                      Kebutuhan: {problem.expectedSolutionType}
                    </span>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Jenis Solver */}
                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1.5">
                      Identitas Solver / Pengaju Solusi *
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none font-medium"
                      value={formData.solverType}
                      onChange={(e) => handleFieldChange('solverType', e.target.value)}
                      disabled={loading}
                    >
                      <option value="tenant">Tenant / Startup Binaan Solo Technopark</option>
                      <option value="peneliti">Peneliti / Tim Laboratorium Riset Terapan</option>
                      <option value="startup">Startup Mandiri / Perusahaan Teknologi Eksternal</option>
                      <option value="umum">Akademisi / Mahasiswa / Inovator Independen</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                      label="Nama Inovator / Tim / Tenant *"
                      placeholder="Contoh: PT. Techno Mekatronika Solo"
                      value={formData.solverName}
                      onChange={(e) => handleFieldChange('solverName', e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Input
                      type="email"
                      label="Alamat Email *"
                      placeholder="tim@inovator.com"
                      value={formData.solverEmail}
                      onChange={(e) => handleFieldChange('solverEmail', e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <Input
                      type="tel"
                      label="Nomor Telepon / WA *"
                      placeholder="081234567890"
                      value={formData.solverPhone}
                      onChange={(e) => handleFieldChange('solverPhone', e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Input
                      label="Estimasi Durasi Pengerjaan"
                      placeholder="Contoh: 2-3 Bulan"
                      icon={<Clock className="h-4 w-4" />}
                      value={formData.proposedTimeline}
                      onChange={(e) => handleFieldChange('proposedTimeline', e.target.value)}
                      disabled={loading}
                    />
                    <Input
                      label="Estimasi Kebutuhan Biaya"
                      placeholder="Contoh: Rp 60.000.000"
                      icon={<Coins className="h-4 w-4" />}
                      value={formData.estimatedCost}
                      onChange={(e) => handleFieldChange('estimatedCost', e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1.5">
                      Ringkasan Konsep Solusi yang Diajukan *
                    </label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-colors"
                      placeholder="Jelaskan secara garis besar bagaimana teknologi atau pendekatan Anda dapat memecahkan masalah ini..."
                      value={formData.solutionSummary}
                      onChange={(e) => handleFieldChange('solutionSummary', e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-800 block mb-1.5">
                      Metodologi & Rencana Implementasi Teknis (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-colors"
                      placeholder="Tahapan pengujian, komponen mesin/AI yang dipakai, atau kebutuhan lab STP..."
                      value={formData.methodology}
                      onChange={(e) => handleFieldChange('methodology', e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="ghost"
                      size="md"
                      onClick={handleClose}
                      disabled={loading}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={loading}
                      className="gap-2 bg-sky-600 hover:bg-sky-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Mengirim Proposal...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Kirim Proposal Solusi</span>
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
