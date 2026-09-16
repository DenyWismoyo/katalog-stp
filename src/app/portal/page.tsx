'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createSessionAction } from '@/lib/auth/session'
import { DEMO_ACCOUNTS } from '@/lib/auth/constants'
import {
  KeyRound,
  ArrowLeft,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react'

function PortalLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPath = searchParams.get('from')

  const [roleTab, setRoleTab] = useState<'user' | 'operator' | 'admin'>('operator')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg(null)

    const res = await createSessionAction(email, password, roleTab)

    if (res.success && res.redirectTo) {
      router.push(fromPath || res.redirectTo)
      router.refresh()
    } else {
      setErrorMsg(res.error || 'Autentikasi gagal.')
      setIsLoading(false)
    }
  }

  const fillDemo = (role: 'admin' | 'operator' | 'user') => {
    if (role === 'admin') {
      setRoleTab('admin')
      setEmail('admin@solotechpark.id')
      setPassword(DEMO_ACCOUNTS['admin@solotechpark.id'].pass)
    } else if (role === 'operator') {
      setRoleTab('operator')
      setEmail('operator@solotechpark.id')
      setPassword(DEMO_ACCOUNTS['operator@solotechpark.id'].pass)
    } else {
      setRoleTab('user')
      setEmail('mitra@industri.id')
      setPassword(DEMO_ACCOUNTS['mitra@industri.id'].pass)
    }
    setErrorMsg(null)
  }

  return (
    <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-md">
      {/* Header Icon */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 mb-1">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Portal Akses Solo Technopark
        </h1>
        <p className="text-xs text-slate-600">
          Masuk ke panel internal sesuai peran Anda di ekosistem Solo Technopark
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setRoleTab('user')
            setErrorMsg(null)
          }}
          className={`py-2 rounded-lg transition-all ${
            roleTab === 'user' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mitra / User
        </button>
        <button
          type="button"
          onClick={() => {
            setRoleTab('operator')
            setErrorMsg(null)
          }}
          className={`py-2 rounded-lg transition-all ${
            roleTab === 'operator' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Operator
        </button>
        <button
          type="button"
          onClick={() => {
            setRoleTab('admin')
            setErrorMsg(null)
          }}
          className={`py-2 rounded-lg transition-all ${
            roleTab === 'admin' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Admin STP
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">Alamat Email:</label>
          <Input
            type="email"
            placeholder={roleTab === 'admin' ? 'admin@solotechpark.id' : 'operator@solotechpark.id'}
            icon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 block mb-1.5">Kata Sandi:</label>
          <Input
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memverifikasi Akses...</span>
            </>
          ) : (
            <span>
              Masuk sebagai{' '}
              {roleTab === 'admin'
                ? 'Administrator'
                : roleTab === 'operator'
                ? 'Operator Layanan'
                : 'Mitra Industri'}
            </span>
          )}
        </Button>
      </form>

      {/* Quick Demo Fill Buttons for Testing */}
      <div className="mt-6 pt-5 border-t border-slate-200">
        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-500" />
            <span className="font-medium">Akun Demo Cepat (1-Klik):</span>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('admin')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-[11px] text-slate-700 hover:text-sky-700 font-medium transition-colors"
          >
            Admin STP
          </button>
          <button
            type="button"
            onClick={() => fillDemo('operator')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-[11px] text-slate-700 hover:text-sky-700 font-medium transition-colors"
          >
            Operator
          </button>
          <button
            type="button"
            onClick={() => fillDemo('user')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-[11px] text-slate-700 hover:text-sky-700 font-medium transition-colors"
          >
            Mitra / User
          </button>
        </div>
      </div>

      <div className="mt-5 text-center text-xs text-slate-500 space-y-2">
        <div>
          Belum memiliki akun mitra?{' '}
          <Link href="/daftar" className="text-sky-600 hover:text-sky-700 font-semibold">
            Daftar Mitra Baru &rarr;
          </Link>
        </div>
        <div>
          <Link href="/tracking" className="text-slate-500 hover:text-slate-700 inline-block font-medium">
            Lacak permohonan menggunakan nomor resi &rarr;
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default function PortalLoginPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      <Suspense
        fallback={
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-sm">
            Memuat portal...
          </div>
        }
      >
        <PortalLoginForm />
      </Suspense>
    </main>
  )
}
