import Link from "next/link";
import HalftoneWordmarkFooter from "./ui/halftone-wordmark-footer";

interface SiteFooterProps {
  includeBlueSection?: boolean;
  disclaimer?: string;
}

export default function SiteFooter({
  includeBlueSection = true,
  disclaimer,
}: SiteFooterProps) {
  return (
    <>
      {includeBlueSection && (
        <section
          aria-label="Contact and legal information"
          id="contact"
          className="w-full min-w-0 border-t border-[#0874d1] bg-[#0874d1] text-white"
        >
          <div className="mx-auto grid max-w-[1280px] gap-9 px-5 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-white"
                aria-label="ODP home"
              >
                <span className="text-[32px] font-black leading-none tracking-[-0.12em]">
                  odp
                </span>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-6 text-white">
                Thoughtfully selected homes for the way you want to live.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
                Discover
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white">
                <Link href="/#properties" className="transition-colors hover:text-white/80">Buy Flats</Link>
                <Link href="/#properties" className="transition-colors hover:text-white/80">Properties</Link>
                <Link href="/#locations" className="transition-colors hover:text-white/80">Locations</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
                Company
              </h3>
              <div className="mt-5 flex flex-col gap-3 text-sm text-white">
                <Link href="/about" className="transition-colors hover:text-white/80">About Us</Link>
                <Link href="/contact" className="transition-colors hover:text-white/80">Contact</Link>
                <Link href="/contact" className="transition-colors hover:text-white/80">List Property</Link>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em]">
                Get in touch
              </h3>
              <p className="mt-5 break-all text-sm leading-6 text-white">
                <a
                  href="mailto:help.onestepdreamproperty@gmail.com"
                  className="transition-colors hover:text-white/80"
                >
                  help.onestepdreamproperty@gmail.com
                </a>
                <br />
                <a
                  href="tel:+917411535782"
                  className="transition-colors hover:text-white/80"
                >
                  +91 7411535782
                </a>
              </p>
            </div>
          </div>
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 border-t border-white/30 px-5 py-6 text-xs text-white/90 sm:flex-row sm:items-center sm:justify-between sm:text-sm lg:px-8">
            <span>© 2026 OneStep Dream Property. All rights reserved.</span>
            <span>Privacy · Terms</span>
          </div>
          {disclaimer && (
            <div className="mx-auto mt-4 w-full max-w-[1280px] border-t border-white/20 px-5 pb-8 pt-6 sm:mt-6 sm:px-8 sm:pb-10 sm:pt-8">
              <p className="text-xs leading-6 text-white/80 sm:text-sm sm:leading-7">
                <strong className="font-semibold text-white">Disclaimer:</strong>{" "}
                {disclaimer}
              </p>
            </div>
          )}
        </section>
      )}
      <HalftoneWordmarkFooter
        wordmark="odp"
        label="OneStep Dream Property"
        meta="ODP Services · © 2026"
        preset="sky"
        palette={{ background: "#f5faff", ink: "#152b43", warm: "#5b9bd5" }}
        dotGap={6}
        radius={88}
        crop={0.16}
        grain={0.28}
        columns={[
          {
            title: "Explore",
            links: [
              { label: "Buy Flats", href: "/#properties" },
              { label: "Properties", href: "/#properties" },
              { label: "Locations", href: "/#locations" },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About Us", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "List Property", href: "/contact" },
            ],
          },
          {
            title: "Get in touch",
            links: [
              {
                label: "help.onestepdreamproperty@gmail.com",
                href: "mailto:help.onestepdreamproperty@gmail.com",
              },
              { label: "+91 7411535782", href: "tel:+917411535782" },
            ],
          },
        ]}
      />
    </>
  );
}
