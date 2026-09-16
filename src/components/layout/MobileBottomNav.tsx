'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Compass, PackageSearch, User, Handshake } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { mobileNavIcon } from '@/lib/utils/motionVariants'

const NAV_ITEMS = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Katalog', href: '/katalog', icon: Compass },
  { label: 'Pengajuan', href: '/inquiry', icon: Handshake },
  { label: 'Lacak', href: '/tracking', icon: PackageSearch },
  { label: 'Portal', href: '/portal', icon: User },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="stp-mobile-nav md:hidden">
      <div className="flex items-stretch justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn('mobile-nav-item', isActive && 'active')}
            >
              {/* Icon wrapper dengan spring active indicator */}
              <div className="nav-icon-wrap">
                {/* Active background blob — layoutId untuk spring transition */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="mobile-nav-active-bg"
                      className="absolute inset-0 rounded-xl bg-sky-100/80 border border-sky-200/60"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                {/* Icon dengan scale spring saat aktif */}
                <motion.div
                  variants={mobileNavIcon}
                  animate={isActive ? 'active' : 'inactive'}
                  className="relative z-10"
                >
                  <Icon
                    className={cn(
                      'h-[1.125rem] w-[1.125rem] transition-colors duration-150',
                      isActive ? 'text-sky-700' : 'text-slate-400'
                    )}
                  />
                </motion.div>
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] leading-none transition-colors duration-150',
                  isActive ? 'text-sky-700 font-bold' : 'text-slate-400 font-medium'
                )}
              >
                {item.label}
              </span>

              {/* Active dot indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    key="dot"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-sky-500"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
