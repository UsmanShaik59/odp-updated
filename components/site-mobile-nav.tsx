'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [['Home', '/#top'], ['Buy Flats', '/#properties'], ['Properties', '/#properties'], ['Locations', '/#locations'], ['About Us', '/about'], ['Contact', '/contact']] as const

export function SiteMobileNav() {
  const [open, setOpen] = useState(false)
  return <>
    <button type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#dce5eb] text-[#111111] lg:hidden">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    <>
      <button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className={`fixed inset-0 z-40 bg-[#152b43]/30 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'}`} />
      <nav aria-label="Mobile navigation" className={`fixed inset-x-0 bottom-0 top-[70px] z-50 overflow-y-auto border-t border-[#cfe2f5] bg-white shadow-[0_18px_50px_rgba(21,43,67,0.18)] transition-[opacity,transform,visibility] duration-300 ease-out lg:hidden ${open ? 'visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-4 opacity-0'}`}>
        <div className="mx-auto w-full max-w-[520px] divide-y divide-[#cfe2f5]">{links.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)} className="flex min-h-[70px] items-center px-6 text-base font-medium text-[#152b43] transition-all duration-200 hover:bg-[#f1f8ff] hover:pl-7">{label}</Link>)}</div>
      </nav>
    </>
  </>
}
