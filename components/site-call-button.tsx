import { Phone } from "lucide-react";

export function SiteCallButton() {
  return (
    <a
      href="tel:+917411535782"
      aria-label="Call ODP at +91 7411535782"
      style={{
        right: "calc(1rem + env(safe-area-inset-right))",
        bottom: "calc(1rem + env(safe-area-inset-bottom))",
      }}
      className="fixed z-30 inline-flex size-11 items-center justify-center rounded-full bg-[#0874d1] text-white shadow-lg transition-colors hover:bg-[#075fab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1]"
    >
      <Phone className="size-4" aria-hidden="true" />
    </a>
  );
}
