'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Building2,
  Plus,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  CheckCircle2,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AdminNav } from '@/components/admin/AdminNav'
import { TenantItem, KlasterId } from '@/types'
import { SEED_KLASTER, SEED_TENANTS } from '@/data/seedData'
import {
  getTenantsAction,
  createTenantAction,
  updateTenantAction,
  deleteTenantAction,
  CreateTenantPayload,
} from '@/actions/tenant'

export default function AdminTenantStudioPage() {
  const [tenants, setTenants] = useState<TenantItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedKlaster, setSelectedKlaster] = useState<KlasterId | 'all'>('all')
  const [selectedStatus, setSelectedStatus] = useState<TenantItem['incubationStatus'] | 'all'>('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Default Form
  const defaultForm: CreateTenantPayload = {
    name: '',
    legalName: '',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop',
    bannerUrl: '',
    klasterId: 'ai-software',
    about: '',
    website: '',
    email: '',
    phone: '',
    address: 'Kawasan Solo Technopark, Surakarta',
    incubationStatus: 'inkubasi',
    batchYear: new Date().getFullYear(),
    socialLinks: {},
    isActive: true,
  }

  const [form, setForm] = useState<CreateTenantPayload>(defaultForm)

  const fetchTenants = async () => {
    setLoading(true)
    try {
      const res = await getTenantsAction({
        search,
        klasterId: selectedKlaster,
        incubationStatus: selectedStatus,
      })
      if (res.success && res.data) {
        setTenants(res.data)
      } else {
        setTenants(SEED_TENANTS)
      }
    } catch {
      setTenants(SEED_TENANTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [selectedKlaster, selectedStatus])

  const openCreateModal = () => {
    setEditingTenantId(null)
    setForm(defaultForm)
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (t: TenantItem) => {
    setEditingTenantId(t.id)
    setForm({
      name: t.name,
      legalName: t.legalName || '',
      logoUrl: t.logoUrl || defaultForm.logoUrl,
      bannerUrl: t.bannerUrl || '',
      klasterId: t.klasterId,
      about: t.about,
      website: t.website || '',
      email: t.email,
      phone: t.phone || '',
      address: t.address || '',
      incubationStatus: t.incubationStatus,
      batchYear: t.batchYear || 2025,
      socialLinks: t.socialLinks || {},
      isActive: t.isActive !== false,
    })
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage(null)

    try {
      if (!form.name.trim() || !form.email.trim() || !form.about.trim()) {
        setErrorMessage('Nama tenant, email, dan tentang singkat wajib diisi.')
        setSaving(false)
        return
      }

      if (editingTenantId) {
        const res = await updateTenantAction(editingTenantId, form)
        if (res.success) {
          setIsModalOpen(false)
          fetchTenants()
        } else {
          setErrorMessage(res.error || 'Gagal memperbarui profil tenant.')
        }
      } else {
        const res = await createTenantAction(form)
        if (res.success) {
          setIsModalOpen(false)
          fetchTenants()
        } else {
          setErrorMessage(res.error || 'Gagal menambahkan tenant baru.')
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (t: TenantItem) => {
    const confirm = window.confirm(
      `Apakah Anda yakin ingin menghapus profil tenant "${t.name}"? Data yang terhapus tidak dapat dikembalikan.`
    )
    if (!confirm) return

    try {
      const res = await deleteTenantAction(t.id)
      if (res.success) {
        setTenants((prev) => prev.filter((it) => it.id !== t.id))
      } else {
        alert(res.error || 'Gagal menghapus tenant.')
      }
    } catch {
      alert('Gagal menghapus tenant.')
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Header Studio */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Solo Technopark Incubator
            </span>
            <span className="text-slate-500">•</span>
            <Badge variant="purple" size="sm">Role: Administrator</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manajemen Tenant & Lab Mitra STP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Daftarkan dan kelola profil startup, badan usaha (PT/CV), status inkubasi, dan kontak riset mitra.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTenants}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Ulang</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Daftarkan Tenant Baru</span>
          </Button>
        </div>
      </div>

      {/* Navigasi Admin Bersama */}
      <AdminNav />

      {/* Filter & Pencarian */}
      <Card className="p-4 mb-6 border-slate-800 bg-slate-900/80">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Input Pencarian */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari tenant berdasarkan nama, badan hukum, atau bidang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchTenants()}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filter Klaster */}
          <div className="flex items-center gap-2">
            <select
              value={selectedKlaster}
              onChange={(e) => setSelectedKlaster(e.target.value as any)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">Semua Klaster</option>
              {SEED_KLASTER.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>

            {/* Filter Status Inkubasi */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="pra-inkubasi">Pra-Inkubasi</option>
              <option value="inkubasi">Inkubasi Aktif</option>
              <option value="alumni">Alumni</option>
              <option value="mitra-industri">Mitra Industri</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Daftar Tenant */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenants.map((t) => {
          const klaster = SEED_KLASTER.find((k) => k.id === t.klasterId)

          return (
            <Card
              key={t.id}
              className="p-5 border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Baris Atas: Logo & Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-800 border border-slate-700/80 overflow-hidden relative flex-shrink-0">
                      <Image
                        src={t.logoUrl || defaultForm.logoUrl}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {t.name}
                      </h2>
                      {t.legalName && (
                        <span className="text-[11px] text-slate-400 block font-medium">
                          {t.legalName}
                        </span>
                      )}
                    </div>
                  </div>

                  <Badge
                    variant={
                      t.incubationStatus === 'inkubasi'
                        ? 'cyan'
                        : t.incubationStatus === 'alumni'
                        ? 'emerald'
                        : t.incubationStatus === 'mitra-industri'
                        ? 'purple'
                        : 'amber'
                    }
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {t.incubationStatus}
                  </Badge>
                </div>

                {/* Klaster & Batch */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                    {klaster?.name || t.klasterId}
                  </span>
                  {t.batchYear && (
                    <span className="text-[11px] text-slate-500">
                      Batch {t.batchYear}
                    </span>
                  )}
                </div>

                {/* Deskripsi */}
                <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {t.about}
                </p>

                {/* Kontak Ringkas */}
                <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/60 pt-3">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="h-3 w-3 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{t.email}</span>
                  </div>
                  {t.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-slate-500 flex-shrink-0" />
                      <span>{t.phone}</span>
                    </div>
                  )}
                  {t.address && (
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-3 w-3 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{t.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Baris Tombol Aksi */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
                <Link
                  href={`/tenant/${t.id}`}
                  target="_blank"
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <span>Lihat Publik</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Profil Tenant"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Tenant"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {tenants.length === 0 && !loading && (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
          <Building2 className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Tidak ada tenant ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Coba sesuaikan kata kunci pencarian atau filter klaster inkubasi.
          </p>
          <Button variant="outline" size="sm" onClick={openCreateModal} className="text-xs">
            Daftarkan Tenant Perdana
          </Button>
        </div>
      )}

      {/* Modal Tambah / Edit Tenant */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  {editingTenantId ? 'Edit Profil Tenant' : 'Daftarkan Tenant / Startup Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Brand */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nama Tenant / Brand <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Solo AI Labs"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Nama Legal PT/CV */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nama Badan Usaha (Legal PT / CV)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Solo Kecerdasan Digital"
                    value={form.legalName || ''}
                    onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Klaster Teknologi */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Klaster Teknologi <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={form.klasterId}
                    onChange={(e) => setForm({ ...form, klasterId: e.target.value as KlasterId })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {SEED_KLASTER.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Inkubasi */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Status Inkubasi <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={form.incubationStatus}
                    onChange={(e) =>
                      setForm({ ...form, incubationStatus: e.target.value as any })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="pra-inkubasi">Pra-Inkubasi</option>
                    <option value="inkubasi">Inkubasi Aktif</option>
                    <option value="alumni">Alumni</option>
                    <option value="mitra-industri">Mitra Industri</option>
                  </select>
                </div>

                {/* Tahun Angkatan */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tahun Angkatan / Batch
                  </label>
                  <input
                    type="number"
                    value={form.batchYear || 2025}
                    onChange={(e) => setForm({ ...form, batchYear: parseInt(e.target.value) || 2025 })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Profil Singkat */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tentang / Profil Singkat Inovator <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan fokus teknologi, riset, atau spesialisasi solusi startup..."
                  value={form.about}
                  onChange={(e) => setForm({ ...form, about: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Resmi */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Email Kontak Resmi <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@perusahaan.co.id"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Nomor Telepon / WA */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={form.phone || ''}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Website */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Situs Web Resmi
                  </label>
                  <input
                    type="url"
                    placeholder="https://startup.id"
                    value={form.website || ''}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Alamat Workshop */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Lokasi Kantor / Lab di STP
                  </label>
                  <input
                    type="text"
                    placeholder="Gedung Inkubator Lt. 2 Solo Technopark"
                    value={form.address || ''}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  URL Logo Profil
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Checkbox Status Aktif */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-slate-300 font-medium cursor-pointer">
                  Tampilkan profil tenant secara aktif di etalase publik
                </label>
              </div>

              {/* Tombol Simpan */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white min-w-[120px]"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </span>
                  ) : (
                    <span>{editingTenantId ? 'Simpan Perubahan' : 'Daftarkan Tenant'}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
