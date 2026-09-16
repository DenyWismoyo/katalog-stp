'use client'

import { useState } from 'react'
import Link from 'next/link'
import { KatalogItem, OrderInquiryItem } from '@/types'
import { submitOrderAction } from '@/actions/order'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  X,
  Handshake,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Building2,
  Send,
  Loader2,
} from 'lucide-react'

interface InquiryModalProps {
  isOpen: boolean
  onClose: () => void
  katalogItem?: KatalogItem
  initialInterestType?: OrderInquiryItem['interestType']
}

export function InquiryModal({
  isOpen,
  onClose,
  katalogItem,
  initialInterestType = 'kerjasama_riset',
}: InquiryModalProps) {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    organizationName: '',
    organizationType: 'pt' as OrderInquiryItem['organizationType'],
    interestType: initialInterestType,
    estimatedBudget: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ orderId: string; trackingCode: string } | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopy = () => {
    if (result?.trackingCode) {
      navigator.clipboard.writeText(result.trackingCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await submitOrderAction({
        katalogId: katalogItem?.id,
        katalogTitle: katalogItem?.title,
        tenantId: katalogItem?.tenantId,
        tenantName: katalogItem?.tenantName,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        organizationName: formData.organizationName,
        organizationType: formData.organizationType,
        interestType: formData.interestType,
        estimatedBudget: formData.estimatedBudget,
        message: formData.message,
      })

      if (res.success && res.data) {
        setResult(res.data)
      } else {
        setError(res.error || 'Gagal mengirim formulir permohonan.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-auto">
        {/* Header Dialog */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Handshake className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Ajukan Kerjasama / Layanan
              </h3>
              <p className="text-xs text-slate-400">Solo Technopark Business Inquiries</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {result ? (
            /* Sukses State: Tampilkan Tracking Code */
            <div className="text-center py-4 space-y-5">
              <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xl font-black text-white">Permohonan Berhasil Dikirim!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Permohonan kerjasama Anda telah masuk ke sistem antrean operator Solo Technopark.
                  Simpan nomor resi di bawah ini untuk memantau status secara berkala.
                </p>
              </div>

              {/* Box Nomor Resi */}
              <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-md mx-auto">
                <div className="text-left">
                  <span className="text-[10px] text-sky-300 uppercase tracking-wider font-bold">
                    Nomor Resi Pelacakan
                  </span>
                  <div className="text-lg font-mono font-black text-sky-400">
                    {result.trackingCode}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 text-xs text-sky-300 border-sky-500/40 hover:bg-sky-500/10"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto">
                <Link
                  href={`/tracking?code=${result.trackingCode}`}
                  className="w-full sm:w-auto flex-1"
                >
                  <Button variant="primary" size="md" className="w-full gap-2">
                    <span>Pantau Status di Portal Tracking</span>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleReset}
                  className="text-slate-400 hover:text-white"
                >
                  Tutup
                </Button>
              </div>
            </div>
          ) : (
            /* Form Input State */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Katalog Context */}
              {katalogItem && (
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 font-bold text-xs">
                    TRL {katalogItem.trl}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] text-sky-400 block font-semibold truncate">
                      {katalogItem.tenantName}
                    </span>
                    <h5 className="text-xs font-bold text-white truncate">{katalogItem.title}</h5>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/30 flex items-start gap-2.5 text-rose-300 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form Baris 1: Nama & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Nama Lengkap Pemohon *"
                  placeholder="Contoh: Ir. Budi Santoso"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  label="Email Resmi *"
                  placeholder="nama@instansi.id"
                  value={formData.senderEmail}
                  onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                  required
                />
              </div>

              {/* Form Baris 2: No WhatsApp & Instansi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Nomor WhatsApp / Telp *"
                  placeholder="081234567890"
                  value={formData.senderPhone}
                  onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                  required
                />
                <Input
                  label="Nama Perusahaan / Instansi *"
                  placeholder="PT. Inovasi Bangsa"
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  required
                />
              </div>

              {/* Form Baris 3: Jenis Organisasi & Kategori Kebutuhan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Tipe Organisasi *</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    value={formData.organizationType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationType: e.target.value as OrderInquiryItem['organizationType'],
                      })
                    }
                  >
                    <option value="pt">Perseroan Terbatas (PT)</option>
                    <option value="cv">CV / Firma</option>
                    <option value="bumn">BUMN / BUMD</option>
                    <option value="pemerintah">Instansi Pemerintah / Kementerian</option>
                    <option value="akademisi">Perguruan Tinggi / Riset</option>
                    <option value="perorangan">Perorangan / Startup Mandiri</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Kategori Kebutuhan *</label>
                  <select
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                    value={formData.interestType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        interestType: e.target.value as OrderInquiryItem['interestType'],
                      })
                    }
                  >
                    <option value="kerjasama_riset">Kerjasama Riset & Lisensi</option>
                    <option value="pembelian_produk">Pembelian / Pengadaan Produk</option>
                    <option value="uji_coba_prototipe">Uji Coba Prototipe / Validasi</option>
                    <option value="sewa_fasilitas_lab">Sewa Fasilitas Lab / Co-Working</option>
                    <option value="konsultasi_inkubasi">Konsultasi Inkubasi Tenant</option>
                  </select>
                </div>
              </div>

              {/* Form Baris 4: Estimasi Budget (Opsional) */}
              <Input
                label="Estimasi Anggaran / Alokasi Dana (Opsional)"
                placeholder="Contoh: Rp 50.000.000 - Rp 100.000.000"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
              />

              {/* Form Baris 5: Uraian Kebutuhan */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Uraian Kebutuhan & Spesifikasi Kerjasama *
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none transition-colors"
                  placeholder="Jelaskan kebutuhan spesifik, jadwal rencana survey, atau ruang lingkup kerjasama yang diinginkan..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={onClose}
                  disabled={loading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Mengirim Permohonan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Kirim Permohonan</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
