"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
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
  Menu,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Smartphone,
  X,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const phone = String(data.get("phone") || "");
    const subject = String(data.get("subject") || "Property enquiry");
    const message = String(data.get("message") || "");

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailto = `mailto:help.onestepdreamproperty@gmail.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setSubmitted(true);
  }

  return (
    <main id="top" className="min-h-screen bg-white text-[#152b43]">
      {/* Navbar */}
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

      {/* Contact Section — Two Aligned Columns */}
      <section className="bg-[#eaf5ff] px-4 pb-16 pt-20 sm:px-5 sm:pb-20 sm:pt-36 lg:px-8">
        <div className="mx-auto grid max-w-[1280px] items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT SIDE — Contact Heading */}
          <div>
            <h1 className="mt-0 text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-5xl lg:mt-35 lg:text-6xl">
              Let&apos;s talk about
              <span className="block text-[#0874d1]">your next property.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#617286] sm:text-lg">
              Have a question about a property or location? We&apos;re here to
              help you with your property search.
            </p>
          </div>

          {/* RIGHT SIDE — Get in Touch */}

          <div className="relative overflow-hidden rounded-3xl border border-[#dce8f4] bg-white p-6 shadow-[0_20px_60px_rgba(21,43,67,0.06)] sm:p-8 lg:p-9">
            {/* Heading */}
            <div className="border-b border-[#e8eff6] pb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0874d1]">
                Get in touch
              </p>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#617286]">
                Have a query in mind? Reach out to us for the solution.
              </p>
            </div>

            {/* Contact details */}
            <div className="divide-y divide-[#e8eff6]">
              {/* Email */}
              <a
                href="mailto:help.onestepdreamproperty@gmail.com"
                className="group flex items-center gap-4 py-5"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ff] text-[#0874d1] transition-colors group-hover:bg-[#0874d1] group-hover:text-white">
                  <Mail size={21} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium uppercase tracking-wider text-[#8292a3]">
                    Email address
                  </span>
                  <span className="mt-1 block break-all text-sm font-semibold text-[#152b43] transition-colors group-hover:text-[#0874d1] sm:text-base">
                    help.onestepdreamproperty@gmail.com
                  </span>
                </span>

                <ArrowUpRight className="size-5 shrink-0 text-[#9aabba] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0874d1]" />
              </a>

              {/* Phone */}
              <a
                href="tel:+917411535782"
                className="group flex items-center gap-4 py-5"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ff] text-[#0874d1] transition-colors group-hover:bg-[#0874d1] group-hover:text-white">
                  <Phone size={21} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium uppercase tracking-wider text-[#8292a3]">
                    Phone number
                  </span>
                  <span className="mt-1 block text-base font-semibold text-[#152b43] transition-colors group-hover:text-[#0874d1]">
                    +91 7411535782
                  </span>
                </span>

                <ArrowUpRight className="size-5 shrink-0 text-[#9aabba] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0874d1]" />
              </a>

              {/* Enquiries */}
              <div className="flex items-center gap-4 py-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5ff] text-[#0874d1]">
                  <Clock3 size={21} />
                </span>

                <span className="min-w-0">
                  <span className="block text-xs font-medium uppercase tracking-wider text-[#8292a3]">
                    Property enquiries
                  </span>
                  <span className="mt-1 block text-sm font-semibold leading-6 text-[#152b43] sm:text-base">
                    Share your requirements with our team
                  </span>
                </span>
              </div>
            </div>

            {/* Bottom note */}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Footer() {
  return (
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
          <strong className="font-semibold text-white">Disclaimer:</strong> ODP
          Services acts solely as an intermediary platform for advertising
          properties and is not a party to or responsible for transactions
          between buyers and sellers. All offers, discounts, and property
          details are subject to verification with the respective seller or
          developer.
        </p>
      </div>
      </footer>
  );
}
