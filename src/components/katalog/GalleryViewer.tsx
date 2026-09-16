'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { overlayVariants, modalVariants, springSnappy } from '@/lib/utils/motionVariants'

interface GalleryViewerProps {
  coverUrl: string
  galleryUrls?: string[]
  title: string
  trl: number
  isFeatured?: boolean
}

export function GalleryViewer({
  coverUrl,
  galleryUrls = [],
  title,
  trl,
  isFeatured,
}: GalleryViewerProps) {
  // Gabungkan coverUrl dengan galleryUrls (hilangkan duplikat)
  const allImages = Array.from(
    new Set([coverUrl, ...galleryUrls].filter(Boolean))
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const currentImage = allImages[activeIndex] || coverUrl

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <div className="space-y-3">
      {/* Main Image Viewport */}
      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-slate-200/90 bg-slate-100 shadow-md group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={currentImage}
              alt={`${title} - foto ${activeIndex + 1}`}
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex gap-2 z-10 pointer-events-none">
          <Badge variant="cyan" size="md">
            TRL {trl} (Katsinov)
          </Badge>
          {isFeatured && (
            <Badge variant="gold" size="md">
              ★ Unggulan STP
            </Badge>
          )}
        </div>

        {/* Maximize Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 hover:text-sky-600 hover:bg-white transition-colors shadow-sm z-10"
          title="Perbesar Tampilan Foto"
        >
          <Maximize2 className="h-4 w-4" />
        </motion.button>

        {/* Next / Prev overlay buttons if multi-image */}
        {allImages.length > 1 && (
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="p-2 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-sky-600 hover:text-white transition-colors shadow-md pointer-events-auto"
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="p-2 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-sky-600 hover:text-white transition-colors shadow-md pointer-events-auto"
            >
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          {allImages.map((img, idx) => {
            const isSelected = idx === activeIndex
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveIndex(idx)}
                className={`relative h-16 w-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                  isSelected
                    ? 'border-sky-600 ring-2 ring-sky-500/30 shadow-md shadow-sky-500/20'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal with AnimatePresence */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700 z-50 transition-colors"
            >
              <X className="h-6 w-6" />
            </motion.button>

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative max-w-5xl max-h-[85vh] w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentImage}
                    alt={title}
                    fill
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {allImages.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-sky-600 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-sky-600 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
