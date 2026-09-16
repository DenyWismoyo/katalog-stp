'use client'

import React from 'react'
import { InterestType, INTEREST_TYPE_LABELS, INTEREST_TYPE_DESCRIPTIONS } from '@/types'
import {
  ShoppingCart,
  Microscope,
  FlaskConical,
  Building2,
  Rocket,
  Briefcase,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface InquiryTypeSelectorProps {
  selectedType: InterestType
  onSelectType: (type: InterestType) => void
  disabled?: boolean
}

const TYPE_CONFIG: Record<
  InterestType,
  {
    icon: React.ElementType
    badge: string
    colorClass: string
    activeBorderClass: string
    activeBgClass: string
  }
> = {
  pembelian_produk: {
    icon: ShoppingCart,
    badge: 'Komersial / PO',
    colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    activeBorderClass: 'border-emerald-500 ring-2 ring-emerald-500/20',
    activeBgClass: 'bg-emerald-50/60',
  },
  kerjasama_riset: {
    icon: Microscope,
    badge: 'Riset & Lisensi',
    colorClass: 'text-sky-600 bg-sky-50 border-sky-200',
    activeBorderClass: 'border-sky-500 ring-2 ring-sky-500/20',
    activeBgClass: 'bg-sky-50/60',
  },
  pengajuan_masalah: {
    icon: Lightbulb,
    badge: 'Problem Bank STP',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    activeBorderClass: 'border-amber-500 ring-2 ring-amber-500/20',
    activeBgClass: 'bg-amber-50/70',
  },
  uji_coba_prototipe: {
    icon: FlaskConical,
    badge: 'Validasi & Uji Lab',
    colorClass: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    activeBorderClass: 'border-cyan-600 ring-2 ring-cyan-500/20',
    activeBgClass: 'bg-cyan-50/60',
  },
  sewa_fasilitas_lab: {
    icon: Building2,
    badge: 'Fasilitas & Mesin',
    colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    activeBorderClass: 'border-indigo-500 ring-2 ring-indigo-500/20',
    activeBgClass: 'bg-indigo-50/60',
  },
  konsultasi_inkubasi: {
    icon: Rocket,
    badge: 'Inkubasi Startup',
    colorClass: 'text-purple-700 bg-purple-50 border-purple-200',
    activeBorderClass: 'border-purple-500 ring-2 ring-purple-500/20',
    activeBgClass: 'bg-purple-50/60',
  },
  investasi: {
    icon: Briefcase,
    badge: 'Business Matching',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    activeBorderClass: 'border-rose-500 ring-2 ring-rose-500/20',
    activeBgClass: 'bg-rose-50/60',
  },
}

const TYPES: InterestType[] = [
  'pembelian_produk',
  'kerjasama_riset',
  'pengajuan_masalah',
  'uji_coba_prototipe',
  'sewa_fasilitas_lab',
  'konsultasi_inkubasi',
  'investasi',
]

export function InquiryTypeSelector({
  selectedType,
  onSelectType,
  disabled = false,
}: InquiryTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {TYPES.map((type) => {
        const isSelected = selectedType === type
        const config = TYPE_CONFIG[type]
        const Icon = config.icon

        return (
          <button
            key={type}
            type="button"
            disabled={disabled}
            onClick={() => onSelectType(type)}
            className={cn(
              'text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between group shadow-xs',
              isSelected
                ? cn(config.activeBorderClass, config.activeBgClass, 'shadow-md shadow-sky-500/5')
                : 'border-slate-200 bg-white hover:bg-slate-50/80 hover:border-slate-300',
              disabled && 'opacity-60 cursor-not-allowed'
            )}
          >
            {/* Header: Icon & Badge */}
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div
                className={cn(
                  'h-10 w-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105',
                  config.colorClass
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                  {config.badge}
                </span>
                {isSelected && (
                  <CheckCircle2 className="h-4 w-4 text-sky-600 animate-in zoom-in-50 duration-200" />
                )}
              </div>
            </div>

            {/* Title & Desc */}
            <div>
              <h4 className={cn('text-xs sm:text-sm font-bold leading-tight mb-1', isSelected ? 'text-slate-900' : 'text-slate-800')}>
                {INTEREST_TYPE_LABELS[type]}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {INTEREST_TYPE_DESCRIPTIONS[type]}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}
