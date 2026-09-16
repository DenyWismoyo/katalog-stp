/**
 * ============================================================================
 * LAYER 1: CONTRACT & ENTITY DEFINITIONS
 * Proyek: Katalog Digital STP (Solo Technopark)
 * ============================================================================
 */

export type UserRole = 'admin' | 'operator' | 'tenant' | 'user' | 'guest'

export type TRLLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type HakiStatus = 'belum' | 'terdaftar' | 'granted'

export type KlasterId =
  | 'ai-software'
  | 'game-animasi'
  | 'manufaktur-cnc'
  | 'robotika-otomasi'
  | 'energi-terbarukan'
  | 'underwater-welding'
  | 'batik-craft-tech'
  | 'smart-city-iot'

export interface KlasterItem {
  id: KlasterId
  name: string
  shortDesc: string
  iconName: string
  colorBadge: string
}

export interface SpecificationItem {
  key: string
  value: string
}

export interface KatalogItem {
  id: string
  title: string
  slug: string
  tagline: string
  description: string
  klasterId: KlasterId
  tenantId: string
  tenantName: string
  trl: TRLLevel
  coverUrl: string
  galleryUrls: string[]
  brochurePdfUrl?: string
  videoUrl?: string
  specifications: SpecificationItem[]
  targetMarket: string[]
  hakiStatus: HakiStatus
  status: 'draft' | 'published' | 'archived'
  isFeatured: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface TenantItem {
  id: string
  name: string
  legalName?: string
  logoUrl: string
  bannerUrl?: string
  klasterId: KlasterId
  about: string
  website?: string
  email: string
  phone?: string
  address?: string
  incubationStatus: 'pra-inkubasi' | 'inkubasi' | 'alumni' | 'mitra-industri'
  batchYear?: number
  socialLinks?: {
    linkedin?: string
    instagram?: string
    github?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type FacilityCategory =
  | 'manufaktur_cnc'
  | 'wet_welding'
  | 'ai_iot_lab'
  | 'diklat_hall'
  | 'studio_kreatif'

export interface FacilityItem {
  id: string
  name: string
  slug: string
  category: FacilityCategory
  categoryLabel: string
  tagline: string
  description: string
  location: string
  capacity: string
  equipmentList: string[]
  specifications: SpecificationItem[]
  coverUrl: string
  galleryUrls?: string[]
  ratePerHour?: string
  ratePerDay?: string
  status: 'available' | 'maintenance' | 'booked'
  contactPerson?: string
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending'
  | 'reviewed'
  | 'contacted'
  | 'survey'
  | 'deal'
  | 'completed'
  | 'rejected'

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['reviewed', 'rejected'],
  reviewed: ['contacted', 'rejected'],
  contacted: ['survey', 'deal', 'rejected'],
  survey: ['deal', 'rejected'],
  deal: ['completed', 'rejected'],
  completed: [],
  rejected: [],
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Menunggu Verifikasi',
  reviewed: 'Ditinjau Tim Teknis',
  contacted: 'Telah Dihubungi',
  survey: 'Jadwal Survey Lab',
  deal: 'Kesepakatan / Deal',
  completed: 'Selesai & Berhasil',
  rejected: 'Ditolak / Batal',
}

export type InterestType =
  | 'pembelian_produk'
  | 'kerjasama_riset'
  | 'uji_coba_prototipe'
  | 'sewa_fasilitas_lab'
  | 'konsultasi_inkubasi'
  | 'investasi'
  | 'pengajuan_masalah'

export const INTEREST_TYPE_LABELS: Record<InterestType, string> = {
  pembelian_produk: 'Pembelian Produk / Lisensi Komersial',
  kerjasama_riset: 'Kerjasama Riset & Lisensi Paten',
  uji_coba_prototipe: 'Uji Coba Prototipe / Validasi Lab',
  sewa_fasilitas_lab: 'Sewa Fasilitas Lab / Co-working',
  konsultasi_inkubasi: 'Konsultasi Inkubasi Startup STP',
  investasi: 'Investasi & Business Matching',
  pengajuan_masalah: 'Tantangan Masalah Industri (Problem Bank)',
}

export const INTEREST_TYPE_DESCRIPTIONS: Record<InterestType, string> = {
  pembelian_produk: 'Pengadaan langsung produk inovasi atau pembelian lisensi komersial untuk industri.',
  kerjasama_riset: 'Kolaborasi riset terapan, transfer teknologi, atau uji coba bersama peneliti & lab STP.',
  uji_coba_prototipe: 'Pengujian performa, sertifikasi, atau validasi teknologi pada lingkungan lab terakreditasi.',
  sewa_fasilitas_lab: 'Pemanfaatan mesin presisi, lab AI/IoT, bengkel wet welding, atau ruang convention STP.',
  konsultasi_inkubasi: 'Pendaftaran program inkubasi startup, bimbingan teknologi, dan pendanaan ventura.',
  investasi: 'Peluang pendanaan, sindikasi investasi, atau penjajakan business matching dengan startup binaan STP.',
  pengajuan_masalah: 'Pengajuan masalah teknis atau tantangan operasional industri untuk dicarikan solusi oleh inovator, tenant, dan lab STP.',
}

export interface OrderInquiryItem {
  id: string
  trackingCode: string
  katalogId?: string
  katalogTitle?: string
  tenantId?: string
  tenantName?: string
  facilityId?: string

  userId?: string
  senderName: string
  senderEmail: string
  senderPhone: string
  organizationName: string
  organizationType: 'pt' | 'cv' | 'bumn' | 'pemerintah' | 'akademisi' | 'perorangan'

  interestType: InterestType
  message: string
  attachmentUrls?: string[]
  estimatedBudget?: string

  // Field Spesifik Kebutuhan Terdiferensiasi
  // 1. Pembelian Produk
  quantity?: number
  targetDeliveryDate?: string
  purchaseOrderRef?: string
  needsDemoFirst?: boolean

  // 2. Kerjasama Riset
  researchScope?: string
  institutionType?: string
  researchDuration?: string
  fundingSource?: string
  expectedOutput?: string

  // 3. Uji Coba Prototipe
  testingScope?: string
  labEnvironment?: string
  numberOfUnits?: number
  testingDuration?: string

  // 4. Sewa Fasilitas Lab
  rentalStartDate?: string
  rentalEndDate?: string
  purposeOfUse?: string
  numberOfParticipants?: number

  // 5. Konsultasi Inkubasi
  startupStage?: string
  sectorFocus?: string
  currentTeamSize?: number
  problemStatement?: string

  // 6. Investasi & Business Matching
  investorType?: 'angel' | 'vc' | 'corporate' | 'strategic'
  investmentRange?: string
  portfolioUrl?: string

  // 7. Pengajuan Masalah / Problem Challenge (Demand-Driven)
  problemTitle?: string
  problemKlasterId?: KlasterId
  problemDescription?: string
  impactStatement?: string
  expectedSolutionType?: string
  collaborationScheme?: 'kontrak_riset' | 'pilot_project' | 'joint_development' | 'bounty_sayembara' | 'konsultasi_teknis'
  isAnonymous?: boolean
  urgency?: 'rendah' | 'sedang' | 'tinggi' | 'kritis'

  // Profil Persona Pengisi / Pemohon
  senderRoleOrPosition?: string
  senderDepartment?: string
  senderLocationCity?: string
  senderIdentityNumber?: string
  senderCategory?: string

  // Fleksibel Metadata Tambahan
  interestTypeMetadata?: Record<string, unknown>

  status: OrderStatus
  assignedOperatorId?: string
  assignedOperatorName?: string
  priority: 'normal' | 'high' | 'urgent'

  createdAt: string
  updatedAt: string
  closedAt?: string
}

export interface OrderLogItem {
  id: string
  orderId: string
  operatorId: string
  operatorName: string
  actionType: 'status_change' | 'whatsapp_contact' | 'email_sent' | 'meeting_held' | 'document_uploaded'
  previousStatus?: OrderStatus
  newStatus?: OrderStatus
  notes: string
  isPublicToUser: boolean
  createdAt: string
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  phoneNumber?: string
  photoURL?: string
  role: UserRole
  organizationName?: string
  tenantId?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface KatalogFilterParams {
  search?: string
  klasterId?: KlasterId | 'all'
  trlMin?: number
  trlMax?: number
  hakiStatus?: HakiStatus | 'all'
  onlyFeatured?: boolean
  page?: number
  limit?: number
}

export interface ServerActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

/* ============================================================================
 * BANK MASALAH & TANTANGAN INDUSTRI (OPEN INNOVATION & REVERSE PITCHING)
 * ============================================================================ */

export type ProblemStatus =
  | 'draft'               // Baru diajukan, verifikasi tim STP
  | 'open_for_solutions'  // Terbit di papan tantangan, mencari solusi
  | 'reviewing_solutions' // Proposal solusi sedang dinilai
  | 'matched'             // Telah dicocokkan dengan tenant/lab STP
  | 'solved'              // Solusi berhasil diimplementasikan
  | 'archived'            // Ditutup / tidak aktif

export const PROBLEM_STATUS_LABELS: Record<ProblemStatus, string> = {
  draft: 'Menunggu Kurasi',
  open_for_solutions: 'Membuka Solusi',
  reviewing_solutions: 'Review Solusi',
  matched: 'Tercocokkan (Matched)',
  solved: 'Terselesaikan (Solved)',
  archived: 'Diarsipkan',
}

export type UrgencyLevel = 'rendah' | 'sedang' | 'tinggi' | 'kritis'

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  rendah: 'Urgensi Rendah',
  sedang: 'Urgensi Sedang',
  tinggi: 'Urgensi Tinggi',
  kritis: 'Kritis / Prioritas Utama',
}

export interface ProblemChallengeItem {
  id: string
  trackingCode: string
  title: string
  slug: string
  klasterId: KlasterId
  organizationName: string
  organizationType: 'pt' | 'cv' | 'bumn' | 'pemerintah' | 'akademisi' | 'umkm' | 'perorangan'
  isAnonymous?: boolean
  contactPerson: string
  contactEmail: string
  contactPhone: string

  description: string
  impactStatement: string
  expectedSolutionType: string
  collaborationScheme?: 'kontrak_riset' | 'pilot_project' | 'joint_development' | 'bounty_sayembara' | 'konsultasi_teknis'
  estimatedBudget?: string
  urgency: UrgencyLevel
  targetTimeline?: string
  attachmentUrls?: string[]

  status: ProblemStatus
  solutionProposalsCount: number
  matchedTenantId?: string
  matchedTenantName?: string

  createdAt: string
  updatedAt: string
}

export interface SolutionProposalItem {
  id: string
  problemId: string
  problemTitle: string
  solverType: 'tenant' | 'peneliti' | 'startup' | 'umum'
  solverId?: string
  solverName: string
  solverEmail: string
  solverPhone: string
  solutionSummary: string
  methodology?: string
  proposedTimeline?: string
  estimatedCost?: string
  attachmentUrls?: string[]
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface ProblemFilterParams {
  search?: string
  klasterId?: KlasterId | 'all'
  urgency?: UrgencyLevel | 'all'
  status?: ProblemStatus | 'all'
  page?: number
  limit?: number
}

