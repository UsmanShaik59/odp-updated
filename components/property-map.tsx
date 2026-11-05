'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Environment } from '@react-three/drei'
import { ArrowRight, Bath, BedDouble, Building2, ChevronDown, LocateFixed, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { properties } from '@/lib/properties'
import { SiteMobileNav } from './site-mobile-nav'

type Category = 'All' | 'Apartment' | 'Villa' | 'Land' | 'Commercial'

const categoryOptions: Category[] = ['All', 'Apartment', 'Villa', 'Land', 'Commercial']
const areaPoints = [
  { name: 'Whitefield', x: 2.2, y: 1.4, count: 3 },
  { name: 'Koramangala', x: -1.3, y: 0.2, count: 1 },
  { name: 'HSR Layout', x: -0.6, y: -1.5, count: 1 },
  { name: 'Indiranagar', x: 0.8, y: 0.4, count: 1 },
  { name: 'Yelahanka', x: -1.8, y: 2.2, count: 1 },
  { name: 'Hebbal', x: -0.5, y: 2.5, count: 1 },
]

function parseBhk(details: string) {
  return details.match(/\d+ BHK/)?.[0] ?? '2 BHK'
}

function pinPosition(index: number) {
  const positions = [[2.2, 1.4], [-1.3, 0.2], [-0.6, -1.5], [0.8, 0.4], [1.1, 0.6], [2.6, 1.1], [-1.8, 2.2], [-0.5, 2.5]]
  return positions[index] ?? [0, 0]
}

function MapMarker({ position, label, active, onClick }: { position: [number, number]; label: string; active: boolean; onClick: () => void }) {
  return (
    <group position={[position[0], 0.38, position[1]]} onClick={(event) => { event.stopPropagation(); onClick() }}>
      <mesh castShadow>
        <sphereGeometry args={[active ? 0.14 : 0.1, 20, 20]} />
        <meshStandardMaterial color={active ? '#0874d1' : '#f4f7fb'} emissive={active ? '#0874d1' : '#31526f'} emissiveIntensity={active ? 0.7 : 0.25} />
      </mesh>
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[active ? 0.11 : 0.08, 0.24, 20]} />
        <meshStandardMaterial color={active ? '#0874d1' : '#dbe8f5'} />
      </mesh>
      <Html distanceFactor={7} position={[0, 0.28, 0]} center>
        <button onClick={onClick} className={`whitespace-nowrap rounded-full border px-2 py-1 text-[10px] font-semibold shadow-lg backdrop-blur transition ${active ? 'border-[#0874d1] bg-[#0874d1] text-white' : 'border-white/30 bg-[#0b1b31]/85 text-white/85 hover:border-[#0874d1]'}`} aria-label={`Explore ${label}`}>
          {label}
        </button>
      </Html>
    </group>
  )
}

function CityMap({ selected, onSelect }: { selected: number | null; onSelect: (index: number) => void }) {
  return (
    <Canvas camera={{ position: [0, 6.8, 6.8], fov: 42 }} shadows dpr={[1, 1.5]}>
      <color attach="background" args={['#08192e']} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 8, 3]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <group rotation={[-0.08, 0, 0]}>
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9.5, 7.2, 16, 12]} />
            <meshStandardMaterial color="#102a43" roughness={0.9} metalness={0.1} wireframe />
          </mesh>
          <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[9.2, 6.9]} />
            <meshStandardMaterial color="#0b2037" roughness={1} />
          </mesh>
          {[[-2.8, 0], [-1.4, 0.3], [0, 0], [1.4, -0.2], [2.8, 0.25]].map(([x, z]) => <mesh key={`${x}-${z}`} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.035, 6.5]} /><meshBasicMaterial color="#31526f" /></mesh>)}
          {[-2.2, -1, 0.2, 1.4, 2.6].map((z) => <mesh key={z} position={[0, 0.04, z]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[8.8, 0.035]} /><meshBasicMaterial color="#31526f" /></mesh>)}
          {areaPoints.map((area, index) => <MapMarker key={area.name} position={[area.x, area.y]} label={area.name} active={selected === index} onClick={() => onSelect(index)} />)}
        </group>
      </Suspense>
      <OrbitControls enablePan enableZoom minDistance={4} maxDistance={11} maxPolarAngle={Math.PI / 2.15} target={[0, 0, 0]} />
    </Canvas>
  )
}

export function PropertyMap() {
  const [category, setCategory] = useState<Category>('All')
  const [location, setLocation] = useState('All locations')
  const [selected, setSelected] = useState<number | null>(0)
  const [selectedProperty, setSelectedProperty] = useState(0)
  const [mobileFilters, setMobileFilters] = useState(false)

  const filtered = useMemo(() => properties.filter((property) => {
    const matchesLocation = location === 'All locations' || property.location.startsWith(location)
    const matchesCategory = category === 'All' || category === 'Apartment' || (category === 'Commercial' && false) || (category === 'Villa' && property.title.includes('Residences')) || (category === 'Land' && false)
    return matchesLocation && matchesCategory
  }), [category, location])

  const activeProperty = properties[selectedProperty]

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#dce5ee] bg-white/95 backdrop-blur">
        <div className="relative mx-auto flex h-[70px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8"><SiteMobileNav />
          <Link href="/" className="flex items-center gap-3" aria-label="OneStep Dream Property home"><span className="text-[32px] font-black leading-none tracking-[-0.12em] text-[#0874d1]">odp</span><span className="hidden border-l border-[#dce5ee] pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5f6368] sm:inline">Property Atlas</span></Link>
          <nav className="hidden items-center gap-6 text-sm text-[#5f6368] md:flex"><Link href="/" className="hover:text-[#0874d1]">Home</Link><Link href="#explore" className="font-semibold text-[#111827]">Explore map</Link><Link href="/agent/dashboard" className="hover:text-[#0874d1]">Agent workspace</Link></nav>
          <Link href="/" className="rounded-full border border-[#0874d1] px-3 py-2 text-xs font-semibold text-[#0874d1] transition hover:bg-[#eef7ff] sm:px-4">Back to listings</Link>
        </div>
      </header>

      <main id="explore" className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="mb-8 max-w-2xl"><div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0874d1]"><Sparkles className="size-4" /> Explore by location</div><h1 className="text-4xl font-medium tracking-[-0.05em] sm:text-5xl">Find your next address, in context.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-[#5f6368] sm:text-base">Move around Bengaluru&apos;s most promising neighbourhoods, compare nearby homes, and open the same trusted property journey.</p></section>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 overflow-hidden rounded-[24px] border border-[#1d3c5d] bg-[#08192e] shadow-[0_20px_60px_rgba(8,25,46,0.16)]"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 text-white sm:px-5"><div><p className="text-sm font-semibold">Bengaluru property atlas</p><p className="mt-1 text-xs text-white/55">Drag to pan · Scroll to zoom · Select an area</p></div><button type="button" onClick={() => setSelected(null)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs text-white/75 hover:bg-white/10"><LocateFixed className="size-3.5" /> Reset view</button></div><div className="relative h-[520px] w-full overflow-hidden sm:h-[600px]"><CityMap selected={selected} onSelect={(index) => { setSelected(index); setSelectedProperty(Math.min(index, properties.length - 1)) }} /><div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(101,163,197,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(101,163,197,0.13)_1px,transparent_1px)] bg-[size:72px_72px] opacity-70" aria-hidden="true" /><div className="pointer-events-none absolute inset-0"><div className="absolute left-[8%] top-[12%] text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">Bengaluru · East corridor</div>{areaPoints.map((area, index) => { const left = `${50 + area.x * 12}%`; const top = `${50 - area.y * 12}%`; return <button key={area.name} type="button" onClick={() => { setSelected(index); setSelectedProperty(index) }} className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold shadow-lg transition ${selected === index ? 'border-[#62b7ff] bg-[#0874d1] text-white' : 'border-white/20 bg-[#102a43]/90 text-white/80 hover:border-[#62b7ff]'}`} style={{ left, top }}><span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#62b7ff] align-middle" />{area.name}</button> })}</div></div><div className="flex flex-wrap gap-4 border-t border-white/10 px-4 py-3 text-[11px] text-white/65 sm:px-5"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#0874d1]" /> Selected area</span><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#dbe8f5]" /> Available properties</span><span className="ml-auto">{filtered.length} homes in view</span></div></div>
          <aside className="flex min-w-0 flex-col gap-5"><div className="rounded-[20px] border border-[#dce5ee] bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Search the atlas</h2><button type="button" onClick={() => setMobileFilters(!mobileFilters)} className="inline-flex items-center gap-1 text-xs font-semibold text-[#0874d1] lg:hidden"><SlidersHorizontal className="size-3.5" /> Filters</button></div><div className={`mt-4 grid gap-3 ${mobileFilters ? '' : 'hidden lg:grid'}`}><label className="grid gap-1.5 text-xs font-semibold text-[#5f6368]">Location<select value={location} onChange={(event) => setLocation(event.target.value)} className="h-11 rounded-xl border border-[#dce5ee] bg-white px-3 text-sm font-medium text-[#111827] outline-none focus:border-[#0874d1]"><option>All locations</option>{areaPoints.map((area) => <option key={area.name}>{area.name}</option>)}</select></label><label className="grid gap-1.5 text-xs font-semibold text-[#5f6368]">Property type<select value={category} onChange={(event) => setCategory(event.target.value as Category)} className="h-11 rounded-xl border border-[#dce5ee] bg-white px-3 text-sm font-medium text-[#111827] outline-none focus:border-[#0874d1]">{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label><label className="grid gap-1.5 text-xs font-semibold text-[#5f6368]">Budget<select className="h-11 rounded-xl border border-[#dce5ee] bg-white px-3 text-sm font-medium text-[#111827] outline-none focus:border-[#0874d1]"><option>Any price</option><option>Under ₹1 Cr</option><option>₹1–2 Cr</option><option>₹2 Cr+</option></select></label><label className="grid gap-1.5 text-xs font-semibold text-[#5f6368]">Bedrooms<select className="h-11 rounded-xl border border-[#dce5ee] bg-white px-3 text-sm font-medium text-[#111827] outline-none focus:border-[#0874d1]"><option>Any BHK</option><option>2 BHK</option><option>3 BHK</option><option>4 BHK</option></select></label></div></div><div className="rounded-[20px] border border-[#dce5ee] bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6368]">{selected !== null ? areaPoints[selected]?.name : 'All areas'}</p><h2 className="mt-1 text-2xl font-medium tracking-[-0.04em]">{filtered.length} homes nearby</h2></div><MapPin className="size-5 text-[#0874d1]" /></div><div className="mt-4 grid gap-2">{areaPoints.slice(0, 4).map((area, index) => <button key={area.name} type="button" onClick={() => { setSelected(index); setSelectedProperty(index) }} className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left transition ${selected === index ? 'border-[#0874d1] bg-[#eef7ff]' : 'border-[#e7edf3] hover:border-[#b6d5ed]'}`}><span><span className="block text-sm font-semibold">{area.name}</span><span className="text-xs text-[#5f6368]">{area.count} mapped properties</span></span><ArrowRight className="size-4 text-[#0874d1]" /></button>)}</div></div></aside>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="rounded-[20px] border border-[#dce5ee] bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6368]">Mapped properties</p><h2 className="mt-1 text-2xl font-medium tracking-[-0.04em]">A closer look</h2></div><span className="text-xs text-[#5f6368]">{filtered.length} results</span></div><div className="grid gap-3 sm:grid-cols-2">{filtered.slice(0, 4).map((property) => { const index = properties.indexOf(property); return <Link href={`/properties/${index}`} key={property.title} className="group flex gap-3 rounded-2xl border border-[#e7edf3] p-2 transition hover:border-[#0874d1]"><div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#eef2f6]"><Image src={property.image} alt="" fill loading="lazy" sizes="80px" className="object-cover transition group-hover:scale-105" /></div><div className="min-w-0 py-1"><p className="truncate text-sm font-semibold">{property.title}</p><p className="mt-1 text-xs text-[#5f6368]">{property.location}</p><p className="mt-2 text-sm font-semibold text-[#0874d1]">{property.price}</p></div></Link> })}</div></div><div className="rounded-[20px] border border-[#dce5ee] bg-[#eaf4fb] p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0874d1]">Selected property</p><div className="relative mt-4 aspect-[1.35/1] overflow-hidden rounded-2xl bg-white"><Image src={activeProperty.image} alt={activeProperty.title} fill loading="lazy" sizes="(max-width: 1024px) 100vw, 360px" className="object-cover" /><button type="button" onClick={() => setSelectedProperty(0)} aria-label="Clear selected property" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-[#111827]"><X className="size-4" /></button></div><h2 className="mt-4 text-xl font-semibold">{activeProperty.title}</h2><p className="mt-1 flex items-center gap-1 text-sm text-[#5f6368]"><MapPin className="size-3.5" /> {activeProperty.location}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#5f6368]"><span className="flex items-center gap-1"><BedDouble className="size-3.5" /> {parseBhk(activeProperty.details)}</span><span className="flex items-center gap-1"><Bath className="size-3.5" /> 2 bathrooms</span><span className="flex items-center gap-1"><Building2 className="size-3.5" /> Apartment</span></div><p className="mt-4 text-lg font-semibold text-[#0874d1]">{activeProperty.price}</p><Link href={`/properties/${selectedProperty}`} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0874d1] text-sm font-semibold text-white transition hover:bg-[#075fae]">View property <ArrowRight className="size-4" /></Link></div></section>
      </main>
      <footer className="border-t border-[#dce5ee] bg-white"><div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-4 py-8 text-xs text-[#5f6368] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>© 2026 OneStep Dream Property</span><div className="flex gap-4"><Link href="/" className="hover:text-[#0874d1]">Listings</Link><Link href="/agent/dashboard" className="hover:text-[#0874d1]">Agent workspace</Link></div></div></footer>
    </div>
  )
}

export default PropertyMap
