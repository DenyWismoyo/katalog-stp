import Link from 'next/link'
import Image from 'next/image'
import { FacilityItem } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin, ArrowRight, CheckCircle2 } from 'lucide-react'

interface FacilityCardProps {
  facility: FacilityItem
}

const CATEGORY_BADGES: Record<
  FacilityItem['category'],
  { label: string; variant: 'amber' | 'cyan' | 'purple' | 'emerald' | 'rose' }
> = {
  manufaktur_cnc: { label: 'Manufaktur CNC', variant: 'amber' },
  wet_welding: { label: 'Wet Welding Tank', variant: 'cyan' },
  ai_iot_lab: { label: 'AI Supercomputer', variant: 'purple' },
  diklat_hall: { label: 'Auditorium & Diklat', variant: 'emerald' },
  studio_kreatif: { label: 'Studio Kreatif', variant: 'rose' },
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const catInfo = CATEGORY_BADGES[facility.category] || {
    label: facility.categoryLabel,
    variant: 'cyan',
  }

  return (
    <Card className="flex flex-col h-full bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-sky-600/10 hover:border-sky-300 transition-all duration-300 group overflow-hidden">
      {/* Cover Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={facility.coverUrl}
          alt={facility.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <Badge variant={catInfo.variant} size="sm">
            {catInfo.label}
          </Badge>
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white/95 backdrop-blur px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-xs">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            <span>Siap Sewa</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span className="truncate">{facility.location}</span>
          </div>

          <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">
            {facility.name}
          </h3>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {facility.tagline}
          </p>

          {/* Equipment Preview Pills */}
          <div className="mt-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              Peralatan Utama:
            </span>
            <div className="flex flex-wrap gap-1">
              {facility.equipmentList.slice(0, 2).map((eq, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 truncate max-w-full font-medium"
                >
                  {eq}
                </span>
              ))}
              {facility.equipmentList.length > 2 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-500">
                  +{facility.equipmentList.length - 2} mesin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer & Rate */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Mulai Dari</span>
            <strong className="text-xs font-bold text-sky-700">
              {facility.ratePerHour || facility.ratePerDay || 'Sesuai Kebutuhan'}
            </strong>
          </div>

          <Link href={`/fasilitas/${facility.slug}`}>
            <Button variant="outline" size="sm" className="gap-1 text-xs font-bold">
              <span>Detail & Sewa</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
