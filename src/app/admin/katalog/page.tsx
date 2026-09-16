'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  KatalogItem,
  KlasterId,
  HakiStatus,
  TRLLevel,
  KlasterItem,
  SpecificationItem,
} from '@/types'
import { SEED_KLASTER, SEED_KATALOG } from '@/data/seedData'
import {
  getKatalogItemsAction,
  createKatalogItemAction,
  updateKatalogItemAction,
  deleteKatalogItemAction,
  CreateKatalogPayload,
} from '@/actions/katalog'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AdminNav } from '@/components/admin/AdminNav'
import {
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  Layers,
  X,
  Send,
  Loader2,
  RefreshCw,
  Search,
  Video,
  FileText,
  Tag,
} from 'lucide-react'

export default function AdminKatalogStudioPage() {
  const [items, setItems] = useState<KatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Form State
  const defaultForm: CreateKatalogPayload = {
    title: '',
    tagline: '',
    description: '',
    klasterId: 'manufaktur-cnc',
    trl: 7,
    tenantId: 'solo-ai-labs',
    tenantName: '',
    hakiStatus: 'granted',
    coverUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop',
    galleryUrls: [],
    videoUrl: '',
    brochurePdfUrl: '',
    targetMarket: ['Industri Otomotif', 'Pabrik Elektronika'],
    specifications: [
      { key: 'Kapasitas / Kecepatan', value: '120 item/menit' },
      { key: 'Standar Mutu', value: 'SNI / ISO 9001' },
    ],
    status: 'published',
    isFeatured: false,
    viewCount: 0,
  }

  const [form, setForm] = useState<CreateKatalogPayload>(defaultForm)
  const [galleryText, setGalleryText] = useState('')
  const [targetMarketText, setTargetMarketText] = useState('')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await getKatalogItemsAction({ search })
      if (res.success && res.data) {
        setItems(res.data)
      } else {
        setItems(SEED_KATALOG)
      }
    } catch {
      setItems(SEED_KATALOG)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const openCreateModal = () => {
    setEditingItemId(null)
    setForm(defaultForm)
    setGalleryText('')
    setTargetMarketText('Industri Otomotif, Pabrik Elektronika')
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: KatalogItem) => {
    setEditingItemId(item.id)
    setForm({
      title: item.title,
      tagline: item.tagline,
      description: item.description,
      klasterId: item.klasterId,
      trl: item.trl,
      tenantId: item.tenantId,
      tenantName: item.tenantName,
      hakiStatus: item.hakiStatus,
      coverUrl: item.coverUrl,
      galleryUrls: item.galleryUrls || [],
      videoUrl: item.videoUrl || '',
      brochurePdfUrl: item.brochurePdfUrl || '',
      targetMarket: item.targetMarket || [],
      specifications: item.specifications || [],
      status: item.status,
      isFeatured: item.isFeatured,
      viewCount: item.viewCount || 0,
    })
    setGalleryText((item.galleryUrls || []).join('\n'))
    setTargetMarketText((item.targetMarket || []).join(', '))
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  // Helper Spesifikasi Dinamis
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage(null)

    // Parse gallery URLs and target market
    const parsedGallery = galleryText
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    const parsedTargetMarket = targetMarketText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const payload: CreateKatalogPayload = {
      ...form,
      galleryUrls: parsedGallery,
      targetMarket: parsedTargetMarket,
      specifications: form.specifications.filter((s) => s.key.trim() && s.value.trim()),
    }

    try {
      if (editingItemId) {
        // Mode Update
        const res = await updateKatalogItemAction(editingItemId, payload)
        if (res.success) {
          setIsModalOpen(false)
          fetchItems()
        } else {
          setErrorMessage(res.error || 'Gagal memperbarui inovasi.')
        }
      } else {
        // Mode Create
        const res = await createKatalogItemAction(payload)
        if (res.success && res.data) {
          setIsModalOpen(false)
          fetchItems()
        } else {
          setErrorMessage(res.error || 'Gagal menyimpan inovasi baru.')
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Terjadi kendala server.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus katalog "${title}"?`)) return
    try {
      const res = await deleteKatalogItemAction(id)
      if (res.success) {
        setItems((prev) => prev.filter((it) => it.id !== id))
      } else {
        alert(res.error || 'Gagal menghapus.')
      }
    } catch {
      alert('Gagal menghapus produk.')
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Header Studio */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Solo Technopark Content Studio
            </span>
            <span className="text-slate-500">•</span>
            <Badge variant="purple" size="sm">Role: Administrator</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Kurasi & Manajemen Katalog Inovasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publikasikan inovasi riset katsinov, paten HAKI, dan spesifikasi produk tenant binaan Solo Technopark.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchItems}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Ulang</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={openCreateModal}
            className="gap-2 text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Inovasi Baru</span>
          </Button>
        </div>
      </div>

      {/* Baris Navigasi Admin Bersama */}
      <AdminNav />

      {/* Baris Pencarian & Total */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari inovasi atau tenant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchItems()}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-400">
          Total: <strong className="text-white font-semibold">{items.length}</strong> Inovasi Terdaftar
        </span>
      </div>

      {/* Grid Katalog Studio */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <Card
            key={item.id}
            className="p-4 bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between overflow-hidden group shadow-lg"
          >
            <div>
              {/* Cover Preview */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-3">
                <Image
                  src={item.coverUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop'}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                  <Badge variant="cyan" size="sm">TRL {item.trl}</Badge>
                  {item.isFeatured && <Badge variant="gold" size="sm">★ Unggulan</Badge>}
                </div>
              </div>

              {/* Detail Info */}
              <span className="text-[11px] font-bold text-sky-400 block truncate">
                {item.tenantName}
              </span>
              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 mt-0.5">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {item.tagline}
              </p>

              {/* Media Tags */}
              <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-500">
                {item.galleryUrls && item.galleryUrls.length > 0 && (
                  <span>{item.galleryUrls.length} Foto Galeri</span>
                )}
                {item.videoUrl && <span>• Ada Video Demo</span>}
                {item.brochurePdfUrl && <span>• Ada Brosur PDF</span>}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">
                HAKI: {item.hakiStatus}
              </span>

              <div className="flex items-center gap-1">
                <Link href={`/katalog/${item.slug}`} target="_blank">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-sky-400" title="Lihat Halaman Publik">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(item)}
                  className="h-8 px-2 text-slate-400 hover:text-amber-400"
                  title="Edit Data Produk"
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item.id, item.title)}
                  className="h-8 px-2 text-slate-400 hover:text-rose-400"
                  title="Hapus Katalog"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah / Edit Inovasi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-y-auto my-auto p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {editingItemId ? 'Edit Produk Inovasi STP' : 'Tambah Produk Inovasi Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl border border-rose-500/30 bg-rose-950/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Judul Produk / Inovasi *"
                placeholder="Contoh: Baterai Motor Listrik STP-EV"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <Input
                label="Tagline / Ringkasan 1 Kalimat *"
                placeholder="Paket daya lithium hemat energi untuk mobilitas ramah lingkungan perkotaan"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Klaster Teknologi STP *</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    value={form.klasterId}
                    onChange={(e) => setForm({ ...form, klasterId: e.target.value as KlasterId })}
                  >
                    {SEED_KLASTER.map((k: KlasterItem) => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Level Katsinov / TRL (1 - 9) *</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    value={form.trl}
                    onChange={(e) => setForm({ ...form, trl: Number(e.target.value) as TRLLevel })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                      <option key={lvl} value={lvl}>TRL {lvl} - {lvl >= 7 ? 'Siap Komersialisasi' : lvl >= 4 ? 'Validasi Lab / Prototipe' : 'Riset Dasar'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Nama Tenant / Penemu / Lab *"
                  placeholder="Solo AI Labs"
                  value={form.tenantName}
                  onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Status Legalitas HAKI *</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    value={form.hakiStatus}
                    onChange={(e) => setForm({ ...form, hakiStatus: e.target.value as HakiStatus })}
                  >
                    <option value="granted">Granted (Paten Terdaftar Resmi)</option>
                    <option value="terdaftar">Terdaftar (Dalam Proses DJKI)</option>
                    <option value="belum">Belum (Rahasia Dagang / Dalam Riset)</option>
                  </select>
                </div>
              </div>

              {/* Media URLs */}
              <div className="space-y-3.5 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Media & Dokumentasi Produk
                </h4>

                <Input
                  label="URL Foto Sampul Utama (Cover Image) *"
                  placeholder="https://images.unsplash.com/..."
                  value={form.coverUrl}
                  onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    URL Galeri Foto Tambahan (Pisahkan dengan baris baru atau koma)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                    placeholder="https://image-1.jpg&#10;https://image-2.jpg"
                    value={galleryText}
                    onChange={(e) => setGalleryText(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="URL Video Demo (YouTube / MP4)"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.videoUrl || ''}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  />
                  <Input
                    label="URL Brosur Teknis PDF"
                    placeholder="https://solotechpark.id/brochures/spec.pdf"
                    value={form.brochurePdfUrl || ''}
                    onChange={(e) => setForm({ ...form, brochurePdfUrl: e.target.value })}
                  />
                </div>
              </div>

              {/* Target Pasar & Deskripsi */}
              <div className="space-y-3.5 pt-2 border-t border-slate-800">
                <Input
                  label="Target Pasar / Sektor Pengguna (Pisahkan dengan koma)"
                  placeholder="Industri Otomotif, RS Bedah, Dinas Perhubungan"
                  value={targetMarketText}
                  onChange={(e) => setTargetMarketText(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Deskripsi Lengkap Produk & Manfaat *</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                    placeholder="Uraikan keunggulan komparatif, materi bahan, hasil uji performa, dan potensi kemitraan..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Spesifikasi Teknis Dinamis */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                    Spesifikasi Teknis Terstruktur
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Baris Spek</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {form.specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Parameter (misal: Akurasi)"
                        value={spec.key}
                        onChange={(e) => updateSpecRow(idx, 'key', e.target.value)}
                        className="w-1/2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Nilai (misal: 99.8%)"
                        value={spec.value}
                        onChange={(e) => updateSpecRow(idx, 'value', e.target.value)}
                        className="w-1/2 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unggulan Checkbox */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500"
                />
                <label htmlFor="featured-check" className="text-xs text-slate-300 font-medium cursor-pointer">
                  Tandai sebagai Produk Unggulan STP (Tampil di Beranda)
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate-800">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{editingItemId ? 'Simpan Perubahan' : 'Publikasikan Inovasi'}</span>
                    </>
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
