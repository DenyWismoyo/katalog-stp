'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Briefcase, DollarSign, Globe, TrendingUp } from 'lucide-react'

interface InquiryInvestasiFieldsProps {
  values: {
    investorType?: 'angel' | 'vc' | 'corporate' | 'strategic'
    investmentRange?: string
    portfolioUrl?: string
  }
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquiryInvestasiFields({
  values,
  onChange,
  disabled = false,
}: InquiryInvestasiFieldsProps) {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
      <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-wider">
        <Briefcase className="h-4 w-4 text-rose-600" />
        <span>Profil Minat Investasi & Business Matching STP</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Tipe Profil Investor *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
            value={values.investorType || 'angel'}
            onChange={(e) => onChange('investorType', e.target.value)}
            disabled={disabled}
          >
            <option value="angel">Angel Investor (Individu)</option>
            <option value="vc">Venture Capital / Private Equity</option>
            <option value="corporate">Corporate Venture Capital (CVC / B2B)</option>
            <option value="strategic">Strategic Industry Partner / Distributor</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Rentang Alokasi Tiket Investasi (Ticket Size) *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none"
            value={values.investmentRange || '100jt-500jt'}
            onChange={(e) => onChange('investmentRange', e.target.value)}
            disabled={disabled}
          >
            <option value="<100jt">&lt; Rp 100 Juta (Pre-Seed / Hibah)</option>
            <option value="100jt-500jt">Rp 100 Juta - Rp 500 Juta (Seed Funding)</option>
            <option value="500jt-2m">Rp 500 Juta - Rp 2 Miliar (Early Stage)</option>
            <option value="2m-10m">Rp 2 Miliar - Rp 10 Miliar (Series A / Scale-up)</option>
            <option value=">10m">&gt; Rp 10 Miliar (Strategic Joint Venture)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700 block mb-1.5">
          Tautan Portofolio / Profil Perusahaan Investor (Website / LinkedIn)
        </label>
        <Input
          type="url"
          placeholder="https://company-investor.com atau link linkedin"
          icon={<Globe className="h-4 w-4" />}
          value={values.portfolioUrl || ''}
          onChange={(e) => onChange('portfolioUrl', e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
