'use server'

import { adminDb } from '@/lib/firebase/admin'
import { SEED_KATALOG, SEED_TENANTS, SEED_FACILITIES } from '@/data/seedData'
import { ServerActionResult, OrderInquiryItem, OrderLogItem } from '@/types'

export interface SyncResult {
  katalogCount: number
  tenantCount: number
  facilityCount: number
  orderCount: number
}

/**
 * Server action untuk menyinkronkan seluruh master data awal ke Firestore secara idempoten
 */
export async function syncInitialDataAction(): Promise<ServerActionResult<SyncResult>> {
  try {
    const batch = adminDb.batch()

    // 1. Sinkronisasi Katalog Inovasi
    for (const item of SEED_KATALOG) {
      const ref = adminDb.collection('katalog_items').doc(item.id)
      batch.set(ref, item, { merge: true })
    }

    // 2. Sinkronisasi Tenant
    for (const tenant of SEED_TENANTS) {
      const ref = adminDb.collection('tenant').doc(tenant.id)
      batch.set(ref, tenant, { merge: true })
    }

    // 3. Sinkronisasi Fasilitas & Lab STP
    for (const facility of SEED_FACILITIES) {
      const ref = adminDb.collection('facilities').doc(facility.id)
      batch.set(ref, facility, { merge: true })
    }

    await batch.commit()

    // 4. Inisialisasi Order Demo jika koleksi orders_inquiries masih kosong
    let orderCount = 0
    const ordersSnap = await adminDb.collection('orders_inquiries').limit(1).get()

    if (ordersSnap.empty) {
      const now = new Date()
      const demoOrders: Omit<OrderInquiryItem, 'id'>[] = [
        {
          trackingCode: 'STP-ORD-202609-F89A',
          katalogId: 'stp-ev-battery-pack',
          katalogTitle: 'Baterai Motor Listrik STP-EV (Lithium Ferro Phosphate)',
          tenantId: 'bengawan-precision',
          tenantName: 'PT. Industri Baterai Nasional STP',
          senderName: 'Bambang Sudibyo, S.T.',
          senderEmail: 'bambang@solotrans.co.id',
          senderPhone: '081223344556',
          organizationName: 'PT. Solo Trans Mandiri',
          organizationType: 'pt',
          interestType: 'kerjasama_riset',
          message: 'Kami ingin menjadwalkan uji coba 5 unit paket baterai untuk armada feeder listrik perkotaan Solo.',
          estimatedBudget: 'Rp 150.000.000',
          status: 'pending',
          priority: 'high',
          createdAt: new Date(now.getTime() - 3600000 * 4).toISOString(),
          updatedAt: new Date(now.getTime() - 3600000 * 4).toISOString(),
        },
        {
          trackingCode: 'STP-ORD-202609-K92B',
          katalogId: 'stp-vision-defect-inspector',
          katalogTitle: 'AI Smart Surveillance & Edge Computing Box',
          tenantId: 'solo-ai-labs',
          tenantName: 'CV. Cipta Solusi Cerdas',
          senderName: 'Rina Wijaya, M.Kom.',
          senderEmail: 'rina@dishub.surakarta.go.id',
          senderPhone: '085611223344',
          organizationName: 'Dinas Perhubungan Kota Surakarta',
          organizationType: 'pemerintah',
          interestType: 'uji_coba_prototipe',
          message: 'Permohonan integrasi sistem edge vision untuk deteksi kemacetan di 3 simpang protokol Surakarta.',
          status: 'contacted',
          priority: 'urgent',
          assignedOperatorId: 'OP-STP-01',
          assignedOperatorName: 'Tim Layanan Bisnis STP',
          createdAt: new Date(now.getTime() - 3600000 * 24).toISOString(),
          updatedAt: new Date(now.getTime() - 3600000 * 12).toISOString(),
        },
      ]

      for (const ord of demoOrders) {
        const ordRef = await adminDb.collection('orders_inquiries').add(ord)
        orderCount++

        // Buat log riwayat perdana
        const log: Omit<OrderLogItem, 'id'> = {
          orderId: ordRef.id,
          operatorId: ord.assignedOperatorId || 'SYSTEM',
          operatorName: ord.assignedOperatorName || 'Sistem Katalog STP',
          actionType: ord.status === 'contacted' ? 'whatsapp_contact' : 'status_change',
          newStatus: ord.status,
          notes:
            ord.status === 'contacted'
              ? 'Telah menghubungi narahubung Dishub via WhatsApp dan mengirim proposal uji coba simpang.'
              : 'Permohonan baru tercatat di antrean verifikasi operator.',
          isPublicToUser: true,
          createdAt: ord.createdAt,
        }
        await adminDb.collection('order_logs').add(log)
      }
    } else {
      const fullSnap = await adminDb.collection('orders_inquiries').get()
      orderCount = fullSnap.size
    }

    return {
      success: true,
      data: {
        katalogCount: SEED_KATALOG.length,
        tenantCount: SEED_TENANTS.length,
        facilityCount: SEED_FACILITIES.length,
        orderCount,
      },
    }
  } catch (error) {
    console.error('[syncInitialDataAction Error]:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menyinkronkan data awal ke Firestore.',
    }
  }
}
