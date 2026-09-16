import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getTenantByIdAction } from '@/actions/tenant'
import { KatalogCard } from '@/components/katalog/KatalogCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  Layers,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'purple' | 'sky' | 'emerald' | 'amber' }
> = {
  'pra-inkubasi': { label: 'Tahap Pra-Inkubasi', variant: 'amber' },
  'inkubasi': { label: 'Inkubasi Aktif STP', variant: 'sky' },
  'alumni': { label: 'Alumni Mandiri STP', variant: 'emerald' },
  'mitra-industri': { label: 'Mitra Industri Strategis', variant: 'purple' },
}

export default async function TenantDetailPage({ params }: PageProps) {
  const { id } = await params
  const res = await getTenantByIdAction(id)

  if (!res.success || !res.data) {
    notFound()
  }

  const { tenant, products } = res.data
  const statusInfo = STATUS_CONFIG[tenant.incubationStatus] || {
    label: tenant.incubationStatus,
    variant: 'sky',
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/tenant"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Direktori Tenant</span>
        </Link>
      </div>

      {/* Tenant Profile Banner Card */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xl mb-10">
        {/* Decorative Top Accent Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 border-b border-slate-200/80 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/10 via-transparent to-transparent" />
        </div>

        {/* Profile Header Content */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-2 border-white bg-white shadow-xl shrink-0">
              <Image
                src={tenant.logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop'}
                alt={tenant.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Badges & Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusInfo.variant} size="md">
                {statusInfo.label}
              </Badge>
              {tenant.batchYear && (
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  Angkatan {tenant.batchYear}
                </span>
              )}
              {tenant.website && (
                <a
                  href={tenant.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-colors shadow-sm"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Kunjungi Web</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Titles & Legal */}
          <div className="space-y-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {tenant.name}
            </h1>
            {tenant.legalName && (
              <p className="text-sm text-sky-600 font-semibold">{tenant.legalName}</p>
            )}
          </div>

          {/* About Section */}
          <div className="prose max-w-none text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-6 mb-6">
            <h3 className="text-base font-bold text-slate-900 mb-2">Profil & Bidang Keahlian</h3>
            <p>{tenant.about}</p>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 text-xs">
            {tenant.email && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <Mail className="h-4 w-4 text-sky-600 shrink-0" />
                <span className="text-slate-700 truncate font-medium">{tenant.email}</span>
              </div>
            )}
            {tenant.phone && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700 truncate font-medium">{tenant.phone}</span>
              </div>
            )}
            {tenant.address && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-1">
                <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-slate-700 truncate font-medium">{tenant.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Produk Inovasi Tenant */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-sky-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Portofolio Produk & Riset Inovasi
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {products.length} Inovasi Terdaftar
          </span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item) => (
              <KatalogCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Sparkles className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-medium">
              Tenant ini belum mendaftarkan produk publik ke dalam e-katalog.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
