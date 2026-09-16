'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Rocket, Users, Target, HelpCircle } from 'lucide-react'

interface InquiryInkubasiFieldsProps {
  values: {
    startupStage?: string
    sectorFocus?: string
    currentTeamSize?: number
    problemStatement?: string
  }
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquiryInkubasiFields({
  values,
  onChange,
  disabled = false,
}: InquiryInkubasiFieldsProps) {
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80">
      <div className="flex items-center gap-2 text-purple-800 text-xs font-bold uppercase tracking-wider">
        <Rocket className="h-4 w-4 text-purple-600" />
        <span>Konsultasi & Seleksi Program Inkubasi Startup STP</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Tahapan Kematangan Startup *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            value={values.startupStage || 'ideation_concept'}
            onChange={(e) => onChange('startupStage', e.target.value)}
            disabled={disabled}
          >
            <option value="ideation_concept">Ideasi / Konsep Awal (TRL 1-3)</option>
            <option value="prototype_mvp">Prototipe Fungsional / MVP (TRL 4-6)</option>
            <option value="early_traction">Telah Ada Pengguna / Traksi Awal (TRL 7)</option>
            <option value="commercial_growth">Komersialisasi & Perluasan Pasar (TRL 8-9)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Sektor Fokus Inovasi *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
            value={values.sectorFocus || 'ai_software'}
            onChange={(e) => onChange('sectorFocus', e.target.value)}
            disabled={disabled}
          >
            <option value="ai_software">AI, Big Data & Enterprise Software</option>
            <option value="game_animation">Game, AR/VR & Animasi 3D</option>
            <option value="iot_hardware">Robotika, IoT & Hardware Cerdas</option>
            <option value="green_tech">Energi Terbarukan & Kendaraan Listrik</option>
            <option value="craft_batik_tech">Teknologi Kerajinan Batik & Budaya</option>
            <option value="agritech">AgriTech & Food Technology</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Ukuran Tim Inti (Founders)
          </label>
          <Input
            type="number"
            min={1}
            placeholder="Contoh: 3 orang"
            icon={<Users className="h-4 w-4" />}
            value={values.currentTeamSize || ''}
            onChange={(e) => onChange('currentTeamSize', e.target.value ? Number(e.target.value) : undefined)}
            disabled={disabled}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Masalah Utama yang Ingin Diselesaikan (Problem Statement)
          </label>
          <Input
            placeholder="Jelaskan masalah utama yang diatasi oleh startup Anda..."
            icon={<HelpCircle className="h-4 w-4" />}
            value={values.problemStatement || ''}
            onChange={(e) => onChange('problemStatement', e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
