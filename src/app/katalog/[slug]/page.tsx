import { notFound } from 'next/navigation'
import { getKatalogItemBySlugAction, getKatalogItemsAction } from '@/actions/katalog'
import { getTenantByIdAction } from '@/actions/tenant'
import { DetailKatalogClient } from '@/components/katalog/DetailKatalogClient'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const res = await getKatalogItemBySlugAction(slug)

  if (!res.success || !res.data) {
    return {
      title: 'Produk Tidak Ditemukan | Solo Technopark',
    }
  }

  const item = res.data
  return {
    title: `${item.title} | Katalog Inovasi Solo Technopark`,
    description: item.tagline,
    openGraph: {
      title: item.title,
      description: item.tagline,
      images: [{ url: item.coverUrl }],
    },
  }
}

export default async function DetailKatalogPage({ params }: PageProps) {
  const { slug } = await params
  const res = await getKatalogItemBySlugAction(slug)

  if (!res.success || !res.data) {
    notFound()
  }

  const item = res.data

  // Ambil tenant info jika ada
  let tenant = null
  if (item.tenantId) {
    const tenantRes = await getTenantByIdAction(item.tenantId)
    if (tenantRes.success && tenantRes.data) {
      tenant = tenantRes.data.tenant
    }
  }

  // Ambil produk terkait di klaster yang sama
  const relatedRes = await getKatalogItemsAction({ klasterId: item.klasterId })
  const relatedProducts = relatedRes.success && relatedRes.data ? relatedRes.data : []

  return (
    <DetailKatalogClient
      item={item}
      tenant={tenant}
      relatedProducts={relatedProducts}
    />
  )
}
