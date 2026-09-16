'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ProblemChallengeItem, URGENCY_LABELS, PROBLEM_STATUS_LABELS } from '@/types'
import { getProblemDetailAction } from '@/actions/problem'
import { SolutionProposalModal } from '@/components/problem/SolutionProposalModal'
import { PageTransition } from '@/components/shared/PageTransition'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  ArrowLeft,
  Lightbulb,
  Building2,
  Clock,
  Coins,
  FileText,
  AlertCircle,
  Users,
  ShieldCheck,
  Send,
  ExternalLink,
  Share2,
  CheckCircle2,
} from 'lucide-react'
import { fadeInUp, springGentle, springSnappy } from '@/lib/utils/motionVariants'

export default function DetailTantanganPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [problem, setProblem] = useState<ProblemChallengeItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadDetail() {
      if (!slug) return
      setLoading(true)
      const res = await getProblemDetailAction(slug)
      if (res.success && res.data) {
        setProblem(res.data)
      } else {
        setError(res.error || 'Tantangan masalah tidak ditemukan.')
      }
      setLoading(false)
    }

    loadDetail()
  }, [slug])

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="space-y-6">
          <div className="h-6 w-32 skeleton rounded-md" />
          <div className="h-10 w-3/4 skeleton rounded-lg" />
          <div className="h-40 w-full skeleton rounded-2xl" />
        </div>
      </main>
    )
  }

  if (error || !problem) {
    return (
      <main className="container mx-auto px-4 py-20 max-w-xl text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Tantangan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          {error || 'Masalah yang Anda cari mungkin telah diarsipkan atau dipenuhi solusinya.'}
        </p>
        <div className="pt-2">
          <Link href="/tantangan">
            <Button variant="primary" size="md">
              Kembali ke Bank Masalah
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <PageTransition>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springGentle}
          className="flex items-center justify-between mb-6"
        >
          <Link
            href="/tantangan"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Bank Masalah & Tantangan</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 transition-colors shadow-xs"
          >
            <Share2 className="h-3.5 w-3.5 text-sky-600" />
            <span>{copied ? 'Link Disalin!' : 'Bagikan Tantangan'}</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Kolom Kiri: Detail Tantangan (2 Kolom) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Box */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 inline-flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-sky-600" />
                  <span>{problem.klasterId.replace('-', ' ')}</span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  {URGENCY_LABELS[problem.urgency]}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg ml-auto">
                  {problem.trackingCode}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {problem.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium pt-1 border-t border-slate-100">
                <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Diajukan oleh: </span>
                <strong className="text-slate-900 font-bold">
                  {problem.isAnonymous
                    ? 'Mitra Industri Terverifikasi (Kerahasiaan Nama Dilindungi)'
                    : problem.organizationName}
                </strong>
              </div>
            </motion.div>

            {/* Uraian Masalah */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-600" />
                <span>Latar Belakang & Deskripsi Masalah</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {problem.description}
              </p>
            </div>

            {/* Dampak Operasional */}
            <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200/70 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600" />
                <span>Dampak Kerugian / Hambatan Operasional Saat Ini</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {problem.impactStatement}
              </p>
            </div>

            {/* Ekspektasi Bentuk Solusi */}
            <div className="p-6 rounded-2xl bg-sky-50/40 border border-sky-200/70 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-sky-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600" />
                <span>Bentuk Luaran Solusi yang Diharapkan</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {problem.expectedSolutionType}
              </p>
            </div>

            {/* Parameter Kerjasama */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Rencana Skema Kolaborasi</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Bentuk Skema
                  </span>
                  <strong className="text-slate-900 font-bold capitalize">
                    {problem.collaborationScheme?.replace('_', ' ') || 'Pilot Project'}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Target Durasi
                  </span>
                  <strong className="text-slate-900 font-bold">
                    {problem.targetTimeline || '2-4 Bulan'}
                  </strong>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                    Estimasi Anggaran
                  </span>
                  <strong className="text-slate-900 font-bold">
                    {problem.estimatedBudget || 'Dinegosiasikan'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Action Box (Sticky) */}
          <div className="space-y-6">
            <Card className="p-6 bg-white border-slate-200 shadow-md rounded-2xl sticky top-20 space-y-5">
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500 font-medium">Status Tantangan:</span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    {PROBLEM_STATUS_LABELS[problem.status]}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-slate-500">Proposal Masuk:</span>
                <span className="font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                  {problem.solutionProposalsCount} Solusi
                </span>
              </div>

              {/* Tombol Utama Pitching Solusi */}
              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full gap-2 bg-sky-600 hover:bg-sky-700 text-white shadow-sm"
                  onClick={() => setIsProposalModalOpen(true)}
                >
                  <Send className="h-4 w-4" />
                  <span>Ajukan Solusi Inovasi</span>
                </Button>

                <Link href={`/tracking?code=${problem.trackingCode}`} className="block">
                  <Button variant="outline" size="sm" className="w-full gap-2 text-slate-600">
                    <span>Lacak Status via Resi</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>

              <div className="bg-sky-50/70 rounded-xl p-3 border border-sky-100 text-[11px] text-slate-600 leading-relaxed text-center">
                Solusi yang diajukan akan ditinjau oleh Tim Bisnis STP dan diagendakan sesi penjajakan kerjasama resmi bersama pihak penantang.
              </div>
            </Card>
          </div>
        </div>

        {/* Modal Pitching Solusi */}
        <SolutionProposalModal
          isOpen={isProposalModalOpen}
          onClose={() => setIsProposalModalOpen(false)}
          problem={problem}
        />
      </main>
    </PageTransition>
  )
}
