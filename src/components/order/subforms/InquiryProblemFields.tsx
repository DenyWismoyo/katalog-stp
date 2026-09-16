'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { KlasterId, UrgencyLevel } from '@/types'
import { Lightbulb, AlertTriangle, Shield, Clock, Layers, FileText } from 'lucide-react'

interface InquiryProblemFieldsProps {
  values: {
    problemTitle?: string
    problemKlasterId?: KlasterId
    impactStatement?: string
    expectedSolutionType?: string
    collaborationScheme?: string
    urgency?: UrgencyLevel
    targetTimeline?: string
    isAnonymous?: boolean
  }
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquiryProblemFields({
  values,
  onChange,
  disabled = false,
}: InquiryProblemFieldsProps) {
  return (
    <div className="space-y-4 p-4.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
        <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <span>Formulir Pengajuan Tantangan / Masalah Industri (Open Innovation)</span>
        </div>
        <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-2 py-0.5 rounded-full">
          Problem Bank STP
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            Judul Singkat Masalah / Kebutuhan Solusi *
          </label>
          <Input
            placeholder="Contoh: Otomasi Inspeksi Cacat Kain Tenun Tradisional"
            value={values.problemTitle || ''}
            onChange={(e) => onChange('problemTitle', e.target.value)}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            Klaster Teknologi Terkait *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            value={values.problemKlasterId || 'ai-software'}
            onChange={(e) => onChange('problemKlasterId', e.target.value)}
            disabled={disabled}
          >
            <option value="ai-software">AI & Software Solution</option>
            <option value="manufaktur-cnc">Manufaktur Presisi & CNC</option>
            <option value="robotika-otomasi">Robotika & Otomasi Industri</option>
            <option value="smart-city-iot">Smart City & IoT Telemetri</option>
            <option value="energi-terbarukan">Energi Terbarukan</option>
            <option value="underwater-welding">Underwater Welding & Inspeksi Bawah Air</option>
            <option value="batik-craft-tech">Batik & Craft Tech</option>
            <option value="game-animasi">Game, XR & Animasi</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-800 block mb-1.5">
          Dampak Kerugian / Hambatan Operasional Saat Ini *
        </label>
        <textarea
          rows={2}
          className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition-colors"
          placeholder="Jelaskan dampak jika masalah ini tidak terpecahkan (contoh: pemborosan biaya operasional, reject rate 15%, bottleneck produksi, dll)..."
          value={values.impactStatement || ''}
          onChange={(e) => onChange('impactStatement', e.target.value)}
          disabled={disabled}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            Bentuk Luaran Solusi yang Diharapkan *
          </label>
          <Input
            placeholder="Contoh: Prototipe Mesin / Software AI / Uji Lab"
            icon={<FileText className="h-4 w-4" />}
            value={values.expectedSolutionType || ''}
            onChange={(e) => onChange('expectedSolutionType', e.target.value)}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            Skema Kolaborasi yang Diinginkan
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            value={values.collaborationScheme || 'pilot_project'}
            onChange={(e) => onChange('collaborationScheme', e.target.value)}
            disabled={disabled}
          >
            <option value="pilot_project">Pilot Project (Uji Coba Lapangan Terbatas)</option>
            <option value="kontrak_riset">Kontrak Riset & Pengembangan (R&D)</option>
            <option value="joint_development">Joint Development (Pengembangan Bersama)</option>
            <option value="bounty_sayembara">Bounty / Sayembara Inovasi Terbuka</option>
            <option value="konsultasi_teknis">Konsultasi Tenaga Ahli Laboratorium</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            Tingkat Urgensi Masalah *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none font-semibold text-amber-900"
            value={values.urgency || 'sedang'}
            onChange={(e) => onChange('urgency', e.target.value)}
            disabled={disabled}
          >
            <option value="rendah">Urgensi Rendah (Eksplorasi Jangka Panjang)</option>
            <option value="sedang">Urgensi Sedang (Jadwal Normal)</option>
            <option value="tinggi">Urgensi Tinggi (Mendesak & Butuh Cepat)</option>
            <option value="kritis">Kritis / Prioritas Utama Operasional</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1.5">
            Target Waktu Penyelesaian
          </label>
          <Input
            placeholder="Contoh: 3-6 Bulan"
            icon={<Clock className="h-4 w-4" />}
            value={values.targetTimeline || ''}
            onChange={(e) => onChange('targetTimeline', e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={values.isAnonymous || false}
              onChange={(e) => onChange('isAnonymous', e.target.checked)}
              disabled={disabled}
              className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <div className="text-[11px] text-slate-700 leading-tight">
              <span className="font-bold flex items-center gap-1 text-slate-900">
                <Shield className="h-3 w-3 text-amber-600" />
                Samarkan Nama Perusahaan
              </span>
              <span className="text-slate-500 text-[10px] block">
                Nama disamarkan di papan tantangan publik
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
