"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

export type BookAssetProps = {
  className?: string;
  style?: CSSProperties;
  edition?: string;
  controls?: boolean;
  background?: "dark" | "light" | "checker" | "transparent";
  open?: boolean;
};

export function BookAssetHost({
  kind,
  title,
  className = "",
  style,
  edition,
  controls = true,
  background = "dark",
  open = false,
}: BookAssetProps & { kind: string; title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(true);
  const [awake, setAwake] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [listening, setListening] = useState(false);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const src =
    "/3d-assets/books/" +
    kind +
    "/preview.html?" +
    new URLSearchParams({
      controls: String(controls),
      background,
      open: String(open),
      ...(edition ? { edition } : {}),
    });
  const mounted = visible && awake && listening;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setAwake(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.source === frame.current?.contentWindow &&
        event.data?.type === "book-asset" &&
        event.data.kind === kind &&
        (event.data.state === "ready" || event.data.state === "error")
      ) {
        setState(event.data.state);
      }
    };
    window.addEventListener("message", receive);
    setListening(true);
    return () => window.removeEventListener("message", receive);
  }, [kind]);

  useEffect(() => {
    setState("loading");
  }, [src, mounted]);

  const fallbackStyle = {
    background: background === "light" ? "#e5ded0" : "#1d1b1b",
    color: background === "light" ? "#152b43" : "#fff",
  };

  return (
    <div
      ref={host}
      className={`threeui-background book-asset ${className}`}
      role="group"
      aria-label={title}
      data-state={mounted ? state : "paused"}
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          background === "transparent"
            ? "transparent"
            : background === "light"
              ? "#e5ded0"
              : "#1d1b1b",
        pointerEvents: "auto",
        ...style,
      }}
    >
      {mounted && (
        <iframe
          key={src}
          ref={frame}
          title={title}
          src={src}
          sandbox="allow-scripts"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: 0,
            pointerEvents: "auto",
          }}
        />
      )}
      {mounted && state === "loading" && (
        <div
          className="absolute inset-0 z-10 grid place-items-center p-6 text-center text-sm"
          role="status"
          style={fallbackStyle}
        >
          Loading the interactive 3D volume…
        </div>
      )}
      {mounted && state === "error" && (
        <div
          className="absolute inset-0 z-10 grid place-items-center p-6 text-center"
          role="status"
          style={fallbackStyle}
        >
          <div>
            <p className="font-semibold">3D preview unavailable</p>
            <p className="mt-2 max-w-sm text-sm leading-6 opacity-75">
              This browser could not start the interactive volume. The About Us
              information continues below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
