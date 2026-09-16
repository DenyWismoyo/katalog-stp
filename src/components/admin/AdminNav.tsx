'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Layers,
  Building2,
  Cpu,
  ClipboardList,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function AdminNav() {
  const pathname = usePathname()

  const tabs = [
    {
      label: 'Ringkasan Eksekutif',
      href: '/admin',
      exact: true,
      icon: LayoutDashboard,
    },
    {
      label: 'Katalog Inovasi',
      href: '/admin/katalog',
      icon: Layers,
    },
    {
      label: 'Tenant & Lab Mitra',
      href: '/admin/tenant',
      icon: Building2,
    },
    {
      label: 'Fasilitas & Lab STP',
      href: '/admin/fasilitas',
      icon: Cpu,
    },
  ]

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-2 mb-8 backdrop-blur-md shadow-xl">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.exact
              ? pathname === tab.href
              : pathname.startsWith(tab.href)

            const Icon = tab.icon

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200',
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25 border border-sky-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-white' : 'text-slate-400')} />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Cross-module link ke Antrean Order Operator */}
        <Link
          href="/operator/orders"
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-colors whitespace-nowrap"
          title="Buka Antrean Permohonan Operator"
        >
          <ClipboardList className="h-3.5 w-3.5 text-emerald-400" />
          <span>Antrean Order Operator</span>
          <ExternalLink className="h-3 w-3 opacity-60" />
        </Link>
      </div>
    </div>
  )
}
