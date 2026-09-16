'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Microscope, Clock, Award, Landmark } from 'lucide-react'

interface InquiryRisetFieldsProps {
  values: {
    researchScope?: string
    institutionType?: string
    researchDuration?: string
    fundingSource?: string
    expectedOutput?: string
  }
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquiryRisetFields({
  values,
  onChange,
  disabled = false,
}: InquiryRisetFieldsProps) {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-sky-50/60 border border-sky-200/80">
      <div className="flex items-center gap-2 text-sky-800 text-xs font-bold uppercase tracking-wider">
        <Microscope className="h-4 w-4 text-sky-600" />
        <span>Parameter Kerjasama Riset & Lisensi Teknologi</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Bentuk Kerjasama Riset *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            value={values.researchScope || 'co_development'}
            onChange={(e) => onChange('researchScope', e.target.value)}
            disabled={disabled}
          >
            <option value="co_development">Co-Development (Pengembangan Bersama)</option>
            <option value="lisensi_paten">Lisensi Paten / HAKI Komersial</option>
            <option value="uji_coba_klinis_lapangan">Pengujian Terapan di Lapangan</option>
            <option value="transfer_teknologi">Transfer Teknologi ke Industri</option>
            <option value="konsultasi_ahli">Pendampingan Tenaga Ahli Riset</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Jenis Institusi Pemohon *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            value={values.institutionType || 'industri_swasta'}
            onChange={(e) => onChange('institutionType', e.target.value)}
            disabled={disabled}
          >
            <option value="industri_swasta">Industri Swasta Nasional / Multinasional</option>
            <option value="bumn">BUMN / BUMD</option>
            <option value="perguruan_tinggi">Perguruan Tinggi / Universitas</option>
            <option value="lembaga_pemerintah">Badan Riset (BRIN / Balai Penelitian)</option>
            <option value="startup">Startup Teknologi Mandiri</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Rencana Durasi Riset
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
            value={values.researchDuration || '3-6_bulan'}
            onChange={(e) => onChange('researchDuration', e.target.value)}
            disabled={disabled}
          >
            <option value="1-3_bulan">1 - 3 Bulan (Pilot/Feasibility)</option>
            <option value="3-6_bulan">3 - 6 Bulan (Pengembangan)</option>
            <option value="6-12_bulan">6 - 12 Bulan (Validasi Penuh)</option>
            <option value=">1_tahun">Lebih dari 1 Tahun (Multi-Year)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Sumber Skema Pendanaan
          </label>
          <Input
            placeholder="Contoh: Kedaireka / Internal PT"
            icon={<Landmark className="h-4 w-4" />}
            value={values.fundingSource || ''}
            onChange={(e) => onChange('fundingSource', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Target Output yang Diharapkan
          </label>
          <Input
            placeholder="Contoh: Prototipe TRL 8 / Paten"
            icon={<Award className="h-4 w-4" />}
            value={values.expectedOutput || ''}
            onChange={(e) => onChange('expectedOutput', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
