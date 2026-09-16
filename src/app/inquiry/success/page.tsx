'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import {
  CheckCircle2,
  Copy,
  Check,
  PackageSearch,
  Compass,
  Clock,
  MessageSquare,
  FileCheck,
  Handshake,
  ArrowRight,
  Share2,
} from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const trackingCode = searchParams.get('code') || 'STP-ORD-202609-DEMO'

  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#0066cc', '#10b981', '#38bdf8'],
      })
    } catch {
      // safe fallback
    }
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/tracking?code=${trackingCode}`
      if (navigator.share) {
        navigator
          .share({
            title: `Resi Permohonan Solo Technopark: ${trackingCode}`,
            text: `Lacak permohonan kerjasama inovasi di Solo Technopark dengan kode resi: ${trackingCode}`,
            url: shareUrl,
          })
          .catch(() => {})
      } else {
        navigator.clipboard.writeText(shareUrl)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      }
    }
  }

  const nextSteps = [
    {
      step: '1',
      title: 'Verifikasi Administratif & Antrean',
      desc: 'Operator layanan bisnis Solo Technopark akan memverifikasi kelengkapan dokumen dan kesiapan tim terkait (SLA 1x24 jam kerja).',
      icon: Clock,
    },
    {
      step: '2',
      title: 'Kajian Teknis & Ketersediaan Fasilitas',
      desc: 'PIC teknis klaster terkait atau pengelola lab akan meninjau spesifikasi produk atau ketersediaan mesin.',
      icon: FileCheck,
    },
    {
      step: '3',
      title: 'Kontak Dua Arah & Temu Teknis',
      desc: 'Tim STP akan menghubungi nomor WhatsApp/email Anda untuk menjadwalkan survey lokasi, demonstrasi, atau rapat daring.',
      icon: MessageSquare,
    },
    {
      step: '4',
      title: 'Kesepakatan & Tindak Lanjut Resmi',
      desc: 'Penandatanganan nota kesepahaman (MoU), penerbitan Surat Pesanan (PO), atau penjadwalan pemakaian lab.',
      icon: Handshake,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <Card className="p-6 sm:p-10 bg-white border-slate-200/90 text-center space-y-6 shadow-md">
        <div className="mx-auto h-20 w-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 animate-in zoom-in-50 duration-300">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Permohonan Berhasil Diajukan!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Terima kasih telah mengajukan permohonan kerjasama inovasi di Solo Technopark. Permohonan Anda telah resmi tercatat di sistem antrean operator kami.
          </p>
        </div>

        {/* Highlighted Tracking Code Box */}
        <div className="max-w-md mx-auto p-5 rounded-2xl border border-sky-200 bg-sky-50/70 space-y-3">
          <span className="text-[11px] uppercase font-bold text-sky-700 tracking-wider block">
            Nomor Resi Pelacakan Resmi
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-black text-sky-700 tracking-widest selection:bg-sky-100">
            {trackingCode}
          </div>
          <p className="text-[11px] text-slate-600">
            Simpan nomor resi ini. Anda dapat menggunakannya kapan saja untuk memantau status secara langsung.
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 text-xs text-sky-700 border-sky-300 hover:bg-sky-50"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Nomor Resi'}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              <Share2 className="h-4 w-4 text-sky-600" />
              <span>{shared ? 'Tautan Disalin' : 'Bagikan'}</span>
            </Button>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
          <Link href={`/tracking?code=${trackingCode}`} className="flex-1">
            <Button variant="primary" size="md" className="w-full gap-2">
              <PackageSearch className="h-4 w-4" />
              <span>Pantau Status di Tracking</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/katalog" className="flex-1">
            <Button variant="outline" size="md" className="w-full gap-2 text-slate-700 border-slate-300 hover:bg-slate-50">
              <Compass className="h-4 w-4 text-sky-600" />
              <span>Jelajah Produk Lain</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Next Steps Card */}
      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 space-y-6 shadow-sm">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
            Apa yang Terjadi Selanjutnya?
          </h3>
          <p className="text-xs text-slate-600">
            Standar Operasional Prosedur (SOP) tindak lanjut permohonan mitra di Solo Technopark
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextSteps.map((item) => {
            return (
              <div
                key={item.step}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 flex items-start gap-3.5"
              >
                <div className="h-9 w-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0 font-bold text-xs">
                  {item.step}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

export default function InquirySuccessPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl pb-24">
      <Suspense
        fallback={
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-sm">
            Memuat konfirmasi permohonan...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  )
}
