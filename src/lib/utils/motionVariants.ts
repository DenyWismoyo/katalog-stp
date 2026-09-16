/**
 * motionVariants.ts
 * Library sentral Framer Motion variants untuk Katalog Digital STP.
 * Semua animasi variants WAJIB didefinisikan di sini, bukan inline di komponen.
 */

import type { Variants, Transition } from 'framer-motion'

/* =========================================================================
   TRANSITIONS (Reusable Transition Configs)
   ========================================================================= */

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 28,
}

export const springGentle: Transition = {
  type: 'spring',
  stiffness: 250,
  damping: 30,
}

export const springBouncy: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 22,
}

export const tweenFast: Transition = {
  type: 'tween',
  duration: 0.15,
  ease: [0.4, 0, 0.2, 1],
}

export const tweenSmooth: Transition = {
  type: 'tween',
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1],
}

export const tweenSlow: Transition = {
  type: 'tween',
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
}

/* =========================================================================
   PAGE TRANSITIONS
   ========================================================================= */

/** Transisi masuk/keluar antar halaman */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
}

/* =========================================================================
   FADE & ENTRANCE VARIANTS
   ========================================================================= */

/** Fade in dari bawah — paling umum digunakan */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: tweenSmooth,
  },
}

/** Fade in dari atas */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: tweenSmooth,
  },
}

/** Fade in dari kiri */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: tweenSmooth,
  },
}

/** Fade in dari kanan */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: tweenSmooth,
  },
}

/** Fade in dengan scale — untuk modal, popup, badge */
export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: tweenSmooth,
  },
}

/** Pop dengan bounce — untuk badge, notifikasi, chip */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springBouncy,
  },
}

/* =========================================================================
   STAGGER CONTAINER VARIANTS
   ========================================================================= */

/** Container untuk stagger anak-anaknya */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

/** Container stagger yang lebih cepat */
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
}

/** Container stagger yang lebih lambat (hero sections) */
export const staggerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

/* =========================================================================
   CARD VARIANTS
   ========================================================================= */

/** Hover state untuk kartu interaktif */
export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
    borderColor: '#e2e8f0',
    transition: springGentle,
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.03), 0 8px 32px rgba(2, 132, 199, 0.18)',
    borderColor: 'rgba(2, 132, 199, 0.35)',
    transition: springSnappy,
  },
}

/** Tap / click feedback */
export const tapScale: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.97, transition: tweenFast },
}

/* =========================================================================
   MODAL / OVERLAY VARIANTS
   ========================================================================= */

/** Overlay gelap di belakang modal */
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

/** Panel modal — muncul dari tengah dengan scale */
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 16,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...springSnappy, duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

/** Bottom sheet mobile — slide dari bawah */
export const bottomSheetVariants: Variants = {
  hidden: {
    opacity: 0,
    y: '100%',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springGentle,
  },
  exit: {
    opacity: 0,
    y: '100%',
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

/** Drawer / side panel dari kanan */
export const drawerVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: springGentle,
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.22, ease: 'easeIn' },
  },
}

/* =========================================================================
   NAVBAR VARIANTS
   ========================================================================= */

/** Brand logo icon rotation on hover */
export const navLogoHover: Variants = {
  rest: { rotate: 0, scale: 1 },
  hover: {
    rotate: 15,
    scale: 1.1,
    transition: springBouncy,
  },
}

/** Nav link dropdown */
export const navDropdown: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnappy,
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: tweenFast,
  },
}

/** Mobile hamburger menu slide down */
export const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, height: 0, y: -10 },
  visible: {
    opacity: 1,
    height: 'auto',
    y: 0,
    transition: springGentle,
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -8,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
}

/* =========================================================================
   MOBILE NAV ITEM VARIANTS
   ========================================================================= */

/** Icon scale pada mobile nav item */
export const mobileNavIcon: Variants = {
  inactive: { scale: 1 },
  active: {
    scale: 1.15,
    transition: springBouncy,
  },
}

/* =========================================================================
   BUTTON VARIANTS
   ========================================================================= */

/** Button hover + tap */
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: springSnappy },
  tap: { scale: 0.97, transition: tweenFast },
}

/* =========================================================================
   SCROLL REVEAL VARIANTS
   ========================================================================= */

/** Elemen muncul saat masuk viewport */
export const scrollRevealUp: Variants = {
  offscreen: { opacity: 0, y: 28 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      bounce: 0.3,
      duration: 0.6,
    },
  },
}

export const scrollRevealLeft: Variants = {
  offscreen: { opacity: 0, x: -28 },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: tweenSlow,
  },
}

export const scrollRevealRight: Variants = {
  offscreen: { opacity: 0, x: 28 },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: tweenSlow,
  },
}

/** Stagger container untuk scroll reveal */
export const scrollRevealContainer: Variants = {
  offscreen: { opacity: 0 },
  onscreen: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

/* =========================================================================
   FILTER PILL ACTIVE INDICATOR (pakai layoutId)
   ========================================================================= */

/** Shared layout animation untuk active indicator pill */
export const filterIndicatorTransition: Transition = {
  type: 'spring',
  stiffness: 350,
  damping: 30,
}

/* =========================================================================
   HERO SECTION VARIANTS
   ========================================================================= */

export const heroContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

export const heroBadge: Variants = {
  hidden: { opacity: 0, y: -12, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnappy,
  },
}

export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...tweenSmooth, duration: 0.6 },
  },
}

export const heroSubtitle: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...tweenSmooth, duration: 0.55, delay: 0.05 },
  },
}

export const heroSearch: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springSnappy, delay: 0.1 },
  },
}

export const heroStats: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...tweenSmooth, delay: 0.2 },
  },
}

/* =========================================================================
   TOAST / NOTIFICATION
   ========================================================================= */

export const toastVariants: Variants = {
  hidden: { opacity: 0, y: -16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springSnappy,
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: tweenFast,
  },
}
