"use client";

import { Pause, Play, Sparkles } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";

interface MatrixNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  col: number;
  row: number;
  tension: number;
  pulsePhase: number;
  label: string;
}

interface SynapticPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  power: number;
}

interface KineticMatrixProps {
  title?: string;
  className?: string;
}

const GRID_SPACING = 48;
const BACKGROUND = "#eaf5ff";
const NAVY_RGB = "21, 43, 67";
const BLUE_RGB = "8, 116, 209";

function drawLatticeLink(
  context: CanvasRenderingContext2D,
  first: MatrixNode,
  second: MatrixNode,
  isTensioned: boolean,
) {
  const stretch = Math.hypot(first.x - second.x, first.y - second.y);
  const glow = Math.max(first.tension, second.tension, Math.max(0, stretch / GRID_SPACING - 1) * 2);
  context.strokeStyle = isTensioned
    ? `rgba(${BLUE_RGB}, ${Math.min(0.72, 0.2 + glow * 0.6)})`
    : `rgba(${NAVY_RGB}, 0.1)`;
  context.lineWidth = isTensioned ? 0.8 + glow : 0.7;
  context.beginPath();
  context.moveTo(first.x, first.y);
  context.lineTo(second.x, second.y);
  context.stroke();
}

export default function KineticMatrix({
  title = "FIND HOME",
  className,
}: KineticMatrixProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({
    x: -2000,
    y: -2000,
    previousX: -2000,
    previousY: -2000,
    vx: 0,
    vy: 0,
    radius: 190,
    isDown: false,
  });
  const nodesRef = useRef<MatrixNode[]>([]);
  const pulsesRef = useRef<SynapticPulse[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0 });
  const [isRunning, setIsRunning] = useState(true);

  const buildLattice = useCallback((width: number, height: number) => {
    const cols = Math.ceil(width / GRID_SPACING) + 1;
    const rows = Math.ceil(height / GRID_SPACING) + 1;
    const nodes: MatrixNode[] = [];

    for (let col = 0; col < cols; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const x = col * GRID_SPACING;
        const y = row * GRID_SPACING;
        nodes.push({
          x,
          y,
          vx: 0,
          vy: 0,
          baseX: x,
          baseY: y,
          col,
          row,
          tension: 0,
          pulsePhase: Math.random() * Math.PI * 2,
          label: `0x${((col * 17 + row * 31) % 256).toString(16).padStart(2, "0").toUpperCase()}`,
        });
      }
    }

    dimensionsRef.current = { width, height, cols, rows };
    nodesRef.current = nodes;
    pulsesRef.current = [];
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!container || !canvas || !context) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (!width || !height) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      buildLattice(width, height);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [buildLattice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context || !isRunning) return;

    let animationFrame = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      const deltaTime = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const { width, height, cols, rows } = dimensionsRef.current;
      const nodes = nodesRef.current;
      const pulses = pulsesRef.current;
      const shockwaves = shockwavesRef.current;
      const pointer = pointerRef.current;
      const mouseSpeed = Math.hypot(pointer.vx, pointer.vy);

      pointer.vx = (pointer.x - pointer.previousX) / (deltaTime * 1000 || 1);
      pointer.vy = (pointer.y - pointer.previousY) / (deltaTime * 1000 || 1);
      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;

      context.fillStyle = BACKGROUND;
      context.fillRect(0, 0, width, height);

      for (let index = shockwaves.length - 1; index >= 0; index -= 1) {
        const wave = shockwaves[index];
        wave.radius += 390 * deltaTime;
        wave.power *= Math.pow(0.12, deltaTime);
        if (wave.radius > wave.maxRadius || wave.power < 0.01) {
          shockwaves.splice(index, 1);
        }
      }

      for (const node of nodes) {
        node.pulsePhase += deltaTime * 3;
        const dx = pointer.x - node.x;
        const dy = pointer.y - node.y;
        const distance = Math.hypot(dx, dy);

        if (distance < pointer.radius && distance > 0) {
          const ratio = 1 - distance / pointer.radius;
          const force = ratio * (1250 + mouseSpeed * 140 + (pointer.isDown ? 1800 : 0));
          const angle = Math.atan2(dy, dx);
          node.vx -= Math.cos(angle) * force * deltaTime;
          node.vy -= Math.sin(angle) * force * deltaTime;
          node.tension = Math.min(1, node.tension + ratio * 0.5);
        }

        for (const wave of shockwaves) {
          const waveDistance = Math.hypot(node.x - wave.x, node.y - wave.y);
          const edgeDistance = Math.abs(waveDistance - wave.radius);
          if (edgeDistance < 55) {
            const force = (1 - edgeDistance / 55) * wave.power * 2400;
            const angle = Math.atan2(node.y - wave.y, node.x - wave.x);
            node.vx += Math.cos(angle) * force * deltaTime;
            node.vy += Math.sin(angle) * force * deltaTime;
            node.tension = 1;
          }
        }

        node.vx += (node.baseX - node.x) * 24 * deltaTime;
        node.vy += (node.baseY - node.y) * 24 * deltaTime;
        node.vx *= 0.86;
        node.vy *= 0.86;
        node.x += node.vx * deltaTime * 60;
        node.y += node.vy * deltaTime * 60;
        node.tension = Math.max(0, node.tension - deltaTime * 0.8);
      }

      if (Math.random() < 0.22 && nodes.length > 0 && pulses.length < 32) {
        const fromIndex = Math.floor(Math.random() * nodes.length);
        const fromNode = nodes[fromIndex];
        const directions = [
          { col: 1, row: 0 },
          { col: -1, row: 0 },
          { col: 0, row: 1 },
          { col: 0, row: -1 },
        ];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const targetCol = fromNode.col + direction.col;
        const targetRow = fromNode.row + direction.row;

        if (targetCol >= 0 && targetCol < cols && targetRow >= 0 && targetRow < rows) {
          pulses.push({
            fromNode: fromIndex,
            toNode: targetCol * rows + targetRow,
            progress: 0,
            speed: 1.5 + Math.random() * 1.8,
          });
        }
      }

      for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row < rows; row += 1) {
          const index = col * rows + row;
          const node = nodes[index];
          if (!node) continue;

          if (col < cols - 1) {
            const right = nodes[(col + 1) * rows + row];
            if (right) drawLatticeLink(context, node, right, node.tension > 0.05 || right.tension > 0.05);
          }
          if (row < rows - 1) {
            const below = nodes[col * rows + row + 1];
            if (below) drawLatticeLink(context, node, below, node.tension > 0.05 || below.tension > 0.05);
          }
        }
      }

      for (let index = pulses.length - 1; index >= 0; index -= 1) {
        const pulse = pulses[index];
        pulse.progress += deltaTime * pulse.speed;
        const first = nodes[pulse.fromNode];
        const second = nodes[pulse.toNode];
        if (!first || !second || pulse.progress >= 1) {
          if (second) second.tension = Math.min(1, second.tension + 0.3);
          pulses.splice(index, 1);
          continue;
        }

        context.fillStyle = "#0874d1";
        context.beginPath();
        context.arc(
          first.x + (second.x - first.x) * pulse.progress,
          first.y + (second.y - first.y) * pulse.progress,
          2.2,
          0,
          Math.PI * 2,
        );
        context.fill();
      }

      for (const wave of shockwaves) {
        context.strokeStyle = `rgba(${BLUE_RGB}, ${Math.max(0.08, wave.power * 0.42)})`;
        context.lineWidth = 1.5;
        context.beginPath();
        context.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        context.stroke();
      }

      for (const node of nodes) {
        const distance = Math.hypot(pointer.x - node.x, pointer.y - node.y);
        const isNear = distance < pointer.radius;
        const radius = isNear ? 3 + node.tension * 1.2 : 1.5 + Math.sin(node.pulsePhase) * 0.2;

        if (isNear || node.tension > 0.1) {
          context.fillStyle = `rgba(${BLUE_RGB}, ${Math.min(0.34, 0.12 + node.tension * 0.2)})`;
          context.beginPath();
          context.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
          context.fill();
        }

        context.fillStyle = isNear || node.tension > 0.1
          ? "#0874d1"
          : `rgba(${NAVY_RGB}, 0.3)`;
        context.beginPath();
        context.arc(node.x, node.y, radius, 0, Math.PI * 2);
        context.fill();

        if (distance < 86) {
          context.font = '8px "Geist Mono", ui-monospace, monospace';
          context.fillStyle = "rgba(8, 116, 209, 0.88)";
          context.fillText(node.label, node.x + 9, node.y - 9);
        }
      }

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrame);
  }, [isRunning]);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerRef.current.x = event.clientX - bounds.left;
    pointerRef.current.y = event.clientY - bounds.top;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    pointerRef.current.isDown = true;
    pointerRef.current.x = x;
    pointerRef.current.y = y;
    shockwavesRef.current.push({
      x,
      y,
      radius: 8,
      maxRadius: 420,
      power: 1.15,
    });
  };

  const handlePointerUp = () => {
    pointerRef.current.isDown = false;
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = -2000;
    pointerRef.current.y = -2000;
    pointerRef.current.isDown = false;
  };

  const triggerCentralImpulse = () => {
    const { width, height } = dimensionsRef.current;
    shockwavesRef.current.push({
      x: width / 2,
      y: height / 2,
      radius: 8,
      maxRadius: Math.max(width, height) * 0.85,
      power: 1.25,
    });
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive property matrix"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "relative isolate h-[360px] w-full select-none overflow-hidden bg-[#eaf5ff] touch-pan-y sm:h-[410px] lg:h-[450px]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block size-full"
      />

      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-5 sm:p-8 lg:p-10">
        <header className="flex items-start justify-between gap-3 text-[#506982]">
          <p className="pt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs">
            ODP <span className="text-[#0874d1]">/</span> Property network
          </p>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={triggerCentralImpulse}
              aria-label="Trigger a matrix pulse"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#b9d8f2] bg-white/80 px-3 font-mono text-[10px] font-semibold tracking-wide text-[#152b43] shadow-sm backdrop-blur transition-colors hover:border-[#0874d1] hover:text-[#0874d1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1]"
            >
              <Sparkles aria-hidden="true" className="size-3.5 text-[#0874d1]" />
              <span>Pulse</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRunning((running) => !running)}
              aria-label={isRunning ? "Pause matrix animation" : "Resume matrix animation"}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#b9d8f2] bg-white/80 px-3 font-mono text-[10px] font-semibold tracking-wide text-[#152b43] shadow-sm backdrop-blur transition-colors hover:border-[#0874d1] hover:text-[#0874d1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0874d1]"
            >
              {isRunning ? (
                <Pause aria-hidden="true" className="size-3.5" />
              ) : (
                <Play aria-hidden="true" className="size-3.5" />
              )}
              <span>{isRunning ? "Pause" : "Play"}</span>
            </button>
          </div>
        </header>

        <div className="pointer-events-none mx-auto flex max-w-full flex-col items-center text-center">
          <h2 className="font-mono text-[clamp(2.75rem,8vw,7rem)] font-black uppercase leading-none tracking-[-0.08em] text-[#152b43]">
            {title}
          </h2>
          <p className="mt-3 font-mono text-[9px] font-medium uppercase tracking-[0.24em] text-[#506982] sm:mt-4 sm:text-[11px]">
            Move through the network to explore
          </p>
        </div>

        <footer className="flex items-end justify-between gap-3 font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-[#60778e] sm:text-[10px]">
          <span>One step closer to home</span>
          <span className="text-right">01 / Interactive discovery</span>
        </footer>
      </div>
    </div>
  );
}
