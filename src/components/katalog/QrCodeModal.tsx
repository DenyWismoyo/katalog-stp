'use client'

import { useState } from 'react'
import Image from 'next/image'
import { KatalogItem } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { QrCode, X, Printer, Download, Sparkles, ExternalLink } from 'lucide-react'

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  item: KatalogItem
}

export function QrCodeModal({ isOpen, onClose, item }: QrCodeModalProps) {
  if (!isOpen) return null

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href
      : `https://katalog.solotechpark.id/katalog/${item.slug}`

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=15&data=${encodeURIComponent(
    currentUrl
  )}`

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Card Header for Exhibition Booth */}
        <div className="space-y-1 mb-4">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            <Sparkles className="h-3 w-3" />
            <span>Stan Pameran Solo Technopark</span>
          </div>
          <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2 mt-2">
            {item.title}
          </h3>
          <span className="text-xs text-slate-500 block font-medium">{item.tenantName}</span>
        </div>

        {/* QR Frame Printable */}
        <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-sm inline-block mx-auto mb-4">
          <img
            src={qrImageUrl}
            alt={`QR Code ${item.title}`}
            className="w-56 h-56 object-contain"
          />
          <div className="text-[10px] font-bold text-slate-900 mt-2 uppercase tracking-widest">
            SOLO TECHNOPARK e-KATALOG
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-5">
          Pindai kode QR menggunakan kamera ponsel untuk melihat spesifikasi lengkap dan mengajukan kerjasama atau pesanan langsung.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="w-full gap-1.5 text-xs text-slate-700 border-slate-300 hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Cetak Stand Card</span>
          </Button>
          <a
            href={qrImageUrl}
            download={`QR-${item.slug}.png`}
            target="_blank"
            rel="noreferrer"
            className="w-full block"
          >
            <Button variant="primary" size="sm" className="w-full gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span>Simpan Gambar</span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
