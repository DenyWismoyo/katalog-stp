'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { KatalogItem } from '@/types'
import { KatalogCard } from './KatalogCard'
import { SearchX } from 'lucide-react'
import { staggerContainer, fadeInUp } from '@/lib/utils/motionVariants'

interface KatalogGridProps {
  items: KatalogItem[]
  isLoading?: boolean
}

/** Skeleton card — wajib warna TERANG sesuai tema putih bersih STP */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
      {/* Image placeholder */}
      <div className="aspect-[16/10] w-full rounded-xl skeleton" />
      <div className="space-y-2.5">
        {/* Tenant name */}
        <div className="h-2.5 w-1/4 rounded-full skeleton" />
        {/* Title */}
        <div className="h-5 w-3/4 rounded-lg skeleton" />
        {/* Tagline line 1 */}
        <div className="h-3 w-full rounded-lg skeleton" />
        {/* Tagline line 2 */}
        <div className="h-3 w-5/6 rounded-lg skeleton" />
      </div>
      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="h-3 w-16 rounded-lg skeleton" />
        <div className="h-3 w-12 rounded-lg skeleton" />
      </div>
    </div>
  )
}

export function KatalogGrid({ items, isLoading }: KatalogGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center my-8"
      >
        <SearchX className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-base font-bold text-slate-700">
          Tidak ada inovasi yang ditemukan
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
          Coba gunakan kata kunci pencarian yang lain atau pilih klaster teknologi yang berbeda.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            layout
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          >
            <KatalogCard item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
