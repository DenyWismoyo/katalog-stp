'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  PackageSearch,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils/cn'
import { SESSION_COOKIE_NAME, SessionData } from '@/lib/auth/constants'
import { destroySessionAction } from '@/lib/auth/session'
import {
  navLogoHover,
  mobileMenuVariants,
  fadeInDown,
  staggerFast,
  springSnappy,
} from '@/lib/utils/motionVariants'

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Katalog', href: '/katalog' },
  { label: 'Tantangan Inovasi', href: '/tantangan' },
  { label: 'Fasilitas & Lab', href: '/fasilitas' },
  { label: 'Tenant', href: '/tenant' },
  { label: 'Pengajuan', href: '/inquiry' },
  { label: 'Lacak Resi', href: '/tracking' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<SessionData | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Deteksi scroll untuk efek shrink navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Tutup mobile menu saat route berubah
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Baca sesi dari cookie
  useEffect(() => {
    const cookies = document.cookie.split(';')
    const sessionCookie = cookies.find((c) =>
      c.trim().startsWith(`${SESSION_COOKIE_NAME}=`)
    )
    if (sessionCookie) {
      try {
        const val = decodeURIComponent(sessionCookie.split('=')[1])
        setSession(JSON.parse(val))
      } catch {
        setSession(null)
      }
    } else {
      setSession(null)
    }
  }, [pathname])

  const handleLogout = async () => {
    await destroySessionAction()
    setSession(null)
    router.push('/portal')
    router.refresh()
  }

  return (
    <>
      <motion.header
        className={cn(
          'sticky top-0 z-[var(--z-sticky)] w-full glass-header-clean transition-all duration-300',
          scrolled && 'shadow-md'
        )}
        animate={{
          height: scrolled ? 52 : 64,
        }}
        transition={springSnappy}
      >
        <div className="stp-container h-full flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 p-0.5 shadow-md shadow-sky-600/20 group-hover:shadow-sky-600/35 transition-shadow">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <motion.div
                  variants={navLogoHover}
                  initial="rest"
                  whileHover="hover"
                >
                  <Sparkles className="h-4.5 w-4.5 text-sky-600" />
                </motion.div>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                SOLO TECHNOPARK
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 leading-tight">
                  KATALOG
                </span>
              </span>
              <span className="text-[10px] text-slate-500 block -mt-0.5">
                Pusat Inovasi & Riset Terapan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation — active indicator pakai layoutId */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors duration-150',
                    isActive
                      ? 'text-sky-700'
                      : 'text-slate-600 hover:text-sky-700 hover:bg-slate-100/70'
                  )}
                >
                  {/* Active background indicator dengan layoutId spring */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-bg"
                      className="absolute inset-0 rounded-xl bg-sky-50 border border-sky-200/70"
                      style={{ zIndex: -1 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Lacak (desktop) */}
            <Link href="/tracking" className="hidden lg:inline-flex">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <PackageSearch className="h-4 w-4 text-sky-600" />
                <span>Lacak Pesanan</span>
              </Button>
            </Link>

            {/* Session actions */}
            {session ? (
              <div className="flex items-center gap-2">
                <Link href={session.role === 'admin' ? '/admin' : '/operator/orders'}>
                  <Button variant="primary" size="sm" className="gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {session.role === 'admin' ? 'Studio Admin' : 'Kelola Order'}
                    </span>
                    <Badge
                      variant={session.role === 'admin' ? 'purple' : 'sky'}
                      size="sm"
                      className="ml-0.5 uppercase text-[9px] px-1.5 py-0"
                    >
                      {session.role}
                    </Badge>
                  </Button>
                </Link>
                <motion.button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 shadow-xs transition-colors"
                  title="Keluar Sesi"
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            ) : (
              <Link href="/portal">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Masuk Portal</span>
                </Button>
              </Link>
            )}

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-xs"
              whileTap={{ scale: 0.92 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="md:hidden fixed inset-0 z-[var(--z-overlay)] bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.nav
              key="mobile-menu"
              className="md:hidden fixed top-[64px] left-0 right-0 z-[var(--z-modal)] bg-white border-b border-slate-200 shadow-xl px-4 py-4"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="flex flex-col gap-1"
                variants={staggerFast}
                initial="hidden"
                animate="visible"
              >
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href)
                  return (
                    <motion.div key={link.href} variants={fadeInDown}>
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                          isActive
                            ? 'bg-sky-50 text-sky-700 border border-sky-200/60'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-sky-700'
                        )}
                      >
                        {link.label}
                        {isActive && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-500" />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
