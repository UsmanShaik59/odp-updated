"use client";

import * as React from "react";

export interface HalftonePalette {
  background: string;
  ink: string;
  warm: string;
}

export type HalftonePreset = "night" | "paper" | "ember" | "cobalt" | "sky";

export interface FooterLink {
  label: string;
  href?: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface HalftoneWordmarkFooterProps {
  wordmark?: string;
  label?: string;
  meta?: string;
  columns?: FooterColumn[];
  backToTop?: boolean;
  preset?: HalftonePreset;
  palette?: { background?: string; ink?: string; warm?: string };
  dotGap?: number;
  radius?: number;
  crop?: number;
  grain?: number;
  interactive?: boolean;
  fontFamily?: string;
  fontWeight?: number;
  monoFamily?: string;
  height?: string;
  className?: string;
}

const PRESETS: Record<HalftonePreset, HalftonePalette> = {
  night: { background: "#0c0c0b", ink: "#e9e4da", warm: "#e9762b" },
  paper: { background: "#efebe3", ink: "#17150f", warm: "#c2361c" },
  ember: { background: "#160a06", ink: "#f2c48c", warm: "#ff5a1f" },
  cobalt: { background: "#0d1b4d", ink: "#dfe7ff", warm: "#ffcd3c" },
  sky: { background: "#f5faff", ink: "#152b43", warm: "#5b9bd5" },
};

const SANS_STACK =
  '"Inter Tight", "Inter Variable", "Inter", "Helvetica Neue", Arial, system-ui, sans-serif';
const MONO_STACK =
  '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, Consolas, monospace';

export function hwfHex(hex: string) {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!match) return null;
  const value =
    match[1].length === 3
      ? match[1].split("").map((char) => char + char).join("")
      : match[1];
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

export function hwfRadius(coverage: number, gap: number) {
  const normalized = Math.max(0, Math.min(1, coverage));
  return Math.sqrt(normalized) * gap * 0.56;
}

export function hwfStep(
  x: number,
  y: number,
  vx: number,
  vy: number,
  homeX: number,
  homeY: number,
  pointerX: number,
  pointerY: number,
  radius: number,
) {
  const dx = x - pointerX;
  const dy = y - pointerY;
  const distanceSquared = dx * dx + dy * dy;

  if (radius > 0 && distanceSquared < radius * radius) {
    const distance = Math.sqrt(distanceSquared) + 0.001;
    const force = (1 - distance / radius) * 2.6;
    vx += (dx / distance) * force;
    vy += (dy / distance) * force;
  }

  vx = (vx + (homeX - x) * 0.05) * 0.84;
  vy = (vy + (homeY - y) * 0.05) * 0.84;
  return [x + vx, y + vy, vx, vy];
}

export function hwfWarmth(
  x: number,
  y: number,
  homeX: number,
  homeY: number,
  span: number,
) {
  const distance = Math.hypot(x - homeX, y - homeY);
  return span > 0 ? Math.min(1, distance / span) : 0;
}

export function hwfFitSize(measured: number, width: number) {
  return measured > 0 ? (width / measured) * 100 : 0;
}

const HWF_CSS = `
.hwf-root {
  position: relative; width: 100%; overflow: hidden; isolation: isolate;
  background: var(--hwf-bg); color: var(--hwf-ink); -webkit-font-smoothing: antialiased;
}
.hwf-root canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; max-width: none; }
.hwf-top {
  position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 1.25fr) repeat(3, minmax(0, 1fr));
  gap: 24px; padding: clamp(22px, 3.4vw, 40px) clamp(20px, 3.4vw, 44px) 0;
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase; line-height: 1.75;
}
.hwf-brand strong { display: block; font-weight: 500; }
.hwf-brand span { opacity: .62; }
.hwf-col h3 { margin: 0; font: inherit; opacity: .62; font-weight: 500; }
.hwf-col ul { list-style: none; margin: 0; padding: 0; }
.hwf-col a, .hwf-up {
  color: inherit; text-decoration: none; opacity: .88; background: none; border: 0; padding: 0;
  font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer;
  background-image: linear-gradient(currentColor, currentColor); background-size: 0% 1px;
  background-repeat: no-repeat; background-position: 0 100%; transition: opacity .25s ease, background-size .35s cubic-bezier(.2,.7,.1,1);
}
.hwf-col a:hover, .hwf-up:hover { opacity: 1; background-size: 100% 1px; }
.hwf-col a:focus-visible, .hwf-up:focus-visible { outline: 1px solid currentColor; outline-offset: 3px; opacity: 1; }
.hwf-rule {
  position: relative; z-index: 1; display: flex; justify-content: flex-end; align-items: center; gap: 16px;
  margin: clamp(18px, 2.6vw, 30px) clamp(20px, 3.4vw, 44px) 0; padding-top: 12px;
  border-top: 0.5px solid color-mix(in srgb, var(--hwf-ink) 30%, transparent);
  font-family: var(--hwf-mono); font-size: 10.5px; letter-spacing: .18em; text-transform: uppercase;
}
.hwf-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 720px) {
  .hwf-top { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); row-gap: 18px; }
  .hwf-brand { grid-column: 1 / -1; }
}
@media (prefers-reduced-motion: reduce) {
  .hwf-col a, .hwf-up { transition: none; }
}
`;

export default function HalftoneWordmarkFooter({
  wordmark = "halden",
  label = "Halden Studio",
  meta = "© 2026 · Oslo / Lisbon",
  columns = [],
  backToTop = true,
  preset = "night",
  palette,
  dotGap = 6,
  radius = 80,
  crop = 0.2,
  grain = 0.5,
  interactive = true,
  fontFamily = SANS_STACK,
  fontWeight = 800,
  monoFamily = MONO_STACK,
  height = "560px",
  className = "",
}: HalftoneWordmarkFooterProps) {
  const colors = { ...PRESETS[preset], ...palette };
  const rootRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const options = React.useRef({
    colors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  });
  options.current = {
    colors,
    dotGap,
    radius,
    crop,
    grain,
    interactive,
    fontFamily,
    fontWeight,
    wordmark,
  };
  const key = [
    wordmark,
    dotGap,
    crop,
    grain,
    fontFamily,
    fontWeight,
    colors.background,
    colors.ink,
    colors.warm,
  ].join("|");

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let pointerX = -1e5;
    let pointerY = -1e5;
    let frame = 0;
    let pointerIdleTimer = 0;
    let visible = true;
    let awake = true;
    let shock = { x: 0, y: 0, time: -1 };
    let dots = new Float32Array(0);
    let dotCount = 0;
    let grainTile: HTMLCanvasElement | null = null;
    const ink = hwfHex(options.current.colors.ink) || [233, 228, 218];
    const warm = hwfHex(options.current.colors.warm) || [233, 118, 43];

    const layout = () => {
      const current = options.current;
      const bounds = root.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);

      const mask = document.createElement("canvas");
      mask.width = width;
      mask.height = height;
      const maskContext = mask.getContext("2d", { willReadFrequently: true });
      if (!maskContext) return;

      maskContext.font = `${current.fontWeight} 100px ${current.fontFamily}`;
      const word = current.wordmark || " ";
      const fontSize = hwfFitSize(maskContext.measureText(word).width, width * 1.02);
      maskContext.font = `${current.fontWeight} ${fontSize}px ${current.fontFamily}`;
      const textMetrics = maskContext.measureText(word);
      const capHeight = textMetrics.actualBoundingBoxAscent || fontSize * 0.72;
      const cropAmount = Math.max(0, Math.min(0.6, current.crop));
      maskContext.fillStyle = "#000";
      maskContext.textBaseline = "alphabetic";
      maskContext.fillText(word, (width - textMetrics.width) / 2, height + capHeight * cropAmount);
      const image = maskContext.getImageData(0, 0, width, height).data;

      const gap = Math.max(3, current.dotGap);
      const columns = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);
      const values: number[] = [];

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          let coverageSum = 0;
          for (let sampleY = 0; sampleY < 3; sampleY++) {
            for (let sampleX = 0; sampleX < 3; sampleX++) {
              const samplePositionX = Math.min(
                width - 1,
                Math.floor(column * gap + ((sampleX + 0.5) * gap) / 3),
              );
              const samplePositionY = Math.min(
                height - 1,
                Math.floor(row * gap + ((sampleY + 0.5) * gap) / 3),
              );
              coverageSum += image[(samplePositionY * width + samplePositionX) * 4 + 3];
            }
          }

          const coverage = coverageSum / (9 * 255);
          if (coverage < 0.06) continue;
          const homeX = column * gap + gap / 2;
          const homeY = row * gap + gap / 2;
          values.push(homeX, homeY, 0, 0, homeX, homeY, hwfRadius(coverage, gap));
        }
      }

      dots = new Float32Array(values);
      dotCount = values.length / 7;

      grainTile = document.createElement("canvas");
      grainTile.width = 256;
      grainTile.height = 256;
      const grainContext = grainTile.getContext("2d");
      if (grainContext) {
        const grainImage = grainContext.createImageData(256, 256);
        for (let index = 0; index < grainImage.data.length; index += 4) {
          const value = Math.random() * 255;
          grainImage.data[index] = value;
          grainImage.data[index + 1] = value;
          grainImage.data[index + 2] = value;
          grainImage.data[index + 3] = Math.random() < 0.5 ? 0 : 255;
        }
        grainContext.putImageData(grainImage, 0, 0);
      }
      awake = true;
    };

    const draw = (now: number) => {
      const current = options.current;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = current.colors.background;
      context.fillRect(0, 0, width, height);

      const pushRadius = current.interactive && !reducedMotion ? Math.max(0, current.radius) : 0;
      const shockAge = shock.time < 0 ? 1e9 : now - shock.time;
      const shockRadius = shockAge * 0.9;
      let moving = false;

      for (let index = 0; index < dotCount; index++) {
        const offset = index * 7;
        let x = dots[offset];
        let y = dots[offset + 1];
        let velocityX = dots[offset + 2];
        let velocityY = dots[offset + 3];
        const homeX = dots[offset + 4];
        const homeY = dots[offset + 5];

        if (!reducedMotion) {
          if (shockAge < 900) {
            const deltaX = homeX - shock.x;
            const deltaY = homeY - shock.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + 0.001;
            const band = 1 - Math.min(1, Math.abs(distance - shockRadius) / 26);
            if (band > 0) {
              const force = band * 3.2 * (1 - shockAge / 900);
              velocityX += (deltaX / distance) * force;
              velocityY += (deltaY / distance) * force;
            }
          }

          const next = hwfStep(
            x,
            y,
            velocityX,
            velocityY,
            homeX,
            homeY,
            pointerX,
            pointerY,
            pushRadius,
          );
          x = next[0];
          y = next[1];
          velocityX = next[2];
          velocityY = next[3];
          if (Math.abs(velocityX) + Math.abs(velocityY) > 0.02 || Math.abs(x - homeX) + Math.abs(y - homeY) > 0.05) {
            moving = true;
          } else {
            x = homeX;
            y = homeY;
            velocityX = 0;
            velocityY = 0;
          }
          dots[offset] = x;
          dots[offset + 1] = y;
          dots[offset + 2] = velocityX;
          dots[offset + 3] = velocityY;
        }

        const warmth = hwfWarmth(x, y, homeX, homeY, 28);
        context.fillStyle =
          warmth > 0.02
            ? `rgb(${Math.round(ink[0] + (warm[0] - ink[0]) * warmth)},${Math.round(ink[1] + (warm[1] - ink[1]) * warmth)},${Math.round(ink[2] + (warm[2] - ink[2]) * warmth)})`
            : current.colors.ink;
        context.beginPath();
        context.arc(x, y, dots[offset + 6], 0, Math.PI * 2);
        context.fill();
      }

      if (grainTile && current.grain > 0) {
        context.globalAlpha = Math.min(1, current.grain) * 0.09;
        context.globalCompositeOperation = "overlay";
        const pattern = context.createPattern(grainTile, "repeat");
        if (pattern) {
          context.fillStyle = pattern;
          context.fillRect(0, 0, width, height);
        }
        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";
      }

      awake = moving || shockAge < 900;
    };

    const loop = (now: number) => {
      frame = 0;
      if (!visible) return;
      draw(now);
      if (awake) frame = requestAnimationFrame(loop);
    };
    const wake = () => {
      awake = true;
      if (!frame && visible) frame = requestAnimationFrame(loop);
    };
    const clearPointer = () => {
      pointerX = -1e5;
      pointerY = -1e5;
      pointerIdleTimer = 0;
      wake();
    };
    const toLocal = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      return [event.clientX - bounds.left, event.clientY - bounds.top];
    };
    const onMove = (event: PointerEvent) => {
      if (!options.current.interactive) return;
      const [x, y] = toLocal(event);
      pointerX = x;
      pointerY = y;
      if (pointerIdleTimer) window.clearTimeout(pointerIdleTimer);
      pointerIdleTimer = window.setTimeout(clearPointer, 120);
      wake();
    };
    const onLeave = () => {
      if (pointerIdleTimer) window.clearTimeout(pointerIdleTimer);
      clearPointer();
    };
    const onDown = (event: PointerEvent) => {
      if (!options.current.interactive || reducedMotion) return;
      if (event.target instanceof Element && event.target.closest("a, button")) return;
      const [x, y] = toLocal(event);
      shock = { x, y, time: performance.now() };
      wake();
    };

    layout();
    draw(performance.now());
    wake();
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);

    const resizeObserver = new ResizeObserver(() => {
      layout();
      wake();
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver((entries) => {
      visible = entries[0] ? entries[0].isIntersecting : true;
      if (visible) wake();
    });
    intersectionObserver.observe(root);

    let alive = true;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!alive) return;
        layout();
        wake();
      });
    }

    return () => {
      alive = false;
      if (pointerIdleTimer) window.clearTimeout(pointerIdleTimer);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
    };
  }, [key]);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <footer
      ref={rootRef}
      aria-label="OneStep Dream Property footer"
      className={`hwf-root ${className}`}
      style={
        {
          height,
          "--hwf-bg": colors.background,
          "--hwf-ink": colors.ink,
          "--hwf-mono": monoFamily,
        } as React.CSSProperties
      }
    >
      <style>{HWF_CSS}</style>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="hwf-sr">{wordmark}</span>
      <div className="hwf-top">
        <div className="hwf-brand">
          <strong>{label}</strong>
          <span>{meta}</span>
        </div>
        {columns.map((column) => (
          <nav className="hwf-col" key={column.title} aria-label={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href || "#top"}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="hwf-rule">
        {backToTop ? (
          <button type="button" className="hwf-up" onClick={scrollToTop}>
            Back to top ↑
          </button>
        ) : null}
      </div>
    </footer>
  );
}
