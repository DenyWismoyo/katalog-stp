'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { registerUserAction, RegisterUserPayload } from '@/lib/auth/session'
import {
  UserPlus,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  Building2,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<RegisterUserPayload>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    organizationName: '',
    organizationType: 'pt',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    if (formData.password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok dengan kata sandi yang dimasukkan.')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.')
      setIsLoading(false)
      return
    }

    const res = await registerUserAction(formData)

    if (res.success && res.redirectTo) {
      setSuccess(true)
      setTimeout(() => {
        router.push(res.redirectTo || '/tracking')
        router.refresh()
      }, 1200)
    } else {
      setErrorMessage(res.error || 'Pendaftaran akun gagal. Silakan coba kembali.')
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-lg pb-24">
      {/* Back Link */}
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Kembali ke Halaman Masuk Portal</span>
      </Link>

      <Card className="p-6 sm:p-8 bg-white border-slate-200/90 shadow-md">
        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 mb-1">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Daftar Akun Mitra Baru
          </h1>
          <p className="text-xs text-slate-600">
            Bergabung dengan ekosistem riset, kolaborasi teknologi, dan pengadaan inovasi Solo Technopark
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="p-4 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Pendaftaran berhasil! Mengalihkan ke portal Anda...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-700 block mb-1.5">Nama Lengkap *</label>
            <Input
              placeholder="Contoh: Ir. Budi Santoso"
              icon={<User className="h-4 w-4" />}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Alamat Email Resmi *</label>
              <Input
                type="email"
                placeholder="nama@instansi.id"
                icon={<Mail className="h-4 w-4" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Nomor WhatsApp / Telp *</label>
              <Input
                type="tel"
                placeholder="081234567890"
                icon={<Phone className="h-4 w-4" />}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Nama Lembaga / Perusahaan *</label>
              <Input
                placeholder="PT / Instansi / Universitas"
                icon={<Building2 className="h-4 w-4" />}
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Tipe Organisasi *</label>
              <select
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none"
                value={formData.organizationType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organizationType: e.target.value as RegisterUserPayload['organizationType'],
                  })
                }
              >
                <option value="pt">Perseroan Terbatas (PT)</option>
                <option value="cv">CV / Firma</option>
                <option value="bumn">BUMN / BUMD</option>
                <option value="pemerintah">Instansi Pemerintah</option>
                <option value="akademisi">Perguruan Tinggi / Riset</option>
                <option value="perorangan">Perorangan / Startup Mandiri</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Kata Sandi *</label>
              <Input
                type="password"
                placeholder="Minimal 6 karakter"
                icon={<Lock className="h-4 w-4" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1.5">Konfirmasi Sandi *</label>
              <Input
                type="password"
                placeholder="Ulangi kata sandi"
                icon={<Lock className="h-4 w-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-3 gap-2"
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mendaftarkan Akun...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Daftar Sebagai Mitra STP</span>
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-center text-xs text-slate-500">
          Sudah memiliki akun terdaftar?{' '}
          <Link href="/portal" className="text-sky-600 hover:text-sky-700 font-semibold ml-1">
            Masuk ke Portal &rarr;
          </Link>
        </div>
      </Card>
    </main>
  )
}
