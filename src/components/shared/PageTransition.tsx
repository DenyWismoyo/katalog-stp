'use client'

import { motion } from 'framer-motion'
import { pageTransition } from '@/lib/utils/motionVariants'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

/**
 * PageTransition
 * Bungkus setiap halaman dengan komponen ini untuk page transition yang mulus.
 * Gunakan bersama AnimatePresence di root layout.
 *
 * Penggunaan:
 * ```tsx
 * export default function MyPage() {
 *   return (
 *     <PageTransition>
 *       <main>...</main>
 *     </PageTransition>
 *   )
 * }
 * ```
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}
