'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  OrderInquiryItem,
  OrderStatus,
  OrderLogItem,
} from '@/types'
import { getOrdersListAction, updateOrderStatusAction } from '@/actions/order'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  Calendar,
  ChevronRight,
  RefreshCw,
  X,
  Send,
  MessageSquare,
  FileText,
  ExternalLink,
  Download,
} from 'lucide-react'

// Dummy fallback orders jika database masih kosong
const FALLBACK_ORDERS: OrderInquiryItem[] = [
  {
    id: 'ord-dummy-1',
    trackingCode: 'STP-ORD-202609-F89A',
    katalogTitle: 'Baterai Motor Listrik STP-EV (Lithium Ferro Phosphate)',
    tenantName: 'PT. Industri Baterai Nasional STP',
    senderName: 'Bambang Sudibyo, S.T.',
    senderEmail: 'bambang@solotrans.co.id',
    senderPhone: '081223344556',
    organizationName: 'PT. Solo Trans Mandiri',
    organizationType: 'pt',
    interestType: 'kerjasama_riset',
    message: 'Kami ingin menjadwalkan uji coba 5 unit paket baterai untuk armada feeder listrik perkotaan Solo.',
    estimatedBudget: 'Rp 150.000.000',
    status: 'pending',
    priority: 'high',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'ord-dummy-2',
    trackingCode: 'STP-ORD-202609-K92B',
    katalogTitle: 'AI Smart Surveillance & Edge Computing Box',
    tenantName: 'CV. Cipta Solusi Cerdas',
    senderName: 'Rina Wijaya, M.Kom.',
    senderEmail: 'rina@dishub.surakarta.go.id',
    senderPhone: '085611223344',
    organizationName: 'Dinas Perhubungan Kota Surakarta',
    organizationType: 'pemerintah',
    interestType: 'uji_coba_prototipe',
    message: 'Permohonan integrasi sistem edge vision untuk deteksi kemacetan di 3 simpang protokol Surakarta.',
    status: 'contacted',
    priority: 'urgent',
    assignedOperatorName: 'Tim Layanan Bisnis STP',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
]

// Helper membuat tautan WhatsApp dengan template resmi STP
function getWhatsAppLink(order: OrderInquiryItem): string {
  const cleanPhone = (order.senderPhone || '').replace(/\D/g, '')
  const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone
  const text = `Salam hormat Bapak/Ibu ${order.senderName} (${order.organizationName}),

Kami dari Tim Layanan Bisnis & Kemitraan Solo Technopark menindaklanjuti permohonan kerjasama/pemesanan Anda:
• Produk / Fasilitas: *${order.katalogTitle}*
• Nomor Resi: *${order.trackingCode}*

Apakah berkenan jika kami menjadwalkan sesi konsultasi teknis atau kunjungan lab ke Solo Technopark?

Terima kasih.
Tim Layanan Bisnis Solo Technopark`

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`
}

export default function OperatorOrdersPage() {
  const [orders, setOrders] = useState<OrderInquiryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')

  // Selected Order for Action Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderInquiryItem | null>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending')
  const [notes, setNotes] = useState('')
  const [savingAction, setSavingAction] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(false)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await getOrdersListAction(activeTab === 'all' ? undefined : activeTab)
      if (res.success && res.data && res.data.length > 0) {
        setOrders(res.data)
      } else {
        // Jika database belum ada isinya, gunakan data demo
        setOrders(
          activeTab === 'all'
            ? FALLBACK_ORDERS
            : FALLBACK_ORDERS.filter((o) => o.status === activeTab)
        )
      }
    } catch {
      setOrders(FALLBACK_ORDERS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const openActionModal = (order: OrderInquiryItem) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setNotes('')
    setActionSuccess(false)
  }

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    setSavingAction(true)
    try {
      const res = await updateOrderStatusAction(
        selectedOrder.id,
        newStatus,
        notes,
        { id: 'OP-STP-01', name: 'Operator Layanan STP' }
      )

      if (res.success) {
        setActionSuccess(true)
        // Perbarui list lokal
        setOrders((prev) =>
          prev.map((o) =>
            o.id === selectedOrder.id
              ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
              : o
          )
        )
        setTimeout(() => {
          setSelectedOrder(null)
          setActionSuccess(false)
        }, 1500)
      } else {
        alert(res.error || 'Gagal memperbarui status order.')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kendala server.')
    } finally {
      setSavingAction(false)
    }
  }

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('Tidak ada data antrean untuk diekspor.')
      return
    }

    const headers = [
      'No',
      'Nomor Resi',
      'Tanggal Pengajuan',
      'Nama Pemohon',
      'Email',
      'Nomor Telepon',
      'Instansi / Perusahaan',
      'Tipe Organisasi',
      'Kategori Kebutuhan',
      'Produk / Fasilitas Terkait',
      'Estimasi Anggaran',
      'Status Alur',
      'Prioritas',
      'Operator Penanggung Jawab',
      'Catatan / Pesan Kebutuhan',
    ]

    const rows = orders.map((order, index) => {
      const cleanMessage = (order.message || '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/"/g, '""')
        .trim()

      return [
        index + 1,
        `"${order.trackingCode}"`,
        `"${new Date(order.createdAt).toLocaleString('id-ID')}"`,
        `"${(order.senderName || '').replace(/"/g, '""')}"`,
        `"${(order.senderEmail || '').replace(/"/g, '""')}"`,
        `"${(order.senderPhone || '').replace(/"/g, '""')}"`,
        `"${(order.organizationName || '').replace(/"/g, '""')}"`,
        `"${(order.organizationType || '').toUpperCase()}"`,
        `"${(order.interestType || '').replace(/_/g, ' ').toUpperCase()}"`,
        `"${(order.katalogTitle || '').replace(/"/g, '""')}"`,
        `"${order.estimatedBudget || '-'}"`,
        `"${order.status}"`,
        `"${order.priority || 'normal'}"`,
        `"${order.assignedOperatorName || '-'}"`,
        `"${cleanMessage}"`,
      ].join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\r\n')
    // Tambahkan UTF-8 BOM (\uFEFF) agar Microsoft Excel mengenali karakter Indonesia dengan tepat
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    link.href = url
    link.setAttribute('download', `Laporan_Permohonan_Katalog_STP_${dateStr}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="gold" size="sm">Menunggu Verifikasi</Badge>
      case 'reviewed':
        return <Badge variant="cyan" size="sm">Ditinjau</Badge>
      case 'contacted':
        return <Badge variant="sky" size="sm">Telah Dihubungi</Badge>
      case 'survey':
        return <Badge variant="purple" size="sm">Jadwal Survey Lab</Badge>
      case 'deal':
        return <Badge variant="emerald" size="sm">Kesepakatan / Deal</Badge>
      case 'completed':
        return <Badge variant="emerald" size="sm">Selesai</Badge>
      case 'rejected':
        return <Badge variant="rose" size="sm">Ditolak</Badge>
      default:
        return <Badge variant="slate" size="sm">{status}</Badge>
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Solo Technopark Business Desk
            </span>
            <span className="text-slate-300">•</span>
            <Badge variant="cyan" size="sm">Role: Operator</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Manajemen Antrean Kerjasama & Layanan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tindak lanjuti permohonan publik, jadwalkan validasi fasilitas, dan perbarui status SLA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Segarkan Antrean</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="gap-2 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 transition-colors"
            title="Unduh laporan arsip format CSV / Excel kompatibel"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor Laporan (CSV / Excel)</span>
          </Button>
          <Link href="/portal">
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-900">
              Ganti Akun
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-white border-slate-200/90 shadow-sm">
          <span className="text-[11px] text-slate-500 font-semibold block">Total Pesanan</span>
          <span className="text-2xl font-black text-slate-900">{orders.length}</span>
        </Card>
        <Card className="p-4 bg-amber-50/70 border-amber-200/80 shadow-sm">
          <span className="text-[11px] text-amber-700 font-semibold block">Menunggu Verifikasi</span>
          <span className="text-2xl font-black text-amber-900">
            {orders.filter((o) => o.status === 'pending').length}
          </span>
        </Card>
        <Card className="p-4 bg-sky-50/70 border-sky-200/80 shadow-sm">
          <span className="text-[11px] text-sky-700 font-semibold block">Sedang Ditindaklanjuti</span>
          <span className="text-2xl font-black text-sky-900">
            {orders.filter((o) => ['reviewed', 'contacted', 'survey'].includes(o.status)).length}
          </span>
        </Card>
        <Card className="p-4 bg-emerald-50/70 border-emerald-200/80 shadow-sm">
          <span className="text-[11px] text-emerald-700 font-semibold block">Deal / Selesai</span>
          <span className="text-2xl font-black text-emerald-900">
            {orders.filter((o) => ['deal', 'completed'].includes(o.status)).length}
          </span>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-thin text-xs font-semibold">
        {(
          [
            { id: 'all', label: 'Semua Status' },
            { id: 'pending', label: 'Pending' },
            { id: 'reviewed', label: 'Ditinjau' },
            { id: 'contacted', label: 'Dihubungi' },
            { id: 'survey', label: 'Survey' },
            { id: 'deal', label: 'Deal' },
            { id: 'completed', label: 'Selesai' },
            { id: 'rejected', label: 'Ditolak' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="p-12 text-center bg-white border-slate-200 shadow-sm space-y-3">
          <Inbox className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Tidak ada antrean pesanan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ditemukan permohonan kerjasama dengan kriteria status yang dipilih saat ini.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="p-5 bg-white border-slate-200 hover:border-sky-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Info Utama */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                      {order.trackingCode}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-slate-300 text-xs">•</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {order.katalogTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="text-sky-700 font-bold">{order.senderName}</span>
                      <span>({order.organizationName})</span>
                      {order.estimatedBudget && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-emerald-700 font-semibold">{order.estimatedBudget}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 line-clamp-2">
                    {order.message}
                  </p>
                </div>

                {/* Aksi & Kontak Cepat */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* Quick WhatsApp Action */}
                    <a
                      href={getWhatsAppLink(order)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors text-xs inline-flex items-center gap-1 font-semibold"
                      title="Hubungi WhatsApp Pemohon Resmi STP"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {/* Action Button */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => openActionModal(order)}
                      className="gap-1.5 text-xs shadow-sm"
                    >
                      <span>Tindak Lanjuti</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Tindak Lanjut Operator */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden my-auto">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Tindak Lanjuti Permohonan
                  </h3>
                  <span className="text-[11px] font-mono text-sky-600 font-semibold">
                    {selectedOrder.trackingCode}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Modal */}
            <form onSubmit={handleUpdateStatus} className="p-5 space-y-4">
              {actionSuccess && (
                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Status dan catatan tindak lanjut berhasil diperbarui!</span>
                </div>
              )}

              {/* Rangkuman Pemohon */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pemohon:</span>
                  <span className="text-slate-900 font-semibold">{selectedOrder.senderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Instansi:</span>
                  <span className="text-slate-900 font-semibold">{selectedOrder.organizationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inovasi:</span>
                  <span className="text-sky-700 font-semibold">{selectedOrder.katalogTitle}</span>
                </div>
                {selectedOrder.senderPhone && (
                  <div className="pt-2 mt-1 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500">Telepon: {selectedOrder.senderPhone}</span>
                    <a
                      href={getWhatsAppLink(selectedOrder)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 shadow-sm"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Kirim Chat WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Pilihan Status Baru */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Perbarui Tahapan Status Pipeline:
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-sm"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                >
                  <option value="pending">Menunggu Verifikasi (Pending)</option>
                  <option value="reviewed">Ditinjau Tim Teknis (Reviewed)</option>
                  <option value="contacted">Telah Dihubungi via WA/Email (Contacted)</option>
                  <option value="survey">Penjadwalan Survey / Uji Lab (Survey)</option>
                  <option value="deal">Kesepakatan Kerjasama (Deal)</option>
                  <option value="completed">Layanan Selesai & Berhasil (Completed)</option>
                  <option value="rejected">Ditolak / Dibatalkan (Rejected)</option>
                </select>
              </div>

              {/* Catatan / Log Tindak Lanjut */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Catatan Tindak Lanjut & Log Audit (Terbaca di Portal Tracking):
                </label>
                <textarea
                  rows={3}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-sm"
                  placeholder="Contoh: Tim STP telah menghubungi pemohon melalui WhatsApp. Telah disepakati jadwal presentasi teknis pada hari Kamis pukul 10.00 WIB."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => setSelectedOrder(null)}
                  disabled={savingAction}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={savingAction}
                  className="gap-2 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  <span>{savingAction ? 'Menyimpan...' : 'Simpan Pembaruan'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
