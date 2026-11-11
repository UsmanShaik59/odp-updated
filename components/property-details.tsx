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
  Menu,
  Ruler,
  Share2,
  X,
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
  MessageCircle,
  Search,
  SlidersHorizontal,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { properties } from "@/lib/properties";
import { PropertyAssistant } from "./property-assistant";
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
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-[#fff0e5] text-[#152b43] shadow-[0_2px_12px_rgba(21,43,67,0.06)]">
        <div className="mx-auto flex h-[58px] max-w-[1280px] items-center gap-3 px-3 lg:h-[72px] lg:gap-6 lg:px-8">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#edd0bb] bg-white/70 text-[#152b43] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <Link
            href="/"
            className="flex shrink-0 items-center text-[#b85e2e]"
            aria-label="OneStep Dream Property home"
          >
            <span className="text-[25px] font-black leading-none tracking-[-0.12em] lg:text-[32px]">
              odp
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-8 text-[13px] text-[#5f6368] lg:flex lg:text-[15px]"
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
                className="transition-colors hover:text-[#cf7544]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="order-3 ml-0 flex min-w-0 shrink-0 items-center justify-end gap-2 lg:order-2 lg:ml-auto lg:max-w-[230px]">
            <button
              type="button"
              aria-label="Choose location"
              onClick={() => {
                setLocationOpen(true);
                setMenuOpen(false);
                setSearchOpen(false);
              }}
              className="flex min-w-0 flex-1 items-center justify-end gap-1 truncate text-[11px] font-semibold"
            >
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">Koramangala, Bengaluru</span>
              <ChevronDown
                aria-hidden="true"
                className="size-3 shrink-0 text-[#496b73]"
              />
            </button>
          </div>
        </div>

        <nav
          id="mobile-navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
          className={`fixed inset-x-0 bottom-0 top-[58px] z-50 flex origin-top flex-col overflow-y-auto border-t border-[#edd0bb] bg-white text-sm text-[#152b43] shadow-[0_18px_50px_rgba(21,43,67,0.18)] transition-[opacity,transform,visibility] duration-300 ease-out lg:hidden ${
            menuOpen
              ? "visible translate-y-0 scale-y-100 opacity-100"
              : "pointer-events-none invisible -translate-y-4 scale-y-95 opacity-0"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="divide-y divide-[#edd0bb]">
            {[
              { label: "Home", href: "/", icon: Building2 },
              { label: "Buy Flats", href: "/#properties", icon: BedDouble },
              { label: "Properties", href: "/#properties", icon: Building2 },
              { label: "Locations", href: "/#locations", icon: MapPin },
              { label: "About Us", href: "/about", icon: Smartphone },
              { label: "Contact", href: "/contact", icon: Headphones },
            ].map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0a879] text-[#542d18]">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <span>{item.label}</span>
                </>
              );
              const className =
                "flex min-h-14 items-center gap-4 px-5 font-medium text-[#152b43] transition-colors hover:bg-[#d6ebff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#cf7544]";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(event) => {
                    setMenuOpen(false);
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
                  className={`${className} min-h-[70px] px-6 text-base hover:bg-[#fff1e7] hover:pl-7`}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main>
        <div className="mx-auto mt-8 w-full max-w-[1280px] overflow-hidden px-3 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-7 lg:px-8 lg:pt-10">
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
                    className={`relative aspect-[1.4/1] overflow-hidden ${activeImage === index ? "ring-2 ring-[#cf7544] ring-offset-2" : "opacity-65 hover:opacity-100"}`}
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
                  {/* <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#cf7544]">
                    {property.status}
                  </p> */}
                  <h1 className="mt-3 break-words text-[2.35rem] font-medium leading-[1.02] tracking-[-0.055em] sm:text-5xl">
                    {property.title}
                  </h1>
                  <p className="mt-4 flex items-center gap-2 text-sm text-[#5f6368]">
                    <MapPin className="size-4 text-[#cf7544]" />{" "}
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
                <p className="mt-1 text-3xl font-semibold tracking-[-0.04em] text-[#cf7544]">
                  {property.price}
                </p>
              </div>

              <Link
                href={`/properties/${properties.findIndex((item) => item.title === property.title)}/appointment`}
                className="mx-auto mt-7 flex h-12 w-full max-w-[280px] items-center justify-center gap-2 rounded-xl bg-[#f0a879] px-3 text-xs font-semibold text-[#542d18] shadow-[0_10px_24px_rgba(207,117,68,.18)] transition hover:bg-[#f3b58e] sm:mx-0 sm:h-14 sm:max-w-none sm:px-5 sm:text-sm"
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
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#cf7544]">
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
                      <BedDouble className="size-5 text-[#cf7544]" />
                      <p className="mt-3 break-words text-base font-semibold leading-tight text-[#152b43] sm:text-lg">
                        {bhk}
                      </p>
                      <p className="mt-1 text-xs text-[#718195]">Bedrooms</p>
                    </div>

                    <div className="rounded-xl p-2.5 sm:p-4">
                      <Bath className="size-5 text-[#cf7544]" />
                      <p className="mt-3 break-words text-base font-semibold leading-tight text-[#152b43] sm:text-lg">
                        {bathrooms}
                      </p>
                      <p className="mt-1 text-xs text-[#718195]">Bathrooms</p>
                    </div>

                    <div className="col-span-2 rounded-xl p-2.5 sm:col-span-1 sm:p-4">
                      <Ruler className="size-5 text-[#cf7544]" />
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
                      className="group relative mt-4 inline-flex items-center gap-2 overflow-hidden rounded-lg border border-[#cf7544] bg-white px-3 py-2 text-sm font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(207,117,68,0.10)] active:scale-[0.97]"
                    >
                      <span className="pointer-events-none absolute inset-0 rounded-lg border-2 border-[#cf7544] [clip-path:inset(0_100%_0_0)] transition-all duration-500 ease-out group-hover:[clip-path:inset(0_0_0_0)]" />
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
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f4f9fe] text-[#cf7544]">
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

      <footer
        id="contact"
        className="border-t border-[#cf7544] bg-[#f0a879] text-[#542d18]"
      >
        <div className="mx-auto grid max-w-[1280px] gap-9 px-5 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-[#cf7544]"
              aria-label="ODP home"
            >
              <span className="text-[32px] font-black leading-none tracking-[-0.12em]">
                odp
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#5f6368]">
              Thoughtfully selected homes for the way you want to live.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
              Discover
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#5f6368]">
              <Link href="/#properties" scroll={false}>
                Buy Flats
              </Link>
              <Link href="/#properties" scroll={false}>
                Properties
              </Link>
              <Link href="/#locations" scroll={false}>
                Locations
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
              Company
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#5f6368]">
              <Link href="/about">About Us</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/contact">List Property</Link>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
              Get in touch
            </h3>
            <p className="mt-5 text-sm leading-6 text-[#5f6368]">
              <a
                href="mailto:help.onestepdreamproperty@gmail.com"
                className="transition-colors hover:text-[#cf7544]"
              >
                help.onestepdreamproperty@gmail.com
              </a>
              <br />
              <a
                href="tel:+91 7411535782"
                className="transition-colors hover:text-[#cf7544]"
              >
                +91 7411535782
              </a>
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-white/30 px-5 py-6 text-xs text-white lg:text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 OneStep Dream Property. All rights reserved.</span>
          <span>Privacy · Terms</span>
        </div>{" "}
        <div className="mx-auto mt-4 w-full max-w-[1280px] border-t border-white/20 px-5 pb-8 pt-6 sm:mt-6 sm:px-8 sm:pb-10 sm:pt-8">
          <p className="text-xs leading-6 text-white/80 sm:text-sm sm:leading-7">
            <strong className="font-semibold text-white">Disclaimer:</strong>{" "}
            ODP Services acts solely as an intermediary platform for advertising
            properties and is not a party to or responsible for transactions
            between buyers and sellers. All offers, discounts, and property
            details are subject to verification with the respective seller or
            developer.
          </p>
        </div>
      </footer>
      {/* <PropertyAssistant /> */}
    </div>
  );
}
