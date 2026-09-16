'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SEED_KLASTER } from '@/data/seedData'
import { TenantItem, KlasterId } from '@/types'
import { getTenantsAction } from '@/actions/tenant'
import { TenantCard } from '@/components/tenant/TenantCard'
import { Input } from '@/components/ui/Input'
import { Search, ArrowLeft, Building2, Sparkles, Filter } from 'lucide-react'

export default function TenantDirectoryPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedKlaster, setSelectedKlaster] = useState<KlasterId | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    async function loadTenants() {
      setIsLoading(true)
      const res = await getTenantsAction()
      if (res.success && res.data) {
        setTenants(res.data)
      }
      setIsLoading(false)
    }
    loadTenants()
  }, [])

  const filteredTenants = tenants.filter((tenant) => {
    const matchKlaster = selectedKlaster === 'all' || tenant.klasterId === selectedKlaster
    const matchStatus = selectedStatus === 'all' || tenant.incubationStatus === selectedStatus
    const query = search.toLowerCase().trim()
    const matchSearch =
      !query ||
      tenant.name.toLowerCase().includes(query) ||
      (tenant.legalName && tenant.legalName.toLowerCase().includes(query)) ||
      tenant.about.toLowerCase().includes(query)

    return matchKlaster && matchStatus && matchSearch
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
          <Building2 className="h-5 w-5 text-sky-600" />
          <span className="text-xs uppercase font-bold tracking-wider text-sky-700">
            Ekosistem Riset & Inkubasi
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Direktori Tenant & Lab Solo Technopark
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Kenali startup teknologi binaan, laboratorium riset terapan, dan mitra industri yang berkolaborasi menghasilkan inovasi di Solo Technopark.
        </p>
      </div>

      {/* Control Filters Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="max-w-md w-full">
            <Input
              placeholder="Cari nama tenant, perusahaan, atau bidang riset..."
              icon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Status Inkubasi Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'inkubasi', label: 'Inkubasi' },
              { id: 'pra-inkubasi', label: 'Pra-Inkubasi' },
              { id: 'alumni', label: 'Alumni' },
              { id: 'mitra-industri', label: 'Mitra Industri' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedStatus === st.id
                    ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Klaster Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedKlaster('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              selectedKlaster === 'all'
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            Semua Klaster
          </button>
          {SEED_KLASTER.map((k) => (
            <button
              key={k.id}
              onClick={() => setSelectedKlaster(k.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedKlaster === k.id
                  ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {k.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800/80" />
          ))}
        </div>
      ) : filteredTenants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTenants.map((tenant) => (
            <TenantCard key={tenant.id} tenant={tenant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/80">
          <Building2 className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Tenant Tidak Ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tidak ada profil tenant yang sesuai dengan kata kunci atau filter yang Anda pilih.
          </p>
        </div>
      )}
    </main>
  )
}
