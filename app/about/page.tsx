"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Handshake,
  ArrowUpRight,
  BedDouble,
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
  Heart,
  House,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Smartphone,
  X,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function PropertyFeatureSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [typedBrand, setTypedBrand] = useState("");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const toggleSaved = (index: number) => {
    setSaved((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index],
    );
  };
  const scroll = (direction: "left" | "right") => {
    sliderRef.current?.scrollBy({
      left: direction === "right" ? 360 : -360,
      behavior: "smooth",
    });
  };

  return (
    <main id="top" className="min-h-screen bg-white text-[#152b43]">
      {/* NAVBAR */}
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-[#eaf5ff] text-[#152b43] shadow-[0_2px_12px_rgba(21,43,67,0.06)]">
        <div className="mx-auto flex h-[58px] max-w-[1280px] items-center gap-3 px-3 lg:h-[72px] lg:gap-6 lg:px-8">
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-[#cfe2f5] bg-white/70 text-[#152b43] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1] lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>

          <Link
            href="/"
            className="flex shrink-0 items-center text-[#0874d1]"
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
                className="transition-colors hover:text-[#0874d1]"
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

<button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} className={`fixed inset-0 top-[58px] z-40 bg-[#152b43]/30 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${menuOpen ? "visible opacity-100" : "pointer-events-none invisible opacity-0"}`} />

  <nav
  id="mobile-navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
          className={`fixed inset-x-0 bottom-0 top-[58px] z-50 flex origin-top flex-col overflow-y-auto border-t border-[#cfe2f5] bg-white text-sm text-[#152b43] shadow-[0_18px_50px_rgba(21,43,67,0.18)] transition-[opacity,transform,visibility] duration-300 ease-out lg:hidden ${
            menuOpen
              ? "visible translate-y-0 scale-y-100 opacity-100"
              : "pointer-events-none invisible -translate-y-4 scale-y-95 opacity-0"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="mx-auto w-full max-w-[520px] divide-y divide-[#cfe2f5]">
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
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0874d1] text-white">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <span>{item.label}</span>
                </>
              );
              const className =
                "flex min-h-[70px] items-center gap-4 px-6 text-base font-medium text-[#152b43] transition-all duration-200 hover:bg-[#f1f8ff] hover:pl-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0874d1]";

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
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* HERO + FEATURE CAROUSEL */}

      {/* PROPERTY BUYING SECTION */}
      <section
        id="about"
        className="relative overflow-hidden bg-white px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20"
      >
        {/* Dotted background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(#dceaf7 1.4px, transparent 1.4px)",
            backgroundSize: "24px 24px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />

        {/* Floating icons */}

        {/* Main heading */}
        <div className="relative z-10 mx-auto mt-10 flex min-h-[285px] max-w-5xl flex-col items-center text-center sm:min-h-[310px]">
          <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#152b43] sm:text-4xl md:text-5xl lg:text-[58px]">
            Your next home starts
            <br className="hidden sm:block" /> with one{" "}
            <span className="inline-block rounded-xl bg-[#0874d1] px-3 py-1 text-white">
              step.
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#617286] sm:text-base">
            Explore flats and residential properties, view property details,
            discover locations across Bengaluru, and enquire about a home you
            would love to own.
          </p>
        </div>

        {/* Property buying features */}
        <div className="relative z-10 mx-auto max-w-[1440px]">
          <div className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0874d1]">
              Explore with OneStep
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#152b43] sm:text-2xl">
              Find a property that feels right
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#617286]">
              Explore available homes and take the next step towards purchasing
              your property.
            </p>
          </div>

          <div
            ref={sliderRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
          >
            {[
              {
                number: "01",
                title: "Explore Flats",
                description:
                  "Browse listed flats and residential properties available on ODP.",
                icon: House,
                style: "bg-[#c23e34] text-[white] border-[#0874D1]",
                href: "/#properties",
              },
              {
                number: "02",
                title: "Choose a Location",
                description:
                  "Explore property locations across Bengaluru to narrow down your search.",
                icon: MapPin,
                style: "bg-[#6cba7e] text-[white]  border-[#F28C38]",
                href: "/#locations",
              },
              {
                number: "03",
                title: "View Property Details",
                description:
                  "Review the available property information before deciding which home interests you.",
                icon: Search,
                style: "bg-[#6371c7] text-[white]  border-[#8B6BCB]",
                href: "/#properties",
              },
              {
                number: "04",
                title: "Enquire About a Property",
                description:
                  "Contact us to discuss a listed property and ask questions before proceeding.",
                icon: Handshake,
                style: "bg-[#9a6bb0] text-[white] border-[#A855F7]",
                href: "/contact",
              },
              {
                number: "05",
                title: "Take the Next Step",
                description:
                  "Connect with our team to discuss the next steps for a property purchase.",
                icon: ShieldCheck,
                style: "bg-[#a67172] text-[white] border-[#66A182]",
                href: "/contact",
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.number}
                  className={`flex min-h-[220px] w-[84%] shrink-0 snap-start flex-col justify-between rounded-[22px] border p-5 shadow-[0_3px_0_rgba(21,43,67,0.12)] transition-transform duration-300 hover:-translate-y-1 sm:w-[320px] sm:p-6 ${feature.style}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-current/15 bg-white/10">
                      <Icon size={22} strokeWidth={1.8} />
                    </span>
                    <span className="text-xs font-semibold opacity-60">
                      {feature.number}
                    </span>
                  </div>

                  <div className="mt-7">
                    <h4 className="text-base font-semibold">{feature.title}</h4>
                    <p className="mt-2 text-sm leading-6 opacity-90">
                      {feature.description}
                    </p>

                    <Link
                      href={feature.href}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
                    >
                      Explore <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Carousel controls */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Previous property features"
              className="flex size-11 items-center justify-center rounded-full bg-[#eaf5ff] text-[#152b43] transition hover:bg-[#d7eaff]"
            >
              <ArrowLeft size={19} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Next property features"
              className="flex size-11 items-center justify-center rounded-full bg-[#0874d1] text-white transition hover:bg-[#075da8]"
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="contact"
        className="border-t border-[#0874d1] bg-[#0874d1] text-white"
      >
        <div className="mx-auto grid max-w-[1280px] gap-9 px-5 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-[#0874d1]"
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
                className="transition-colors hover:text-[#0874d1]"
              >
                help.onestepdreamproperty@gmail.com
              </a>
              <br />
              <a
                href="tel:+91 7411535782"
                className="transition-colors hover:text-[#0874d1]"
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
    </main>
  );
}
