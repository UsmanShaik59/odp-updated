"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { properties } from "@/lib/properties";
import { HeroScene } from "./hero-scene";
import { PropertyAssistant } from "./property-assistant";
import { GsapCursor } from "./gsap-cursor";
import KineticMatrix from "./ui/kinetic-matrix";
import Link from "next/link";
import { CarFront, Phone } from "lucide-react";
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
  Info,
  House,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

gsap.registerPlugin(
  useGSAP,
  Draggable,
  DrawSVGPlugin,
  Flip,
  MotionPathPlugin,
  Observer,
  ScrollToPlugin,
  ScrollTrigger,
  SplitText,
);

const locations = [
  { name: "Bengaluru", count: "128 properties" },
  { name: "Koramangala", count: "86 properties" },
  { name: "HSR Layout", count: "74 properties" },
  { name: "Indiranagar", count: "52 properties" },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const isHeroCopy = element.classList.contains("hero-copy");
    const heroItems = isHeroCopy ? element.firstElementChild?.children : null;
    const propertyCards = element.querySelectorAll<HTMLElement>("[data-gsap-card]");
    const scrollTrigger = { trigger: element, start: "top 88%", once: true };

    if (propertyCards.length) {
      gsap.fromTo(
        propertyCards,
        { autoAlpha: 0, y: 58, scale: 0.94, rotateX: 5, transformPerspective: 900 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.95,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger,
        },
      );
    } else {
      gsap.fromTo(
        heroItems?.length ? heroItems : element,
        { autoAlpha: 0, y: 38, scale: isHeroCopy ? 1 : 0.985 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          delay: delay / 1000,
          ease: "power3.out",
          stagger: isHeroCopy ? 0.1 : 0,
          scrollTrigger,
        },
      );
    }

    if (isHeroCopy) {
      const title = element.querySelector<HTMLElement>("[data-gsap-title]");
      if (title) {
        SplitText.create(title, {
          type: "words",
          wordsClass: "gsap-hero-word",
          aria: "auto",
          onSplit: (split) =>
            gsap.from(split.words, {
              autoAlpha: 0,
              yPercent: 115,
              rotateX: -35,
              transformOrigin: "50% 100%",
              duration: 0.95,
              delay: 0.18,
              ease: "power4.out",
              stagger: 0.075,
            }),
        });
      }
    }
  }, { scope: ref });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}


export function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Koramangala, Bengaluru");
  const [saved, setSaved] = useState<number[]>([]);
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [typedBrand, setTypedBrand] = useState("");
  const filteredLocations = locations.filter(({ name }) =>
    name.toLocaleLowerCase().includes(locationQuery.trim().toLocaleLowerCase()),
  );

  useEffect(() => {
    setCookieConsent(document.cookie.includes("odp_cookie_consent=accepted"));
  }, []);

  const saveCookieConsent = (value: "accepted" | "essential") => {
    document.cookie = `odp_cookie_consent=${value}; max-age=31536000; path=/; SameSite=Lax`;
    setCookieConsent(true);
  };

  useEffect(() => {
    const brand = "Start Your Journey";
    let index = 0;
    let deleting = false;
    let timer: number;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setTypedBrand(brand.slice(0, index));
        if (index === brand.length) {
          deleting = true;
          timer = window.setTimeout(tick, 1800);
          return;
        }
      } else {
        index -= 1;
        setTypedBrand(brand.slice(0, index));
        if (index === 0) {
          deleting = false;
          timer = window.setTimeout(tick, 450);
          return;
        }
      }
      timer = window.setTimeout(tick, deleting ? 55 : 85);
    };

    timer = window.setTimeout(tick, 300);
    return () => window.clearTimeout(timer);
  }, []);

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
  useEffect(() => {
    const scrollToHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    scrollToHash();

    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);
  useGSAP(() => {
    const root = pageRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const draggables = Array.from(
      root.querySelectorAll<HTMLElement>("[data-gsap-drag]"),
    )
      .filter((rail) => rail.scrollWidth > rail.clientWidth + 8)
      .flatMap((rail) =>
        Draggable.create(rail, {
          type: "scroll",
          lockAxis: true,
          edgeResistance: 0.82,
          minimumMovement: 6,
          dragClickables: false,
          allowNativeTouchScrolling: true,
          cursor: "grab",
          activeCursor: "grabbing",
        }),
      );

    const featureStack = root.querySelector<HTMLElement>("[data-feature-stack]");
    const featureCards = featureStack?.querySelectorAll<HTMLElement>("[data-feature-card]");
    if (featureStack && featureCards?.length) {
      gsap.set(featureCards, {
        x: (index) => (index % 2 === 0 ? 78 : -78),
        y: (index) => (index < 2 ? 56 : -52),
        rotation: (index) => (index % 2 === 0 ? 7 : -7),
        scale: 0.9,
      });
      const featureState = Flip.getState(featureCards);
      gsap.set(featureCards, { clearProps: "transform" });
      gsap.set(featureCards, { autoAlpha: 0 });

      const featureReveal = gsap.timeline({
        scrollTrigger: {
          trigger: featureStack,
          start: "top 82%",
          once: true,
        },
      });
      featureReveal.add(
        Flip.from(featureState, {
          duration: 1.15,
          stagger: 0.1,
          ease: "power3.inOut",
        }),
        0,
      );
      featureReveal.to(
        featureCards,
        { autoAlpha: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
        0.12,
      );
    }

    const path = root.querySelector<SVGPathElement>("[data-motion-path]");
    const orbitDot = root.querySelector<SVGCircleElement>("[data-motion-dot]");
    const heroStage = root.querySelector<HTMLElement>("[data-hero-stage]");
    const heroArt = root.querySelector<HTMLElement>("[data-hero-art]");

    if (path && orbitDot) {
      gsap.fromTo(
        path,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 2.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: heroStage ?? path,
            start: "top 80%",
            once: true,
          },
        },
      );
      gsap.to(orbitDot, {
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
        duration: 13,
        repeat: -1,
        ease: "none",
      });
    }

    const progressBar = root.querySelector<HTMLElement>("[data-scroll-progress]");
    if (progressBar) {
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (trigger) => gsap.set(progressBar, { scaleX: trigger.progress }),
      });
    }

    const cardCleanup: Array<() => void> = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      root.querySelectorAll<HTMLElement>("[data-gsap-card]").forEach((card) => {
        const image = card.querySelector<HTMLElement>("img");
        const onEnter = () => {
          gsap.to(card, { y: -8, duration: 0.34, ease: "power3.out", overwrite: true });
          if (image) {
            gsap.to(image, { scale: 1.075, duration: 0.65, ease: "power3.out", overwrite: true });
          }
        };
        const onLeave = () => {
          gsap.to(card, { y: 0, duration: 0.45, ease: "power3.out", overwrite: true });
          if (image) {
            gsap.to(image, { scale: 1, duration: 0.7, ease: "power3.out", overwrite: true });
          }
        };
        card.addEventListener("pointerenter", onEnter);
        card.addEventListener("pointerleave", onLeave);
        cardCleanup.push(() => {
          card.removeEventListener("pointerenter", onEnter);
          card.removeEventListener("pointerleave", onLeave);
        });
      });

      if (heroStage && heroArt) {
        const resetHeroArt = () =>
          gsap.to(heroArt, {
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.55)",
            overwrite: true,
          });
        const pointerObserver = Observer.create({
          target: heroStage,
          type: "pointer",
          onMove: (observer) => {
            const bounds = heroStage.getBoundingClientRect();
            const pointer = (observer as Observer & { event: PointerEvent }).event;
            const x = gsap.utils.clamp(-1, 1, ((pointer.clientX - bounds.left) / bounds.width - 0.5) * 2);
            const y = gsap.utils.clamp(-1, 1, ((pointer.clientY - bounds.top) / bounds.height - 0.5) * 2);
            gsap.to(heroArt, {
              x: x * 8,
              y: y * 6,
              rotateY: x * 2.2,
              rotateX: y * -1.8,
              duration: 0.55,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });
        heroStage.addEventListener("pointerleave", resetHeroArt);
        cardCleanup.push(() => {
          pointerObserver.kill();
          heroStage.removeEventListener("pointerleave", resetHeroArt);
        });
      }
    }

    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;

      const id = decodeURIComponent(href.slice(1));
      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();
      window.history.pushState(null, "", href);
      setMenuOpen(false);
      setLocationOpen(false);
      gsap.to(window, {
        duration: 0.9,
        ease: "power3.inOut",
        scrollTo: { y: destination, offsetY: 78, autoKill: true },
      });
    };
    root.addEventListener("click", handleAnchorClick, true);

    return () => {
      draggables.forEach((draggable) => draggable.kill());
      cardCleanup.forEach((cleanup) => cleanup());
      root.removeEventListener("click", handleAnchorClick, true);
    };
  }, { scope: pageRef });

  return (
  <div ref={pageRef} className="odp-gradient-theme min-h-screen bg-white text-[#111111]">
  <GsapCursor />
  <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#e8edf3] bg-white text-[#152b43] shadow-[0_2px_16px_rgba(21,43,67,0.04)]">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center gap-3 px-3 lg:h-[72px] lg:gap-6 lg:px-8">
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-[#152b43] transition-colors duration-200 hover:bg-[#f3f7fa] active:bg-[#eaf1f6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1] motion-reduce:transition-none lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="relative size-[22px]">
              <Menu
                aria-hidden="true"
                className={`absolute inset-0 size-[22px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${menuOpen ? 'rotate-45 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
                strokeWidth={1.75}
              />
              <X
                aria-hidden="true"
                className={`absolute inset-0 size-[22px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${menuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-45 scale-75 opacity-0'}`}
                strokeWidth={1.75}
              />
            </span>
          </button>

          <Link
            href="#top"
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
              { label: "Home", href: "#top" },
              { label: "Properties", href: "#properties" },
              { label: "Locations", href: "#locations" },
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-colors hover:text-[#0874d1]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="order-3 ml-0 flex min-w-0 flex-1 items-center justify-end gap-2 lg:order-2 lg:ml-auto lg:max-w-[230px] lg:flex-none">
            <button
              type="button"
              aria-label="Choose location"
              onClick={() => {
                setLocationQuery("");
                setLocationOpen(true);
                setMenuOpen(false);
                setSearchOpen(false);
              }}
              className="flex min-w-0 flex-1 items-center justify-end gap-1 truncate text-[11px] font-semibold"
            >
              <MapPin aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{selectedLocation}</span>
              <ChevronDown
                aria-hidden="true"
                className="size-3 shrink-0 text-[#496b73]"
              />
            </button>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close navigation"
          aria-hidden={!menuOpen}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
          data-open={menuOpen}
          className={`mobile-drawer-backdrop fixed inset-0 top-[64px] z-40 bg-[#152b43]/10 lg:hidden ${
            menuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        />

        <nav
          ref={mobileNavRef}
          id="mobile-navigation"
          aria-hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
          data-open={menuOpen}
          className={`mobile-drawer-panel fixed inset-x-0 bottom-0 top-[64px] z-50 flex flex-col overflow-y-auto overscroll-contain border-t border-[#e8edf3] bg-white text-sm text-[#152b43] shadow-[0_16px_40px_rgba(21,43,67,0.08)] lg:hidden ${
            menuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-label="Mobile navigation"
        >
          <div className="mx-auto w-full max-w-[520px] divide-y divide-[#edf1f5]">
  {([
  ["Home", "/#top"],
  ["Buy Flats", "/#properties"],
  ["Properties", "/#properties"],
  ["Locations", "/#locations"],
  ["About Us", "/about"],
  ["Contact", "/contact"],
  ] as const).map(([item, href], index) => {
              const icons = {
                Home: House,
                "Buy Flats": BedDouble,
                Properties: Building2,
                Locations: MapPin,
                "About Us": Info,
                Contact: Headphones,
              };

              const Icon = icons[item];

              return (
                <Link
                  key={item}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  style={{ transitionDelay: menuOpen ? `${index * 28}ms` : `${(5 - index) * 12}ms` }}
                  className={`group flex min-h-[64px] items-center gap-4 px-5 text-[15px] font-medium text-[#24384d] transition-[opacity,transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#f8fbfe] active:bg-[#f2f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0874d1] motion-reduce:transition-none ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                >
                  <span className="flex size-6 shrink-0 items-center justify-center text-[#0874d1] transition-colors duration-200 group-hover:text-[#005da8]">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
                  </span>
                  <span>{item}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        <span
          data-scroll-progress
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-[#0874d1] via-[#5b9bd5] to-[#c7e1f7]"
        />
      </header>
      {locationOpen && (
        <section
          className="fixed inset-x-0 bottom-0 top-[64px] z-[49] overflow-y-auto bg-location-background text-location-ink lg:top-[72px]"
          aria-label="Location picker"
        >
          <main className="mx-auto max-w-[1280px] px-4 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-10 lg:pb-16 lg:pt-14">
            <button
              type="button"
              onClick={() => setLocationOpen(false)}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-location-border bg-location-surface px-4 text-sm font-semibold text-location-ink transition-colors hover:border-location-accent/40 hover:text-location-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-location-accent"
            >
              <ArrowRight aria-hidden="true" className="size-4 rotate-180" />
              Back to home
            </button>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-location-accent sm:text-xs">
                  Bengaluru · Area guide
                </p>

                <h1 className="mt-4 max-w-[720px] text-[clamp(2rem,8.5vw,3.75rem)] font-semibold leading-[1.03] tracking-[-0.055em]">
                  Find a place that <span className="text-location-accent">feels like home.</span>
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-6 text-location-muted sm:mt-5 sm:text-base sm:leading-7">
                  Explore properties in Bengaluru&apos;s most loved neighbourhoods, and find the area that fits your next move.
                </p>
              </div>

              <div className="rounded-3xl border border-location-border bg-location-surface p-4 shadow-[0_18px_55px_rgba(21,43,67,0.06)] sm:p-6">
                <label htmlFor="location-search" className="mb-3 block text-sm font-semibold text-location-ink">
                  Search locations
                </label>

                <div className="flex h-13 items-center gap-3 rounded-2xl border border-location-border bg-white px-4 transition-colors focus-within:border-location-accent focus-within:ring-4 focus-within:ring-location-accent/10">
                  <Search aria-hidden="true" className="size-5 shrink-0 text-location-muted" />
                  <input
                    id="location-search"
                    type="search"
                    value={locationQuery}
                    onChange={(event) => setLocationQuery(event.target.value)}
                    placeholder="Try Koramangala or HSR"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-location-ink outline-none placeholder:text-location-muted/70 sm:text-base"
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-location-muted sm:text-sm">
                  Search by city or neighbourhood to find the right place.
                </p>
              </div>
            </div>

            <section aria-labelledby="popular-locations-title" className="mt-10 sm:mt-14">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 id="popular-locations-title" className="text-xl font-semibold tracking-tight text-location-ink sm:text-2xl">
                    Popular locations
                  </h2>
                  <p className="mt-1.5 text-sm text-location-muted">
                    A few great places to start your search.
                  </p>
                </div>

                <span className="shrink-0 text-xs font-semibold text-location-muted">
                  {filteredLocations.length} {filteredLocations.length === 1 ? "area" : "areas"}
                </span>
              </div>

              {filteredLocations.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredLocations.map((location) => (
                    <button
                      type="button"
                      key={location.name}
                      onClick={() => {
                        setSelectedLocation(
                          location.name === "Bengaluru"
                            ? location.name
                            : `${location.name}, Bengaluru`,
                        );
                        setLocationOpen(false);
                      }}
                      className="group flex min-h-[84px] items-center gap-3 rounded-2xl border border-location-border bg-location-surface p-4 text-left shadow-[0_4px_20px_rgba(21,43,67,0.03)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-location-accent/50 hover:shadow-[0_12px_28px_rgba(21,43,67,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-location-accent sm:p-5"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-location-accent/10 text-location-accent">
                        <MapPin aria-hidden="true" className="size-[18px]" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-location-ink">
                          {location.name}
                        </span>
                        <span className="mt-1 block text-xs text-location-muted">
                          {location.count}
                        </span>
                      </span>

                      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-location-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-location-accent" />
                    </button>
                  ))}
                </div>
              ) : (
                <p aria-live="polite" className="rounded-2xl border border-dashed border-location-border bg-location-surface px-4 py-8 text-center text-sm text-location-muted">
                  No popular areas match that search. Try another neighbourhood.
                </p>
              )}
            </section>
          </main>
        </section>
      )}
      <main id="top" aria-hidden={locationOpen} inert={locationOpen ? true : undefined} className="overflow-clip mt-15">
        <section
          id="property-search"
          className="relative z-40 w-full overflow-hidden bg-[#eaf5ff]"
        >
          <KineticMatrix title="FIND HOME" />
        </section>

  <section data-hero-stage className="relative mx-auto grid w-full min-w-0 max-w-full items-center overflow-hidden rounded-none border-0 bg-[#eaf5ff] px-3 pb-8 pt-8 min-[360px]:px-4 sm:pb-16 sm:pt-16 md:grid-cols-2 md:gap-10 md:px-10 md:py-12 lg:gap-16 lg:px-14 lg:py-16 xl:gap-20 2xl:px-16">
          {/* LEFT — HERO INFORMATION */}
          <Reveal className="hero-copy relative z-10 order-1 flex h-full w-full items-center justify-center md:justify-self-start">
            <div className="mx-auto w-full min-w-0 max-w-[560px] overflow-hidden text-left">
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f7185]">
                Your next home starts here
              </p>

              <h1 className="max-w-[560px] font-medium leading-[1.05] tracking-[-0.06em]">
                <span
                  className="block min-h-[1.2em] whitespace-nowrap text-[clamp(1.5rem,7vw,3rem)] leading-[1.1] tracking-[-0.055em] text-[#0874d1]"
                  aria-live="polite"
                >
                  {typedBrand}
                  <span
                    className="ml-1 inline-block h-[1em] w-[3px] translate-y-[0.08em] bg-[#111111] align-baseline motion-safe:animate-pulse"
                    aria-hidden="true"
                  />
                </span>

                <span data-gsap-title className="mt-2 block whitespace-nowrap text-[clamp(1.45rem,4.8vw,3.125rem)] leading-[1.08] text-[#152b43]">
                  Find the right property.
                  <br />
                  Make your next move.
                </span>
              </h1>

              {/* MOBILE ONLY — HOUSE ILLUSTRATION */}
              <div
                className="mt-2 flex w-full items-center justify-center md:hidden min-[380px]:mt-3"
                aria-label="Animated 3D property illustration"
              >
<div className="hero-scene-mobile relative h-[230px] w-[82%] max-w-[360px] min-[380px]:h-[250px]">
  <HeroScene mobile />
                </div>
              </div>

              <p className="mt-6 w-full max-w-[520px] break-words text-left text-[14px] leading-[1.65] text-[#5f7185] sm:mt-7 sm:text-[16px] sm:leading-7 lg:text-[18px] lg:leading-8">
                Discover thoughtfully selected flats and residential properties
                across India&apos;s most promising locations. Explore your
                options and take the next step with confidence.
              </p>

              <div className="mt-7 flex w-full min-w-0 max-w-[560px] flex-col items-center gap-3 min-[380px]:mt-9 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-center">
                <Link
                  href="#properties"
                  className="group relative isolate inline-flex h-14 w-full max-w-[240px] min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-[#0874d1] bg-[#0874d1] px-3 text-xs font-semibold text-white shadow-[0_5px_16px_rgba(8,116,209,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874d1] min-[380px]:w-[min(220px,calc(50vw-24px))] min-[380px]:flex-none lg:h-16 lg:gap-3 lg:px-5 lg:text-sm"
                >
                  <Building2
                    size={19}
                    strokeWidth={1.8}
                    className="relative z-20 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="relative z-20">Explore Properties</span>
                  <ArrowUpRight
                    size={15}
                    className="relative z-20 shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-full border-2 border-white [clip-path:inset(0_100%_0_0_round_999px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_999px)] motion-reduce:transition-none"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="group relative isolate inline-flex h-14 w-full max-w-[240px] min-w-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-[#c8dff4] bg-white px-3 text-xs font-semibold text-[#152b43] shadow-[0_4px_12px_rgba(21,43,67,0.05)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874d1] min-[380px]:w-[min(220px,calc(50vw-24px))] min-[380px]:flex-none lg:h-16 lg:gap-3 lg:px-5 lg:text-sm"
                >
                  <Phone
                    size={18}
                    strokeWidth={1.8}
                    className="relative z-20 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="relative z-20">Contact Us</span>
                  <ArrowUpRight
                    size={15}
                    className="relative z-20 shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-full border-2 border-[#064b91] [clip-path:inset(0_100%_0_0_round_999px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_999px)] motion-reduce:transition-none"
                  />
                </Link>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — DESKTOP HOUSE ILLUSTRATION */}
          <Reveal className="hero-illustration relative z-10 order-2 hidden h-full min-h-[500px] w-full items-center justify-center md:flex">
              <div data-hero-art className="relative h-[500px] w-full max-w-[680px] lg:h-[560px]">
                <HeroScene />
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 hidden size-full overflow-visible md:block"
                  viewBox="0 0 680 560"
                  preserveAspectRatio="none"
                >
                  <path
                    data-motion-path
                    d="M 38 354 C 62 152 220 40 376 66 C 540 94 643 225 612 357 C 589 455 476 509 355 480"
                    fill="none"
                    stroke="#5b9bd5"
                    strokeDasharray="4 9"
                    strokeOpacity="0.34"
                    strokeWidth="1.5"
                  />
                  <circle data-motion-dot r="5" fill="#5b9bd5" />
                </svg>
              </div>
          </Reveal>
        </section>
        <section
          id="properties"
          className="mx-auto max-w-[1280px] px-4 pb-14 pt-14 min-[360px]:px-5 min-[360px]:pb-16 min-[360px]:pt-16 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-32"
        >
          <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end sm:gap-6">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5f6368]">
                A considered selection
              </p>
              <h2 className="text-3xl font-medium tracking-[-0.04em] md:text-4xl lg:text-5xl">
                Explore featured properties
              </h2>
              <p className="mt-3 text-sm text-[#5f6368]">
                Find thoughtfully selected homes in locations that matter to
                you.
              </p>
            </div>

            <Link
              href="#properties"
              className="group hidden items-center gap-2 text-sm font-semibold text-[#152b43] md:inline-flex"
            >
              <Building2
                size={17}
                strokeWidth={1.8}
                className="text-[#0874d1]"
                aria-hidden="true"
              />

              <span className="relative py-1">
                View all properties
                <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-[#0874d1] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
            </Link>
          </div>
          <Reveal className="grid grid-cols-2 gap-x-3 gap-y-7 min-[390px]:gap-x-4 min-[390px]:gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
            {properties.map((property, index) => (
              <article data-gsap-card key={property.title} className="group relative min-w-0">
                <Link
                  href={`/properties/${index}`}
                  className="relative block aspect-[1.1/1] overflow-hidden bg-[#f2f2f2]"
                  aria-label={`View ${property.title}`}
                >
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {property.status}
                  </span>
                </Link>
                <button
                  onClick={(event) => {
                    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                      gsap.fromTo(
                        event.currentTarget,
                        { scale: 0.72, rotation: -14 },
                        { scale: 1, rotation: 0, duration: 0.48, ease: "back.out(3)", overwrite: true },
                      );
                    }
                    toggleSaved(index);
                  }}
                  aria-label={`${saved.includes(index) ? "Remove" : "Save"} ${property.title}`}
                  className="absolute right-3 top-3 flex size-8 items-center justify-center bg-white transition-colors hover:bg-[#f2f2f2]"
                >
                  <Heart
                    size={16}
                    fill={saved.includes(index) ? "#111111" : "none"}
                  />
                </button>
                <div className="pt-3 min-[480px]:pt-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[13px] font-medium leading-4 min-[480px]:text-[15px] min-[480px]:leading-5">
                      {property.title}
                    </h3>
                    <span className="whitespace-nowrap text-[13px] font-medium min-[480px]:text-[15px]">
                      {property.price}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#5f6368] min-[480px]:text-[13px]">
                    {property.location}
                  </p>

                  <div className="mt-4 grid gap-3 border-t border-[#e5edf5] pt-4">
                    <p className="line-clamp-2 break-words text-[12px] leading-5 text-[#5f6f80]">
                      {property.details}
                    </p>

                    <Link
                      href={`/properties/${index}`}
                      className="group inline-flex w-fit items-center gap-2 text-[12px] font-semibold text-[#0874d1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874d1]"
                    >
                      <span className="relative py-1">
                        View Details
                        <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-[#0874d1] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                      </span>

                      <ArrowRight
                        size={15}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </Reveal>
          <Link
            href="#properties"
            className="mt-10 flex items-center gap-2 text-sm font-medium md:hidden"
          >
            View all properties <ArrowRight size={16} />
          </Link>
        </section>
        <section id="locations" className="border-y border-[#dceaf7] bg-white">
          <div className="mx-auto max-w-[1280px] px-4 py-12 min-[360px]:px-5 sm:py-16 lg:px-8 lg:py-20">
            <Link
              href="#properties"
              className="group relative block w-full overflow-hidden rounded-2xl border border-[#c7e1f7] bg-[#f5faff] transition-all duration-300 hover:border-[#91c5ef] hover:shadow-xl hover:shadow-[#5b9bd5]/10"
            >
              {/* Light blue decorative background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                <div className="absolute -right-16 -top-24 size-80 rounded-full bg-[#dceeff]/80 blur-3xl" />
                <div className="absolute right-[18%] -bottom-32 size-72 rounded-full bg-[#e8f4ff]/90 blur-3xl" />

                <div className="absolute right-8 top-1/2 hidden size-64 -translate-y-1/2 rounded-full border border-[#d2e7f9]/80 sm:block lg:right-20 lg:size-80" />
                <div className="absolute right-16 top-1/2 hidden size-48 -translate-y-1/2 rounded-full border border-[#d2e7f9]/70 sm:block lg:right-32 lg:size-64" />
              </div>

              <div className="relative grid min-h-[280px] items-center gap-5 p-6 sm:min-h-[320px] sm:p-9 md:grid-cols-[1.15fr_0.85fr] md:gap-3 lg:min-h-[360px] lg:p-12">
                {/* Content */}
                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#cfe4f8] bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3979ad] sm:text-xs">
                    Find your place
                  </span>

                  <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#152b43] sm:text-4xl md:text-4xl lg:text-5xl">
                    Find your home
                    <span className="block text-[#287fbe]">in Bengaluru.</span>
                  </h2>

                  <p className="mt-4 max-w-md text-sm leading-6 text-[#5e7185] sm:text-base sm:leading-7">
                    Discover thoughtfully selected properties in one of
                    Bengaluru&apos;s most sought-after real estate markets.
                  </p>

                  <span className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#247db8] px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 group-hover:bg-[#175e91] sm:mt-8">
                    Explore Bengaluru Properties
                    <ArrowRight
                      size={18}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>

                {/* Property illustration */}
                <div
                  aria-hidden="true"
                  className="relative mx-auto flex h-36 w-full max-w-sm items-center justify-center sm:h-44 md:h-full md:min-h-[230px] lg:min-h-[260px]"
                >
                  <div className="absolute bottom-3 h-5 w-4/5 rounded-[50%] bg-[#9fc9eb]/35 blur-md" />

                  <div className="relative flex items-end gap-2 transition-transform duration-500 group-hover:scale-[1.04]">
                    {/* Main house */}
                    <div className="relative h-24 w-36 rounded-t-sm border border-[#b9cde0] bg-[#e9f3fc] shadow-lg sm:h-28 sm:w-44 lg:h-32 lg:w-48">
                      {/* Roof */}
                      <div className="absolute -top-7 -left-3 h-8 w-[calc(100%+24px)] border border-[#536b83] bg-[#435b73] [clip-path:polygon(8%_0,92%_0,100%_100%,0_100%)]" />

                      {/* Windows */}
                      <div className="absolute top-5 left-4 grid grid-cols-2 gap-3">
                        <div className="h-7 w-6 border-2 border-[#9db6ce] bg-[#b9def7] sm:h-8 sm:w-7" />
                        <div className="h-7 w-6 border-2 border-[#9db6ce] bg-[#b9def7] sm:h-8 sm:w-7" />
                      </div>

                      <div className="absolute top-5 right-4 h-7 w-6 border-2 border-[#9db6ce] bg-[#b9def7] sm:h-8 sm:w-7" />

                      {/* Door */}
                      <div className="absolute bottom-0 left-1/2 h-12 w-8 -translate-x-1/2 border border-[#8da9c4] bg-[#668eaf] sm:h-14 sm:w-9">
                        <span className="absolute top-1/2 right-1.5 size-1 rounded-full bg-[#e5f3ff]" />
                      </div>
                    </div>

                    {/* Side wing */}
                    <div className="relative h-16 w-12 border border-[#b9cde0] bg-[#d8e9f8] sm:h-20 sm:w-14">
                      <div className="absolute -top-4 -left-1 h-5 w-[calc(100%+8px)] bg-[#526b84] [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
                      <div className="absolute top-3 left-2 h-5 w-4 border border-[#9db6ce] bg-[#b9def7]" />
                      <div className="absolute bottom-0 right-2 h-8 w-4 bg-[#668eaf]" />
                    </div>
                  </div>

                  {/* Location label */}
                  <div className="absolute right-0 bottom-0 rounded-lg border border-[#d1e5f7] bg-white/95 px-3 py-2 shadow-sm sm:right-2 sm:bottom-2">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#5084ad]">
                      Our featured locations - 1
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
        <section
          id="about"
          className="relative isolate overflow-hidden bg-white"
        >
          {/* Subtle background decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-10 -z-10 h-80 w-80 rounded-full bg-[#eaf5ff] blur-3xl"
          />

          <section
            id="about"
            className="relative isolate overflow-hidden bg-white"
          >
            {/* Background decoration */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-32 top-10 -z-10 size-80 rounded-full bg-[#eaf5ff] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-32 bottom-0 -z-10 size-72 rounded-full bg-[#f2f7ff] blur-3xl"
            />

            <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:gap-16 sm:px-8 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16 lg:py-28">
              {/* LEFT: Brand introduction */}
              <div className="relative z-10">
                <div className="mb-5 inline-flex items-center gap-3">
                  <span className="h-[2px] w-8 rounded-full bg-[#0874d1]" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0874d1]">
                    The OneStep Difference
                  </p>
                </div>

                <h2 className="max-w-xl text-[34px] font-semibold leading-[1.12] tracking-[-0.045em] text-[#152b43] min-[420px]:text-[39px] sm:text-5xl lg:text-[52px]">
                  Your next property.
                  <span className="block text-[#0874d1]">One step closer.</span>
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-[#617286] sm:text-[15px]">
                  Finding the right property should feel simple. Explore
                  property options, discover locations that suit your needs, and
                  connect with our team to take your next step with confidence.
                </p>

                {/* Primary action */}
                <Link
                  href="#properties"
                  className="group relative isolate mt-8 inline-flex h-12 items-center gap-3 overflow-hidden rounded-full border border-[#0874d1] bg-[#0874d1] px-5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(8,116,209,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0874d1] sm:h-14 sm:px-6"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-full border-2 border-white [clip-path:inset(0_100%_0_0_round_999px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_999px)] motion-reduce:transition-none"
                  />
                  <House
                    size={18}
                    strokeWidth={1.8}
                    className="relative z-20"
                    aria-hidden="true"
                  />
                  <span className="relative z-20">Explore Properties</span>
                  <ArrowRight
                    size={16}
                    className="relative z-20 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>

                {/* Brand principles */}
                <div className="mt-10 flex items-center gap-3 border-t border-[#e5edf5] pt-6 sm:mt-12">
                  <div className="flex shrink-0 -space-x-2" aria-hidden="true">
                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#eaf5ff] text-[#0874d1]">
                      <House size={16} />
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#d8eafa] text-[#152b43]">
                      <MapPin size={16} />
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#152b43] text-white">
                      <Handshake size={16} />
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-[#152b43] sm:text-sm">
                      Search. Discover. Connect.
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-[#718195] sm:text-xs">
                      A simpler way to move forward.
                    </p>
                  </div>
                </div>

                {/* Three key steps */}
  <div className="mt-8 hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-3">
  {[

                    { number: "01", label: "Explore" },
                    { number: "02", label: "Compare" },
                    { number: "03", label: "Connect" },
                  ].map((step) => (
                    <div
                      key={step.number}
                      className="border-l-2 border-[#c7e2f9] pl-3"
                    >
                      <span className="block text-[10px] font-semibold tracking-[0.12em] text-[#0874d1]">
                        {step.number}
                      </span>
                      <span className="mt-1 block text-xs font-medium text-[#152b43] sm:text-sm">
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Floating, overlapping feature cards */}
              <div data-feature-stack className="relative mx-auto h-[430px] w-full max-w-[560px] sm:h-[520px] lg:h-[550px]">
                {/* Soft glow behind cards */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[20%] top-[20%] -z-10 size-64 rounded-full bg-[#eaf5ff] blur-3xl"
                />

                {[
                  {
                    number: "01",
                    title: "Curated Choices",
                    description: "Property options to match your search.",
                    tags: ["PROPERTY", "EXPLORE"],
                    icon: House,
                    position: "left-[1%] top-[5%] z-10 w-[78%] -rotate-[7deg]",
                    accent: "bg-[#dceeff]",
                  },
                  {
                    number: "02",
                    title: "Easy Discovery",
                    description: "Browse listings with a simpler experience.",
                    tags: ["DISCOVER", "COMPARE"],
                    icon: Search,
                    position: "right-[0%] top-[14%] z-20 w-[77%] rotate-[6deg]",
                    accent: "bg-[#fff0d9]",
                  },
                  {
                    number: "03",
                    title: "Location Focus",
                    description: "Explore areas that matter to you.",
                    tags: ["LOCATIONS", "PROPERTY"],
                    icon: MapPin,
                    position: "left-[0%] top-[43%] z-30 w-[78%] rotate-[5deg]",
                    accent: "bg-[#e8e3ff]",
                  },
                  {
                    number: "04",
                    title: "Enquiry Support",
                    description: "Connect with our team about your needs.",
                    tags: ["SUPPORT", "CONNECT"],
                    icon: MessageCircle,
                    position:
                      "right-[0%] top-[61%] z-40 w-[77%] -rotate-[6deg]",
                    accent: "bg-[#ffe1d8]",
                  },
                ].map((item) => {
                  const FeatureIcon = item.icon;

                  return (
                    <div
                      data-feature-card
                      key={item.number}
                      className={`group absolute min-w-0 ${item.position}`}
                    >
                      <div className="relative overflow-hidden rounded-[20px] border border-[#edf2f7] bg-white p-4 shadow-[0_16px_38px_rgba(44,62,100,0.12)] sm:rounded-[25px] sm:p-5">
                        <div
                          aria-hidden="true"
                          className={`absolute inset-x-0 bottom-0 h-3 ${item.accent}`}
                        />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eaf5ff] text-[#0874d1] sm:size-10">
                                <FeatureIcon size={19} strokeWidth={1.8} />
                              </span>
                              <span className="text-[9px] font-bold tracking-[0.12em] text-[#0874d1] sm:text-[10px]">
                                ONESTEP
                              </span>
                            </div>

                            <span className="text-[10px] font-semibold text-[#9aabba]">
                              {item.number}
                            </span>
                          </div>

                          <h3 className="mt-4 text-[13px] font-semibold tracking-[-0.025em] text-[#152b43] sm:mt-5 sm:text-base">
                            {item.title}
                          </h3>

                          <p className="mt-1.5 max-w-[250px] text-[10px] leading-5 text-[#718195] sm:text-xs sm:leading-6">
                            {item.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-1.5 pb-2 sm:mt-4 sm:gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-[#e5edf5] bg-white px-2 py-1 text-[7px] font-semibold tracking-wide text-[#526a83] sm:px-2.5 sm:text-[9px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </section>
      </main>
      <section aria-hidden={locationOpen} inert={locationOpen ? true : undefined} className="mx-auto max-w-[1280px] px-4 py-8 min-[360px]:px-5 sm:py-12 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[18px] border border-[#f3c95f] bg-gradient-to-r from-[#fffdf8] via-[#fffefa] to-[#effaf2] px-5 py-7 sm:px-10 sm:py-9">
            <div className="relative z-10 max-w-[760px]">
              <p className="text-3xl font-semibold tracking-[-0.04em] text-[#ed1f2b] sm:text-4xl">
                ODP<span className="text-[#e51f2b]"> L</span>oans
              </p>
              <h2 className="mt-4 text-[clamp(1.45rem,3vw,2.25rem)] font-semibold leading-tight text-[#070707]">
                Compare Home Loan Offers from 40+ Banks
              </h2>
              <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-base text-[#636363] sm:text-lg">
                <span className="inline-flex items-center gap-2">
                  <Check className="size-5 rounded-full text-[#666]" /> Rates
                  starting from <strong className="text-[#009c86]">7%</strong>
                </span>
                <span className="inline-flex items-center gap-2">
                  <Check className="size-5 rounded-full text-[#666]" />{" "}
                  <strong className="text-[#e5232b]">0%*</strong> Processing Fee
                </span>
              </div>
              <p className="mt-7 text-xs font-medium uppercase tracking-wide text-[#a87518]">
                Our banking partners
              </p>

              <div
                data-gsap-drag
                role="region"
                aria-label="Bank offers, scroll horizontally to view each bank"
                tabIndex={0}
                className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4"
              >                {[
                  {
                    bank: "SBI",
                    rate: "Starts at 7.25%",
                    logo: "https://thebranvetica.com/assets/img/SBI_Logo.webp",
                    alt: "State Bank of India logo",
                  },
                  {
                    bank: "Canara Bank",
                    rate: "Starts at 7.15%",
                    logo: "https://www.google.com/s2/favicons?domain=canarabank.bank.in&sz=128",
                    alt: "Canara Bank logo",
                  },
                  {
                    bank: "Bank of Baroda",
                    rate: "Starts at 7.2%",
                    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPuf_6udo2drLRvycpVn3Vn74X7Gfzt77lsI203XDtKw&s",
                    alt: "Bank of Baroda logo",
                  },
                  {
                    bank: "Bank of India",
                    rate: "Starts at 7.1%",
                    logo: "https://companieslogo.com/img/orig/BANKINDIA.NS-e3d88e01.png?t=1720244490",
                    alt: "Bank of India logo",
                  },
                ].map(({ bank, rate, logo, alt }) => (
                  <div
                    key={bank}
                    className="group relative w-[min(78vw,220px)] shrink-0 snap-start overflow-hidden rounded-xl border border-[#e6e6e6] bg-white px-3 py-3 text-center transition-colors duration-300 hover:border-[#b8b8b8] sm:w-auto sm:min-w-0 sm:shrink sm:snap-none"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 z-10 rounded-xl border-2 border-black [clip-path:inset(0_100%_0_0_round_12px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_12px)] motion-reduce:transition-none"
                    />

                    <div className="relative z-0 flex h-10 items-center justify-center">
                      <img
                        src={logo}
                        alt={alt}
                        width={36}
                        height={36}
                        loading="lazy"
                        className="size-9 object-contain"
                      />
                    </div>

                    <p className="mt-2 text-sm font-bold text-black sm:text-base">
                      {bank}
                    </p>

                    <p className="mt-1 whitespace-nowrap text-[10px] font-semibold text-black">
                      {rate}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-7">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-base font-semibold text-[#e5232b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5232b]"
                >
                  <span className="relative py-1">
                    Explore Bank Offers
                    <span className="absolute inset-x-0 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-[#e5232b] transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </span>
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact"
                  className="group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full border border-[#e5232b] bg-[#e5232b] px-7 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5232b] sm:px-9"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 rounded-full border-2 border-white [clip-path:inset(0_100%_0_0_round_999px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_999px)] motion-reduce:transition-none"
                  />
                  <span className="relative z-20 inline-flex items-center gap-2">
                    Check Your Eligibility
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </div>
            </div>
            <div
              className="pointer-events-none absolute -right-8 bottom-0 hidden h-52 w-80 rounded-t-[100%] bg-[#dff2e5] opacity-60 lg:block"
              aria-hidden="true"
            />
          </div>
        </Reveal>
      </section>
      <section aria-hidden={locationOpen} inert={locationOpen ? true : undefined} className=" text-[#111111]" aria-label="More ways to connect">
        <div className="mx-auto max-w-[1280px] px-0 lg:px-8">
          <div className="px-4 pb-5 pt-8 sm:px-5 lg:px-0 lg:pb-2 lg:pt-10">
            <div className="mb-7">
              <h2 className="text-[28px] font-normal tracking-[-0.04em] text-[#17202a] sm:text-[30px]">
                Advice &amp; Tools
              </h2>
              <div
                className="mt-3 h-1 w-12 rounded-full bg-[#11b6c9]"
                aria-hidden="true"
              />
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-5">
              {[
                {
                  title: "EMI Calculator",
                  description:
                    "Know how much you'll have to pay every month on your loan",
                  icon: Calculator,
                },
                {
                  title: "Best Home Loan Offers",
                  description:
                    "Get the best bank offers curated just for your profile",
                  icon: Building2,
                },
                {
                  title: "Interiors Budget Estimator",
                  description:
                    "Know the cost of getting your full/partial home interiors done",
                  icon: House,
                },
                {
                  title: "Rates & Trends",
                  description:
                    "Know all about Property Rates & Trends in your city",
                  icon: ChartNoAxesColumnIncreasing,
                },
              ].map(({ title, description, icon: Icon }) => (
                <Link
                  href="/contact"
                  key={title}
                  className="group flex min-h-[310px] w-[min(84vw,320px)] shrink-0 snap-start flex-col rounded-[10px] border border-[#d9d9d9] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#11b6c9] hover:shadow-[0_12px_26px_rgba(0,0,0,0.08)] sm:w-auto sm:min-w-0 sm:shrink sm:snap-none sm:p-6"
                >
                  <span className="flex size-14 items-center justify-center text-[#303030]">
                    <Icon className="size-12 stroke-[1.7]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-7 text-[22px] font-semibold leading-tight tracking-[-0.035em] text-[#383838]">
                    {title}
                  </h3>
                  <p className="mt-4 max-w-[290px] text-[17px] leading-[1.55] text-[#5a5a5a]">
                    {description}
                  </p>
                  <span className="mt-auto pt-6 text-[18px] font-semibold text-[#e5232b]">
                    View now{" "}
                    <ArrowRight className="ml-1 inline size-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

  <div className="flex flex-col items-center justify-center gap-3 bg-[#eaf5ff] px-4 py-5 sm:flex-row sm:gap-4 lg:bg-transparent lg:px-0 lg:py-8">
  {/* BUY — White animated outline */}
  <Link
  href="#properties"
  className="group relative inline-flex min-h-[52px] w-full max-w-[240px] items-center justify-center gap-3 overflow-hidden rounded-full border border-[#0874d1] bg-[#0874d1] px-5 text-sm font-semibold text-white sm:min-h-[64px] sm:w-auto sm:min-w-[190px] sm:justify-between sm:gap-4 sm:px-6 sm:text-base"
  >
              <Building2 className="size-7 shrink-0" />
              <span className="flex-1 whitespace-nowrap">Buy Property</span>
              <ArrowRight className="size-6 shrink-0" />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-white [clip-path:inset(0_100%_0_0_round_999px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_999px)]"
              />
            </Link>

            {/* SELL — Dark-blue animated outline */}
            <Link
              href="/contact"
  className="group relative inline-flex min-h-[52px] w-full max-w-[240px] items-center justify-center gap-3 overflow-hidden rounded-full border border-white bg-white px-5 text-sm font-semibold text-[#0874d1] sm:min-h-[64px] sm:w-auto sm:min-w-[190px] sm:justify-between sm:gap-4 sm:px-6 sm:text-base"
  >
              <Building2 className="size-7 shrink-0" />
              <span className="flex-1 whitespace-nowrap">Sell Property</span>
              <ArrowRight className="size-6 shrink-0" />

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#064b91] [clip-path:inset(0_100%_0_0_round_999px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_999px)]"
              />
            </Link>
          </div>

          <div className="px-3 py-5 text-center lg:rounded-sm lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f6368]">
              Why people choose us
            </p>
            <div className="mx-auto mt-3 grid max-w-md grid-cols-2 gap-2">
              <div className="rounded-md border border-[#d7dde2] bg-white px-3 py-3">
                <p className="text-xl font-semibold tracking-[-0.04em] text-[#0874d1]">
                  100+
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#5f6368]">
                  Happy clients
                </p>
              </div>
              <div className="rounded-md border border-[#d7dde2] bg-white px-3 py-3">
                <p className="text-xl font-semibold tracking-[-0.04em] text-[#22a447]">
                  100%
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#5f6368]">
                  Registered company
                </p>
              </div>
            </div>
            <section aria-hidden={locationOpen} inert={locationOpen ? true : undefined} className="mx-auto w-full max-w-[1280px] px-0 pb-8 pt-2 sm:pb-12 lg:px-8">
              <Reveal>
                <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-r from-[#e9fbff] via-[#f5fdff] to-white px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
                  <div className="relative z-10 flex flex-col items-center gap-5 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
                    <div>
                      <p className="max-w-[700px] text-[clamp(1.35rem,3vw,2rem)] leading-[1.15] tracking-[-0.035em] text-[#243442]">
                        Plan hassle-free{" "}
                        <strong>Site Visits &amp; Evaluate Projects</strong>{" "}
                        with <strong>ODP</strong>
                      </p>

                      <div className="mt-3 inline-flex w-full max-w-[260px] items-center justify-center gap-3 rounded-xl border border-[#f3e4b9] bg-[#fff8e5] px-3 py-2.5 text-sm text-[#17202a] sm:text-base">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#17202a] shadow-sm">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                            <CarFront
                              size={24}
                              strokeWidth={2}
                              className="text-[#0874d1] drop-shadow-[2px_1px_0px_#5b9bd5]"
                              aria-hidden="true"
                            />
                          </span>
                        </span>

                        <span>
                          Get <strong>Free Cab</strong> for every site visit!
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/contact"
                      className="group relative isolate inline-flex w-full max-w-[210px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border border-[#e5232b] bg-[#e5232b] px-7 py-3 text-sm font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e5232b] lg:w-auto sm:px-9 sm:text-base"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 rounded-full border-2 border-white [clip-path:inset(0_100%_0_0_round_999px)] transition-[clip-path] duration-500 ease-in-out group-hover:[clip-path:inset(0_0_0_0_round_999px)] motion-reduce:transition-none"
                      />

                      <span className="relative z-20 inline-flex items-center gap-2">
                        Find out how
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </div>
                  <div
                    className="pointer-events-none absolute -right-8 -top-12 h-52 w-72 rounded-full bg-[#dff7fb] opacity-60 blur-3xl"
                    aria-hidden="true"
                  />
                </div>
              </Reveal>
            </section>
          </div>

          <div className="mb-10 mt-7 px-5 py-4 text-center lg:border-t lg:border-[#d8dadd]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f6368]">
              Follow us
            </p>
            <div className="mt-2 flex justify-center items-center gap-2">
              <Link
                aria-label="Facebook"
                href="/contact"
                className="flex size-6 items-center justify-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/facebook/default.svg"
                  alt=""
                  className="size-6"
                />
              </Link>
              <Link
                aria-label="Instagram"
                href="/contact"
                className="flex size-6 items-center justify-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/instagram/default.svg"
                  alt=""
                  className="size-6"
                />
              </Link>
              <Link
                aria-label="YouTube"
                href="/contact"
                className="flex size-6 items-center justify-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/youtube/default.svg"
                  alt=""
                  className="size-6"
                />
              </Link>
              <Link
                aria-label="X"
                href="/contact"
                className="flex size-6 items-center justify-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/x/default.svg"
                  alt=""
                  className="size-6"
                />
              </Link>
              <Link
                aria-label="WhatsApp"
                href="/contact"
                className="flex size-6 items-center justify-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/whatsapp/default.svg"
                  alt=""
                  className="size-6"
                />
              </Link>
              <Link
                aria-label="LinkedIn"
                href="/contact"
                className="flex size-6 items-center justify-center"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/linkedin/default.svg"
                  alt=""
                  className="size-6"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* chatbot */}

      <div className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[75] flex flex-col items-end gap-4 sm:inset-x-auto sm:bottom-6 sm:right-7">
        {chatOpen && (
          <section
            role="dialog"
            aria-label="ODP property assistant"
            className="
        flex max-h-[min(560px,calc(100svh-7rem))]
        w-full flex-col overflow-hidden rounded-2xl
        border border-[#e3eaf1] bg-white
        text-[#152b43]
        shadow-[0_16px_55px_rgba(21,43,67,0.12)]
        sm:w-[370px]
      "
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#edf1f5] bg-[#dceaf6] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3  ">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#0874d1]">
                  <Bot className="size-5" strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-[-0.02em]">
                    ODP Assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close chatbot"
                onClick={() => setChatOpen(false)}
                className="flex size-9 shrink-0 items-center justify-center text-[#8292a3] transition-colors hover:text-[#152b43]"
              >
                <X className="size-[18px]" strokeWidth={1.7} />
              </button>
            </div>

            {/* Conversation */}
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-white p-5">
              <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#9aa8b7]">
                Welcome to ODP
              </div>

              <div className="max-w-[290px] rounded-r-xl rounded-bl-xl rounded-tl-sm bg-[#f4f8fc] px-4 py-3.5">
                <p className="text-[13px] leading-[1.8] text-[#52677d]">
                  Hello! Welcome to OneStep Dream Property. How can we help you
                  find your next home?
                </p>
              </div>

              <div className="pt-1">
                <p className="mb-3 text-[11px] font-medium text-[#8292a3]">
                  How can we help?
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("properties")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setChatOpen(false);
                    }}
                    className="
                group flex w-full items-center justify-between
                rounded-lg border border-[#e3eaf1] bg-white
                px-4 py-3.5 text-left
                transition-colors duration-200
                hover:border-[#a9cfee]
              "
                  >
                    <span>
                      <span className="block text-[13px] font-medium text-[#152b43]">
                        Explore properties
                      </span>
                      <span className="mt-1 block text-[11px] text-[#8292a3]">
                        Find a place that feels like home
                      </span>
                    </span>

                    <ArrowRight
                      className="size-4 shrink-0 text-[#8292a3] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#0874d1]"
                      strokeWidth={1.7}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("contact")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setChatOpen(false);
                    }}
                    className="
                group flex w-full items-center justify-between
                rounded-lg border border-[#e3eaf1] bg-white
                px-4 py-3.5 text-left
                transition-colors duration-200
                hover:border-[#a9cfee]
              "
                  >
                    <span>
                      <span className="block text-[13px] font-medium text-[#152b43]">
                        Speak with our team
                      </span>
                      <span className="mt-1 block text-[11px] text-[#8292a3]">
                        Get help with your property search
                      </span>
                    </span>

                    <ArrowRight
                      className="size-4 shrink-0 text-[#8292a3] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#0874d1]"
                      strokeWidth={1.7}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-[#edf1f5] bg-white px-5 py-3">
              <p className="text-center text-[10px] tracking-wide text-[#9aa8b7]">
                OneStep Dream Property
              </p>
            </div>
          </section>
        )}

        {/* Floating launcher */}
        <button
          type="button"
          aria-label={chatOpen ? "Close ODP assistant" : "Open ODP assistant"}
          aria-expanded={chatOpen}
          onClick={() => setChatOpen((open) => !open)}
          className="
      group flex size-12 shrink-0 items-center justify-center
      self-end rounded-full border border-[#dceaf6]
      bg-white text-[#0874d1]
      shadow-[0_5px_22px_rgba(21,43,67,0.12)]
      transition-all duration-300
      hover:border-[#0874d1] hover:shadow-[0_8px_28px_rgba(21,43,67,0.16)]
      sm:size-14
    "
        >
          {chatOpen ? (
            <X className="size-5" strokeWidth={1.7} />
          ) : (
            <Bot
              className="size-[22px] transition-transform duration-300 group-hover:scale-105"
              strokeWidth={1.6}
            />
          )}
        </button>
      </div>

      {/* {cookieConsent === false && ( */}

      {cookieConsent === false && (
        <aside
          role="dialog"
          aria-label="Cookie preferences"
          aria-modal="false"
          className="
      fixed inset-x-0 bottom-0 z-[80] p-3
      sm:inset-x-4 sm:bottom-4 sm:rounded-2xl sm:border sm:p-4
      lg:inset-x-8 lg:bottom-6
    "
        >
          <div className="relative mx-auto max-w-[1280px] rounded-xl bg-white px-5 py-5 sm:px-6 sm:py-5">
            {/* Close */}
            <button
              type="button"
              aria-label="Close cookie preferences"
              onClick={() => saveCookieConsent("essential")}
              className="
          absolute right-4 top-4 flex size-8 items-center
          justify-center text-[#152b43]
          transition-colors hover:text-[#0874d1]
        "
            >
              <X className="size-5" />
            </button>

            {/* Heading */}
            <h2 className="pr-10 text-lg font-semibold tracking-tight text-[#152b43] sm:text-xl">
              Let&apos;s Talk Cookies 🍪
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-5xl pr-2 text-xs leading-[1.6] text-[#303b46] sm:text-[13px]">
              We use cookies to enhance your browsing experience, personalize
              content, and understand site performance. By clicking &quot;Accept
              all&quot;, you consent to the use of cookies that help us deliver
              tailored content and improve how our site works.
            </p>

            <p className="mt-2 text-xs leading-[1.6] text-[#303b46] sm:text-[13px]">
              You can view our full{" "}
              <Link
                href="/privacy-policy"
                className="font-semibold text-[#152b43] underline underline-offset-2 transition-colors hover:text-[#0874d1]"
              >
                Cookie Policy
              </Link>{" "}
              for more details and update or disable your preferences anytime in
              your browser settings.
            </p>

            {/* Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => saveCookieConsent("accepted")}
                className="
            inline-flex h-10 items-center justify-center
            rounded-full bg-[#0874d1] px-5
            text-xs font-semibold text-white
            transition-colors duration-200 hover:bg-[#075da8]
          "
              >
                Accept all
              </button>

              <button
                type="button"
                onClick={() => saveCookieConsent("essential")}
                className="
            inline-flex h-10 items-center justify-center
            rounded-full border border-[#cbd5df]
            bg-white px-5 text-xs font-medium text-[#152b43]
            transition-colors duration-200
            hover:border-[#0874d1] hover:text-[#0874d1]
          "
              >
                Essential only
              </button>

              <button
                type="button"
                onClick={() => saveCookieConsent("essential")}
                className="
            inline-flex h-10 items-center justify-center gap-2
            rounded-full border border-[#cbd5df]
            bg-white px-5 text-xs font-medium text-[#152b43]
            transition-colors duration-200
            hover:border-[#0874d1] hover:text-[#0874d1]
          "
              >
                <SlidersHorizontal className="size-3.5" />
                Customize
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export function SearchIcon() {
  return <SlidersHorizontal size={15} />;
}
export function CheckIcon() {
  return <Check size={15} />;
}
export function BedIcon() {
  return <BedDouble size={15} />;
}
