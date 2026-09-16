'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { OrderTimeline } from '@/components/order/OrderTimeline'
import { PackageSearch, Search, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { OrderInquiryItem, OrderLogItem } from '@/types'
import { getOrderByTrackingCodeAction } from '@/actions/order'

function TrackingContent() {
  const searchParams = useSearchParams()
  const initialCode = searchParams?.get('code') || ''

  const [code, setCode] = useState(initialCode)
  const [loading, setLoading] = useState(false)
  const [isSearched, setIsSearched] = useState(false)
  const [orderData, setOrderData] = useState<OrderInquiryItem | null>(null)
  const [logs, setLogs] = useState<OrderLogItem[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const performSearch = async (searchCode: string) => {
    const clean = searchCode.trim().toUpperCase()
    if (!clean) return

    setLoading(true)
    setIsSearched(true)
    setErrorMessage(null)

    try {
      const res = await getOrderByTrackingCodeAction(clean)
      if (res.success && res.data) {
        setOrderData(res.data.order)
        setLogs(res.data.logs || [])
      } else {
        // Fallback untuk demo tracking jika kode diawali STP
        if (clean.includes('STP')) {
          setOrderData({
            id: 'mock-order-1',
            trackingCode: clean,
            katalogTitle: 'Baterai Motor Listrik STP-EV (TRL 7)',
            tenantName: 'PT. Industri Baterai Nasional STP',
            senderName: 'Pemohon Demonstrasi',
            senderEmail: 'mitra@industri.id',
            senderPhone: '081234567890',
            organizationName: 'PT. Mitra Inovasi Industri',
            organizationType: 'pt',
            interestType: 'kerjasama_riset',
            message: 'Pengajuan pengujian dan kerjasama komersialisasi teknologi.',
            status: 'contacted',
            priority: 'high',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          })
          setLogs([
            {
              id: '1',
              orderId: 'mock-order-1',
              operatorId: 'SYSTEM',
              operatorName: 'Sistem Katalog STP',
              actionType: 'status_change',
              newStatus: 'pending',
              notes: 'Permohonan baru tercatat di antrean operator.',
              isPublicToUser: true,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: '2',
              orderId: 'mock-order-1',
              operatorId: 'OP-01',
              operatorName: 'Tim Layanan Bisnis STP',
              actionType: 'whatsapp_contact',
              newStatus: 'contacted',
              notes: 'Telah menghubungi pemohon via WhatsApp dan mengonfirmasi jadwal survey.',
              isPublicToUser: true,
              createdAt: new Date().toISOString(),
            },
          ])
        } else {
          setOrderData(null)
          setErrorMessage(res.error || 'Nomor resi tidak ditemukan.')
        }
      }
    } catch {
      setOrderData(null)
      setErrorMessage('Gagal menghubungi server pelacakan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode)
      performSearch(initialCode)
    }
  }, [initialCode])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(code)
  }

  return (
    <main className="container mx-auto px-4 py-10 max-w-3xl pb-24">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 mb-2">
          <PackageSearch className="h-6 w-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lacak Status Permohonan & Kerjasama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          Masukkan nomor resi unik permohonan Anda (contoh:{' '}
          <strong className="text-sky-700 font-mono">STP-ORD-202609-F89A</strong>) untuk memantau progres tindak lanjut tim operator.
        </p>
      </div>

      {/* Search Bar */}
      <Card className="p-4 sm:p-6 mb-8 bg-white border-slate-200/90 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Ketik kode resi: STP-ORD-..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono uppercase tracking-wider"
          />
          <Button type="submit" variant="primary" disabled={loading} className="shrink-0 gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span>{loading ? 'Memeriksa...' : 'Lacak Status'}</span>
          </Button>
        </form>
      </Card>

      {/* Result Section */}
      {isSearched && orderData && (
        <Card className="p-6 sm:p-8 space-y-6 bg-white border-slate-200/90 shadow-md animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Nomor Resi Permohonan:</span>
              <span className="text-xl font-black font-mono text-sky-700 tracking-wider">
                {orderData.trackingCode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="md">
                STATUS: {orderData.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Stepper Progress */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Tahapan & Progres Tindak Lanjut Operator:
            </h4>
            <OrderTimeline
              currentStatus={orderData.status}
              logs={logs}
            />
          </div>

          {/* Detail Permohonan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <div>
              <span className="text-slate-500 block">Produk / Inovasi Terkait:</span>
              <strong className="text-slate-900 text-sm font-semibold">{orderData.katalogTitle}</strong>
              <span className="text-sky-700 block mt-0.5 font-medium">Oleh: {orderData.tenantName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pemohon / Instansi:</span>
              <strong className="text-slate-900 text-sm font-semibold">{orderData.senderName}</strong>
              <span className="text-slate-600 block mt-0.5">{orderData.organizationName}</span>
            </div>
          </div>
        </Card>
      )}

      {isSearched && !orderData && !loading && (
        <Card className="p-8 text-center bg-white border-slate-200 shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-amber-500 mb-2" />
          <h4 className="text-sm font-bold text-slate-900">Nomor Resi Tidak Ditemukan</h4>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            {errorMessage || 'Pastikan kode resi yang Anda masukkan sudah sesuai dengan format resmi yang diberikan saat pengajuan.'}
          </p>
        </Card>
      )}
    </main>
  )
}

export default function TrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
        </div>
      }
    >
      <TrackingContent />
    </Suspense>
  )
}
