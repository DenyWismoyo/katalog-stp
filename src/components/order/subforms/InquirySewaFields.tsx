'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Building2, Calendar, Users, Target } from 'lucide-react'
import { useFacilityList } from '@/hooks/useFacilities'

interface InquirySewaFieldsProps {
  values: {
    facilityId?: string
    rentalStartDate?: string
    rentalEndDate?: string
    purposeOfUse?: string
    numberOfParticipants?: number
  }
  onChange: (field: string, value: any) => void
  disabled?: boolean
}

export function InquirySewaFields({
  values,
  onChange,
  disabled = false,
}: InquirySewaFieldsProps) {
  const { data: facilities = [] } = useFacilityList()

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
      <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
        <Building2 className="h-4 w-4 text-amber-600" />
        <span>Penyewaan Fasilitas Laboratorium & Workshop STP</span>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-700 block mb-1.5">
          Pilih Laboratorium / Fasilitas *
        </label>
        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
          value={values.facilityId || (facilities[0]?.id || '')}
          onChange={(e) => onChange('facilityId', e.target.value)}
          disabled={disabled}
        >
          {facilities.length > 0 ? (
            facilities.map((fac) => (
              <option key={fac.id} value={fac.id}>
                {fac.name} ({fac.categoryLabel}) — Kapasitas: {fac.capacity}
              </option>
            ))
          ) : (
            <option value="fasilitas-umum">Pusat Laboratorium Terpadu Solo Technopark</option>
          )}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Tanggal Mulai Sewa *
          </label>
          <Input
            type="date"
            icon={<Calendar className="h-4 w-4" />}
            value={values.rentalStartDate || ''}
            onChange={(e) => onChange('rentalStartDate', e.target.value)}
            disabled={disabled}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Tanggal Berakhir Sewa *
          </label>
          <Input
            type="date"
            icon={<Calendar className="h-4 w-4" />}
            value={values.rentalEndDate || ''}
            onChange={(e) => onChange('rentalEndDate', e.target.value)}
            disabled={disabled}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Tujuan Penggunaan *
          </label>
          <select
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            value={values.purposeOfUse || 'pelatihan_workshop'}
            onChange={(e) => onChange('purposeOfUse', e.target.value)}
            disabled={disabled}
          >
            <option value="pelatihan_workshop">Pelatihan Vokasi / Workshop Perusahaan</option>
            <option value="produksi_batch">Produksi Batch Terbatas (Pilot Project)</option>
            <option value="penelitian_mandiri">Riset Independen Mahasiswa / Dosen</option>
            <option value="event_seminar">Seminar / Konvensi Teknologi</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">
            Perkiraan Jumlah Peserta / Personil
          </label>
          <Input
            type="number"
            min={1}
            placeholder="Contoh: 25 orang"
            icon={<Users className="h-4 w-4" />}
            value={values.numberOfParticipants || ''}
            onChange={(e) => onChange('numberOfParticipants', e.target.value ? Number(e.target.value) : undefined)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
