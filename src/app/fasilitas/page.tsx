'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FacilityItem, FacilityCategory } from '@/types'
import { getFacilitiesAction } from '@/actions/facility'
import { FacilityCard } from '@/components/facility/FacilityCard'
import { Input } from '@/components/ui/Input'
import { Search, ArrowLeft, Building, Wrench, Sparkles, SlidersHorizontal } from 'lucide-react'

const CATEGORY_TABS: { id: FacilityCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Semua Fasilitas' },
  { id: 'studio_kreatif', label: 'Studio Kreatif & Podcast' },
  { id: 'diklat_hall', label: 'Ruang Kelas & Pertemuan' },
  { id: 'ai_iot_lab', label: 'AI Supercomputer Lab' },
  { id: 'wet_welding', label: 'Wet Welding Tank' },
  { id: 'manufaktur_cnc', label: 'Permesinan CNC' },
]

export default function FasilitasExplorerPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory | 'all'>('all')

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      const res = await getFacilitiesAction()
      if (res.success && res.data) {
        setFacilities(res.data)
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  const filteredFacilities = facilities.filter((f) => {
    const matchCat = selectedCategory === 'all' || f.category === selectedCategory
    const q = search.toLowerCase().trim()
    const matchSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.tagline.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.equipmentList.some((eq) => eq.toLowerCase().includes(q))

    return matchCat && matchSearch
  })

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb & Navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="h-5 w-5 text-sky-600" />
          <span className="text-xs uppercase font-bold tracking-wider text-sky-700">
            Infrastruktur & Laboratorium Bersama
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Fasilitas Riset & Permesinan Industri Solo Technopark
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Akses peralatan industri berstandar global, mesin CNC presisi mikron, kolam uji las bawah air, dan laboratorium superkomputer AI untuk kebutuhan riset, prototipe, maupun produksi B2G/B2B.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="max-w-md w-full">
            <Input
              placeholder="Cari fasilitas, tipe mesin, atau lokasi..."
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === tab.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800" />
          ))}
        </div>
      ) : filteredFacilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Wrench className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Fasilitas Tidak Ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tidak ada laboratorium atau permesinan yang cocok dengan kriteria pencarian Anda.
          </p>
        </div>
      )}
    </main>
  )
}
