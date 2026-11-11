"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  ArrowRight,
  Bath,
  BedDouble,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Handshake,
  Bot,
  Building2,
  Calculator,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  Cookie,
  FileText,
  FolderOpen,
  Headphones,
  House,
  Info,
  Ruler,
  SlidersHorizontal,
  ShieldCheck,
} from "lucide-react";
import { properties } from "@/lib/properties";
import { PropertyAssistant } from "./property-assistant";
import SiteFooter from "./site-footer";
import { SiteMobileNav } from "./site-mobile-nav";

type Property = (typeof properties)[number];

const nearby = [
  "ITPL · 8 min",
  "Phoenix Marketcity · 12 min",
  "Whitefield Metro · 15 min",
  "The International School · 10 min",
];

export function PropertyDetails({ property }: { property: Property }) {
  const [activeImage, setActiveImage] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [typedBrand, setTypedBrand] = useState("");

  const toggleSaved = (index: number) => {
    setSaved((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };

  const gallery =
    "images" in property
      ? property.images
      : [
          property.image,
          `${property.image}&sat=-10`,
          `${property.image}&con=1`,
          `${property.image}&blend=ffffff`,
        ];
  const [bhk, area] = property.details.split(" · ");
  const bathrooms = bhk.startsWith("4")
    ? "4 Bathrooms"
    : bhk.startsWith("3")
      ? "3 Bathrooms"
      : "2 Bathrooms";

  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#e8edf3] bg-white text-[#152b43] shadow-[0_2px_16px_rgba(21,43,67,0.04)]">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center gap-3 px-3 lg:h-[72px] lg:gap-6 lg:px-8">
          <SiteMobileNav
            open={menuOpen}
            onOpenChange={setMenuOpen}
            onNavigate={() => {
              setLocationOpen(false);
              setSearchOpen(false);
            }}
          />

          <Link
            href="/"
            className="order-1 flex shrink-0 items-center text-[#0874d1]"
            aria-label="OneStep Dream Property home"
          >
            <span className="text-[25px] font-black leading-none tracking-[-0.12em] lg:text-[32px]">
              odp
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-8 text-[13px] text-[#5f6368] lg:order-2 lg:flex lg:text-[15px]"
            aria-label="Main navigation"
          >
            {[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/#properties" },
              { label: "Locations", href: "/#locations" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(event) => {
                  const sectionId = item.href.split("#")[1];
                  if (!sectionId) return;

                  if (window.location.pathname === "/") {
                    event.preventDefault();
                    document.getElementById(sectionId)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                    window.history.replaceState(null, "", `/#${sectionId}`);
                  }
                }}
                className="transition-colors hover:text-[#0874d1]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="order-2 ml-auto flex min-w-0 items-center justify-end gap-2 lg:order-3 lg:max-w-[230px] lg:flex-none">
            <button
              type="button"
              aria-label="Choose location. Current location: Koramangala, Bengaluru"
              aria-expanded={locationOpen}
              onClick={() => {
                setLocationOpen(true);
                setMenuOpen(false);
                setSearchOpen(false);
              }}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[#152b43] transition-colors hover:bg-[#f3f7fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1] lg:h-auto lg:w-auto lg:justify-end lg:gap-1 lg:rounded-none lg:text-[11px] lg:font-semibold"
            >
              <MapPin aria-hidden="true" className="size-5 shrink-0 text-[#0874d1] lg:size-4" />
              <span className="sr-only lg:not-sr-only lg:truncate">Koramangala, Bengaluru</span>
              <ChevronDown
                aria-hidden="true"
                className="hidden size-3 shrink-0 text-[#496b73] lg:inline-flex"
              />
            </button>
          </div>
        </div>


      </header>

      <main>
        <div className="mx-auto mt-8 w-full max-w-[1280px] overflow-hidden px-3 pb-12 pt-7 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8 lg:pt-10">
          <div className="grid gap-7 lg:grid-cols-[1.18fr_.82fr] lg:gap-16">
            <section>
              <div className="relative aspect-[1.18/1] overflow-hidden bg-[#edf5fb] sm:aspect-[1.45/1]">
                <Image
                  src={gallery[activeImage]}
                  alt={`${property.title} interior`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <span
                  aria-label="odp property mark"
                  className="absolute right-4 top-4 z-10 text-3xl font-black leading-none tracking-[-0.14em] text-white drop-shadow-[0_2px_5px_rgba(0,0,0,.45)]"
                >
                  odp
                </span>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/45 to-transparent p-4 pt-16">
                  <span className="bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                    {property.status}
                  </span>
                  <span className="text-xs font-medium text-white">
                    {activeImage + 1} / {gallery.length}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setActiveImage(
                      (activeImage + gallery.length - 1) % gallery.length,
                    )
                  }
                  className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
                >
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() =>
                    setActiveImage((activeImage + 1) % gallery.length)
                  }
                  className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90"
                >
                  <ArrowRight />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {gallery.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-[1.4/1] overflow-hidden ${activeImage === index ? "ring-2 ring-[#0874d1] ring-offset-2" : "opacity-65 hover:opacity-100"}`}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="25vw"
                    />
                  </button>
                ))}
              </div>
            </section>
            <section className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0874d1]">
                    {property.status}
                  </p> */}
                  <h1 className="mt-3 break-words text-[2.35rem] font-medium leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                    {property.title}
                  </h1>
                  <p className="mt-4 flex items-center gap-2 text-sm text-[#5f6368]">
                    <MapPin className="size-4 text-[#0874d1]" />{" "}
                    {property.location}
                  </p>
                </div>
                {/* <button
                  type="button"
                  aria-label="Save property"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#dce5eb] hover:bg-[#f5faff]"
                >
                  <Heart />
                </button> */}
              </div>
              <div className="mt-8 border-y border-[#e5e5e5] py-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#5f6368]">
                  Starting price
                </p>
                <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#0874d1]">
                  {property.price}
                </p>
              </div>

              <Link
                href={`/properties/${properties.findIndex((item) => item.title === property.title)}/appointment`}
                className="mx-auto mt-7 flex h-12 w-full max-w-[280px] items-center justify-center gap-2 rounded-xl bg-[#0874d1] px-3 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(8,116,209,.2)] transition hover:bg-[#0667bb] sm:mx-0 sm:h-14 sm:max-w-none sm:px-5 sm:text-sm"
              >
                <CalendarDays data-icon="inline-start" /> Book an Appointment
              </Link>
              {/* <button
                type="button"
                className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl border border-[#b9d5e8] text-sm font-semibold"
              >
                <Share2 data-icon="inline-start" /> Share property
              </button> */}
              <p className="mt-4 text-center text-xs text-[#77828b]">
                A property advisor will help you choose a convenient time.
              </p>
            </section>
          </div>

          {/* Property Overview & Location Details */}
          <div className="mt-12 border-t border-[#dceaf7] pt-8 sm:mt-20 sm:pt-14">
            {/* Section heading */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0874d1]">
                Property details
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#152b43] sm:text-4xl">
                Everything you need to know
              </h2>
              <p className="mt-3 w-full max-w-2xl break-words text-[13px] leading-6 text-[#617286] sm:text-sm sm:leading-7 md:text-base">
                Explore the property overview, key specifications, and nearby
                destinations before planning your visit.
              </p>
            </div>

            <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
              {/* Left: Overview and specifications */}
              <div>
                <div className="rounded-2xl border border-[#dceaf7] bg-white p-5 sm:p-7">
                  <h3 className="text-xl font-semibold text-[#152b43]">
                    About this property
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#617286] sm:text-base">
                    {property.title} is located in {property.location}. Review
                    the property specifications below and contact our team for
                    verified information about layouts, availability, pricing,
                    and other project details.
                  </p>

                  <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    <div className="rounded-xl p-2.5 sm:p-4">
                      <BedDouble className="size-5 text-[#0874d1]" />
                      <p className="mt-3 break-words text-base font-semibold leading-tight text-[#152b43] sm:text-lg">
                        {bhk}
                      </p>
                      <p className="mt-1 text-xs text-[#718195]">Bedrooms</p>
                    </div>

                    <div className="rounded-xl p-2.5 sm:p-4">
                      <Bath className="size-5 text-[#0874d1]" />
                      <p className="mt-3 break-words text-base font-semibold leading-tight text-[#152b43] sm:text-lg">
                        {bathrooms}
                      </p>
                      <p className="mt-1 text-xs text-[#718195]">Bathrooms</p>
                    </div>

                    <div className="col-span-2 rounded-xl p-2.5 sm:col-span-1 sm:p-4">
                      <Ruler className="size-5 text-[#0874d1]" />
                      <p className="mt-3 break-words text-base font-semibold leading-tight text-[#152b43] sm:text-lg">
                        {area}
                      </p>
                      <p className="mt-1 text-xs text-[#718195]">Area</p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-xl border border-[#e5edf5] bg-[#f8fbff] p-4">
                    <p className="mt-2 text-sm font-medium leading-6 text-[#152b43]">
                      {property.location}
                    </p>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.location)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative mt-4 inline-flex items-center gap-2 overflow-hidden rounded-lg border border-[#0874d1] bg-white px-3 py-2 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(8,116,209,0.10)] active:scale-[0.97]"
                    >
                      <span className="pointer-events-none absolute inset-0 rounded-lg border-2 border-[#0874d1] [clip-path:inset(0_100%_0_0)] transition-all duration-500 ease-out group-hover:[clip-path:inset(0_0_0_0)]" />
                      <span className="relative z-10">Get directions</span>
                      <ArrowUpRight
                        size={16}
                        className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Nearby places */}
              <aside className="rounded-2xl border border-[#dceaf7] bg-white p-4 sm:p-7">
                <div className="flex items-start gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-[#152b43]">
                      Nearby locations
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#8292a3]">
                      Places to explore around the property
                    </p>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-[#e8eff6] sm:mt-6">
                  {nearby.map((place) => {
                    const [name, distance] = place.split(" · ");

                    return (
                      <div
                        key={place}
                        className="flex min-w-0 items-center gap-2.5 py-3 first:pt-0 last:pb-0 sm:gap-3 sm:py-4"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f9fe] text-[#0874d1]">
                          <MapPin size={17} />
                        </span>

                        <span className="min-w-0 flex-1 break-words text-[13px] font-medium leading-5 text-[#152b43] sm:text-sm">
                          {name}
                        </span>

                        <span className="shrink-0 rounded-full bg-[#f4f9fe] px-2 py-1 text-[11px] font-medium text-[#617286] sm:px-2.5 sm:text-xs">
                          {distance}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter disclaimer="ODP Services acts solely as an intermediary platform for advertising properties and is not a party to or responsible for transactions between buyers and sellers. All offers, discounts, and property details are subject to verification with the respective seller or developer." />
      {/* <PropertyAssistant /> */}
    </div>
  );
}
