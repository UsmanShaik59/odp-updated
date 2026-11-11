"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function GsapCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const supportsCustomCursor = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;

    if (!cursor || !supportsCustomCursor) return;

    gsap.set(cursor, { autoAlpha: 0, xPercent: -50, yPercent: -50 });

    const moveX = gsap.quickTo(cursor, "x", {
      duration: 0.34,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(cursor, "y", {
      duration: 0.34,
      ease: "power3.out",
    });
    const handlePointerMove = (event: PointerEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
      gsap.to(cursor, { autoAlpha: 1, duration: 0.16, overwrite: "auto" });
    };
    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      const isInteractive =
        target instanceof Element &&
        Boolean(
          target.closest(
            'a, button, input, select, textarea, [role="button"], [data-cursor-hover]',
          ),
        );

      gsap.to(cursor, {
        scale: isInteractive ? 1.35 : 1,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    const hideCursor = () => {
      gsap.to(cursor, { autoAlpha: 0, duration: 0.18, overwrite: "auto" });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", hideCursor);
    window.addEventListener("blur", hideCursor);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.removeEventListener("pointerleave", hideCursor);
      window.removeEventListener("blur", hideCursor);
    };
  }, { scope: cursorRef });

  return (
    <div ref={cursorRef} className="odp-cursor" aria-hidden="true">
      <span className="odp-cursor__ring" />
      <span className="odp-cursor__dot" />
    </div>
  );
}
