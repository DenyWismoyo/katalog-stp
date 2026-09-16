'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { FlaskConical, Clock, Layers, ShieldCheck } from 'lucide-react'

interface InquiryUjiCobaFieldsProps {
  values: {
    testingScope?: string
    labEnvironment?: string
    numberOfUnits?: number
    testingDuration?: string
  }
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquiryUjiCobaFields({
  values,
  onChange,
  disabled = false,
}: InquiryUjiCobaFieldsProps) {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80">
      <div className="flex items-center gap-2 text-cyan-800 text-xs font-bold uppercase tracking-wider">
        <FlaskConical className="h-4 w-4 text-cyan-600" />
        <span>Spesifikasi Uji Coba Prototipe & Validasi Lab</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Fokus Lingkup Pengujian *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            value={values.testingScope || 'fungsional_kinerja'}
            onChange={(e) => onChange('testingScope', e.target.value)}
            disabled={disabled}
          >
            <option value="fungsional_kinerja">Uji Fungsional & Kinerja Sistem</option>
            <option value="ketahanan_material">Uji Ketahanan Beban & Material Presisi</option>
            <option value="underwater_test">Uji Kedap Air & Tekanan Wet Welding</option>
            <option value="ai_benchmark">Benchmark Model AI & Stress Test Server</option>
            <option value="sertifikasi_sni">Uji Pra-Sertifikasi / Standar Industri</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Lingkungan Laboratorium yang Dibutuhkan *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
            value={values.labEnvironment || 'manufaktur_cnc'}
            onChange={(e) => onChange('labEnvironment', e.target.value)}
            disabled={disabled}
          >
            <option value="manufaktur_cnc">Bengkel Pemesinan CNC Presisi</option>
            <option value="wet_welding_tank">Tangki Uji Underwater Wet Welding</option>
            <option value="ai_iot_lab">Lab AI, IoT & Cyber Security</option>
            <option value="studio_kreatif">Lab Grafika & Audio Visual 3D</option>
            <option value="outdoor_field">Area Terbuka / Simulasi Lapangan</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Jumlah Unit Prototipe yang Diuji
          </label>
          <Input
            type="number"
            min={1}
            placeholder="Contoh: 2 unit sampel"
            icon={<Layers className="h-4 w-4" />}
            value={values.numberOfUnits || ''}
            onChange={(e) => onChange('numberOfUnits', e.target.value ? Number(e.target.value) : undefined)}
            disabled={disabled}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Estimasi Waktu Pengujian
          </label>
          <Input
            placeholder="Contoh: 3 hari kerja / 2 minggu"
            icon={<Clock className="h-4 w-4" />}
            value={values.testingDuration || ''}
            onChange={(e) => onChange('testingDuration', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
