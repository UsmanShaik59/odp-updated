import { Phone } from "lucide-react";

export function SiteCallButton() {
  return (
    <a
      href="tel:+917411535782"
      aria-label="Call ODP at +91 7411535782"
      style={{
        left: "calc(1rem + env(safe-area-inset-left))",
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
      className="fixed z-30 inline-flex min-h-12 items-center gap-2 whitespace-nowrap rounded-full bg-[#0874d1] px-4 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-[#075fab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1]"
    >
      <Phone className="size-4 shrink-0" aria-hidden="true" />
      <span>+91 7411535782</span>
    </a>
  );
}
