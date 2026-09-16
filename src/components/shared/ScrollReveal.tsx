'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { scrollRevealUp, scrollRevealLeft, scrollRevealRight, scrollRevealContainer } from '@/lib/utils/motionVariants'
import type { Variants } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  /** Arah reveal: 'up' (default) | 'left' | 'right' | 'container' */
  direction?: 'up' | 'left' | 'right' | 'container'
  /** Delay sebelum animasi mulai (ms) */
  delay?: number
  /** Jarak dari tepi viewport sebelum trigger */
  margin?: string
  /** Hanya animasi satu kali saja */
  once?: boolean
}

const DIRECTION_MAP: Record<string, Variants> = {
  up:        scrollRevealUp,
  left:      scrollRevealLeft,
  right:     scrollRevealRight,
  container: scrollRevealContainer,
}

/**
 * ScrollReveal
 * Membungkus elemen untuk animasi muncul saat masuk viewport.
 *
 * Penggunaan:
 * ```tsx
 * <ScrollReveal direction="up" delay={100}>
 *   <div>Konten yang muncul saat di-scroll</div>
 * </ScrollReveal>
 * ```
 */
export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  margin = '-80px',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: margin as any })

  const variants = DIRECTION_MAP[direction]

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="offscreen"
      animate={isInView ? 'onscreen' : 'offscreen'}
      transition={{ delay: delay / 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** ScrollReveal khusus untuk section container dengan stagger children */
export function ScrollRevealGroup({
  children,
  className,
  margin = '-60px',
  once = true,
}: Omit<ScrollRevealProps, 'direction' | 'delay'>) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: margin as any })

  return (
    <motion.div
      ref={ref}
      variants={scrollRevealContainer}
      initial="offscreen"
      animate={isInView ? 'onscreen' : 'offscreen'}
      className={className}
    >
      {children}
    </motion.div>
  )
}
