'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { KatalogItem, TenantItem, InterestType } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { InquiryFormModal } from '@/components/order/InquiryFormModal'
import { GalleryViewer } from '@/components/katalog/GalleryViewer'
import { VideoEmbed } from '@/components/katalog/VideoEmbed'
import { TrlIndicator } from '@/components/katalog/TrlIndicator'
import { KatalogCard } from '@/components/katalog/KatalogCard'
import { QrCodeModal } from '@/components/katalog/QrCodeModal'
import { PageTransition } from '@/components/shared/PageTransition'
import { ScrollReveal, ScrollRevealGroup } from '@/components/shared/ScrollReveal'
import {
  fadeInUp,
  staggerContainer,
  buttonVariants,
  springSnappy,
  springGentle,
} from '@/lib/utils/motionVariants'
import {
  ArrowLeft,
  FileDown,
  CheckCircle2,
  Building2,
  Share2,
  ExternalLink,
  Tag,
  Layers,
  QrCode,
  ShoppingCart,
  Microscope,
  Briefcase,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'

interface DetailKatalogClientProps {
  item: KatalogItem
  tenant?: TenantItem | null
  relatedProducts?: KatalogItem[]
}

export function DetailKatalogClient({
  item,
  tenant,
  relatedProducts = [],
}: DetailKatalogClientProps) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [selectedInterestType, setSelectedInterestType] = useState<InterestType>('pembelian_produk')
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)

  const openInquiryModal = (type: InterestType) => {
    setSelectedInterestType(type)
    setIsInquiryOpen(true)
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator
          .share({
            title: `${item.title} - Solo Technopark`,
            text: item.tagline,
            url: window.location.href,
          })
          .catch(() => {})
      } else {
        navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    }
  }

  // Filter out current item from related products
  const otherProducts = relatedProducts
    .filter((p) => p.id !== item.id && p.slug !== item.slug)
    .slice(0, 3)

  return (
    <PageTransition>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Navigation Breadcrumb & Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springGentle}
          className="flex items-center justify-between mb-6"
        >
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-sky-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali ke Katalog Inovasi</span>
          </Link>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsQrOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 transition-colors shadow-xs"
              title="Tampilkan QR Code untuk pameran atau pemindaian ponsel"
            >
              <QrCode className="h-3.5 w-3.5 text-sky-600" />
              <span>QR Pameran</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 transition-colors shadow-xs"
            >
              <Share2 className="h-3.5 w-3.5 text-sky-600" />
              <span>{shareSuccess ? 'Link Disalin!' : 'Bagikan'}</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Kolom Kiri: Galeri, Judul, TRL & Uraian (2 Kolom) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Multi-Image Gallery Viewer with Zoom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springSnappy}
            >
              <GalleryViewer
                coverUrl={item.coverUrl}
                galleryUrls={item.galleryUrls}
                title={item.title}
                trl={item.trl}
                isFeatured={item.isFeatured}
              />
            </motion.div>

            {/* Heading & Tagline */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="space-y-2 pt-1"
            >
              <Link
                href={tenant ? `/tenant/${tenant.id}` : '#'}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-sky-700 transition-colors group"
              >
                <Building2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                <span>{item.tenantName}</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {item.title}
              </h1>
              <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                {item.tagline}
              </p>
            </motion.div>

            {/* Katsinov TRL Visual Gauge (1-9) */}
            <ScrollReveal direction="up" delay={50}>
              <TrlIndicator trl={item.trl} />
            </ScrollReveal>

            {/* Deskripsi Inovasi Lengkap */}
            <ScrollReveal direction="up" delay={100}>
              <div className="prose max-w-none text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-6">
                <h3 className="text-base font-bold text-slate-900 mb-3">Tentang Produk / Inovasi</h3>
                <p className="whitespace-pre-line">{item.description}</p>
              </div>
            </ScrollReveal>

            {/* Target Pasar & Pengguna */}
            {item.targetMarket && item.targetMarket.length > 0 && (
              <ScrollReveal direction="up" delay={120}>
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-sky-600" />
                    <span>Target Pengguna & Segmen Industri</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.targetMarket.map((target, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium hover:border-sky-300 hover:bg-sky-50 transition-colors"
                      >
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Spesifikasi Teknis Terstruktur */}
            {item.specifications && item.specifications.length > 0 && (
              <ScrollReveal direction="up" delay={140}>
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-600" />
                    <span>Spesifikasi Teknis</span>
                  </h3>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white divide-y divide-slate-100 text-xs shadow-xs">
                    {item.specifications.map((spec, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3.5 hover:bg-slate-50/70 transition-colors"
                      >
                        <span className="text-slate-500 font-medium">{spec.key}</span>
                        <strong className="text-slate-900 font-semibold text-right">{spec.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Video Demo Embed (jika ada) */}
            {item.videoUrl && (
              <ScrollReveal direction="up" delay={160}>
                <VideoEmbed videoUrl={item.videoUrl} title={item.title} />
              </ScrollReveal>
            )}
          </div>

          {/* Kolom Kanan: Info Tenant, Legalitas & Action Box (1 Kolom Sticky) */}
          <div className="space-y-6">
            {/* Action Box Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springSnappy}
              className="sticky top-20 space-y-6"
            >
              <Card className="p-6 bg-white border-slate-200/90 space-y-4 shadow-md rounded-2xl">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Status Legalitas & Paten:</span>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-5 w-5 shrink-0 ${
                        item.hakiStatus === 'granted' ? 'text-emerald-600' : 'text-amber-500'
                      }`}
                    />
                    <span className="text-sm font-bold text-slate-900 uppercase">
                      {item.hakiStatus === 'granted'
                        ? 'HAKI / Paten Terdaftar'
                        : item.hakiStatus === 'terdaftar'
                        ? 'Proses Pendaftaran HAKI'
                        : 'Rahasia Dagang / Dalam Riset'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2.5">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block mb-1">
                    Pilih Jenis Interaksi:
                  </span>

                  {/* CTA 1: Pembelian Produk / Lisensi */}
                  <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap">
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full justify-start gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                      onClick={() => openInquiryModal('pembelian_produk')}
                    >
                      <ShoppingCart className="h-4 w-4 shrink-0" />
                      <span className="text-xs font-bold">Beli / Lisensi Komersial</span>
                    </Button>
                  </motion.div>

                  {/* CTA 2: Kerjasama Riset & Lisensi */}
                  <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full justify-start gap-2.5 border-sky-300 text-sky-700 hover:bg-sky-50"
                      onClick={() => openInquiryModal('kerjasama_riset')}
                    >
                      <Microscope className="h-4 w-4 shrink-0 text-sky-600" />
                      <span className="text-xs font-bold">Kerjasama Riset & Uji Lab</span>
                    </Button>
                  </motion.div>

                  {/* CTA 3: Investasi & Business Matching */}
                  <motion.div variants={buttonVariants} initial="rest" whileHover="hover" whileTap="tap">
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full justify-start gap-2.5 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      onClick={() => openInquiryModal('investasi')}
                    >
                      <Briefcase className="h-4 w-4 shrink-0 text-indigo-600" />
                      <span className="text-xs font-bold">Investasi & Business Matching</span>
                    </Button>
                  </motion.div>

                  {/* Link ke Wizard Lengkap */}
                  <Link
                    href={`/inquiry?slug=${item.slug}&type=${selectedInterestType}`}
                    className="w-full block pt-1"
                  >
                    <motion.div
                      whileHover={{ x: 2 }}
                      className="text-[11px] text-center text-slate-500 hover:text-sky-600 transition-colors flex items-center justify-center gap-1 font-medium"
                    >
                      <span>Buka formulir wizard mandiri</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </Link>

                  {item.brochurePdfUrl && (
                    <a
                      href={item.brochurePdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full block pt-1"
                    >
                      <Button variant="ghost" size="sm" className="w-full text-slate-600 hover:text-slate-900 border border-slate-200">
                        <FileDown className="h-4 w-4 text-sky-600" />
                        <span>Unduh Brosur PDF</span>
                      </Button>
                    </a>
                  )}
                </div>

                <div className="bg-sky-50/70 rounded-xl p-3 border border-sky-100 text-[11px] text-slate-600 leading-relaxed text-center">
                  Permohonan akan langsung diverifikasi Tim Bisnis STP dan Anda akan menerima nomor resi pelacakan resmi.
                </div>
              </Card>

              {/* Profil Tenant / Lab Inovator */}
              {tenant && (
                <Card className="p-6 bg-white border-slate-200/90 space-y-4 shadow-sm rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                      <Image src={tenant.logoUrl} alt={tenant.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{tenant.name}</h4>
                      {tenant.legalName && (
                        <span className="text-[11px] text-sky-700 font-medium block">{tenant.legalName}</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{tenant.about}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Badge variant="purple" size="sm">
                      {tenant.incubationStatus.toUpperCase()} ({tenant.batchYear})
                    </Badge>
                    <Link
                      href={`/tenant/${tenant.id}`}
                      className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold group"
                    >
                      <span>Profil Lengkap</span>
                      <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bagian Produk Rekomendasi Terkait di Klaster Ini */}
        {otherProducts.length > 0 && (
          <ScrollReveal direction="up" delay={200}>
            <div className="border-t border-slate-200 pt-10">
              <div className="flex items-center gap-2 mb-6">
                <Layers className="h-5 w-5 text-sky-600" />
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Inovasi Terkait di Klaster Ini
                </h2>
              </div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {otherProducts.map((other) => (
                  <KatalogCard key={other.id} item={other} />
                ))}
              </motion.div>
            </div>
          </ScrollReveal>
        )}

        {/* Inquiry Form Modal Terdiferensiasi */}
        <InquiryFormModal
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          katalogItem={item}
          initialInterestType={selectedInterestType}
        />

        {/* QR Code Exhibition Modal */}
        <QrCodeModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          item={item}
        />
      </main>
    </PageTransition>
  )
}
