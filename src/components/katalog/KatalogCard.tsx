'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { KatalogItem } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { ArrowRight, FileText, CheckCircle, Star } from 'lucide-react'
import { cardHover, popIn, springSnappy } from '@/lib/utils/motionVariants'

export function KatalogCard({ item }: { item: KatalogItem }) {
  return (
    <motion.div
      className="group flex flex-col h-full bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm cursor-pointer"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.99 }}
    >
      <Link href={`/katalog/${item.slug}`} className="flex flex-col h-full">
        {/* Visual Header / Cover Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <motion.div
            className="absolute inset-0"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.06, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            <Image
              src={
                item.coverUrl ||
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop'
              }
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="card-image-overlay" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <motion.div variants={popIn} initial="hidden" animate="visible" transition={{ delay: 0.05 }}>
              <Badge variant="sky" size="sm">
                TRL {item.trl}
              </Badge>
            </motion.div>
            {item.isFeatured && (
              <motion.div variants={popIn} initial="hidden" animate="visible" transition={{ delay: 0.12 }}>
                <Badge variant="gold" size="sm">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Unggulan
                </Badge>
              </motion.div>
            )}
          </div>

          {/* HAKI Status Tag */}
          {item.hakiStatus === 'granted' && (
            <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
              <CheckCircle className="h-3 w-3 text-emerald-600" />
              <span>HAKI Terdaftar</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-1 justify-between">
          <div>
            <span className="stp-label-eyebrow block mb-1">{item.tenantName}</span>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors duration-200 line-clamp-1 tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {item.tagline}
            </p>
          </div>

          {/* Card Footer */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              <span>{item.specifications?.length || 0} Spesifikasi</span>
            </span>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-600">
              <span>Detail</span>
              <motion.div
                variants={{
                  rest: { x: 0 },
                  hover: { x: 4, transition: springSnappy },
                }}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
