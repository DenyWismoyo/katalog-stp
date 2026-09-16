import Link from 'next/link'
import Image from 'next/image'
import { TenantItem } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Building2, MapPin, ArrowRight, ExternalLink } from 'lucide-react'

interface TenantCardProps {
  tenant: TenantItem
  productCount?: number
}

const STATUS_CONFIG: Record<
  TenantItem['incubationStatus'],
  { label: string; variant: 'purple' | 'sky' | 'emerald' | 'amber' }
> = {
  'pra-inkubasi': { label: 'Pra-Inkubasi', variant: 'amber' },
  'inkubasi': { label: 'Inkubasi Aktif', variant: 'sky' },
  'alumni': { label: 'Alumni Mandiri', variant: 'emerald' },
  'mitra-industri': { label: 'Mitra Industri', variant: 'purple' },
}

export function TenantCard({ tenant, productCount }: TenantCardProps) {
  const statusInfo = STATUS_CONFIG[tenant.incubationStatus] || {
    label: tenant.incubationStatus,
    variant: 'sky',
  }

  return (
    <Card className="flex flex-col h-full bg-white border-slate-200/90 p-5 group shadow-sm hover:shadow-md hover:border-sky-300 transition-all">
      {/* Header Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0 shadow-xs group-hover:border-sky-400 transition-colors">
          <Image
            src={tenant.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'}
            alt={tenant.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Badge variant={statusInfo.variant} size="sm">
              {statusInfo.label}
            </Badge>
            {tenant.batchYear && (
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                Batch {tenant.batchYear}
              </span>
            )}
          </div>
          <h3 className="font-bold text-base text-slate-900 truncate group-hover:text-sky-700 transition-colors">
            {tenant.name}
          </h3>
          {tenant.legalName && (
            <p className="text-xs text-slate-500 truncate font-medium">{tenant.legalName}</p>
          )}
        </div>
      </div>

      {/* Deskripsi Singkat */}
      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 flex-1">
        {tenant.about}
      </p>

      {/* Lokasi di Kawasan STP */}
      {tenant.address && (
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-4 truncate font-medium">
          <MapPin className="h-3.5 w-3.5 text-sky-600 shrink-0" />
          <span className="truncate">{tenant.address}</span>
        </div>
      )}

      {/* Footer & Action Link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-500 font-medium">
          {productCount !== undefined ? `${productCount} Inovasi Terdaftar` : 'Tenant STP'}
        </span>
        <Link
          href={`/tenant/${tenant.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors group/btn"
        >
          <span>Lihat Profil</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </Card>
  )
}
