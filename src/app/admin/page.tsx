'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Layers,
  Building2,
  Cpu,
  ClipboardList,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ShieldCheck,
  TrendingUp,
  Database,
  Loader2,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AdminNav } from '@/components/admin/AdminNav'
import { getDashboardMetricsAction, DashboardMetrics } from '@/actions/analytics'
import { syncInitialDataAction } from '@/actions/seed'
import { ORDER_STATUS_LABELS } from '@/types'

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  const fetchMetrics = async () => {
    setLoading(true)
    try {
      const res = await getDashboardMetricsAction()
      if (res.success && res.data) {
        setMetrics(res.data)
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncData = async () => {
    setSyncing(true)
    setSyncMsg(null)
    try {
      const res = await syncInitialDataAction()
      if (res.success && res.data) {
        setSyncMsg(
          `Sukses menyinkronkan ${res.data.katalogCount} inovasi, ${res.data.tenantCount} tenant, dan ${res.data.facilityCount} fasilitas ke database Firestore.`
        )
        await fetchMetrics()
      } else {
        setSyncMsg(res.error || 'Gagal menyinkronkan data.')
      }
    } catch {
      setSyncMsg('Terjadi kendala saat menyinkronkan data.')
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Solo Technopark Command Center
            </span>
            <span className="text-slate-500">•</span>
            <Badge variant="purple" size="sm">Role: Administrator</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ringkasan Eksekutif e-Katalog STP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitoring performa ekosistem inovasi, hilirisasi riset, utilitas laboratorium, dan kemitraan industri.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Muat Ulang Metrik</span>
          </Button>
          <Link href="/admin/katalog">
            <Button variant="primary" size="sm" className="gap-2 text-xs">
              <Plus className="h-4 w-4" />
              <span>Studio Inovasi</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Bar Navigasi Admin Bersama */}
      <AdminNav />

      {/* Banner Kontrol Sinkronisasi Database Firestore */}
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Database Cloud Firestore (katalog-stp)</span>
              <Badge variant="cyan" size="sm">Live Connected</Badge>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inisialisasi atau sinkronkan data master awal (Katalog, Tenant, Fasilitas, Permohonan Demo) ke Firestore.
            </p>
            {syncMsg && (
              <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{syncMsg}</span>
              </p>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSyncData}
          disabled={syncing}
          className="shrink-0 gap-2 text-xs border-sky-500/30 hover:bg-sky-500/10 text-sky-300"
        >
          {syncing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Menyinkronkan...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Sinkronkan Data Awal ke Firestore</span>
            </>
          )}
        </Button>
      </div>

      {/* 4 Kartu KPI Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* KPI 1: Inovasi Terdaftar */}
        <Card className="p-5 border-slate-800/80 bg-slate-900/60 relative overflow-hidden group hover:border-sky-500/40 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-medium text-slate-400">Total Inovasi</span>
              <h2 className="text-3xl font-black text-white mt-1">
                {metrics?.katalog.total ?? 0}
              </h2>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 group-hover:scale-105 transition-transform">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="text-emerald-400 font-semibold">{metrics?.katalog.published ?? 0}</span> Terbit
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-semibold">{metrics?.katalog.draft ?? 0}</span> Draft
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold">{metrics?.katalog.featured ?? 0}</span> Unggulan
          </div>
        </Card>

        {/* KPI 2: Tenant & Lab Mitra */}
        <Card className="p-5 border-slate-800/80 bg-slate-900/60 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-medium text-slate-400">Tenant & Lab Mitra</span>
              <h2 className="text-3xl font-black text-white mt-1">
                {metrics?.tenant.total ?? 0}
              </h2>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="text-sky-400 font-semibold">{metrics?.tenant.inkubasi ?? 0}</span> Inkubasi
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">{metrics?.tenant.alumni ?? 0}</span> Alumni
            <span className="text-slate-600">•</span>
            <span className="text-purple-400 font-semibold">{metrics?.tenant.mitraIndustri ?? 0}</span> Mitra
          </div>
        </Card>

        {/* KPI 3: Fasilitas & Lab STP */}
        <Card className="p-5 border-slate-800/80 bg-slate-900/60 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-medium text-slate-400">Fasilitas & Mesin Riset</span>
              <h2 className="text-3xl font-black text-white mt-1">
                {metrics?.facility.total ?? 0}
              </h2>
            </div>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="text-emerald-400 font-semibold">{metrics?.facility.available ?? 0}</span> Siap Pakai
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-semibold">{metrics?.facility.maintenance ?? 0}</span> Maintenance
          </div>
        </Card>

        {/* KPI 4: Antrean Permohonan Masuk */}
        <Card className="p-5 border-slate-800/80 bg-slate-900/60 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-xs font-medium text-slate-400">Permohonan Kemitraan</span>
              <h2 className="text-3xl font-black text-white mt-1">
                {metrics?.orders.total ?? 0}
              </h2>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <span className="text-amber-400 font-semibold">{metrics?.orders.pending ?? 0}</span> Pending
            <span className="text-slate-600">•</span>
            <span className="text-sky-400 font-semibold">{metrics?.orders.activeFollowUp ?? 0}</span> Ditindaklanjuti
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400 font-semibold">{metrics?.orders.deal ?? 0}</span> Deal
          </div>
        </Card>
      </div>

      {/* Grid: Distribusi TRL Katsinov & Aksi Cepat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Distribusi TRL Katsinov 1-9 */}
        <Card className="p-6 lg:col-span-2 border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-sky-400" />
                <span>Tingkat Kesiapterapan Teknologi (TRL Katsinov)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kematangan produk tenant Solo Technopark menuju pasar B2G & B2B komersial
              </p>
            </div>
            <Badge variant="cyan" size="sm">Standar BRIN / Kemenperin</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* TRL 1-3 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-sky-400">TRL 1 – 3</span>
                <span className="text-lg font-black text-white">
                  {metrics?.katalog.trlDistribution.research ?? 0}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-300">Riset & Konseptual</div>
              <p className="text-[10px] text-slate-400 mt-1">
                Prinsip dasar teknologi telah terformulasi dan diuji secara teoritis di laboratorium.
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full"
                  style={{
                    width: `${
                      metrics?.katalog.total
                        ? ((metrics.katalog.trlDistribution.research / metrics.katalog.total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* TRL 4-6 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-400">TRL 4 – 6</span>
                <span className="text-lg font-black text-white">
                  {metrics?.katalog.trlDistribution.prototype ?? 0}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-300">Validasi Prototipe</div>
              <p className="text-[10px] text-slate-400 mt-1">
                Komponen teruji di lab dan prototipe telah diuji pada lingkungan operasional relevan.
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${
                      metrics?.katalog.total
                        ? ((metrics.katalog.trlDistribution.prototype / metrics.katalog.total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* TRL 7-9 */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-400">TRL 7 – 9</span>
                <span className="text-lg font-black text-white">
                  {metrics?.katalog.trlDistribution.marketReady ?? 0}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-300">Siap Komersialisasi</div>
              <p className="text-[10px] text-slate-400 mt-1">
                Sistem terbukti di kondisi nyata, siap pengadaan B2G (e-Katalog LKPP) & pasar luas.
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{
                    width: `${
                      metrics?.katalog.total
                        ? ((metrics.katalog.trlDistribution.marketReady / metrics.katalog.total) * 100)
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Akses Pintas Studio Admin */}
        <Card className="p-6 border-slate-800 bg-slate-900/80 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Aksi Cepat Studio</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Pintasan manajemen data dan kelola ekosistem Solo Technopark.
            </p>

            <div className="space-y-2">
              <Link
                href="/admin/katalog"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                    <Layers className="h-4 w-4" />
                  </div>
                  <span>Kurasi Inovasi Baru</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
              </Link>

              <Link
                href="/admin/tenant"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span>Kelola Tenant & Lab Mitra</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </Link>

              <Link
                href="/admin/fasilitas"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 text-xs font-medium text-slate-200 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <span>Kelola Fasilitas & Mesin</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Perlu tindak lanjut order?</span>
            <Link
              href="/operator/orders"
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Buka Antrean</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* Tabel 5 Permohonan Kemitraan Terbaru */}
      <Card className="p-6 border-slate-800 bg-slate-900/80">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-400" />
              <span>Permohonan Kerja Sama B2G / Industri Terbaru</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              5 permohonan kerjasama atau pemesanan inovasi terakhir yang masuk ke sistem
            </p>
          </div>
          <Link href="/operator/orders">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <span>Lihat Seluruh Antrean</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {metrics?.recentInquiries && metrics.recentInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Nomor Resi</th>
                  <th className="py-3 px-3">Instansi / Pemohon</th>
                  <th className="py-3 px-3">Produk / Layanan</th>
                  <th className="py-3 px-3">Estimasi Anggaran</th>
                  <th className="py-3 px-3">Status Alur</th>
                  <th className="py-3 px-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {metrics.recentInquiries.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-sky-400">
                      {order.trackingCode}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">{order.organizationName}</div>
                      <div className="text-[11px] text-slate-400">{order.senderName}</div>
                    </td>
                    <td className="py-3 px-3 max-w-[200px] truncate text-slate-200">
                      {order.katalogTitle}
                    </td>
                    <td className="py-3 px-3 font-medium text-emerald-400">
                      {order.estimatedBudget || 'Menyesuaikan'}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          order.status === 'pending'
                            ? 'amber'
                            : order.status === 'deal' || order.status === 'completed'
                            ? 'emerald'
                            : 'sky'
                        }
                        size="sm"
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Link
                        href={`/operator/orders`}
                        className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
                      >
                        Tindak Lanjut →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            Belum ada permohonan kerjasama yang masuk. Data akan muncul otomatis saat calon mitra mengisi formulir inquiry.
          </div>
        )}
      </Card>
    </main>
  )
}
