import { PropertyMap } from '@/components/property-map'

export const metadata = {
  title: 'Property Atlas | OneStep Dream Property',
  description: 'Explore Bengaluru properties on an interactive 3D map and continue to property details or appointment booking.',
}

export default function ExplorePage() {
  return <PropertyMap />
}

// The interactive map is client-rendered so Three.js only loads when this route is visited.
export const dynamic = 'force-static'

// Keep the page discoverable as the V4 geographical experience.
export const revalidate = 3600
