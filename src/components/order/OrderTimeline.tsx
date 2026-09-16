import { OrderStatus, OrderLogItem } from '@/types'
import { CheckCircle2, Clock, PhoneCall, Calendar, Handshake, CheckCheck, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StepConfig {
  key: OrderStatus
  label: string
  icon: typeof Clock
}

const STEPS: StepConfig[] = [
  { key: 'pending', label: 'Diajukan', icon: Clock },
  { key: 'reviewed', label: 'Ditinjau', icon: CheckCircle2 },
  { key: 'contacted', label: 'Dihubungi', icon: PhoneCall },
  { key: 'survey', label: 'Survei / Temu Teknis', icon: Calendar },
  { key: 'deal', label: 'Kesepakatan / MoU', icon: Handshake },
  { key: 'completed', label: 'Selesai', icon: CheckCheck },
]

export function OrderTimeline({
  currentStatus,
  logs = [],
}: {
  currentStatus: OrderStatus
  logs?: OrderLogItem[]
}) {
  if (currentStatus === 'rejected') {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-center">
        <XCircle className="mx-auto h-10 w-10 text-red-400 mb-2" />
        <h4 className="text-base font-semibold text-red-300">Permohonan Tidak Dapat Dilanjutkan</h4>
        <p className="text-sm text-red-200/80 mt-1">
          {logs[logs.length - 1]?.notes || 'Permohonan ditolak atau dibatalkan oleh tim pengelola.'}
        </p>
      </div>
    )
  }

  const currentIndex = STEPS.findIndex((s) => s.key === currentStatus)

  return (
    <div className="w-full py-4">
      {/* Stepper Progress Bar */}
      <div className="grid grid-cols-6 gap-2">
        {STEPS.map((step, idx) => {
          const Icon = step.icon
          const isDone = idx < currentIndex
          const isCurrent = idx === currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCurrent
                    ? 'border-sky-600 bg-sky-600 text-white ring-4 ring-sky-500/25 scale-110 shadow-md'
                    : isDone
                    ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-xs'
                    : 'border-slate-200 bg-slate-100 text-slate-400'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={cn(
                  'mt-2 text-[11px] leading-tight font-medium',
                  isCurrent ? 'text-sky-700 font-bold' : isDone ? 'text-slate-800 font-semibold' : 'text-slate-400'
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Log Riwayat Terbaru */}
      {logs.length > 0 && (
        <div className="mt-8 space-y-3 border-t border-slate-200 pt-6">
          <h5 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Riwayat Tindak Lanjut:
          </h5>
          {logs.map((log) => (
            <div
              key={log.id}
              className="rounded-xl bg-slate-50 border border-slate-200/90 p-3.5 text-sm flex gap-3 shadow-xs"
            >
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap mt-0.5">
                {new Date(log.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <div className="flex-1 text-slate-700">
                <p className="leading-relaxed">{log.notes}</p>
                <span className="text-[11px] text-sky-700 font-medium mt-1 block">Oleh: {log.operatorName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
