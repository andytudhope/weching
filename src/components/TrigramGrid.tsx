"use client";

import { useMemo, useState } from "react";
import { getTemporalTexture } from "@/lib/kingwen";
import { hexagramNumberToLines, getHexagramInfo } from "@/lib/hexagrams";

const TRIGRAMS = [
  { symbol: "☷", name: "K'un" },
  { symbol: "☳", name: "Chên" },
  { symbol: "☵", name: "K'an" },
  { symbol: "☱", name: "Tui" },
  { symbol: "☶", name: "Kên" },
  { symbol: "☲", name: "Li" },
  { symbol: "☴", name: "Sun" },
  { symbol: "☰", name: "Ch'ien" },
];

function trigramBits(lines: boolean[], offset: number): number {
  return (lines[offset] ? 1 : 0) | (lines[offset + 1] ? 2 : 0) | (lines[offset + 2] ? 4 : 0);
}

// grid[row][col] = hexagram number; row = lower trigram, col = upper trigram
const GRID: number[][] = (() => {
  const g: number[][] = Array.from({ length: 8 }, () => Array(8).fill(0));
  for (let h = 1; h <= 64; h++) {
    const l = hexagramNumberToLines(h);
    g[trigramBits(l, 0)][trigramBits(l, 3)] = h;
  }
  return g;
})();

const CELL = 42;
const HEAD = 38;

interface Props {
  today: Date;
}

export function TrigramGrid({ today }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const texture = useMemo(() => getTemporalTexture(today), [today]);

  // King Wen sequence is 1–64 in order, so todayIdx + 1 = today's hexagram
  const todayHex = texture.hexagramPairIndex + 1;
  const nextHex = (texture.hexagramPairIndex % 64) + 2 > 64 ? 1 : texture.hexagramPairIndex + 2;

  const hoveredInfo = useMemo(
    () => (hovered ? getHexagramInfo(hexagramNumberToLines(hovered)) : null),
    [hovered]
  );

  return (
    <div className="space-y-3">

      {/* Hover info */}
      <div className="h-5 text-center">
        {hoveredInfo ? (
          <p className="text-xs font-serif text-foreground/80">
            <span className="font-semibold text-primary">{hoveredInfo.number}</span>
            {" · "}
            <a
              href={hoveredInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              {hoveredInfo.name}
            </a>
          </p>
        ) : (
          <p className="text-[10px] font-serif text-muted-foreground">hover or tap a cell</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">

          {/* Column headers — outer / upper trigram */}
          <div className="flex" style={{ paddingLeft: HEAD }}>
            {TRIGRAMS.map((t, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-end pb-1.5"
                style={{ width: CELL }}
              >
                <span className="text-base leading-none text-foreground/60">{t.symbol}</span>
                <span className="text-[7px] font-serif text-muted-foreground mt-0.5">{t.name}</span>
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Row headers — inner / lower trigram */}
            <div className="flex flex-col" style={{ width: HEAD }}>
              {TRIGRAMS.map((t, i) => (
                <div
                  key={i}
                  className="flex items-center justify-end gap-1 pr-2"
                  style={{ height: CELL }}
                >
                  <span className="text-[7px] font-serif text-muted-foreground leading-none text-right">
                    {t.name}
                  </span>
                  <span className="text-base leading-none text-foreground/60">{t.symbol}</span>
                </div>
              ))}
            </div>

            {/* 8×8 cells */}
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(8, ${CELL}px)`,
                gridTemplateRows: `repeat(8, ${CELL}px)`,
              }}
            >
              {GRID.flatMap((row, r) =>
                row.map((hexNum, c) => {
                  const isToday = hexNum === todayHex;
                  const isNext = hexNum === nextHex;
                  const isHov = hovered === hexNum;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={[
                        "flex items-center justify-center text-[11px] font-mono border border-border/20 cursor-pointer transition-colors select-none",
                        isToday
                          ? "bg-amber-100/80 dark:bg-amber-900/30 border-amber-300"
                          : isNext
                          ? "bg-sky-100/80 dark:bg-sky-900/30 border-sky-300"
                          : isHov
                          ? "bg-primary/8"
                          : "hover:bg-muted/30",
                      ].join(" ")}
                      onMouseEnter={() => setHovered(hexNum)}
                      onMouseLeave={() => setHovered(null)}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        setHovered((prev) => (prev === hexNum ? null : hexNum));
                      }}
                    >
                      <span
                        className={
                          isToday
                            ? "font-bold text-amber-800 dark:text-amber-300"
                            : isNext
                            ? "font-bold text-sky-700 dark:text-sky-300"
                            : "text-foreground/50"
                        }
                      >
                        {hexNum}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Key */}
      <p className="text-[10px] font-serif text-muted-foreground/70 leading-relaxed">
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-200 border border-amber-300 mr-1 align-middle" />
        {todayHex} — today&apos;s hexagram ·{" "}
        <span className="inline-block w-2.5 h-2.5 rounded-sm bg-sky-200 border border-sky-300 mx-1 align-middle" />
        {nextHex} — next · rows = inner · columns = outer
      </p>
    </div>
  );
}
