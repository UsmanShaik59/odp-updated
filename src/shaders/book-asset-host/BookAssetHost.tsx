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
          aria-hidden={state !== "ready"}
          tabIndex={state === "ready" ? 0 : -1}
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
      {mounted && state !== "ready" && (
        <div
          className="working-volume-fallback absolute inset-0 z-10"
          role="status"
          style={fallbackStyle}
        >
          <div
            className="working-volume-fallback__books"
            aria-hidden="true"
          >
            <div className="working-volume-fallback__book working-volume-fallback__book--one">
              <span>WORKING<br />VOLUME 01</span>
            </div>
            <div className="working-volume-fallback__book working-volume-fallback__book--two">
              <span>WORKING<br />VOLUME 02</span>
            </div>
            <div className="working-volume-fallback__book working-volume-fallback__book--three">
              <span>WORKING<br />VOLUME 03</span>
            </div>
            <div className="working-volume-fallback__book working-volume-fallback__book--four">
              <span>WORKING<br />VOLUME 04</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.16em]">
              Working Volumes
            </p>
            <p className="mt-1 text-xs opacity-70">
              {state === "error"
                ? "Showing the cover artwork while 3D is unavailable."
                : "Loading the interactive preview…"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
