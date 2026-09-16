import Link from 'next/link'
import { MapPin, Phone, Mail, Sparkles, ExternalLink } from 'lucide-react'

const FOOTER_LINKS = [
  {
    title: 'Jelajahi Inovasi',
    links: [
      { label: 'Semua Produk & Riset', href: '/katalog' },
      { label: '8 Klaster Teknologi', href: '/#klaster' },
      { label: 'Direktori Tenant Binaan', href: '/tenant' },
      { label: 'Pengajuan Kerjasama', href: '/inquiry' },
      { label: 'Lacak Resi Permohonan', href: '/tracking' },
    ],
  },
  {
    title: 'Layanan Kawasan',
    links: [
      { label: 'Pusat Diklat & Sertifikasi CNC', href: '/fasilitas' },
      { label: 'Lab Uji Las Bawah Air', href: '/fasilitas' },
      { label: 'Lab AI, IoT & Cyber Security', href: '/fasilitas' },
      { label: 'Inkubasi Bisnis & Hilirisasi BRIN', href: '/inquiry' },
      { label: 'Sewa Coworking & Hall Konvensi', href: '/fasilitas' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white pb-24 md:pb-0 text-slate-600">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />

      <div className="stp-container pt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10">
          {/* Kolom 1: Profil STP */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 font-bold text-base">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white text-xs font-black shadow-md shadow-sky-600/20 shrink-0">
                STP
              </div>
              <div className="leading-tight">
                <span className="block font-bold text-slate-900 text-sm">Solo Technopark</span>
                <span className="text-[10px] text-sky-600 font-semibold">Pusat Inovasi & Riset Terapan</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Kawasan Sains dan Teknologi berstandar internasional di Kota Surakarta yang memfasilitasi
              riset terapan, inkubasi startup teknologi, dan pengujian industri manufaktur.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-semibold">
                ISO 9001
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-[10px] text-sky-700 font-semibold">
                Kemenristek/BRIN
              </span>
            </div>
          </div>

          {/* Kolom 2 & 3: Navigation */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-slate-900 font-bold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 hover:text-sky-600 transition-colors duration-150 flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Kolom 4: Kontak */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-sm mb-4">Kontak & Lokasi</h4>

            <div className="flex items-start gap-2.5 text-xs text-slate-500">
              <MapPin className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Jl. Ki Hajar Dewantara No. 19, Jebres,<br />
                Kota Surakarta, Jawa Tengah 57126
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <Phone className="h-4 w-4 text-sky-500 shrink-0" />
              <a href="tel:02716488" className="hover:text-sky-600 transition-colors">(0271) 648588</a>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-slate-500">
              <Mail className="h-4 w-4 text-sky-500 shrink-0" />
              <a href="mailto:info@solotechpark.id" className="hover:text-sky-600 transition-colors">
                info@solotechpark.id
              </a>
            </div>

            <a
              href="https://solotechpark.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 font-semibold transition-colors mt-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              solotechpark.id
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3 pb-6">
          <p>
            © {new Date().getFullYear()} Solo Technopark (STP) Surakarta.
            <span className="hidden sm:inline"> Hak Cipta Dilindungi Undang-Undang.</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium text-slate-500">
              Standar TRL Kemenristek/BRIN
            </span>
            <span className="text-slate-300">•</span>
            <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100 font-medium">
              Pemkot Surakarta
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
