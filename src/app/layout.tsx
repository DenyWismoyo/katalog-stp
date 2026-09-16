import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { Footer } from '@/components/layout/Footer'
import { QueryProvider } from '@/components/providers/QueryProvider'

/**
 * Inter — font utama body text (weights: 400-900)
 * next/font/google untuk zero CLS dan optimal loading (self-hosted di production)
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

/**
 * Plus Jakarta Sans — font display untuk heading dan judul
 * Premium geometric sans, cocok untuk look teknologi modern
 */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Katalog Digital Solo Technopark | Pusat Riset & Inovasi Teknologi',
  description:
    'Etalase resmi produk inovasi teknologi, hasil riset terapan, profil startup inkubasi, dan layanan pengujian laboratorium kawasan Solo Technopark (STP), Surakarta.',
  keywords: [
    'Solo Technopark',
    'Katalog Inovasi STP',
    'Riset Terapan Surakarta',
    'CNC Manufaktur',
    'Underwater Wet Welding',
    'Inkubasi Startup',
    'Teknologi Solo',
    'e-Katalog LKPP',
  ],
  authors: [{ name: 'Solo Technopark (STP)' }],
  openGraph: {
    title: 'Katalog Digital Solo Technopark',
    description: 'Etalase resmi inovasi teknologi & riset terapan Solo Technopark, Surakarta.',
    siteName: 'Katalog Digital STP',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={`light scroll-smooth ${inter.variable} ${plusJakartaSans.variable}`}
    >
      <body
        className="min-h-screen flex flex-col bg-[--bg-canvas] text-[--text-body] antialiased"
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
      >
        <QueryProvider>
          {/* Header Navigasi */}
          <Navbar />

          {/* Konten Utama */}
          <div className="flex-1 w-full">
            {children}
          </div>

          {/* Footer */}
          <Footer />

          {/* Mobile Bottom Nav — fixed di bawah layar */}
          <MobileBottomNav />
        </QueryProvider>
      </body>
    </html>
  )
}
