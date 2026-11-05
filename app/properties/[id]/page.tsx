import { notFound } from 'next/navigation'
import { properties } from '@/lib/properties'
import { PropertyDetails } from '@/components/property-details'

export function generateStaticParams() {
  return properties.map((_, id) => ({ id: String(id) }))
}

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = properties[Number(id)]
  if (!property || !Number.isInteger(Number(id))) notFound()
  return <PropertyDetails property={property} />
}
