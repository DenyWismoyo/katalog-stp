'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Cpu,
  Plus,
  Trash2,
  Edit,
  Search,
  RefreshCw,
  X,
  ExternalLink,
  MapPin,
  Users,
  Clock,
  Coins,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AdminNav } from '@/components/admin/AdminNav'
import { FacilityItem, FacilityCategory } from '@/types'
import { SEED_FACILITIES } from '@/data/seedData'
import {
  getFacilitiesAction,
  createFacilityAction,
  updateFacilityAction,
  deleteFacilityAction,
  CreateFacilityPayload,
} from '@/actions/facility'

const CATEGORY_OPTIONS: { id: FacilityCategory; label: string }[] = [
  { id: 'manufaktur_cnc', label: 'Manufaktur Presisi & CNC' },
  { id: 'wet_welding', label: 'Underwater Wet Welding' },
  { id: 'ai_iot_lab', label: 'AI & Cyber Security Lab' },
  { id: 'diklat_hall', label: 'Gedung Diklat & Convention' },
  { id: 'studio_kreatif', label: 'Studio Game & Multimedia' },
]

export default function AdminFasilitasStudioPage() {
  const [facilities, setFacilities] = useState<FacilityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FacilityCategory | 'all'>('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Default Form
  const defaultForm: CreateFacilityPayload = {
    name: '',
    category: 'manufaktur_cnc',
    tagline: '',
    description: '',
    location: 'Kawasan Solo Technopark',
    capacity: '25 Orang',
    equipmentList: ['CNC Milling 5-Axis'],
    specifications: [
      { key: 'Spesifikasi Mesin', value: 'Spindle 20.000 RPM' },
      { key: 'Toleransi Presisi', value: '± 0.003 mm' },
    ],
    coverUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=500&fit=crop',
    ratePerHour: 'Rp 250.000 / jam',
    ratePerDay: 'Rp 1.800.000 / hari',
    status: 'available',
    contactPerson: 'Layanan Lab STP (+62 812-3456-7890)',
  }

  const [form, setForm] = useState<CreateFacilityPayload>(defaultForm)
  const [equipmentInput, setEquipmentInput] = useState('')

  const fetchFacilities = async () => {
    setLoading(true)
    try {
      const res = await getFacilitiesAction({
        category: selectedCategory,
        search,
      })
      if (res.success && res.data) {
        setFacilities(res.data)
      } else {
        setFacilities(SEED_FACILITIES)
      }
    } catch {
      setFacilities(SEED_FACILITIES)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFacilities()
  }, [selectedCategory])

  const openCreateModal = () => {
    setEditingFacilityId(null)
    setForm(defaultForm)
    setEquipmentInput(defaultForm.equipmentList.join(', '))
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (f: FacilityItem) => {
    setEditingFacilityId(f.id)
    setForm({
      name: f.name,
      slug: f.slug,
      category: f.category,
      categoryLabel: f.categoryLabel,
      tagline: f.tagline,
      description: f.description,
      location: f.location,
      capacity: f.capacity,
      equipmentList: f.equipmentList || [],
      specifications: f.specifications || [],
      coverUrl: f.coverUrl,
      galleryUrls: f.galleryUrls || [],
      ratePerHour: f.ratePerHour || '',
      ratePerDay: f.ratePerDay || '',
      status: f.status,
      contactPerson: f.contactPerson || '',
    })
    setEquipmentInput((f.equipmentList || []).join(', '))
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  // Handle Dynamic Specification Key-Value Pairs
  const addSpecRow = () => {
    setForm({
      ...form,
      specifications: [...form.specifications, { key: '', value: '' }],
    })
  }

  const updateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...form.specifications]
    updated[index][field] = val
    setForm({ ...form, specifications: updated })
  }

  const removeSpecRow = (index: number) => {
    setForm({
      ...form,
      specifications: form.specifications.filter((_, i) => i !== index),
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage(null)

    try {
      if (!form.name.trim() || !form.tagline.trim() || !form.description.trim()) {
        setErrorMessage('Nama fasilitas, tagline, dan deskripsi wajib diisi.')
        setSaving(false)
        return
      }

      // Parse equipment comma separated
      const parsedEquipment = equipmentInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

      const payload: CreateFacilityPayload = {
        ...form,
        equipmentList: parsedEquipment.length > 0 ? parsedEquipment : ['Fasilitas Standar'],
        specifications: form.specifications.filter((s) => s.key.trim() && s.value.trim()),
      }

      if (editingFacilityId) {
        const res = await updateFacilityAction(editingFacilityId, payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchFacilities()
        } else {
          setErrorMessage(res.error || 'Gagal memperbarui data fasilitas.')
        }
      } else {
        const res = await createFacilityAction(payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchFacilities()
        } else {
          setErrorMessage(res.error || 'Gagal menambahkan fasilitas baru.')
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (f: FacilityItem) => {
    const confirm = window.confirm(
      `Apakah Anda yakin ingin menghapus fasilitas "${f.name}"? Tindakan ini permanen.`
    )
    if (!confirm) return

    try {
      const res = await deleteFacilityAction(f.id)
      if (res.success) {
        setFacilities((prev) => prev.filter((it) => it.id !== f.id))
      } else {
        alert(res.error || 'Gagal menghapus fasilitas.')
      }
    } catch {
      alert('Gagal menghapus fasilitas.')
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Header Studio */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Solo Technopark Shared Infrastructure
            </span>
            <span className="text-slate-500">•</span>
            <Badge variant="purple" size="sm">Role: Administrator</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Manajemen Fasilitas & Mesin Riset STP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Kelola data laboratorium bersama, permesinan CNC presisi, tangki wet welding, dan tarif sewa B2G/B2B.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFacilities}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Ulang</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            className="gap-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Fasilitas / Mesin</span>
          </Button>
        </div>
      </div>

      {/* Navigasi Admin Bersama */}
      <AdminNav />

      {/* Filter & Pencarian */}
      <Card className="p-4 mb-6 border-slate-800 bg-slate-900/80">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari fasilitas, mesin, atau lokasi gedung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchFacilities()}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">Semua Kategori Fasilitas</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Daftar Fasilitas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((f) => (
          <Card
            key={f.id}
            className="p-5 border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Gambar Cover & Status */}
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4 border border-slate-800 bg-slate-950">
                <Image
                  src={f.coverUrl || defaultForm.coverUrl}
                  alt={f.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <Badge variant="sky" size="sm">
                    {f.categoryLabel || f.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={
                      f.status === 'available'
                        ? 'emerald'
                        : f.status === 'maintenance'
                        ? 'amber'
                        : 'purple'
                    }
                    size="sm"
                    className="capitalize text-[10px]"
                  >
                    {f.status === 'available'
                      ? 'Siap Digunakan'
                      : f.status === 'maintenance'
                      ? 'Maintenance'
                      : 'Sedang Dibooking'}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h2 className="text-base font-bold text-white leading-tight mb-1">
                    {f.name}
                  </h2>
                  <p className="text-[11px] text-slate-300 line-clamp-1">{f.tagline}</p>
                </div>
              </div>

              {/* Rincian Lokasi, Kapasitas, dan Biaya */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{f.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                  <span>Kapasitas {f.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{f.ratePerHour || 'Sesuai Penggunaan'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{f.ratePerDay || 'Kontrak Harian'}</span>
                </div>
              </div>

              {/* Peralatan Mesin Utama */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                  Peralatan / Mesin Terpasang:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {f.equipmentList.slice(0, 4).map((eq, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    >
                      {eq}
                    </span>
                  ))}
                  {f.equipmentList.length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                      +{f.equipmentList.length - 4} lainnya
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
              <Link
                href={`/fasilitas/${f.slug}`}
                target="_blank"
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Lihat Etalase Lab</span>
                <ExternalLink className="h-3 w-3" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(f)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit Fasilitas"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(f)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Hapus Fasilitas"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {facilities.length === 0 && !loading && (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
          <Cpu className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">Fasilitas tidak ditemukan</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Belum ada data fasilitas untuk filter yang dipilih.
          </p>
          <Button variant="outline" size="sm" onClick={openCreateModal} className="text-xs">
            Tambah Fasilitas Baru
          </Button>
        </div>
      )}

      {/* Modal Tambah / Edit Fasilitas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  {editingFacilityId ? 'Edit Data Fasilitas / Lab' : 'Tambah Fasilitas & Mesin Riset Baru'}
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
                {/* Nama Fasilitas */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nama Fasilitas / Laboratorium <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: CNC 5-Axis Precision Machining Center"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kategori Lab / Infrastruktur <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as FacilityCategory })
                    }
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tagline / Deskripsi Satu Kalimat <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sentra manufaktur presisi tinggi dengan toleransi mikron."
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Deskripsi Lengkap */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Deskripsi Lengkap & Peruntukan Riset <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan fasilitas, peruntukan pengujian, kompatibilitas material, dan aturan pemakaian..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Lokasi Gedung */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Lokasi Gedung di STP <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Workshop Manufaktur Lt. 1"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Kapasitas */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Kapasitas Ruang / Tim
                  </label>
                  <input
                    type="text"
                    placeholder="25 Orang / 3 Operator"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Status Kesiapan */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Status Operasional <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="available">Siap Digunakan (Available)</option>
                    <option value="maintenance">Maintenance / Kalibrasi</option>
                    <option value="booked">Sedang Dibooking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tarif Jam */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Estimasi Tarif Sewa / Jam
                  </label>
                  <input
                    type="text"
                    placeholder="Rp 250.000 / jam"
                    value={form.ratePerHour || ''}
                    onChange={(e) => setForm({ ...form, ratePerHour: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Tarif Hari */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Estimasi Tarif Sewa / Hari
                  </label>
                  <input
                    type="text"
                    placeholder="Rp 1.800.000 / hari"
                    value={form.ratePerDay || ''}
                    onChange={(e) => setForm({ ...form, ratePerDay: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Daftar Peralatan */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Daftar Peralatan / Mesin (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="CNC Milling 5-Axis, Mesin Bubut CNC, CMM Mitutoyo"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Spesifikasi Teknis Mesin (Key - Value Dinamis) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 font-semibold">
                    Spesifikasi Teknis Mesin / Lab
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Tambah Baris Spek</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {form.specifications.map((sp, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label Parameter (cth: Kecepatan Spindle)"
                        value={sp.key}
                        onChange={(e) => updateSpecRow(idx, 'key', e.target.value)}
                        className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-white focus:border-cyan-500 focus:outline-none text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Nilai Spek (cth: 24.000 RPM)"
                        value={sp.value}
                        onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                        className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-white focus:border-cyan-500 focus:outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cover URL */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    URL Foto Cover Workshop / Mesin
                  </label>
                  <input
                    type="url"
                    value={form.coverUrl}
                    onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Narahubung */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Narahubung Operator Laboratorium
                  </label>
                  <input
                    type="text"
                    value={form.contactPerson || ''}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
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
                  className="bg-cyan-600 hover:bg-cyan-500 text-white min-w-[120px]"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </span>
                  ) : (
                    <span>{editingFacilityId ? 'Simpan Perubahan' : 'Tambah Fasilitas'}</span>
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
