'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { SEED_KATALOG, SEED_KLASTER, SEED_FACILITIES } from '@/data/seedData'
import { KatalogGrid } from '@/components/katalog/KatalogGrid'
import { FacilityCard } from '@/components/facility/FacilityCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { CountUp } from '@/components/shared/CountUp'
import {
  Search,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  Handshake,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { KlasterId, KatalogItem } from '@/types'
import { getKatalogItemsAction } from '@/actions/katalog'
import {
  heroContainer,
  heroBadge,
  heroTitle,
  heroSubtitle,
  heroSearch,
  heroStats,
  staggerContainer,
  fadeInUp,
  filterIndicatorTransition,
} from '@/lib/utils/motionVariants'

const STATS = [
  { value: 8, suffix: '', label: 'Klaster Teknologi', color: 'text-sky-700' },
  { value: 9, prefix: 'TRL 1-', suffix: '', label: 'Standar Kesiapterapan', color: 'text-sky-600' },
  { value: 45, suffix: '+', label: 'Tenant & Lab Riset', color: 'text-slate-900' },
  { value: 100, suffix: '%', label: 'Mitra Terbuka', color: 'text-emerald-600' },
]

export default function HomePage() {
  const [items, setItems] = useState<KatalogItem[]>(SEED_KATALOG)
  const [selectedKlaster, setSelectedKlaster] = useState<KlasterId | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function loadLiveItems() {
      const res = await getKatalogItemsAction()
      if (res.success && res.data && res.data.length > 0) {
        setItems(res.data)
      }
    }
    loadLiveItems()
  }, [])

  const filteredItems = items.filter((item) => {
    const matchKlaster = selectedKlaster === 'all' || item.klasterId === selectedKlaster
    const query = searchQuery.toLowerCase().trim()
    const matchSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.tagline.toLowerCase().includes(query) ||
      item.tenantName.toLowerCase().includes(query)
    return matchKlaster && matchSearch
  })

  return (
    <main className="w-full main-with-bottom-nav">

      {/* ================================================================= */}
      {/* HERO SECTION                                                        */}
      {/* ================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28 border-b border-slate-200 hero-gradient-clean">
        {/* Ambient glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-300/12 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[280px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-indigo-300/8 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="stp-container text-center max-w-4xl">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Official Badge */}
            <motion.div variants={heroBadge}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-200/80 text-sky-700 text-xs font-bold mb-6 shadow-sm shadow-sky-600/10">
                <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                <span>Kawasan Sains & Teknologi Kelas Dunia — Surakarta</span>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={heroTitle}
              className="stp-heading-display mb-0"
            >
              Etalase Digital Inovasi &{' '}
              <span className="gradient-text-brand">Riset Terapan</span>
            </motion.h1>

            <motion.p
              variants={heroSubtitle}
              className="mt-5 md:mt-6 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
            >
              Menghubungkan karya teknologi teruji, prototipe industri manufaktur presisi, dan startup binaan{' '}
              <strong className="text-slate-900 font-bold">Solo Technopark</strong>{' '}
              dengan mitra industri, investor, dan masyarakat.
            </motion.p>

            {/* Quick Search Bar */}
            <motion.div
              variants={heroSearch}
              className="mt-8 md:mt-10 max-w-xl mx-auto flex flex-col sm:flex-row gap-2.5 px-2"
            >
              <Input
                type="text"
                placeholder="Cari inovasi: CNC, AI vision, elektroda las, batik..."
                icon={<Search className="h-4 w-4 text-slate-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-slate-300 text-slate-900 shadow-sm"
              />
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    const el = document.getElementById('katalog-showcase')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="shrink-0 gap-2 font-bold w-full sm:w-auto"
                >
                  <span>Jelajahi</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Row — dengan CountUp */}
            <motion.div
              variants={heroStats}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-slate-200/70"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="p-3 text-center">
                  <span className={`stat-digit block ${stat.color}`}>
                    {stat.prefix}
                    <CountUp to={stat.value} suffix={stat.suffix} duration={1600} />
                  </span>
                  <span className="text-xs text-slate-500 font-semibold mt-0.5 block">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* KLASTER TEKNOLOGI FILTER                                            */}
      {/* ================================================================= */}
      <section id="klaster" className="py-10 border-b border-slate-200 bg-white">
        <div className="stp-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-sky-600" />
                <span>8 Klaster Prioritas Solo Technopark</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Pilih bidang teknologi untuk memfilter etalase inovasi</p>
            </div>
            <AnimatePresence>
              {selectedKlaster !== 'all' && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onClick={() => setSelectedKlaster('all')}
                  className="text-xs text-sky-600 hover:text-sky-800 font-bold transition-colors cursor-pointer shrink-0"
                >
                  Reset (Semua) ×
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Klaster pill selector — active indicator pakai layoutId */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {/* Pill: Semua */}
            <button
              onClick={() => setSelectedKlaster('all')}
              className={`relative klaster-pill ${selectedKlaster === 'all' ? 'klaster-pill-all-active' : ''}`}
            >
              {selectedKlaster === 'all' && (
                <motion.span
                  layoutId="klaster-active"
                  className="absolute inset-0 rounded-xl bg-sky-600"
                  style={{ zIndex: -1 }}
                  transition={filterIndicatorTransition}
                />
              )}
              Semua ({SEED_KATALOG.length})
            </button>

            {SEED_KLASTER.map((k) => {
              const isSelected = selectedKlaster === k.id
              return (
                <button
                  key={k.id}
                  onClick={() => setSelectedKlaster(k.id)}
                  className={`relative klaster-pill ${isSelected ? 'klaster-pill-active' : ''}`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="klaster-active"
                      className="absolute inset-0 rounded-xl bg-sky-50 border border-sky-300/60"
                      style={{ zIndex: -1 }}
                      transition={filterIndicatorTransition}
                    />
                  )}
                  {k.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SHOWCASE KATALOG GRID                                               */}
      {/* ================================================================= */}
      <section id="katalog-showcase" className="stp-section stp-container">
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="stp-label-eyebrow">Showcase Resmi</span>
              <h2 className="stp-heading-lg mt-0.5">
                Daftar Produk Inovasi & Purwarupa
              </h2>
              <p className="stp-text-muted mt-1">
                Menampilkan{' '}
                <motion.span
                  key={filteredItems.length}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-bold text-slate-700"
                >
                  {filteredItems.length}
                </motion.span>{' '}
                produk inovasi terkurasi
              </p>
            </div>
            <Link href="/katalog">
              <Button variant="outline" size="sm" className="gap-1.5 font-bold shrink-0">
                <span>Katalog Lengkap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </ScrollReveal>

        <KatalogGrid items={filteredItems} />
      </section>

      {/* ================================================================= */}
      {/* FASILITAS LABORATORIUM & PERMESINAN                                */}
      {/* ================================================================= */}
      <section className="py-14 border-t border-b border-slate-100 bg-slate-50/60">
        <div className="stp-container">
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
                  <Cpu className="h-3.5 w-3.5 text-cyan-600" />
                  <span>Shared Infrastructure STP</span>
                </div>
                <h2 className="stp-heading-lg">
                  Fasilitas Laboratorium & Permesinan Riset
                </h2>
                <p className="stp-text-muted mt-1">
                  Akses terbuka untuk pengujian industri, fabrikasi presisi, dan uji prototipe
                </p>
              </div>
              <Link href="/fasilitas">
                <Button variant="outline" size="sm" className="gap-1.5 font-bold shrink-0">
                  <span>Lihat Seluruh Fasilitas</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {SEED_FACILITIES.slice(0, 3).map((facility, i) => (
              <motion.div key={facility.id} variants={fadeInUp}>
                <FacilityCard facility={facility} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* BUSINESS MATCHING CTA                                               */}
      {/* ================================================================= */}
      <section className="stp-container py-16">
        <ScrollReveal direction="up">
          <div className="cta-gradient-card p-8 sm:p-12 shadow-xl shadow-sky-600/15">
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                <Handshake className="h-3.5 w-3.5" />
                <span>Kemitraan Industri & Alih Teknologi</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Tertarik Mengembangkan Produk atau Bekerjasama dengan Inovator STP?
              </h3>

              <p className="text-sm text-sky-100 leading-relaxed">
                Tim Operator Layanan Bisnis Solo Technopark siap memfasilitasi kebutuhan uji coba laboratorium,
                perjanjian lisensi paten (HAKI), pengadaan produk B2B/B2G, hingga sewa mesin manufaktur CNC.
              </p>

              {/* Benefit chips */}
              <div className="flex flex-wrap gap-2 py-1">
                {['Lisensi HAKI', 'Uji Lab', 'Kerjasama Riset', 'Sewa Fasilitas', 'Inkubasi Startup'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link href="/inquiry">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="secondary"
                      size="md"
                      className="font-bold text-sky-700 bg-white hover:bg-sky-50 shadow-md"
                    >
                      <Zap className="h-4 w-4" />
                      Ajukan Permohonan / Kerjasama
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/tracking">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      size="md"
                      className="border-white/40 text-white hover:bg-white/10 hover:border-white"
                    >
                      Lacak Permohonan Saya
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </main>
  )
}
