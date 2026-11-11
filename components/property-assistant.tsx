'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bot, Building2, ChevronRight, MapPin, MessageCircle, Search, Send, X } from 'lucide-react'
import { properties } from '@/lib/properties'

type Property = (typeof properties)[number]

type SearchResult = {
  reply: string
  matches: Property[]
}

const suggestions = [
  { label: 'Find a property', query: 'Show me available properties' },
  { label: 'Search by location', query: 'Show me properties in Whitefield' },
  { label: 'Search by budget', query: 'Find properties under 1 crore' },
  { label: 'Search by BHK', query: 'Show me 3 BHK homes' },
  { label: 'Commercial properties', query: 'Show me commercial properties' },
  { label: 'Available land', query: 'Show me available land' },
]

function getBhk(property: Property) {
  return property.details.match(/\d+ BHK/i)?.[0] ?? ''
}

function getPriceInLakhs(price: string) {
  const value = Number(price.replace(/[^\d.]/g, ''))
  return price.includes('Cr') ? value * 100 : value
}

function searchProperties(input: string): SearchResult {
  const query = input.toLowerCase()
  const location = properties.find((property) => query.includes(property.location.split(',')[0].toLowerCase()))?.location.split(',')[0]
  const requestedBhk = query.match(/([234])\s*(?:bhk|bed(?:room)?s?)/i)?.[1]
  const budget = query.match(/(?:under|below|within|up to|upto)\s*[₹]?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|cr|crore|crores)?/i)
  const budgetLakhs = budget ? Number(budget[1]) * (budget[2]?.toLowerCase().startsWith('cr') ? 100 : 1) : null
  const isCommercial = /commercial|office|shop|building/.test(query)
  const isLand = /\bland\b|plot/.test(query)

  const matches = properties.filter((property) => {
    const matchesLocation = !location || property.location.toLowerCase().includes(location.toLowerCase())
    const matchesBhk = !requestedBhk || getBhk(property).startsWith(requestedBhk)
    const matchesBudget = budgetLakhs === null || getPriceInLakhs(property.price) <= budgetLakhs
    const matchesType = !isCommercial && !isLand
    return matchesLocation && matchesBhk && matchesBudget && matchesType
  })

  if (isCommercial || isLand) {
    return { reply: 'I could not find a matching commercial or land listing in the current property catalogue. Try a location, budget or BHK search for the available homes.', matches: [] }
  }
  if (matches.length) {
    return { reply: `I found ${matches.length} ${matches.length === 1 ? 'property' : 'properties'} matching your search. These are from the current catalogue.`, matches }
  }
  if (location || requestedBhk || budgetLakhs !== null) {
    return { reply: 'I could not find an exact match in the current catalogue. Try widening your location, budget or bedroom preference.', matches: [] }
  }
  return { reply: 'I can search the current catalogue by location, budget, BHK and property type. What would you like to find?', matches: [] }
}

export function PropertyAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ question: string; result: SearchResult }>>([])
  const latest = useMemo(() => messages[messages.length - 1], [messages])

  const ask = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed) return
    setMessages((current) => [...current, { question: trimmed, result: searchProperties(trimmed) }])
    setInput('')
  }

  return (
    <div className="fixed inset-x-3 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[74] sm:bottom-[6.25rem] sm:left-auto sm:right-6 sm:inset-x-auto">
      {open && (
        <section role="dialog" aria-label="Smart property discovery assistant" className="mb-3 flex w-[min(390px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[#d9e7f3] bg-white text-[#111111] shadow-[0_20px_60px_rgba(7,40,75,0.22)]">
          <div className="flex items-center justify-between bg-[#f0a879] px-4 py-3 text-[#542d18]">
            <div className="flex items-center gap-2"><Bot className="size-5" /><div><p className="text-sm font-semibold">Property discovery</p><p className="text-[10px] text-white/75">Search the current listings</p></div></div>
            <button type="button" aria-label="Close property discovery" onClick={() => setOpen(false)}><X className="size-4" /></button>
          </div>
          <div className="max-h-[min(470px,60vh)] space-y-3 overflow-y-auto bg-[#f8fbfe] p-3 text-xs leading-5">
            <div className="rounded-2xl rounded-tl-sm border border-[#e2edf5] bg-white px-3 py-2.5 text-[#4f5d68]">Tell me what you are looking for and I&apos;ll filter our available properties.</div>
            {messages.length === 0 && <div className="grid grid-cols-2 gap-2">{suggestions.map((suggestion) => <button key={suggestion.label} type="button" onClick={() => ask(suggestion.query)} className="flex items-center gap-1.5 rounded-xl border border-[#cfe0ef] bg-white px-2.5 py-2 text-left text-[10px] font-medium text-[#cf7544] transition-colors hover:border-[#cf7544]"><Search className="size-3 shrink-0" />{suggestion.label}</button>)}</div>}
            {messages.map(({ question, result }) => <div key={question} className="space-y-2"><div className="ml-8 rounded-2xl rounded-tr-sm bg-[#f0a879] px-3 py-2.5 text-[#542d18]">{question}</div><div className="mr-3 rounded-2xl rounded-tl-sm border border-[#e2edf5] bg-white px-3 py-2.5 text-[#4f5d68]">{result.reply}</div>{result.matches.length > 0 && <div className="space-y-2">{result.matches.map((property) => { const index = properties.indexOf(property); return <article key={property.title} className="overflow-hidden rounded-xl border border-[#d9e7f3] bg-white"><div className="flex gap-2 p-2"><img src={property.image} alt="" loading="lazy" className="size-16 shrink-0 rounded-lg object-cover" /><div className="min-w-0"><h3 className="truncate text-[11px] font-semibold text-[#17324d]">{property.title}</h3><p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#687887]"><MapPin className="size-3" />{property.location}</p><p className="mt-1 text-[10px] font-semibold text-[#cf7544]">{property.price} · {property.details}</p></div></div><Link href={`/properties/${index}`} className="flex items-center justify-between border-t border-[#edf3f7] px-3 py-2 text-[10px] font-semibold text-[#cf7544]">View property <ChevronRight className="size-3" /></Link></article> })}</div>}</div>)}
            {latest?.result.matches.length === 0 && messages.length > 0 && <div className="rounded-xl border border-[#e2edf5] bg-white px-3 py-2 text-[10px] text-[#687887]">Try &quot;3 BHK in Whitefield&quot; or &quot;under 1 crore&quot;.</div>}
          </div>
          <div className="border-t border-[#e2edf5] p-3"><Link href="/agent/dashboard" className="mb-2 flex items-center justify-center gap-1 rounded-lg border border-[#cf7544] px-2 py-2 text-[11px] font-semibold text-[#cf7544]"><MessageCircle className="size-3.5" /> Need personal assistance? Talk to a Property Agent</Link><form onSubmit={(event) => { event.preventDefault(); ask(input) }} className="flex gap-2"><input aria-label="Search available properties" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Try 3 BHK in Whitefield..." className="min-w-0 flex-1 rounded-lg border border-[#cfe0ef] px-3 py-2 text-xs outline-none focus:border-[#cf7544]" /><button type="submit" aria-label="Search properties" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#cf7544] text-white"><Send className="size-4" /></button></form></div>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f0a879] px-4 py-3 text-xs font-semibold text-[#542d18] shadow-[0_10px_25px_rgba(207,117,68,.2)] sm:w-auto"><Bot className="size-4" /> Property discovery</button>
    </div>
  )
}

export { searchProperties }
