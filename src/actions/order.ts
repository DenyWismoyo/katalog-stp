'use server'

import { adminDb } from '@/lib/firebase/admin'
import {
  OrderInquiryItem,
  OrderLogItem,
  OrderStatus,
  ServerActionResult,
  ORDER_STATUS_TRANSITIONS,
  ORDER_STATUS_LABELS,
} from '@/types'

/**
 * Helper untuk menghasilkan kode pelacakan unik ramah pengguna
 * Format: STP-ORD-YYYYMM-XXXX (contoh: STP-ORD-202609-A4B7)
 */
function generateTrackingCode(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `STP-ORD-${year}${month}-${randomSuffix}`
}

export interface SubmitOrderPayload {
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
  organizationType: OrderInquiryItem['organizationType']
  interestType: OrderInquiryItem['interestType']
  message: string
  estimatedBudget?: string

  // Profil Persona Pengisi / Pemohon
  senderRoleOrPosition?: string
  senderDepartment?: string
  senderLocationCity?: string
  senderIdentityNumber?: string
  senderCategory?: string

  // Field Spesifik Kebutuhan
  quantity?: number
  targetDeliveryDate?: string
  purchaseOrderRef?: string
  needsDemoFirst?: boolean

  researchScope?: string
  institutionType?: string
  researchDuration?: string
  fundingSource?: string
  expectedOutput?: string

  testingScope?: string
  labEnvironment?: string
  numberOfUnits?: number
  testingDuration?: string

  rentalStartDate?: string
  rentalEndDate?: string
  purposeOfUse?: string
  numberOfParticipants?: number

  startupStage?: string
  sectorFocus?: string
  currentTeamSize?: number
  problemStatement?: string

  investorType?: 'angel' | 'vc' | 'corporate' | 'strategic'
  investmentRange?: string
  portfolioUrl?: string

  // Field Pengajuan Masalah (Problem Challenge)
  problemTitle?: string
  problemKlasterId?: OrderInquiryItem['problemKlasterId']
  problemDescription?: string
  impactStatement?: string
  expectedSolutionType?: string
  collaborationScheme?: OrderInquiryItem['collaborationScheme']
  isAnonymous?: boolean
  urgency?: OrderInquiryItem['urgency']

  interestTypeMetadata?: Record<string, unknown>
}

/**
 * Mengajukan permohonan kerjasama atau pemesanan inovasi baru
 */
export async function submitOrderAction(
  payload: SubmitOrderPayload
): Promise<ServerActionResult<{ orderId: string; trackingCode: string }>> {
  try {
    // Validasi input wajib
    if (!payload.senderName || !payload.senderEmail || !payload.senderPhone) {
      return { success: false, error: 'Nama, email, dan nomor telepon wajib diisi.' }
    }
    if (!payload.organizationName || !payload.message) {
      return { success: false, error: 'Nama organisasi/instansi dan pesan kebutuhan wajib diisi.' }
    }

    const trackingCode = generateTrackingCode()
    const now = new Date().toISOString()

    const newOrderData: Omit<OrderInquiryItem, 'id'> = {
      trackingCode,
      katalogId: payload.katalogId || '',
      katalogTitle: payload.katalogTitle || 'Inquiry Umum / Fasilitas',
      tenantId: payload.tenantId || '',
      tenantName: payload.tenantName || 'Solo Technopark',
      facilityId: payload.facilityId || '',
      userId: payload.userId || '',
      senderName: payload.senderName.trim(),
      senderEmail: payload.senderEmail.trim().toLowerCase(),
      senderPhone: payload.senderPhone.trim(),
      organizationName: payload.organizationName.trim(),
      organizationType: payload.organizationType || 'pt',
      interestType: payload.interestType || 'kerjasama_riset',
      message: payload.message.trim(),
      estimatedBudget: payload.estimatedBudget || '',
      status: 'pending',
      priority: 'normal',

      // Profil Persona Pengisi
      ...(payload.senderRoleOrPosition ? { senderRoleOrPosition: payload.senderRoleOrPosition.trim() } : {}),
      ...(payload.senderDepartment ? { senderDepartment: payload.senderDepartment.trim() } : {}),
      ...(payload.senderLocationCity ? { senderLocationCity: payload.senderLocationCity.trim() } : {}),
      ...(payload.senderIdentityNumber ? { senderIdentityNumber: payload.senderIdentityNumber.trim() } : {}),
      ...(payload.senderCategory ? { senderCategory: payload.senderCategory.trim() } : {}),

      // Specific fields
      ...(payload.quantity !== undefined ? { quantity: Number(payload.quantity) } : {}),
      ...(payload.targetDeliveryDate ? { targetDeliveryDate: payload.targetDeliveryDate } : {}),
      ...(payload.purchaseOrderRef ? { purchaseOrderRef: payload.purchaseOrderRef.trim() } : {}),
      ...(payload.needsDemoFirst !== undefined ? { needsDemoFirst: Boolean(payload.needsDemoFirst) } : {}),

      ...(payload.researchScope ? { researchScope: payload.researchScope.trim() } : {}),
      ...(payload.institutionType ? { institutionType: payload.institutionType.trim() } : {}),
      ...(payload.researchDuration ? { researchDuration: payload.researchDuration.trim() } : {}),
      ...(payload.fundingSource ? { fundingSource: payload.fundingSource.trim() } : {}),
      ...(payload.expectedOutput ? { expectedOutput: payload.expectedOutput.trim() } : {}),

      ...(payload.testingScope ? { testingScope: payload.testingScope.trim() } : {}),
      ...(payload.labEnvironment ? { labEnvironment: payload.labEnvironment.trim() } : {}),
      ...(payload.numberOfUnits !== undefined ? { numberOfUnits: Number(payload.numberOfUnits) } : {}),
      ...(payload.testingDuration ? { testingDuration: payload.testingDuration.trim() } : {}),

      ...(payload.rentalStartDate ? { rentalStartDate: payload.rentalStartDate } : {}),
      ...(payload.rentalEndDate ? { rentalEndDate: payload.rentalEndDate } : {}),
      ...(payload.purposeOfUse ? { purposeOfUse: payload.purposeOfUse.trim() } : {}),
      ...(payload.numberOfParticipants !== undefined ? { numberOfParticipants: Number(payload.numberOfParticipants) } : {}),

      ...(payload.startupStage ? { startupStage: payload.startupStage.trim() } : {}),
      ...(payload.sectorFocus ? { sectorFocus: payload.sectorFocus.trim() } : {}),
      ...(payload.currentTeamSize !== undefined ? { currentTeamSize: Number(payload.currentTeamSize) } : {}),
      ...(payload.problemStatement ? { problemStatement: payload.problemStatement.trim() } : {}),

      ...(payload.investorType ? { investorType: payload.investorType } : {}),
      ...(payload.investmentRange ? { investmentRange: payload.investmentRange.trim() } : {}),
      ...(payload.portfolioUrl ? { portfolioUrl: payload.portfolioUrl.trim() } : {}),

      ...(payload.problemTitle ? { problemTitle: payload.problemTitle.trim() } : {}),
      ...(payload.problemKlasterId ? { problemKlasterId: payload.problemKlasterId } : {}),
      ...(payload.problemDescription ? { problemDescription: payload.problemDescription.trim() } : {}),
      ...(payload.impactStatement ? { impactStatement: payload.impactStatement.trim() } : {}),
      ...(payload.expectedSolutionType ? { expectedSolutionType: payload.expectedSolutionType.trim() } : {}),
      ...(payload.collaborationScheme ? { collaborationScheme: payload.collaborationScheme } : {}),
      ...(payload.isAnonymous !== undefined ? { isAnonymous: payload.isAnonymous } : {}),
      ...(payload.urgency ? { urgency: payload.urgency } : {}),

      ...(payload.interestTypeMetadata ? { interestTypeMetadata: payload.interestTypeMetadata } : {}),

      createdAt: now,
      updatedAt: now,
    }

    // Simpan ke Firestore Named Database (katalog-stp)
    const docRef = await adminDb.collection('orders_inquiries').add(newOrderData)

    // Catat log histori perdana
    const initialLog: Omit<OrderLogItem, 'id'> = {
      orderId: docRef.id,
      operatorId: 'SYSTEM',
      operatorName: 'Sistem Katalog STP',
      actionType: 'status_change',
      newStatus: 'pending',
      notes: 'Permohonan / Order baru berhasil diajukan oleh pemohon dan tercatat di antrean verifikasi.',
      isPublicToUser: true,
      createdAt: now,
    }

    await adminDb.collection('order_logs').add(initialLog)

    return {
      success: true,
      data: {
        orderId: docRef.id,
        trackingCode,
      },
    }
  } catch (error) {
    console.error('[submitOrderAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kendala saat mengajukan permohonan.',
    }
  }
}

/**
 * Mencari pesanan dan histori log berdasarkan nomor resi publik
 */
export async function getOrderByTrackingCodeAction(
  trackingCode: string
): Promise<ServerActionResult<{ order: OrderInquiryItem; logs: OrderLogItem[] }>> {
  try {
    const cleanCode = trackingCode.trim().toUpperCase()
    if (!cleanCode) {
      return { success: false, error: 'Nomor resi pelacakan wajib diisi.' }
    }

    const querySnapshot = await adminDb
      .collection('orders_inquiries')
      .where('trackingCode', '==', cleanCode)
      .limit(1)
      .get()

    if (querySnapshot.empty) {
      return {
        success: false,
        error: `Nomor resi ${cleanCode} tidak ditemukan di sistem Katalog Digital STP.`,
      }
    }

    const doc = querySnapshot.docs[0]
    const order = { id: doc.id, ...doc.data() } as OrderInquiryItem

    // Ambil log yang diizinkan untuk dilihat oleh publik
    const logsSnapshot = await adminDb
      .collection('order_logs')
      .where('orderId', '==', doc.id)
      .where('isPublicToUser', '==', true)
      .get()

    const logs: OrderLogItem[] = logsSnapshot.docs
      .map((d) => ({ id: d.id, ...d.data() } as OrderLogItem))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return {
      success: true,
      data: { order, logs },
    }
  } catch (error) {
    console.error('[getOrderByTrackingCodeAction Error]:', error)
    return {
      success: false,
      error: 'Gagal memuat status pelacakan pesanan.',
    }
  }
}

/**
 * Mengambil seluruh daftar permohonan/order untuk Operator Dashboard
 */
export async function getOrdersListAction(
  statusFilter?: OrderStatus | 'all'
): Promise<ServerActionResult<OrderInquiryItem[]>> {
  try {
    let queryRef = adminDb.collection('orders_inquiries') as FirebaseFirestore.Query

    if (statusFilter && statusFilter !== 'all') {
      queryRef = queryRef.where('status', '==', statusFilter)
    }

    const snapshot = await queryRef.get()
    const orders: OrderInquiryItem[] = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as OrderInquiryItem))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return {
      success: true,
      data: orders,
    }
  } catch (error) {
    console.error('[getOrdersListAction Error]:', error)
    return {
      success: false,
      error: 'Gagal mengambil daftar antrean order.',
    }
  }
}

/**
 * Memperbarui status alur pesanan dan mencatat log tindak lanjut oleh Operator
 */
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus,
  notes: string,
  operatorInfo?: { id: string; name: string }
): Promise<ServerActionResult<{ updated: boolean }>> {
  try {
    if (!orderId || !newStatus) {
      return { success: false, error: 'ID pesanan dan status baru wajib disediakan.' }
    }

    const orderDocRef = adminDb.collection('orders_inquiries').doc(orderId)
    const orderDoc = await orderDocRef.get()

    if (!orderDoc.exists) {
      return { success: false, error: 'Pesanan tidak ditemukan.' }
    }

    const currentOrder = orderDoc.data() as OrderInquiryItem
    const previousStatus = currentOrder.status

    // Validasi alur transisi status resmi SOP Solo Technopark
    if (previousStatus !== newStatus) {
      const allowedTransitions = ORDER_STATUS_TRANSITIONS[previousStatus] || []
      if (!allowedTransitions.includes(newStatus)) {
        return {
          success: false,
          error: `Transisi status dari "${ORDER_STATUS_LABELS[previousStatus]}" ke "${ORDER_STATUS_LABELS[newStatus]}" tidak diperkenankan sesuai SOP alur layanan STP.`,
        }
      }
    }

    const now = new Date().toISOString()

    const updatePayload: Partial<OrderInquiryItem> = {
      status: newStatus,
      updatedAt: now,
    }

    if (operatorInfo?.id) {
      updatePayload.assignedOperatorId = operatorInfo.id
      updatePayload.assignedOperatorName = operatorInfo.name
    }

    if (newStatus === 'completed' || newStatus === 'rejected') {
      updatePayload.closedAt = now
    }

    await orderDocRef.update(updatePayload)

    // Buat riwayat log
    const newLog: Omit<OrderLogItem, 'id'> = {
      orderId,
      operatorId: operatorInfo?.id || 'OPERATOR-DEFAULT',
      operatorName: operatorInfo?.name || 'Tim Layanan Bisnis STP',
      actionType: 'status_change',
      previousStatus,
      newStatus,
      notes: notes.trim() || `Status pesanan diubah dari ${previousStatus} menjadi ${newStatus}.`,
      isPublicToUser: true,
      createdAt: now,
    }

    await adminDb.collection('order_logs').add(newLog)

    return {
      success: true,
      data: { updated: true },
    }
  } catch (error) {
    console.error('[updateOrderStatusAction Error]:', error)
    return {
      success: false,
      error: 'Gagal memperbarui status pesanan.',
    }
  }
}
