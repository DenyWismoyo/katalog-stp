import { notFound } from 'next/navigation'
import { getFacilityBySlugAction } from '@/actions/facility'
import { DetailFacilityClient } from '@/components/facility/DetailFacilityClient'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const res = await getFacilityBySlugAction(slug)

  if (!res.success || !res.data) {
    return {
      title: 'Fasilitas Tidak Ditemukan | Solo Technopark',
    }
  }

  const facility = res.data
  return {
    title: `${facility.name} | Fasilitas Solo Technopark`,
    description: facility.tagline,
    openGraph: {
      title: facility.name,
      description: facility.tagline,
      images: [{ url: facility.coverUrl }],
    },
  }
}

export default async function FacilityDetailPage({ params }: PageProps) {
  const { slug } = await params
  const res = await getFacilityBySlugAction(slug)

  if (!res.success || !res.data) {
    notFound()
  }

  return <DetailFacilityClient facility={res.data} />
}
