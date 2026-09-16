'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProblemChallengeItem, URGENCY_LABELS, PROBLEM_STATUS_LABELS } from '@/types'
import { cardHover, springSnappy } from '@/lib/utils/motionVariants'
import {
  Lightbulb,
  Building2,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
  Users,
  ShieldCheck,
  Briefcase,
} from 'lucide-react'

interface ProblemCardProps {
  problem: ProblemChallengeItem
}

const URGENCY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  kritis: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  tinggi: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  sedang: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  rendah: { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' },
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const urgencyStyle = URGENCY_STYLES[problem.urgency] || URGENCY_STYLES.sedang

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="stp-card-interactive rounded-2xl bg-white border border-slate-200/90 flex flex-col justify-between overflow-hidden shadow-xs hover:border-sky-300 transition-colors"
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header Badges: Klaster & Urgensi */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 inline-flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5 text-sky-600" />
            <span>{problem.klasterId.replace('-', ' ')}</span>
          </span>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${urgencyStyle.bg} ${urgencyStyle.text} ${urgencyStyle.border} inline-flex items-center gap-1`}
          >
            <AlertCircle className="h-3 w-3" />
            <span>{URGENCY_LABELS[problem.urgency]}</span>
          </span>
        </div>

        {/* Title */}
        <Link href={`/tantangan/${problem.slug}`} className="block group">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
            {problem.title}
          </h3>
        </Link>

        {/* Organization / Submitter */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {problem.isAnonymous
              ? 'Mitra Industri Terverifikasi (Kerahasiaan Dilindungi)'
              : problem.organizationName}
          </span>
        </div>

        {/* Impact Statement */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
          <strong className="text-slate-800 font-semibold block mb-0.5">Hambatan Lapangan:</strong>
          {problem.impactStatement}
        </p>

        {/* Expected Solution */}
        <div className="text-xs text-slate-700 flex items-start gap-2">
          <FileText className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
          <span className="line-clamp-2 font-medium">
            <strong className="text-slate-900 font-semibold">Bentuk Solusi: </strong>
            {problem.expectedSolutionType}
          </span>
        </div>
      </div>

      {/* Footer Info & Action */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-sky-600" />
            <span>{problem.solutionProposalsCount} Solusi Diajukan</span>
          </span>
          {problem.targetTimeline && (
            <span className="hidden sm:inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{problem.targetTimeline}</span>
            </span>
          )}
        </div>

        <Link
          href={`/tantangan/${problem.slug}`}
          className="inline-flex items-center gap-1.5 font-bold text-sky-700 hover:text-sky-800 transition-colors group"
        >
          <span>Buka Tantangan</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  )
}
