'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ProblemChallengeItem, KlasterId } from '@/types'
import { getPublishedProblemsAction } from '@/actions/problem'
import { ProblemCard } from '@/components/problem/ProblemCard'
import { InquiryFormModal } from '@/components/order/InquiryFormModal'
import { PageTransition } from '@/components/shared/PageTransition'
import {
  Lightbulb,
  Search,
  PlusCircle,
  Sparkles,
  HelpCircle,
  Filter,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  fadeInUp,
  staggerContainer,
  springSnappy,
  filterIndicatorTransition,
} from '@/lib/utils/motionVariants'

const KLASTER_FILTER_OPTIONS: { id: KlasterId | 'all'; label: string }[] = [
  { id: 'all', label: 'Semua Klaster' },
  { id: 'ai-software', label: 'AI & Software' },
  { id: 'manufaktur-cnc', label: 'Manufaktur & CNC' },
  { id: 'smart-city-iot', label: 'Smart City & IoT' },
  { id: 'underwater-welding', label: 'Underwater Welding' },
  { id: 'robotika-otomasi', label: 'Robotika & Otomasi' },
  { id: 'energi-terbarukan', label: 'Energi Terbarukan' },
  { id: 'batik-craft-tech', label: 'Batik & Craft Tech' },
]

export default function TantanganPage() {
  const [problems, setProblems] = useState<ProblemChallengeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKlaster, setSelectedKlaster] = useState<KlasterId | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)

  useEffect(() => {
    async function loadProblems() {
      setLoading(true)
      const res = await getPublishedProblemsAction({
        klasterId: selectedKlaster,
        search: searchQuery,
      })
      if (res.success && res.data) {
        setProblems(res.data)
      }
      setLoading(false)
    }

    const timer = setTimeout(() => {
      loadProblems()
    }, 250)

    return () => clearTimeout(timer)
  }, [selectedKlaster, searchQuery])

  return (
    <PageTransition>
      <main className="min-h-screen bg-slate-50/50 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200/80 pt-12 pb-14 sm:pt-16 sm:pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Open Innovation & Reverse Pitching Hub</span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4"
              >
                Bank Masalah & <span className="gradient-text-brand">Tantangan Industri</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-6"
              >
                Saluran resmi Solo Technopark yang menampung masalah teknis dan tantangan operasional nyata dari mitra industri, instansi pemerintah, BUMN, dan UMKM untuk dipecahkan bersama oleh ekosistem startup, tenant inovasi, dan laboratorium riset terapan.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center gap-3"
              >
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                  onClick={() => setIsInquiryModalOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Ajukan Tantangan Masalah Baru</span>
                </Button>

                <Link href="/katalog">
                  <Button variant="outline" size="md" className="gap-2">
                    <span>Lihat Produk Inovasi Jadi</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Explorer Section */}
        <section className="container mx-auto px-4 sm:px-6 max-w-6xl -mt-6">
          {/* Filter & Search Bar Card */}
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kata kunci masalah (contoh: deteksi cacat, CNC presisi, telemetri air, robotika)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Klaster Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
              {KLASTER_FILTER_OPTIONS.map((opt) => {
                const isActive = selectedKlaster === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedKlaster(opt.id)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-problem-filter"
                        transition={filterIndicatorTransition}
                        className="absolute inset-0 bg-sky-600 rounded-xl z-0 shadow-sm shadow-sky-600/20"
                      />
                    )}
                    <span className="relative z-10">{opt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Grid Problems */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Daftar Tantangan Terbuka ({problems.length})
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Diperbarui secara real-time oleh Tim Bisnis STP
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
                    <div className="h-5 w-24 skeleton rounded-md" />
                    <div className="h-6 w-3/4 skeleton rounded-md" />
                    <div className="h-16 w-full skeleton rounded-xl" />
                    <div className="h-4 w-1/2 skeleton rounded-md" />
                  </div>
                ))}
              </div>
            ) : problems.length > 0 ? (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {problems.map((problem) => (
                  <ProblemCard key={problem.id} problem={problem} />
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Tidak Ditemukan Tantangan Sesuai Filter
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Belum ada tantangan terbuka pada klaster ini atau pencarian Anda. Anda dapat menjadi pihak pertama yang mengajukan masalah industri untuk dicarikan solusinya!
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                    onClick={() => setIsInquiryModalOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Ajukan Masalah Baru</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Modal Pengajuan Masalah */}
        <InquiryFormModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          initialInterestType="pengajuan_masalah"
        />
      </main>
    </PageTransition>
  )
}
