'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { properties } from '@/lib/properties'
import { CalendarDays, Check, ChevronRight, LogOut, MessageSquare, Search, Users } from 'lucide-react'

type Enquiry = { id: string; property_id: string; customer_name: string; customer_email: string; customer_phone: string | null; budget: string | null; bhk: string | null; message: string; status: string; created_at: string }
type Appointment = { id: string; property_id: string; customer_id: string; appointment_date: string; appointment_time: string; venue: string; status: string }
const statuses = ['New', 'Contacted', 'Interested', 'Site Visit Scheduled', 'Site Visit Completed', 'Follow-up', 'Closed']

export default function AgentDashboard() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selected, setSelected] = useState<Enquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [appointmentError, setAppointmentError] = useState('')

  const load = async (id: string) => {
  if (!supabase) return
  const [{ data: eq }, { data: ap }] = await Promise.all([

      supabase.from('enquiries').select('id,property_id,customer_name,customer_email,customer_phone,budget,bhk,message,status,created_at').eq('agent_id', id).order('created_at', { ascending: false }),
      supabase.from('appointments').select('id,property_id,customer_id,appointment_date,appointment_time,venue,status').eq('agent_id', id).order('appointment_date'),
    ])
    setEnquiries(eq ?? [])
    setAppointments(ap ?? [])
  }

  useEffect(() => {
  if (!supabase) {
  setLoading(false)
  return
  }
  supabase.auth.getUser().then(({ data }) => { if (data.user) { setUser(data.user); load(data.user.id) }; setLoading(false) })
  }, [supabase])

  const signIn = async (event: React.FormEvent) => { event.preventDefault(); setError(''); if (!supabase) { setError('Agent sign in is unavailable until the property database is connected.'); return }; const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password }); if (authError || !data.user) { setError('Invalid email or password.'); return }; setUser(data.user); await load(data.user.id) }
  const updateStatus = async (status: string) => { if (!selected || !supabase) return; const { error: updateError } = await supabase.from('enquiries').update({ status, updated_at: new Date().toISOString() }).eq('id', selected.id); if (!updateError) { setSelected({ ...selected, status }); setEnquiries(enquiries.map((item) => item.id === selected.id ? { ...item, status } : item)) } }
  const propertyName = (id: string) => properties[Number(id)]?.title ?? `Property ${id}`
  const filteredEnquiries = enquiries.filter((item) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return [item.customer_name, item.customer_email, item.status, propertyName(item.property_id)].some((value) => value.toLowerCase().includes(query))
  })

  if (loading) return <main className="min-h-screen bg-[#f5f8fb] p-8 text-[#17324d]">Loading dashboard...</main>
  if (!user) return <main className="flex min-h-screen items-center justify-center bg-[#f5f8fb] px-4"><form onSubmit={signIn} className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"><p className="text-sm font-semibold text-[#cf7544]">OneStep Dream Property</p><h1 className="mt-2 text-3xl font-semibold text-[#17324d]">Agent sign in</h1><p className="mt-2 text-sm text-[#687887]">Access enquiries, appointments and customer conversations.</p><div className="mt-7 flex flex-col gap-4"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" className="rounded-xl border border-[#dce6ee] px-4 py-3 text-sm outline-none focus:border-[#cf7544]" /><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="rounded-xl border border-[#dce6ee] px-4 py-3 text-sm outline-none focus:border-[#cf7544]" />{error && <p role="alert" className="text-sm text-red-600">{error}</p>}<button className="rounded-xl bg-[#cf7544] px-4 py-3 font-semibold text-white">Sign in securely</button></div><Link href="/" className="mt-6 block text-center text-sm text-[#687887]">Return to website</Link></form></main>

  return <main className="min-h-screen bg-[#f5f8fb] text-[#17324d]"><header className="border-b border-[#e1e9f0] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#cf7544]">Agent workspace</p><h1 className="text-xl font-semibold">Property operations</h1></div><button onClick={() => supabase?.auth.signOut().then(() => setUser(null))} className="flex items-center gap-2 rounded-lg border border-[#dce6ee] px-3 py-2 text-sm"><LogOut className="size-4" /> Sign out</button></div></header><div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[1fr_360px]"><section><div className="grid gap-4 sm:grid-cols-3"><Stat icon={<MessageSquare />} label="Active enquiries" value={enquiries.filter((e) => e.status !== 'Closed').length} /><Stat icon={<CalendarDays />} label="Upcoming visits" value={appointments.filter((a) => a.status !== 'Cancelled' && a.status !== 'Completed').length} /><Stat icon={<Users />} label="Completed visits" value={appointments.filter((a) => a.status === 'Completed').length} /></div><div className="mt-6 rounded-2xl border border-[#e1e9f0] bg-white"><div className="flex flex-col gap-4 border-b border-[#e1e9f0] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"><div><h2 className="font-semibold">Assigned enquiries</h2><p className="mt-1 text-sm text-[#687887]">Customer requests connected to your properties.</p></div><label className="flex h-10 w-full items-center gap-2 rounded-xl border border-[#dce6ee] px-3 sm:max-w-[240px]"><Search className="size-4 shrink-0 text-[#9aaebb]" /><span className="sr-only">Search enquiries</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search enquiries" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9aaebb]" /></label></div><div className="divide-y divide-[#edf2f6]">{filteredEnquiries.length ? filteredEnquiries.map((item) => <button key={item.id} onClick={() => setSelected(item)} className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-[#f8fbfe]"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{item.customer_name}</p><span className="rounded-full bg-[#e8f3fc] px-2 py-1 text-[11px] font-semibold text-[#cf7544]">{item.status}</span></div><p className="mt-1 truncate text-sm text-[#687887]">{propertyName(item.property_id)} · {item.message}</p></div><ChevronRight className="size-4 shrink-0 text-[#9aaebb]" /></button>) : <p className="p-8 text-center text-sm text-[#687887]">No assigned enquiries yet.</p>}</div></div></section><aside className="rounded-2xl border border-[#e1e9f0] bg-white p-5"><h2 className="font-semibold">Upcoming appointments</h2><div className="mt-4 flex flex-col gap-3">{appointments.length ? appointments.map((item) => <div key={item.id} className="rounded-xl bg-[#f8fbfe] p-4"><p className="font-semibold">{propertyName(item.property_id)}</p><p className="mt-1 text-sm text-[#687887]">{item.appointment_date} at {item.appointment_time}</p><p className="text-sm text-[#687887]">{item.venue}</p><span className="mt-2 inline-block text-xs font-semibold text-[#cf7544]">{item.status}</span></div>) : <p className="text-sm text-[#687887]">No upcoming appointments.</p>}</div></aside></div>{selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#17324d]/30 p-4 sm:items-center"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#cf7544]">Customer enquiry</p><h2 className="mt-1 text-2xl font-semibold">{selected.customer_name}</h2></div><button onClick={() => setSelected(null)} className="text-sm text-[#687887]">Close</button></div><div className="mt-6 flex flex-col gap-3 text-sm"><p><strong>Property:</strong> {propertyName(selected.property_id)}</p><p><strong>Email:</strong> {selected.customer_email}</p>{selected.customer_phone && <p><strong>Phone:</strong> {selected.customer_phone}</p>}<p><strong>Requirements:</strong> {selected.bhk || 'Any BHK'} · {selected.budget || 'Budget not specified'}</p><div className="rounded-xl bg-[#f8fbfe] p-4"><p className="font-medium">Message</p><p className="mt-1 text-[#687887]">{selected.message}</p></div><label className="font-medium">Update enquiry status<select value={selected.status} onChange={(e) => updateStatus(e.target.value)} className="mt-2 w-full rounded-xl border border-[#dce6ee] px-3 py-3 font-normal"><option value="">Select status</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div></div></div>}</main>
}
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="rounded-2xl border border-[#e1e9f0] bg-white p-5"><div className="flex items-center gap-2 text-[#cf7544]">{icon}<span className="text-sm text-[#687887]">{label}</span></div><p className="mt-3 text-3xl font-semibold">{value}</p></div> }
