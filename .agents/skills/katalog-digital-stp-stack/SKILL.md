---
name: katalog-digital-stp-stack
description: Cheatsheet lengkap stack, arsitektur 6 layer, Server Actions order pipeline, TanStack Query hooks, dan reusable UI components (Mobile-First Bottom Nav & Desktop Split-View) untuk proyek Katalog Digital STP.
---

# 🚀 Skill Cheatsheet: Katalog Digital STP Stack

Panduan cepat untuk mengimplementasikan fitur pada proyek **Katalog Digital Solo Technopark** mengikuti pola **Arsitektur 6 Layer** dengan dukungan 3 Role (**Admin**, **Operator**, dan **User Biasa**).

---

## 1. Quick Reference: Pola 6 Layer

```
1. types/        -> Definisi TypeScript interface (KatalogItem, Tenant, OrderInquiryItem, UserProfile)
2. lib/firebase/ -> Firebase client/admin config (katalog-stp DB) & storage helpers (katalog-stp/ namespace)
3. actions/      -> 'use server' Server Actions untuk Write (saveKatalog, submitOrder, updateOrderStatus)
4. hooks/        -> TanStack Query hooks untuk Read (useKatalogList, useOrderList, useOrderTracking)
5. components/   -> ui/ (primitives), layout/ (MobileBottomNav, Navbar), shared/ (OrderTimeline), katalog/, order/
6. app/          -> Next.js App Router pages (Thin orchestrators, route protection)
```

---

## 2. Server Action: Order Ingestion & Operator Pipeline (`src/actions/order.ts`)

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { adminDb } from '@/lib/firebase/admin'
import { OrderInquiryItem, OrderStatus, OrderLogItem } from '@/types'

// 1. Publik / User Biasa: Mengajukan permohonan kerjasama baru
export async function submitOrderAction(payload: Omit<OrderInquiryItem, 'id' | 'trackingCode' | 'status' | 'createdAt' | 'updatedAt'>) {
  try {
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '')
    const trackingCode = `STP-ORD-${yearMonth}-${randomDigits}`
    
    const docRef = adminDb.collection('orders_inquiries').doc()
    const now = new Date().toISOString()

    const newOrder: OrderInquiryItem = {
      ...payload,
      id: docRef.id,
      trackingCode,
      status: 'pending',
      priority: payload.priority || 'normal',
      createdAt: now,
      updatedAt: now,
    }

    await docRef.set(newOrder)

    // Catat log inisialisasi
    await docRef.collection('logs').add({
      orderId: docRef.id,
      operatorId: 'system',
      operatorName: 'Sistem Portal STP',
      actionType: 'status_change',
      newStatus: 'pending',
      notes: 'Permohonan berhasil diterima oleh sistem dan masuk antrean operator.',
      isPublicToUser: true,
      createdAt: now,
    } as OrderLogItem)

    revalidatePath('/tracking')
    return { success: true, data: { id: docRef.id, trackingCode } }
  } catch (err: any) {
    console.error('submitOrderAction error:', err)
    return { success: false, error: err.message || 'Gagal mengajukan permohonan' }
  }
}

// 2. Role Operator: Memperbarui status alur pesanan
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
  operatorId: string,
  operatorName: string,
  notes: string,
  isPublicToUser: boolean = true
) {
  try {
    const orderRef = adminDb.collection('orders_inquiries').doc(orderId)
    const snap = await orderRef.get()
    if (!snap.exists) return { success: false, error: 'Pesanan tidak ditemukan' }

    const oldData = snap.data() as OrderInquiryItem
    const now = new Date().toISOString()

    await orderRef.update({
      status: newStatus,
      updatedAt: now,
      ...(newStatus === 'completed' || newStatus === 'rejected' ? { closedAt: now } : {}),
    })

    // Tambahkan log tindak lanjut
    await orderRef.collection('logs').add({
      orderId,
      operatorId,
      operatorName,
      actionType: 'status_change',
      previousStatus: oldData.status,
      newStatus,
      notes,
      isPublicToUser,
      createdAt: now,
    } as OrderLogItem)

    revalidatePath('/orders')
    revalidatePath(`/tracking/${oldData.trackingCode}`)

    return { success: true }
  } catch (err: any) {
    console.error('updateOrderStatusAction error:', err)
    return { success: false, error: err.message || 'Gagal memperbarui status' }
  }
}
```

---

## 3. Custom Hook: Pelacakan Resi Publik (`src/hooks/useOrderTracking.ts`)

```typescript
import { useQuery } from '@tanstack/react-query'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { OrderInquiryItem, OrderLogItem } from '@/types'

export function useOrderTracking(trackingCode?: string) {
  return useQuery({
    queryKey: ['order', 'tracking', trackingCode],
    queryFn: async (): Promise<{ order: OrderInquiryItem; logs: OrderLogItem[] } | null> => {
      if (!trackingCode) return null

      const q = query(
        collection(db, 'orders_inquiries'),
        where('trackingCode', '==', trackingCode.trim().toUpperCase())
      )

      const snap = await getDocs(q)
      if (snap.empty) return null

      const doc = snap.docs[0]
      const order = { id: doc.id, ...doc.data() } as OrderInquiryItem

      // Ambil log yang bersifat publik untuk user
      const logsSnap = await getDocs(
        query(
          collection(db, `orders_inquiries/${doc.id}/logs`),
          where('isPublicToUser', '==', true),
          orderBy('createdAt', 'asc')
        )
      )

      const logs = logsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as OrderLogItem)

      return { order, logs }
    },
    enabled: !!trackingCode && trackingCode.length >= 8,
    staleTime: 1000 * 30, // 30 detik
  })
}
```

---

## 4. Reusable Component: Mobile Bottom Navigation Bar (`src/components/layout/MobileBottomNav.tsx`)

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PackageSearch, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Katalog', href: '/katalog', icon: Compass },
    { label: 'Lacak', href: '/tracking', icon: PackageSearch },
    { label: 'Akun', href: '/portal', icon: User },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/85 backdrop-blur-lg border-t border-slate-800/80 px-4 py-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center min-w-[56px] py-1 text-xs font-medium transition-colors',
                isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-1 transition-transform', isActive && 'scale-110')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
```

---

## 5. Reusable Component: Timeline Pelacakan Pesanan (`src/components/order/OrderTimeline.tsx`)

```typescript
import { OrderStatus, OrderLogItem } from '@/types'
import { CheckCircle2, Clock, PhoneCall, Calendar, Handshake, CheckCheck, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const STEPS: Array<{ key: OrderStatus; label: string; icon: any }> = [
  { key: 'pending', label: 'Diajukan', icon: Clock },
  { key: 'reviewed', label: 'Ditinjau', icon: CheckCircle2 },
  { key: 'contacted', label: 'Dihubungi', icon: PhoneCall },
  { key: 'survey', label: 'Survei / Temu Teknis', icon: Calendar },
  { key: 'deal', label: 'Kesepakatan / MoU', icon: Handshake },
  { key: 'completed', label: 'Selesai', icon: CheckCheck },
]

export function OrderTimeline({ currentStatus, logs = [] }: { currentStatus: OrderStatus; logs?: OrderLogItem[] }) {
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
          const isDone = idx <= currentIndex
          const isCurrent = idx === currentIndex

          return (
            <div key={step.key} className="flex flex-col items-center text-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isDone
                    ? 'border-sky-500 bg-sky-500/20 text-sky-400 shadow-md shadow-sky-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-600',
                  isCurrent && 'ring-4 ring-sky-500/30 scale-110'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn('mt-2 text-[11px] leading-tight font-medium', isDone ? 'text-slate-200' : 'text-slate-500')}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Log Riwayat Terbaru */}
      {logs.length > 0 && (
        <div className="mt-8 space-y-3 border-t border-slate-800 pt-6">
          <h5 className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Riwayat Tindak Lanjut:</h5>
          {logs.map((log) => (
            <div key={log.id} className="rounded-lg bg-slate-900/60 border border-slate-800 p-3 text-sm flex gap-3">
              <span className="text-xs text-slate-500 whitespace-nowrap mt-0.5">
                {new Date(log.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="flex-1 text-slate-300">
                <p>{log.notes}</p>
                <span className="text-[11px] text-sky-400/80 mt-1 block">Oleh: {log.operatorName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 6. Pola Ketahanan Clario Cloud AI (Resilient Multi-Model Fallback)

Saat berkonsultasi ke Clario Cloud AI (`https://clario.apicloud.my.id/v1`), model upstream seperti Opus dapat sewaktu-waktu mengalami lonjakan beban (*503 Upstream Overload*). Terapkan pola fallback berantai:

```typescript
const CLARIO_MODELS_FALLBACK = [
  'clario/claude-opus-5',        // Prioritas 1: Analisis arsitektur mendalam
  'clario/gpt-5.6-sol',          // Prioritas 2: Presisi tinggi & penalaran cepat
  'clario/deepseek-v4-pro-0813', // Prioritas 3: Reasoning & review kode TypeScript
  'clario/glm-5.3',              // Prioritas 4: Kapasitas throughput stabil
]
```
Jika model utama mengembalikan status HTTP 503 atau timeout, sistem secara otomatis beralih ke model berikutnya dalam daftar tanpa menghentikan proses kerja pengembang.

