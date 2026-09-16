'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { ShoppingBag, Calendar, FileText, Sparkles } from 'lucide-react'

interface InquiryPembelianFieldsProps {
  values: {
    quantity?: number
    targetDeliveryDate?: string
    purchaseOrderRef?: string
    needsDemoFirst?: boolean
  }
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquiryPembelianFields({
  values,
  onChange,
  disabled = false,
}: InquiryPembelianFieldsProps) {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
      <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider">
        <ShoppingBag className="h-4 w-4 text-emerald-600" />
        <span>Spesifikasi Pengadaan / Pembelian Produk</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Estimasi Jumlah Unit / Kuantitas *
          </label>
          <Input
            type="number"
            min={1}
            placeholder="Contoh: 5 unit"
            value={values.quantity || ''}
            onChange={(e) => onChange('quantity', e.target.value ? Number(e.target.value) : undefined)}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Target Waktu Kebutuhan / Pengiriman
          </label>
          <Input
            type="date"
            icon={<Calendar className="h-4 w-4" />}
            value={values.targetDeliveryDate || ''}
            onChange={(e) => onChange('targetDeliveryDate', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Nomor Dokumen PO / RfQ (Jika Ada)
          </label>
          <Input
            placeholder="Contoh: PO-STP/2026/089"
            icon={<FileText className="h-4 w-4" />}
            value={values.purchaseOrderRef || ''}
            onChange={(e) => onChange('purchaseOrderRef', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <label className="relative flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700 font-medium">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/30"
              checked={values.needsDemoFirst || false}
              onChange={(e) => onChange('needsDemoFirst', e.target.checked)}
              disabled={disabled}
            />
            <span>Memerlukan sesi demonstrasi produk terlebih dahulu</span>
          </label>
        </div>
      </div>
    </div>
  )
}
