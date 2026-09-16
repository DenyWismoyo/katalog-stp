'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CountUpProps {
  /** Nilai target angka */
  to: number
  /** Suffix setelah angka (misal: '+', '%', 'x') */
  suffix?: string
  /** Prefix sebelum angka (misal: 'Rp') */
  prefix?: string
  /** Durasi animasi count-up dalam ms */
  duration?: number
  /** Class Tailwind untuk styling */
  className?: string
  /** Tampilkan format dengan separator ribuan */
  separator?: boolean
}

/**
 * CountUp
 * Animasi angka yang naik dari 0 ke nilai target saat masuk viewport.
 * Menggunakan requestAnimationFrame untuk performa optimal.
 *
 * Penggunaan:
 * ```tsx
 * <CountUp to={45} suffix="+" className="text-4xl font-black text-sky-700" />
 * ```
 */
export function CountUp({
  to,
  suffix = '',
  prefix = '',
  duration = 1800,
  className,
  separator = false,
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const [hasRun, setHasRun] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!isInView || hasRun) return
    setHasRun(true)

    const startTime = performance.now()
    const startValue = 0

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const currentValue = Math.round(startValue + (to - startValue) * easedProgress)
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, hasRun, to, duration])

  const displayValue = separator
    ? count.toLocaleString('id-ID')
    : count.toString()

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
