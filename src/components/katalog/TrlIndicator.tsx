import { TRLLevel } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, Info } from 'lucide-react'

interface TrlIndicatorProps {
  trl: TRLLevel
}

const TRL_DESCRIPTIONS: Record<
  TRLLevel,
  { phase: string; title: string; desc: string; phaseColor: 'cyan' | 'amber' | 'emerald' }
> = {
  1: {
    phase: 'Fase Riset Dasar',
    title: 'Prinsip Dasar Teknologi Teridentifikasi',
    desc: 'Formulasi riset ilmiah awal dan pemetaan potensi penerapan teknologi.',
    phaseColor: 'cyan',
  },
  2: {
    phase: 'Fase Riset Dasar',
    title: 'Konsep & Aplikasi Teknologi Diformulasikan',
    desc: 'Spesifikasi teoritis dan rancangan awal solusi telah terdefinisi.',
    phaseColor: 'cyan',
  },
  3: {
    phase: 'Fase Riset Dasar',
    title: 'Pembuktian Konsep Analitis & Eksperimental (PoC)',
    desc: 'Pengujian awal di tingkat laboratorium berhasil membuktikan kelayakan fungsi.',
    phaseColor: 'cyan',
  },
  4: {
    phase: 'Fase Purwarupa & Uji Coba',
    title: 'Validasi Komponen di Lingkungan Laboratorium',
    desc: 'Komponen-komponen terintegrasi dan berfungsi dengan baik dalam uji coba skala kecil.',
    phaseColor: 'amber',
  },
  5: {
    phase: 'Fase Purwarupa & Uji Coba',
    title: 'Validasi Komponen di Lingkungan Simulasi Relevan',
    desc: 'Prototipe diuji pada kondisi beban kerja simulasi mendekati operasional nyata.',
    phaseColor: 'amber',
  },
  6: {
    phase: 'Fase Purwarupa & Uji Coba',
    title: 'Demonstrasi Model Prototipe Lapangan',
    desc: 'Prototipe berukuran penuh berfungsi secara operasional di lingkungan uji industri.',
    phaseColor: 'amber',
  },
  7: {
    phase: 'Fase Komersialisasi & Pasar',
    title: 'Demonstrasi Prototipe di Lingkungan Nyata Industri',
    desc: 'Telah terbukti beroperasi stabil di fasilitas manufaktur/lapangan mitra industri.',
    phaseColor: 'emerald',
  },
  8: {
    phase: 'Fase Komersialisasi & Pasar',
    title: 'Sistem Lengkap & Memenuhi Standar Sertifikasi Mutu',
    desc: 'Lolos uji kualifikasi teknis, sertifikasi standar (SNI/ISO/AWS), dan siap uji terima.',
    phaseColor: 'emerald',
  },
  9: {
    phase: 'Fase Komersialisasi & Pasar',
    title: 'Sistem Teruji Penuh & Siap Beli / Produksi Massal',
    desc: 'Produk telah beredar komersial, teruji handal di pasar, dan siap transaksi B2G/B2B.',
    phaseColor: 'emerald',
  },
}

export function TrlIndicator({ trl }: TrlIndicatorProps) {
  const current = TRL_DESCRIPTIONS[trl] || TRL_DESCRIPTIONS[7]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={current.phaseColor} size="md">
            TRL {trl} / 9 (Katsinov)
          </Badge>
          <span className="text-xs font-semibold text-slate-700">
            {current.phase}
          </span>
        </div>
        {trl >= 7 && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Kesiapan Pasar / Pengadaan B2G</span>
          </div>
        )}
      </div>

      {/* 9 Segment Visual Step Progress */}
      <div className="space-y-1.5">
        <div className="grid grid-cols-9 gap-1.5 h-2.5">
          {([1, 2, 3, 4, 5, 6, 7, 8, 9] as TRLLevel[]).map((level) => {
            const isActive = level <= trl
            let activeClass = 'bg-slate-100 border border-slate-200'
            if (isActive) {
              if (level <= 3) activeClass = 'bg-sky-500 shadow-sm shadow-sky-500/30'
              else if (level <= 6) activeClass = 'bg-amber-500 shadow-sm shadow-amber-500/30'
              else activeClass = 'bg-emerald-600 shadow-sm shadow-emerald-500/30'
            }

            return (
              <div
                key={level}
                className={`rounded-sm transition-all duration-300 ${activeClass}`}
                title={`TRL ${level}: ${TRL_DESCRIPTIONS[level].title}`}
              />
            )
          })}
        </div>
        <div className="flex justify-between text-[10px] font-medium text-slate-500 px-0.5">
          <span>1 (Riset Awal)</span>
          <span>4 (Prototipe Lab)</span>
          <span>7 (Operasional Industri)</span>
          <span>9 (Komersial)</span>
        </div>
      </div>

      {/* Detail Penjelasan Level */}
      <div className="bg-sky-50/50 rounded-xl p-3.5 border border-sky-100 text-xs space-y-1">
        <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 text-sky-600 shrink-0" />
          <span>{current.title}</span>
        </h4>
        <p className="text-slate-600 pl-5 leading-relaxed">
          {current.desc}
        </p>
      </div>
    </div>
  )
}
