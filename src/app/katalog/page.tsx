'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SEED_KATALOG, SEED_KLASTER } from '@/data/seedData'
import { KatalogItem, KlasterId } from '@/types'
import { getKatalogItemsAction } from '@/actions/katalog'
import { KatalogGrid } from '@/components/katalog/KatalogGrid'
import { Input } from '@/components/ui/Input'
import { Search, ArrowLeft, SlidersHorizontal, PackageSearch } from 'lucide-react'
import Link from 'next/link'
import { filterIndicatorTransition, fadeInUp, staggerFast } from '@/lib/utils/motionVariants'

const TRL_FILTERS = [
  { id: 'all', label: 'Semua TRL' },
  { id: 4,     label: 'TRL 4+' },
  { id: 7,     label: 'TRL 7+ (Siap Pasar)' },
  { id: 8,     label: 'TRL 8+ (Tersertifikasi)' },
]

export default function KatalogExplorerPage() {
  const [items, setItems] = useState<KatalogItem[]>(SEED_KATALOG)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedKlaster, setSelectedKlaster] = useState<KlasterId | 'all'>('all')
  const [selectedTrl, setSelectedTrl] = useState<number | 'all'>('all')

  useEffect(() => {
    async function fetchLiveKatalog() {
      setIsLoading(true)
      const res = await getKatalogItemsAction()
      if (res.success && res.data && res.data.length > 0) {
        setItems(res.data)
      }
      setIsLoading(false)
    }
    fetchLiveKatalog()
  }, [])

  const filteredItems = items.filter((item) => {
    const matchKlaster = selectedKlaster === 'all' || item.klasterId === selectedKlaster
    const matchTrl = selectedTrl === 'all' || item.trl >= (selectedTrl as number)
    const query = search.toLowerCase().trim()
    const matchSearch =
      !query ||
      item.title.toLowerCase().includes(query) ||
      item.tagline.toLowerCase().includes(query) ||
      item.tenantName.toLowerCase().includes(query) ||
      (item.targetMarket && item.targetMarket.some((t) => t.toLowerCase().includes(query)))
    return matchKlaster && matchTrl && matchSearch
  })

  return (
    <main className="stp-container py-8 main-with-bottom-nav">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="flex items-center gap-2 mb-1.5">
          <PackageSearch className="h-5 w-5 text-sky-600" />
          <span className="stp-label-eyebrow">Etalase e-Katalog Inovasi STP</span>
        </div>

        <h1 className="stp-heading-xl tracking-tight">
          Eksplorasi Produk & Riset Terapan
          <span className="block sm:inline"> Solo Technopark</span>
        </h1>
        <p className="stp-text-muted mt-2 max-w-2xl">
          Telusuri seluruh portofolio teknologi siap pakai, purwarupa teruji, dan produk manufaktur presisi
          dari tenant dan laboratorium STP.
        </p>
      </motion.div>

      {/* Control Bar */}
      <motion.div
        className="space-y-3 mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Search + TRL Filter */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="max-w-md w-full">
            <Input
              placeholder="Ketik nama produk, teknologi, atau tenant..."
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* TRL Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            <span className="text-xs text-slate-500 font-semibold mr-0.5 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-sky-600" />
              <span className="hidden sm:inline">TRL Min:</span>
            </span>
            {TRL_FILTERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTrl(t.id as any)}
                className={`relative stp-pill-filter ${selectedTrl === t.id ? 'active' : ''}`}
              >
                {selectedTrl === t.id && (
                  <motion.span
                    layoutId="trl-active"
                    className="absolute inset-0 rounded-pill bg-sky-600"
                    style={{ borderRadius: 9999, zIndex: -1 }}
                    transition={filterIndicatorTransition}
                  />
                )}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Klaster Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setSelectedKlaster('all')}
            className={`relative shrink-0 stp-pill-filter ${selectedKlaster === 'all' ? 'active' : ''}`}
          >
            {selectedKlaster === 'all' && (
              <motion.span
                layoutId="klaster-explorer-active"
                className="absolute inset-0 bg-sky-600"
                style={{ borderRadius: 9999, zIndex: -1 }}
                transition={filterIndicatorTransition}
              />
            )}
            Semua ({items.length})
          </button>

          {SEED_KLASTER.map((k) => {
            const count = items.filter((it) => it.klasterId === k.id).length
            const isSelected = selectedKlaster === k.id
            return (
              <button
                key={k.id}
                onClick={() => setSelectedKlaster(k.id)}
                className={`relative shrink-0 stp-pill-filter ${isSelected ? 'active' : ''}`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="klaster-explorer-active"
                    className="absolute inset-0 bg-sky-600"
                    style={{ borderRadius: 9999, zIndex: -1 }}
                    transition={filterIndicatorTransition}
                  />
                )}
                {k.name}
                <span className={`ml-1 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                  ({count})
                </span>
              </button>
            )
          })}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={filteredItems.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="font-bold text-slate-700 inline-block"
              >
                {filteredItems.length}
              </motion.span>
            </AnimatePresence>
            {' '}dari {items.length} produk inovasi
          </span>
          <AnimatePresence>
            {(selectedKlaster !== 'all' || selectedTrl !== 'all' || search) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => {
                  setSelectedKlaster('all')
                  setSelectedTrl('all')
                  setSearch('')
                }}
                className="text-xs text-sky-600 hover:text-sky-800 font-bold transition-colors"
              >
                Reset semua filter ×
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Grid */}
      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Skeleton terang — konsisten dengan tema putih bersih */}
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
              <div className="aspect-[16/10] rounded-xl skeleton" />
              <div className="space-y-2">
                <div className="h-2.5 w-1/4 rounded-full skeleton" />
                <div className="h-5 w-3/4 rounded-lg skeleton" />
                <div className="h-3 w-full rounded-lg skeleton" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <KatalogGrid items={filteredItems} />
      )}
    </main>
  )
}
