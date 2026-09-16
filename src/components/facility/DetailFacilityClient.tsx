'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FacilityItem, KatalogItem } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { InquiryFormModal } from '@/components/order/InquiryFormModal'
import {
  ArrowLeft,
  Wrench,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Phone,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react'

interface DetailFacilityClientProps {
  facility: FacilityItem
}

export function DetailFacilityClient({ facility }: DetailFacilityClientProps) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: `${facility.name} - Solo Technopark`,
          text: facility.tagline,
          url: window.location.href,
        }).catch(() => {})
      } else {
        navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    }
  }

  // Bentuk adapter untuk InquiryFormModal
  const facilityAsKatalogItem: KatalogItem = {
    id: facility.id,
    title: facility.name,
    slug: facility.slug,
    tagline: facility.tagline,
    description: facility.description,
    klasterId: 'manufaktur-cnc',
    tenantId: 'solo-technopark',
    tenantName: 'Solo Technopark Facility Center',
    trl: 9,
    coverUrl: facility.coverUrl,
    galleryUrls: facility.galleryUrls || [],
    specifications: facility.specifications,
    targetMarket: ['Industri Manufaktur', 'Lembaga Riset', 'BUMN & Pemerintah'],
    hakiStatus: 'granted',
    status: 'published',
    isFeatured: true,
    viewCount: 0,
    createdAt: facility.createdAt,
    updatedAt: facility.updatedAt,
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/fasilitas"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Etalase Fasilitas</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-sky-600 hover:border-sky-300 shadow-sm transition-all"
        >
          <Share2 className="h-3.5 w-3.5 text-sky-600" />
          <span>{shareSuccess ? 'Link Disalin!' : 'Bagikan Fasilitas'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Kolom Kiri: Cover, Deskripsi, Daftar Peralatan (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Visual Frame */}
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-lg">
            <Image
              src={facility.coverUrl}
              alt={facility.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant="cyan" size="md">
                {facility.categoryLabel}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-white/95 backdrop-blur px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Status: Siap Dioperasikan</span>
              </div>
            </div>
          </div>

          {/* Heading & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600">
              <MapPin className="h-4 w-4" />
              <span>{facility.location}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {facility.name}
            </h1>
            <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
              {facility.tagline}
            </p>
          </div>

          {/* Uraian Fasilitas */}
          <div className="prose max-w-none text-sm text-slate-700 leading-relaxed border-t border-slate-200 pt-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Tentang Fasilitas & Kemampuan Riset</h3>
            <p className="whitespace-pre-line">{facility.description}</p>
          </div>

          {/* Daftar Mesin & Peralatan */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-sky-600" />
              <span>Daftar Mesin & Instrumen Utama</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {facility.equipmentList.map((eq, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spesifikasi Teknis */}
          {facility.specifications && facility.specifications.length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">Spesifikasi & Kapasitas Teknis</h3>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white divide-y divide-slate-100 text-xs shadow-sm">
                {facility.specifications.map((spec, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5">
                    <span className="text-slate-500 font-medium">{spec.key}</span>
                    <strong className="text-slate-900 font-semibold text-right">{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Biaya Sewa, Narahubung, Booking Button (1 Kolom Sticky) */}
        <div className="space-y-6">
          <Card className="p-6 bg-white border-slate-200/90 space-y-5 shadow-lg sticky top-20">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Skema Tarif Penggunaan:</span>
              {facility.ratePerHour && (
                <div className="text-xl font-black text-slate-900">
                  {facility.ratePerHour}
                </div>
              )}
              {facility.ratePerDay && (
                <div className="text-xs text-sky-700 font-semibold mt-0.5">
                  Shift Harian: {facility.ratePerDay}
                </div>
              )}
            </div>

            {/* Kapasitas Operasional */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="text-slate-500 font-medium block">Kapasitas Kerja:</span>
              <strong className="text-slate-800 block text-sm font-bold">{facility.capacity}</strong>
            </div>

            {/* Narahubung */}
            {facility.contactPerson && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-medium block">Kontak Unit Pengelola:</span>
                <span className="text-slate-800 font-semibold block">{facility.contactPerson}</span>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <Button
                variant="primary"
                size="lg"
                className="w-full gap-2 shadow-md hover:shadow-lg transition-all"
                onClick={() => setIsInquiryOpen(true)}
              >
                <Calendar className="h-4 w-4" />
                <span>Ajukan Sewa / Jadwal Lab</span>
              </Button>
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                Permohonan sewa akan diproses langsung oleh Unit Layanan Fasilitas STP dan Anda akan menerima nomor resi pelacakan.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Differentiated Inquiry Modal */}
      <InquiryFormModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        katalogItem={facilityAsKatalogItem}
        initialInterestType="sewa_fasilitas_lab"
      />
    </main>
  )
}
