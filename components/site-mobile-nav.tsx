'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { BedDouble, Building2, Headphones, House, Info, MapPin, Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', href: '/#top', Icon: House },
  { label: 'Buy Flats', href: '/#properties', Icon: BedDouble },
  { label: 'Properties', href: '/#properties', Icon: Building2 },
  { label: 'Locations', href: '/#locations', Icon: MapPin },
  { label: 'About Us', href: '/about', Icon: Info },
  { label: 'Contact', href: '/contact', Icon: Headphones },
] as const

type SiteMobileNavProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onNavigate?: () => void
}

export function SiteMobileNav({
  open: controlledOpen,
  onOpenChange,
  onNavigate,
}: SiteMobileNavProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = controlledOpen ?? internalOpen

  const setOpen = useCallback((nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }, [isControlled, onOpenChange])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    if (open) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', closeOnEscape)
    }

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open, setOpen])

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-mobile-navigation"
        onClick={() => setOpen(!open)}
        className="order-last inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-[#152b43] transition-colors duration-200 hover:bg-[#f3f7fa] active:bg-[#eaf1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1] motion-reduce:transition-none lg:hidden"
      >
        <span className="relative size-[22px]">
          <Menu
            aria-hidden="true"
            className={`absolute inset-0 size-[22px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${open ? 'rotate-45 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
            strokeWidth={1.75}
          />
          <X
            aria-hidden="true"
            className={`absolute inset-0 size-[22px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${open ? 'rotate-0 scale-100 opacity-100' : '-rotate-45 scale-75 opacity-0'}`}
            strokeWidth={1.75}
          />
        </span>
      </button>
      <button
        type="button"
        aria-label="Close navigation"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        data-open={open}
        className={`mobile-drawer-backdrop fixed inset-0 z-40 bg-[#34363d] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      />
      <nav
        id="site-mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        data-open={open}
        style={{ top: '12px', bottom: '0', left: '15px', width: 'min(calc(100vw - 30px), 280px)' }}
        className={`mobile-drawer-panel fixed z-50 overflow-y-auto overscroll-contain bg-white text-[#152b43] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="flex h-11 items-center justify-between border-b border-[#e8edf3] px-2">
          <Link
            href="/#top"
            onClick={() => setOpen(false)}
            className="text-[18px] font-black leading-none tracking-[-0.12em] text-[#0874d1]"
            aria-label="OneStep Dream Property home"
          >
            odp
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/#locations"
              onClick={() => setOpen(false)}
              aria-label="Locations"
              className="inline-flex size-8 items-center justify-center rounded-md text-[#0874d1] transition-colors hover:bg-[#f3f7fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0874d1]"
            >
              <MapPin className="size-[14px]" strokeWidth={2} aria-hidden="true" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex size-8 items-center justify-center rounded-md text-[#152b43] transition-colors hover:bg-[#f3f7fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0874d1]"
            >
              <X className="size-[14px]" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-[#edf1f5]">
          {links.map(({ label, href, Icon }, index) => (
            <Link
              key={label}
              href={href}
              onClick={() => {
                setOpen(false)
                onNavigate?.()
              }}
              style={{ transitionDelay: open ? `${index * 28}ms` : `${(links.length - index - 1) * 12}ms` }}
              className={`group flex min-h-[44px] items-center gap-3 px-3 text-[12px] font-medium text-[#24384d] transition-[opacity,transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#f8fbfe] active:bg-[#f2f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0874d1] motion-reduce:transition-none ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
            >
              <Icon className="size-[14px] shrink-0 text-[#0874d1] transition-colors duration-200 group-hover:text-[#005da8]" strokeWidth={1.75} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
