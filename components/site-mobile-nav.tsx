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
        {open ? <X aria-hidden="true" className="size-[22px]" strokeWidth={1.75} /> : <Menu aria-hidden="true" className="size-[22px]" strokeWidth={1.75} />}
      </button>
      <button
        type="button"
        aria-label="Close navigation"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        className={`fixed inset-x-0 bottom-0 top-[70px] z-40 bg-[#152b43]/10 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <nav
        id="site-mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        inert={!open ? true : undefined}
        className={`fixed inset-x-0 bottom-0 top-[70px] z-50 overflow-y-auto overscroll-contain border-t border-[#e8edf3] bg-white text-[#152b43] shadow-[0_16px_40px_rgba(21,43,67,0.08)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
      >
        <div className="mx-auto w-full max-w-[520px] divide-y divide-[#edf1f5]">
          {links.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="group flex min-h-[64px] items-center gap-4 px-5 text-[15px] font-medium text-[#24384d] transition-colors duration-200 hover:bg-[#f8fbfe] active:bg-[#f2f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0874d1] motion-reduce:transition-none"
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
