'use server'

import {
  ProblemChallengeItem,
  SolutionProposalItem,
  ProblemFilterParams,
  ServerActionResult,
} from '@/types'
import { adminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin'

/**
 * Generate kode resi khusus pengajuan masalah/tantangan
 * Format: STP-PRB-YYYYMM-XXXX
 */
function generateProblemTrackingCode(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `STP-PRB-${year}${month}-${random}`
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * DEMO FALLBACK DATA
 * Menyediakan contoh tantangan industri nyata yang representatif bagi klaster STP
 */
const DEMO_PROBLEMS: ProblemChallengeItem[] = [
  {
    id: 'prb-001',
    trackingCode: 'STP-PRB-202609-8F2A',
    title: 'Sistem Computer Vision Deteksi Cacat Motif & Kerapatan Kain Tenun Tradisional',
    slug: 'deteksi-cacat-kain-tenun-computer-vision',
    klasterId: 'ai-software',
    organizationName: 'Asosiasi Perajin Batik & Tenun Surakarta',
    organizationType: 'umkm',
    isAnonymous: false,
    contactPerson: 'H. Sudarsono',
    contactEmail: 'kerjasama@tenunsolo.org',
    contactPhone: '081298765432',
    description:
      'Proses quality control (QC) pada kain tenun dan batik cap presisi saat ini masih 100% mengandalkan mata manusia selama 8 jam kerja. Hal ini menimbulkan tingkat human error hingga 12% pada cacat pergeseran motif dan kerapatan benang sebelum proses ekspor.',
    impactStatement:
      'Kerugian pengembalian barang ekspor mencapai Rp 350 juta per semester serta waktu inspeksi manual yang lambat (15 menit per lembar kain).',
    expectedSolutionType:
      'Perangkat kamera industri terintegrasi edge-AI (komputer mini) yang mampu memindai kain bergerak dan menandai lokasi cacat secara real-time dengan akurasi minimal 95%.',
    collaborationScheme: 'pilot_project',
    estimatedBudget: 'Rp 75.000.000 - Rp 150.000.000',
    urgency: 'tinggi',
    targetTimeline: '3-4 Bulan',
    status: 'open_for_solutions',
    solutionProposalsCount: 3,
    createdAt: '2026-09-05T08:30:00Z',
    updatedAt: '2026-09-12T14:15:00Z',
  },
  {
    id: 'prb-002',
    trackingCode: 'STP-PRB-202609-C39B',
    title: 'Pemesinan Presisi Sudu Turbin Pembangkit Listrik Pikohidro dari Bahan Komposit Tahan Korosi',
    slug: 'pemesinan-presisi-sudu-turbin-pikohidro',
    klasterId: 'manufaktur-cnc',
    organizationName: 'PT. Tirta Mandiri Energi Bersih',
    organizationType: 'pt',
    isAnonymous: false,
    contactPerson: 'Ir. Hendra Gunawan, MT',
    contactEmail: 'rnd@tirtamandiri.co.id',
    contactPhone: '081345678901',
    description:
      'Kami membutuhkan manufaktur sudu runner turbin vortex skala pikohidro (5 kW - 20 kW) untuk daerah 3T. Sudu konvensional dari besi cor mudah mengalami erosi kavitasi dalam 6 bulan pemakaian air sungai berlumpur.',
    impactStatement:
      'Biaya penggantian sudu impor sangat mahal dan waktu tunggu pengiriman suku cadang hingga 2 bulan menyebabkan turbin warga sering mati.',
    expectedSolutionType:
      'Prototipe sudu turbin hasil permesinan CNC 5-axis dari material stainless alloy atau komposit berkekuatan tinggi dengan toleransi dimensional di bawah 0.05 mm.',
    collaborationScheme: 'kontrak_riset',
    estimatedBudget: 'Rp 120.000.000 - Rp 250.000.000',
    urgency: 'kritis',
    targetTimeline: '2-3 Bulan',
    status: 'open_for_solutions',
    solutionProposalsCount: 2,
    createdAt: '2026-09-08T10:00:00Z',
    updatedAt: '2026-09-14T09:20:00Z',
  },
  {
    id: 'prb-003',
    trackingCode: 'STP-PRB-202609-D51E',
    title: 'Sistem Telemetri IoT Pemantauan Kualitas Air Sungai Bengawan Solo Berdaya Mandiri Surya',
    slug: 'iot-telemetri-kualitas-air-bengawan-solo',
    klasterId: 'smart-city-iot',
    organizationName: 'Dinas Lingkungan Hidup & Pengairan Wilayah Sungai',
    organizationType: 'pemerintah',
    isAnonymous: false,
    contactPerson: 'Dra. Endang Setyawati',
    contactEmail: 'pengairan@surakarta.go.id',
    contactPhone: '081122334455',
    description:
      'Pemantauan baku mutu air sungai (pH, Dissolved Oxygen, Kekeruhan/TDS, Suhu) saat ini dilakukan secara berkala 2 minggu sekali dengan pengambilan sampel manual. Diperlukan stasiun sensor apung mandiri surya yang mengirim data per 10 menit via LoRaWAN/GSM ke dashboard pemkot.',
    impactStatement:
      'Keterlambatan deteksi limbah industri liar yang dibuang malam hari menyebabkan pencemaran air baku PDAM dan kematian bibit ikan warga.',
    expectedSolutionType:
      'Buoy sensor apung waterproof IP68 bertenaga panel surya + baterai lifepo4, sensor multiparameter terkalibrasi, serta web dashboard alert dini terintegrasi WhatsApp API.',
    collaborationScheme: 'joint_development',
    estimatedBudget: 'Rp 80.000.000 - Rp 180.000.000',
    urgency: 'tinggi',
    targetTimeline: '3 Bulan',
    status: 'reviewing_solutions',
    solutionProposalsCount: 4,
    createdAt: '2026-09-02T11:45:00Z',
    updatedAt: '2026-09-15T16:00:00Z',
  },
  {
    id: 'prb-004',
    trackingCode: 'STP-PRB-202609-F90C',
    title: 'Manipulator Robot Bawah Air (ROV Tooling) untuk Inspeksi Tiang Pancang Jembatan',
    slug: 'manipulator-robot-rov-inspeksi-tiang-pancang',
    klasterId: 'underwater-welding',
    organizationName: 'PT. Infrastruktur Maritim Nusantara',
    organizationType: 'bumn',
    isAnonymous: true,
    contactPerson: 'Tim R&D Divisi Bawah Air',
    contactEmail: 'rov-tech@inframaritim.id',
    contactPhone: '082199887766',
    description:
      'Pekerjaan penyelaman inspeksi tiang pancang jembatan bentang panjang dan dermaga memiliki risiko tinggi akibat arus deras dan jarak pandang keruh (zero visibility). Dibutuhkan modul robotic arm & ultrasonic thickness gauge yang dapat dipasang pada ROV inspeksi.',
    impactStatement:
      'Penyelam komersial terbatas pada kedalaman dan waktu dekompresi, biaya sewa tim penyelam bersertifikat mencapai puluhan juta per hari.',
    expectedSolutionType:
      'Arm manipulator tahan tekanan air hingga kedalaman 50 meter dengan feedback kamera low-light dan probe pengukur ketebalan plat baja sisa.',
    collaborationScheme: 'kontrak_riset',
    estimatedBudget: 'Rp 200.000.000 - Rp 450.000.000',
    urgency: 'sedang',
    targetTimeline: '5-6 Bulan',
    status: 'open_for_solutions',
    solutionProposalsCount: 1,
    createdAt: '2026-09-10T13:10:00Z',
    updatedAt: '2026-09-11T09:00:00Z',
  },
]

export interface SubmitProblemPayload {
  title: string
  klasterId: ProblemChallengeItem['klasterId']
  organizationName: string
  organizationType: ProblemChallengeItem['organizationType']
  isAnonymous?: boolean
  contactPerson: string
  contactEmail: string
  contactPhone: string
  description: string
  impactStatement: string
  expectedSolutionType: string
  collaborationScheme?: ProblemChallengeItem['collaborationScheme']
  estimatedBudget?: string
  urgency: ProblemChallengeItem['urgency']
  targetTimeline?: string
  attachmentUrls?: string[]
}

/**
 * Server Action: Submit Pengajuan Masalah Baru
 */
export async function submitProblemAction(
  payload: SubmitProblemPayload
): Promise<ServerActionResult<{ problemId: string; trackingCode: string }>> {
  try {
    if (!payload.title || !payload.description || !payload.contactPerson || !payload.contactEmail) {
      return {
        success: false,
        error: 'Mohon lengkapi judul masalah, uraian deskripsi, dan informasi kontak resmi.',
      }
    }

    const trackingCode = generateProblemTrackingCode()
    const slug = `${slugify(payload.title)}-${Math.random().toString(36).substring(2, 6)}`
    const now = new Date().toISOString()

    const newProblem: ProblemChallengeItem = {
      id: `prb-${Date.now()}`,
      trackingCode,
      title: payload.title,
      slug,
      klasterId: payload.klasterId,
      organizationName: payload.organizationName,
      organizationType: payload.organizationType,
      isAnonymous: payload.isAnonymous || false,
      contactPerson: payload.contactPerson,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      description: payload.description,
      impactStatement: payload.impactStatement,
      expectedSolutionType: payload.expectedSolutionType,
      collaborationScheme: payload.collaborationScheme || 'pilot_project',
      estimatedBudget: payload.estimatedBudget,
      urgency: payload.urgency || 'sedang',
      targetTimeline: payload.targetTimeline,
      attachmentUrls: payload.attachmentUrls || [],
      status: 'draft', // Menunggu kurasi operator
      solutionProposalsCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    if (isFirebaseAdminConfigured()) {
      try {
        await adminDb.collection('problem_challenges').doc(newProblem.id).set(newProblem)

        // Sekaligus catat ke orders_inquiries agar operator dapat memproses di antrean terpusat
        await adminDb.collection('orders_inquiries').doc(newProblem.id).set({
          id: newProblem.id,
          trackingCode: newProblem.trackingCode,
          interestType: 'pengajuan_masalah',
          senderName: newProblem.contactPerson,
          senderEmail: newProblem.contactEmail,
          senderPhone: newProblem.contactPhone,
          organizationName: newProblem.organizationName,
          organizationType: newProblem.organizationType,
          message: `[TANTANGAN MASALAH INDUSTRI] ${newProblem.title}\n\nUraian: ${newProblem.description}\n\nDampak: ${newProblem.impactStatement}\n\nEkspektasi: ${newProblem.expectedSolutionType}`,
          problemTitle: newProblem.title,
          problemKlasterId: newProblem.klasterId,
          problemDescription: newProblem.description,
          impactStatement: newProblem.impactStatement,
          expectedSolutionType: newProblem.expectedSolutionType,
          collaborationScheme: newProblem.collaborationScheme,
          isAnonymous: newProblem.isAnonymous,
          urgency: newProblem.urgency,
          estimatedBudget: newProblem.estimatedBudget,
          status: 'pending',
          priority: newProblem.urgency === 'kritis' ? 'urgent' : newProblem.urgency === 'tinggi' ? 'high' : 'normal',
          createdAt: now,
          updatedAt: now,
        })
      } catch (dbErr) {
        console.warn('Firestore write failed, using fallback in-memory:', dbErr)
        DEMO_PROBLEMS.unshift(newProblem)
      }
    } else {
      DEMO_PROBLEMS.unshift(newProblem)
    }

    return {
      success: true,
      data: {
        problemId: newProblem.id,
        trackingCode: newProblem.trackingCode,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan sistem saat mengirim tantangan.',
    }
  }
}

/**
 * Server Action: Mengambil Daftar Tantangan Masalah Publik
 */
export async function getPublishedProblemsAction(
  params?: ProblemFilterParams
): Promise<ServerActionResult<ProblemChallengeItem[]>> {
  try {
    let list = [...DEMO_PROBLEMS]

    if (isFirebaseAdminConfigured()) {
      try {
        const snap = await adminDb.collection('problem_challenges').get()
        if (!snap.empty) {
          list = snap.docs.map((doc: { data: () => unknown }) => doc.data() as ProblemChallengeItem)
        }
      } catch (dbErr) {
        console.warn('Using demo problems as fallback:', dbErr)
      }
    }

    // Filter klaster
    if (params?.klasterId && params.klasterId !== 'all') {
      list = list.filter((p) => p.klasterId === params.klasterId)
    }

    // Filter status
    if (params?.status && params.status !== 'all') {
      list = list.filter((p) => p.status === params.status)
    } else {
      // Default: tampilkan yang terbuka atau sedang direview
      list = list.filter((p) => p.status !== 'draft' && p.status !== 'archived')
    }

    // Filter urgensi
    if (params?.urgency && params.urgency !== 'all') {
      list = list.filter((p) => p.urgency === params.urgency)
    }

    // Search query
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.organizationName.toLowerCase().includes(q) ||
          p.expectedSolutionType.toLowerCase().includes(q)
      )
    }

    // Sort descending by createdAt
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return {
      success: true,
      data: list,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengambil daftar tantangan.',
      data: DEMO_PROBLEMS,
    }
  }
}

/**
 * Server Action: Mengambil Detail Masalah berdasarkan slug atau id
 */
export async function getProblemDetailAction(
  identifier: string
): Promise<ServerActionResult<ProblemChallengeItem>> {
  try {
    if (isFirebaseAdminConfigured()) {
      try {
        // Coba by id
        const docSnap = await adminDb.collection('problem_challenges').doc(identifier).get()
        if (docSnap.exists) {
          return { success: true, data: docSnap.data() as ProblemChallengeItem }
        }
        // Coba by slug
        const qSnap = await adminDb.collection('problem_challenges').where('slug', '==', identifier).limit(1).get()
        if (!qSnap.empty) {
          return { success: true, data: qSnap.docs[0].data() as ProblemChallengeItem }
        }
      } catch (dbErr) {
        console.warn('Firestore fallback on getProblemDetailAction:', dbErr)
      }
    }

    // Fallback demo
    const found = DEMO_PROBLEMS.find((p) => p.id === identifier || p.slug === identifier)
    if (found) {
      return { success: true, data: found }
    }

    return {
      success: false,
      error: 'Tantangan masalah tidak ditemukan atau telah diarsipkan.',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat tantangan.',
    }
  }
}

export interface SubmitSolutionPayload {
  problemId: string
  problemTitle: string
  solverType: SolutionProposalItem['solverType']
  solverId?: string
  solverName: string
  solverEmail: string
  solverPhone: string
  solutionSummary: string
  methodology?: string
  proposedTimeline?: string
  estimatedCost?: string
  attachmentUrls?: string[]
}

/**
 * Server Action: Pitching / Mengajukan Solusi Inovasi
 */
export async function submitSolutionProposalAction(
  payload: SubmitSolutionPayload
): Promise<ServerActionResult<{ proposalId: string }>> {
  try {
    if (!payload.problemId || !payload.solverName || !payload.solutionSummary || !payload.solverEmail) {
      return {
        success: false,
        error: 'Mohon lengkapi ringkasan solusi, metodologi, dan kontak pengaju solusi.',
      }
    }

    const proposalId = `sol-${Date.now()}`
    const now = new Date().toISOString()

    const proposal: SolutionProposalItem = {
      id: proposalId,
      problemId: payload.problemId,
      problemTitle: payload.problemTitle,
      solverType: payload.solverType,
      solverId: payload.solverId,
      solverName: payload.solverName,
      solverEmail: payload.solverEmail,
      solverPhone: payload.solverPhone,
      solutionSummary: payload.solutionSummary,
      methodology: payload.methodology,
      proposedTimeline: payload.proposedTimeline,
      estimatedCost: payload.estimatedCost,
      attachmentUrls: payload.attachmentUrls || [],
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }

    if (isFirebaseAdminConfigured()) {
      try {
        await adminDb.collection('solution_proposals').doc(proposalId).set(proposal)
      } catch (dbErr) {
        console.warn('Firestore fallback on submitSolutionProposalAction:', dbErr)
      }
    }

    return {
      success: true,
      data: { proposalId },
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengirimkan proposal solusi.',
    }
  }
}
