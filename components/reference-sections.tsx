"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  FolderOpen,
  MapPin,
  MessageSquare,
  Search,
} from "lucide-react";

const bankOffers = [
  { bank: "SBI", rate: "Starts at 7.25%", tone: "text-[#2d2a83]" },
  { bank: "Canara Bank", rate: "Starts at 7.15%", tone: "text-[#1177a8]" },
  { bank: "Bank of Baroda", rate: "Starts at 7.2%", tone: "text-[#c46a2b]" },
  { bank: "Bank of India", rate: "Starts at 7.1%", tone: "text-[#17628c]" },
];

const searchTabs = ["Buy", "Rent", "New Projects", "PG", "Plot", "Commercial"];

export function ReferenceSections() {
  return (
    <div className="mx-auto w-full max-w-[1280px] space-y-5 px-4 pb-4 min-[360px]:px-5 md:px-8 lg:space-y-7 lg:px-8">
      <section className="relative overflow-hidden rounded-[18px] bg-gradient-to-r from-[#e0f7fb] via-[#f4fcfd] to-white px-5 py-6 sm:px-8 lg:px-10 lg:py-8" aria-labelledby="site-visits-title">
        <div className="relative z-10 flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div>
            <h2 id="site-visits-title" className="max-w-[800px] text-2xl font-normal leading-tight tracking-[-0.04em] text-[#18344d] sm:text-3xl lg:text-[34px]">
              Plan hassle-free <strong>Site Visits & Evaluate Projects</strong> with <strong>MagicDiary</strong>
            </h2>
            <p className="mt-3 inline-flex rounded-lg bg-[#fff6df] px-3 py-2 text-sm font-medium text-[#111111] sm:text-base">
              Get <strong className="mx-1">Free Cab</strong> for every site visit!
              <span className="ml-3" aria-hidden="true">🚕</span>
            </p>
          </div>
          <Link href="/contact" className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#e3232d] px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e3232d]">
            Find out how
          </Link>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-64 rounded-full bg-white/50 blur-3xl" aria-hidden="true" />
      </section>

      <section className="relative overflow-hidden rounded-[18px] border border-[#f0c557] bg-gradient-to-r from-[#fffdf8] via-[#fffefb] to-[#eef8e8] px-5 py-7 sm:px-8 lg:px-10 lg:py-8" aria-labelledby="loan-title">
        <div className="relative z-10 max-w-[850px]">
          <p className="text-2xl font-medium tracking-[-0.04em] text-[#ed1c2a] sm:text-3xl">magic<span className="text-[#111111]">Loans</span></p>
          <h2 id="loan-title" className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-black sm:text-3xl lg:text-[36px]">Compare Home Loan Offers from 40+ Banks</h2>
          <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-base text-[#686868] sm:text-lg">
            <span className="inline-flex items-center gap-2"><Check className="size-5 rounded-full text-[#666]" />Rates starting from <strong className="text-[#009b83]">7%</strong></span>
            <span className="inline-flex items-center gap-2"><Check className="size-5 rounded-full text-[#666]" /><strong className="text-[#e3232d]">0%*</strong> Processing Fee</span>
          </div>
          <p className="mt-7 text-xs font-medium uppercase tracking-[0.08em] text-[#a4761d]">Our banking partners</p>
          <div className="mt-4 flex gap-3 overflow-hidden pb-1">
            {bankOffers.map((offer) => (
              <div key={offer.bank} className="min-w-[142px] rounded-2xl border border-[#e7e7e7] bg-white/75 px-3 py-3 text-center shadow-sm sm:min-w-[168px]">
                <p className={`text-base font-bold ${offer.tone}`}>{offer.bank}</p>
                <p className="mt-1 text-[11px] font-bold text-[#008e7b]">{offer.rate}</p>
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <Link href="#properties" className="inline-flex items-center gap-2 text-sm font-semibold text-[#e3232d]">Explore Bank Offers <ArrowRight className="size-5" /></Link>
            <Link href="/contact" className="rounded-full bg-[#e3232d] px-7 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]">Check Your Eligibility</Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 bottom-[-70px] h-52 w-72 rounded-full bg-[#d8efd1] blur-2xl" aria-hidden="true" />
      </section>

      <section className="rounded-[18px] bg-gradient-to-b from-[#effbfc] to-white px-5 py-7 text-center sm:px-8 lg:px-10 lg:py-8" aria-labelledby="homes-title">
        <span className="inline-block rounded-md bg-[#ffda77] px-3 py-1 text-xs font-medium text-[#3a3a3a]">New Launch</span>
        <p className="mt-4 text-3xl font-medium tracking-[-0.06em] text-[#ed1c2a] sm:text-4xl">magicHomes</p>
        <h2 id="homes-title" className="mt-2 text-xl font-semibold text-[#162c43] sm:text-2xl">Encyclopedia For All New Projects</h2>
        <div className="mt-7 grid gap-3 text-left lg:grid-cols-3 lg:gap-5">
          <FeatureCard icon={<FolderOpen />} label="Directory for All New Projects" className="bg-[#c9f5fb]" />
          <FeatureCard icon={<FileText />} label="All Reports from RERA" className="bg-[#ffd0d5]" />
          <FeatureCard icon={<MessageSquare />} label="Expert Reviews & Advice" className="bg-[#fff0c7]" />
        </div>
        <Link href="#properties" className="mt-7 inline-flex rounded-full bg-[#e3232d] px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03]">View All New projects</Link>
      </section>

      <section className="rounded-[18px] bg-white px-1 py-3 sm:px-5 lg:py-5" aria-label="Property search">
        <h2 className="text-center text-2xl font-normal tracking-[-0.04em] text-[#263242] sm:text-3xl">Start your <strong>#PataBadloLifeBadlo</strong> Journey</h2>
        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-semibold text-[#252525] sm:gap-x-8" aria-label="Property search categories">
          {searchTabs.map((tab, index) => <Link key={tab} href="#properties" className={index === 0 ? "text-[#e3232d]" : "transition-colors hover:text-[#e3232d]"}>{tab}</Link>)}
        </nav>
        <div className="mt-7 flex flex-col rounded-full border border-[#989898] p-1 shadow-[0_2px_5px_rgba(0,0,0,0.08)] lg:flex-row lg:items-center lg:p-0">
          <button type="button" className="flex min-h-14 flex-1 items-center gap-3 px-5 text-left text-sm text-[#7a7a7a] sm:text-base"><MapPin className="size-5 shrink-0 text-[#e3232d]" />Enter City, Locality, Project</button>
          <button type="button" className="flex min-h-12 items-center justify-between gap-3 border-t border-[#e0e0e0] px-5 text-left text-sm text-[#666] sm:text-base lg:min-w-[220px] lg:border-l lg:border-t-0"><span className="inline-flex items-center gap-3"><FolderOpen className="size-5 text-[#e3232d]" />Property Type</span><ChevronDown className="size-4" /></button>
          <button type="button" className="flex min-h-12 items-center justify-between gap-3 border-t border-[#e0e0e0] px-5 text-left text-sm text-[#666] sm:text-base lg:min-w-[190px] lg:border-l lg:border-t-0"><span className="inline-flex items-center gap-3"><span className="text-lg font-bold text-[#e3232d]">₹</span>Budget</span><ChevronDown className="size-4" /></button>
          <Link href="#properties" className="m-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e3232d] px-8 text-base font-bold text-white lg:min-w-[190px]"><Search className="size-5" />Search</Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, label, className }: { icon: React.ReactNode; label: string; className: string }) {
  return <div className={`flex min-h-[106px] items-center gap-5 rounded-[26px] border-2 border-white px-6 shadow-[0_12px_24px_rgba(25,63,81,0.08)] ${className}`}><span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/75 text-[#e3232d]">{icon}</span><span className="text-lg font-normal text-[#101010]">{label}</span></div>;
}

export default ReferenceSections;
