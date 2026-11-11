'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BedDouble, Building2, Headphones, House, Info, MapPin, Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', href: '/#top', Icon: House },
  { label: 'Buy Flats', href: '/#properties', Icon: BedDouble },
  { label: 'Properties', href: '/#properties', Icon: Building2 },
  { label: 'Locations', href: '/#locations', Icon: MapPin },
  { label: 'About Us', href: '/about', Icon: Info },
  { label: 'Contact', href: '/contact', Icon: Headphones },
] as const

export function SiteMobileNav() {
  const [open, setOpen] = useState(false)

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
  }, [open])

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="site-mobile-navigation"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-[#152b43] transition-colors duration-200 hover:bg-[#f3f7fa] active:bg-[#eaf1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1] motion-reduce:transition-none lg:hidden"
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
        className={`mobile-drawer-backdrop fixed inset-x-0 bottom-0 top-[70px] z-40 bg-[#152b43]/10 lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      />
      <nav
        id="site-mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        data-open={open}
        className={`mobile-drawer-panel fixed inset-x-0 bottom-0 top-[70px] z-50 overflow-y-auto overscroll-contain border-t border-[#e8edf3] bg-white text-[#152b43] shadow-[0_16px_40px_rgba(21,43,67,0.08)] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <div className="mx-auto w-full max-w-[520px] divide-y divide-[#edf1f5]">
          {links.map(({ label, href, Icon }, index) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${index * 28}ms` : `${(links.length - index - 1) * 12}ms` }}
              className={`group flex min-h-[64px] items-center gap-4 px-5 text-[15px] font-medium text-[#24384d] transition-[opacity,transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#f8fbfe] active:bg-[#f2f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0874d1] motion-reduce:transition-none ${open ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
            >
              <Icon className="size-5 shrink-0 text-[#0874d1] transition-colors duration-200 group-hover:text-[#005da8]" strokeWidth={1.75} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}
