"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface CircleSummary {
  id: string;
  createdAt: number;
  method: "seeds" | "timing";
  parentIds: string[];
  inquiry?: string;
  fragments: { text: string; addedAt: number }[];
  participantCount: number;
}

type Position = { x: number; y: number };

const NODE_SIZE = 92;
const MODAL_WIDTH = 272;
const POSITIONS_KEY = "mixer-positions";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function loadSavedPositions(): Record<string, Position> {
  try {
    return JSON.parse(localStorage.getItem(POSITIONS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function MixerPage() {
  const router = useRouter();
  const [circles, setCircles] = useState<CircleSummary[]>([]);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [weaveMethod, setWeaveMethod] = useState<"timing" | "seeds">("timing");
  const [creating, setCreating] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    fetch("/api/circles")
      .then((r) => r.json())
      .then(({ circles: fetched }: { circles: CircleSummary[] }) => {
        setCircles(fetched);
        const saved = loadSavedPositions();
        const canvas = canvasRef.current;
        const W = canvas?.clientWidth ?? window.innerWidth;
        const H = canvas?.clientHeight ?? window.innerHeight - 56;
        setPositions(() => {
          const next: Record<string, Position> = {};
          fetched.forEach((c, i) => {
            next[c.id] = saved[c.id] ?? {
              x: clamp(80 + (i % 4) * 160 + Math.random() * 40, 0, W - NODE_SIZE),
              y: clamp(80 + Math.floor(i / 4) * 160 + Math.random() * 40, 0, H - NODE_SIZE),
            };
          });
          return next;
        });
      });
  }, []);

  const savePositions = useCallback((pos: Record<string, Position>) => {
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(pos));
  }, []);

  // ── Drag ──

  function onPointerDown(e: React.PointerEvent, id: string) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const pos = positions[id] ?? { x: 0, y: 0 };
    dragRef.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const { id, startX, startY, origX, origY } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) dragRef.current.moved = true;
    const canvas = canvasRef.current;
    const maxX = (canvas?.clientWidth ?? 800) - NODE_SIZE;
    const maxY = (canvas?.clientHeight ?? 600) - NODE_SIZE;
    setPositions((prev) => ({
      ...prev,
      [id]: { x: clamp(origX + dx, 0, maxX), y: clamp(origY + dy, 0, maxY) },
    }));
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const { id, moved } = dragRef.current;
    dragRef.current = null;
    if (!moved) {
      // Tap/click — toggle selection
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else {
      // End of drag — persist positions
      setPositions((prev) => {
        savePositions(prev);
        return prev;
      });
    }
    // Suppress ghost hover on touch
    if (e.pointerType === "touch") setHoveredId(null);
  }

  // ── Weave ──

  async function handleWeave() {
    if (selectedIds.size < 2 || creating) return;
    setCreating(true);
    try {
      const parents = circles.filter((c) => selectedIds.has(c.id));
      // Each parent's distilled inquiry becomes an anonymous seed in the new circle.
      // The parent's original fragments remain accessible via accordions on the circle page.
      const fragments: { text: string; addedAt: number }[] = parents
        .filter((p) => p.inquiry)
        .map((p) => ({ text: p.inquiry!, addedAt: Date.now() }));
      const res = await fetch("/api/circle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: weaveMethod,
          parentIds: [...selectedIds],
          fragments,
        }),
      });
      const { id } = await res.json();
      router.push(`/circle/${id}`);
    } finally {
      setCreating(false);
    }
  }

  // ── Modal positioning ──

  const modalId = hoveredId ?? (selectedIds.size === 1 ? [...selectedIds][0] : null);
  const modalCircle = modalId ? circles.find((c) => c.id === modalId) ?? null : null;
  const modalPos = modalCircle ? positions[modalCircle.id] : null;

  function getModalLeft(pos: Position): number {
    const canvas = canvasRef.current;
    const W = canvas?.clientWidth ?? 800;
    const rightEdge = pos.x + NODE_SIZE + 10 + MODAL_WIDTH;
    return rightEdge > W ? pos.x - MODAL_WIDTH - 10 : pos.x + NODE_SIZE + 10;
  }

  // ── Render ──

  return (
    <div className="min-h-screen bg-gradient-warm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <a
          href="/"
          className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← home
        </a>
        <h1 className="font-serif text-sm text-primary lowercase tracking-wide">
          circle mixer
        </h1>
        {(() => { const n = circles.filter(c => c.inquiry).length; return (
          <p className="font-serif text-xs text-muted-foreground w-16 text-right hidden sm:block">
            {n} circle{n !== 1 ? "s" : ""}
          </p>
        ); })()}
        <div className="w-16 sm:hidden" />
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="flex-1 relative overflow-hidden">
        {/* Patch cables between selected circles */}
        {selectedIds.size >= 2 && (() => {
          const selected = [...selectedIds]
            .map((sid) => positions[sid] ? { id: sid, cx: positions[sid].x + NODE_SIZE / 2, cy: positions[sid].y + NODE_SIZE / 2 } : null)
            .filter(Boolean) as { id: string; cx: number; cy: number }[];
          const pairs: [typeof selected[0], typeof selected[0]][] = [];
          for (let i = 0; i < selected.length; i++)
            for (let j = i + 1; j < selected.length; j++)
              pairs.push([selected[i], selected[j]]);
          return (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {pairs.map(([a, b]) => (
                <line
                  key={`${a.id}-${b.id}`}
                  x1={a.cx} y1={a.cy}
                  x2={b.cx} y2={b.cy}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  strokeLinecap="round"
                  className="text-primary/40"
                />
              ))}
            </svg>
          );
        })()}

        {circles.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center font-serif text-sm text-muted-foreground">
            no circles yet
          </p>
        )}

        {circles.filter((circle) => circle.inquiry).map((circle) => {
          const pos = positions[circle.id];
          if (!pos) return null;
          const isSelected = selectedIds.has(circle.id);
          const isHovered = hoveredId === circle.id;

          return (
            <div
              key={circle.id}
              style={{
                left: pos.x,
                top: pos.y,
                width: NODE_SIZE,
                height: NODE_SIZE,
                touchAction: "none",
              }}
              className={[
                "absolute rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none",
                "bg-gradient-subtle border transition-all duration-150",
                isSelected
                  ? "border-primary ring-2 ring-primary/40 shadow-meditation"
                  : isHovered
                  ? "border-primary/50 shadow-warm"
                  : "border-primary/20 shadow-soft",
              ].join(" ")}
              onPointerDown={(e) => onPointerDown(e, circle.id)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerEnter={() => {
                if (!dragRef.current) setHoveredId(circle.id);
              }}
              onPointerLeave={() => setHoveredId(null)}
            >
              <span className="text-[10px] font-serif text-primary/80 text-center px-2 leading-snug pointer-events-none">
                {circle.inquiry!.slice(0, 28) + (circle.inquiry!.length > 28 ? "…" : "")}
              </span>
            </div>
          );
        })}

        {/* Modal */}
        {modalCircle && modalPos && (
          <div
            className="absolute z-20 rounded-xl bg-background border border-border shadow-soft p-4 font-serif space-y-3 pointer-events-none"
            style={{
              width: MODAL_WIDTH,
              left: getModalLeft(modalPos),
              top: clamp(
                modalPos.y,
                4,
                (canvasRef.current?.clientHeight ?? 600) - 200
              ),
            }}
          >
            {modalCircle.inquiry ? (
              <p className="text-sm text-primary italic leading-relaxed">
                &ldquo;{modalCircle.inquiry}&rdquo;
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                no inquiry distilled yet
              </p>
            )}
            {modalCircle.fragments.length > 0 && (
              <div className="space-y-2 border-t border-border pt-3">
                {modalCircle.fragments.map((f, i) => (
                  <p key={i} className="text-xs text-foreground/70 leading-relaxed">
                    {f.text}
                  </p>
                ))}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
              {modalCircle.method} · {modalCircle.participantCount} cast
              {modalCircle.participantCount !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Selection hint */}
      {selectedIds.size === 1 && (
        <div className="shrink-0 px-4 py-2 border-t border-border text-center">
          <p className="font-serif text-xs text-muted-foreground">
            select one more circle to weave
          </p>
        </div>
      )}

      {/* Weave panel */}
      {selectedIds.size >= 2 && (
        <div className="shrink-0 border-t border-border bg-gradient-subtle px-4 py-4 space-y-3">
          <p className="text-xs font-serif text-muted-foreground text-center uppercase tracking-widest">
            weave {selectedIds.size} circles into a new one
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setWeaveMethod("timing")}
              className={`flex-1 py-2 rounded-lg font-serif text-sm border transition-colors ${
                weaveMethod === "timing"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              timing
            </button>
            <button
              onClick={() => setWeaveMethod("seeds")}
              className={`flex-1 py-2 rounded-lg font-serif text-sm border transition-colors ${
                weaveMethod === "seeds"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              seeds
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="flex-1 py-2 rounded-lg font-serif text-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              cancel
            </button>
            <button
              onClick={handleWeave}
              disabled={creating}
              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-serif text-sm disabled:opacity-60 hover:opacity-90 transition-opacity"
            >
              {creating ? "weaving…" : "weave"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
