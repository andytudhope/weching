"use client";

import { useEffect, useState, useRef, useCallback, use } from "react";
import { NeighbourhoodDisplay } from "@/components/thread/NeighbourhoodDisplay";
import { HexagramDisplay } from "@/components/HexagramDisplay";
import { DigitalCasting } from "@/components/circle/DigitalCasting";
import { getHexagramInfo } from "@/lib/hexagrams";
import { participantsToLines, participantsToChangingLine } from "@/lib/groupCast";
import { exportCircle, downloadMarkdown } from "@/lib/exportCircle";
import type { Circle } from "@/types/circle";

type View = "neighbourhood" | "collections" | "inquiry" | "casting" | "results";

function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  const key = "wc-device-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem(key, id);
  }
  return id;
}

function relativeTime(ms: number): string {
  const diff = Math.floor((Date.now() - ms) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function CirclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [circle, setCircle] = useState<Circle | null>(null);
  const [view, setView] = useState<View>("neighbourhood");
  const [deviceId, setDeviceId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Collections form
  const [fragmentText, setFragmentText] = useState("");
  const [fragmentAuthor, setFragmentAuthor] = useState("");
  const [addingFragment, setAddingFragment] = useState(false);

  // Inquiry (distilled question)
  const [inquiryDraft, setInquiryDraft] = useState("");
  const [savingInquiry, setSavingInquiry] = useState(false);

  // Casting form
  const [castMode, setCastMode] = useState<"seeds" | "timing">("timing");
  const [castName, setCastName] = useState("");
  const [seedNumbers, setSeedNumbers] = useState<string[]>(["", "", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [castDone, setCastDone] = useState(false);

  // Copy link state
  const [copied, setCopied] = useState(false);

  // Results explainer
  const [explainerOpen, setExplainerOpen] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCircle = useCallback(async () => {
    try {
      const res = await fetch(`/api/circle/${id}`);
      if (!res.ok) {
        setError("Circle not found.");
        return;
      }
      const data = await res.json();
      setCircle(data);
    } catch {
      // silent poll failure
    }
  }, [id]);

  // Init deviceId + initial fetch
  useEffect(() => {
    setDeviceId(getOrCreateDeviceId());
    fetchCircle();
  }, [fetchCircle]);

  // Poll every 5s
  useEffect(() => {
    pollRef.current = setInterval(fetchCircle, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchCircle]);

  async function handleSaveInquiry() {
    if (!inquiryDraft.trim()) return;
    setSavingInquiry(true);
    try {
      await fetch(`/api/circle/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "inquiry", text: inquiryDraft.trim() }),
      });
      await fetchCircle();
    } finally {
      setSavingInquiry(false);
    }
  }

  async function handleAddFragment() {
    if (!fragmentText.trim()) return;
    setAddingFragment(true);
    try {
      await fetch(`/api/circle/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "fragment",
          text: fragmentText.trim(),
          author: fragmentAuthor.trim() || undefined,
        }),
      });
      setFragmentText("");
      setFragmentAuthor("");
      await fetchCircle();
    } finally {
      setAddingFragment(false);
    }
  }

  async function submitNumbers(numbers: number[]) {
    if (!deviceId) return;
    setSubmitting(true);
    try {
      await fetch(`/api/circle/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "participant",
          deviceId,
          name: castName.trim() || undefined,
          numbers,
        }),
      });
      setCastDone(true);
      await fetchCircle();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSeedSubmit() {
    const nums = seedNumbers.map((s) => parseInt(s, 10));
    if (nums.some(isNaN)) return;
    await submitNumbers(nums);
  }

  function handleTimingComplete(numbers: number[]) {
    submitNumbers(numbers);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleExport() {
    if (!circle) return;
    const md = exportCircle(circle);
    downloadMarkdown(md, `circle-${circle.id}-${new Date().toISOString().slice(0, 10)}.md`);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="font-serif text-primary">{error}</p>
          <a href="/" className="text-sm font-serif text-muted-foreground underline">
            ← back home
          </a>
        </div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <p className="font-serif text-muted-foreground text-sm animate-pulse">loading…</p>
      </div>
    );
  }

  const today = new Date();
  const groupLines = participantsToLines(circle.participants);
  const changingLine = participantsToChangingLine(circle.participants);
  const presentInfo = getHexagramInfo(groupLines);

  let futureLines: boolean[] | null = null;
  let futureInfo = null;
  if (changingLine !== null && circle.participants.length > 0) {
    futureLines = [...groupLines];
    futureLines[changingLine - 1] = !futureLines[changingLine - 1];
    futureInfo = getHexagramInfo(futureLines);
  }

  const myParticipant = circle.participants.find((p) => p.deviceId === deviceId);

  const NAV_LABELS: Record<View, string> = {
    neighbourhood: "now",
    collections: "collections",
    inquiry: "inquiry",
    casting: "casting",
    results: "results",
  };

  // ── NAV TABS ──
  const NavTabs = () => (
    <div className="flex gap-1 text-sm font-serif justify-center flex-wrap">
      {(["neighbourhood", "collections", "inquiry", "casting", "results"] as View[]).map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            view === v
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {NAV_LABELS[v]}
        </button>
      ))}
    </div>
  );

  // ── VIEW: NEIGHBOURHOOD ──
  if (view === "neighbourhood") {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
          <NavTabs />
          <NeighbourhoodDisplay today={today} />
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setView("collections")}
              className="font-serif text-sm text-primary hover:text-primary/70 transition-colors underline underline-offset-4"
            >
              Begin collecting →
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── VIEW: COLLECTIONS ──
  if (view === "collections") {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
          <NavTabs />

          {/* Share link */}
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={typeof window !== "undefined" ? window.location.href : ""}
              className="flex-1 text-xs font-mono px-3 py-2 rounded-lg border border-border bg-background text-muted-foreground truncate"
            />
            <button
              onClick={handleCopyLink}
              className="shrink-0 text-xs font-serif px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              {copied ? "copied!" : "copy"}
            </button>
          </div>

          {/* Fragment list */}
          <div className="space-y-2">
            <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest text-center">
              the collection
            </p>
            {circle.fragments.length === 0 && (
              <p className="text-sm font-serif text-muted-foreground text-center italic py-4">
                No thoughts yet — add the first.
              </p>
            )}
            {circle.fragments.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-gradient-subtle border border-border shadow-soft space-y-1"
              >
                <p className="text-sm font-serif text-foreground leading-relaxed">{f.text}</p>
                <p className="text-xs font-serif text-muted-foreground">
                  {f.author ?? "anonymous"} · {relativeTime(f.addedAt)}
                </p>
              </div>
            ))}
          </div>

          {/* Add fragment */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <textarea
              value={fragmentText}
              onChange={(e) => setFragmentText(e.target.value)}
              placeholder="your thought, question, poem, fragment, wandering..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background font-serif text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="flex gap-2 items-center">
              <input
                value={fragmentAuthor}
                onChange={(e) => setFragmentAuthor(e.target.value)}
                placeholder="name (optional)"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background font-serif text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleAddFragment}
                disabled={!fragmentText.trim() || addingFragment}
                className="shrink-0 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-serif text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {addingFragment ? "adding…" : "+ add"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleExport}
              className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Export ↓
            </button>
            <button
              onClick={() => setView("inquiry")}
              className="font-serif text-sm text-primary hover:text-primary/70 transition-colors underline underline-offset-4"
            >
              Distil inquiry →
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ── VIEW: INQUIRY ──
  if (view === "inquiry") {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
          <NavTabs />

          {/* The collection — read-only */}
          {circle.fragments.length > 0 && (
            <details className="rounded-xl border border-border bg-gradient-subtle shadow-soft" open>
              <summary className="px-4 py-3 text-xs font-serif text-muted-foreground uppercase tracking-widest cursor-pointer">
                the collection ({circle.fragments.length} fragment{circle.fragments.length !== 1 ? "s" : ""})
              </summary>
              <div className="px-4 pb-4 space-y-3">
                {circle.fragments.map((f, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-sm font-serif text-foreground leading-relaxed">{f.text}</p>
                    <p className="text-xs font-serif text-muted-foreground">
                      — {f.author ?? "anonymous"}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Distil the inquiry */}
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest text-center">
                the inquiry
              </p>
              <p className="text-sm font-serif text-foreground/70 text-center leading-relaxed">
                From all that has been collected, what is the one clear question you bring to the I Ching?
              </p>
            </div>

            {/* Show current saved inquiry if it exists */}
            {circle.inquiry && (
              <div className="p-4 rounded-xl bg-gradient-subtle border border-primary/20 shadow-soft">
                <p className="text-sm font-serif text-primary font-medium leading-relaxed italic text-center">
                  &ldquo;{circle.inquiry}&rdquo;
                </p>
              </div>
            )}

            <textarea
              value={inquiryDraft}
              onChange={(e) => setInquiryDraft(e.target.value)}
              placeholder={circle.inquiry ? "Edit the inquiry…" : "The question we bring to the oracle…"}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background font-serif text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSaveInquiry}
              disabled={!inquiryDraft.trim() || savingInquiry}
              className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-serif text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {savingInquiry ? "saving…" : circle.inquiry ? "Update inquiry" : "Save inquiry"}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleExport}
              className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Export ↓
            </button>
            <button
              onClick={() => setView("casting")}
              className="font-serif text-sm text-primary hover:text-primary/70 transition-colors underline underline-offset-4"
            >
              Begin casting →
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ── VIEW: CASTING ──
  if (view === "casting") {
    return (
      <div className="min-h-screen bg-gradient-warm">
        <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
          <NavTabs />

          {/* Inquiry + collapsed collection */}
          {circle.inquiry && (
            <div className="p-4 rounded-xl bg-gradient-subtle border border-primary/20 shadow-soft text-center">
              <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest mb-2">the inquiry</p>
              <p className="text-sm font-serif text-primary font-medium leading-relaxed italic">
                &ldquo;{circle.inquiry}&rdquo;
              </p>
            </div>
          )}
          {circle.fragments.length > 0 && (
            <details className="rounded-xl border border-border bg-gradient-subtle shadow-soft">
              <summary className="px-4 py-3 text-xs font-serif text-muted-foreground uppercase tracking-widest cursor-pointer">
                the collection ({circle.fragments.length} fragment{circle.fragments.length !== 1 ? "s" : ""})
              </summary>
              <div className="px-4 pb-4 space-y-2">
                {circle.fragments.map((f, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-sm font-serif text-foreground leading-relaxed">{f.text}</p>
                    <p className="text-xs font-serif text-muted-foreground">
                      — {f.author ?? "anonymous"}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Cast form */}
          <div className="space-y-4 rounded-2xl border border-border bg-gradient-subtle p-5 shadow-soft">
            <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest text-center">
              your cast
            </p>

            {!castDone ? (
              <>
                <div className="flex gap-2 items-center">
                  <input
                    value={castName}
                    onChange={(e) => setCastName(e.target.value)}
                    placeholder="your name (optional)"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background font-serif text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCastMode("timing")}
                    className={`flex-1 py-2 rounded-lg font-serif text-sm border transition-colors ${
                      castMode === "timing"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    timing
                  </button>
                  <button
                    onClick={() => setCastMode("seeds")}
                    className={`flex-1 py-2 rounded-lg font-serif text-sm border transition-colors ${
                      castMode === "seeds"
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    seeds
                  </button>
                </div>

                {castMode === "timing" && (
                  <DigitalCasting
                    onComplete={handleTimingComplete}
                    onCancel={() => setCastMode("seeds")}
                  />
                )}

                {castMode === "seeds" && (
                  <div className="space-y-3">
                    <p className="text-xs font-serif text-muted-foreground text-center">
                      Enter pile counts for lines 1–6, then the moving-line seed.
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {seedNumbers.map((v, i) => (
                        <div key={i} className="space-y-1">
                          <label className="text-xs font-serif text-muted-foreground block text-center">
                            {i < 6 ? `line ${i + 1}` : "moving"}
                          </label>
                          <input
                            type="number"
                            value={v}
                            onChange={(e) => {
                              const n = [...seedNumbers];
                              n[i] = e.target.value;
                              setSeedNumbers(n);
                            }}
                            className="w-full px-2 py-1.5 rounded-lg border border-border bg-background font-serif text-sm text-center focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleSeedSubmit}
                      disabled={submitting || seedNumbers.some((s) => s === "" || isNaN(parseInt(s, 10)))}
                      className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-serif text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
                    >
                      {submitting ? "submitting…" : "Submit"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-2 py-4">
                <p className="font-serif text-primary">Cast submitted.</p>
                {myParticipant && (
                  <p className="text-xs font-serif text-muted-foreground">
                    You can re-submit any time to update your numbers.
                  </p>
                )}
                <button
                  onClick={() => setCastDone(false)}
                  className="text-xs font-serif text-muted-foreground underline underline-offset-4"
                >
                  re-cast
                </button>
              </div>
            )}
          </div>

          {/* Submitted count */}
          <div className="text-center space-y-1">
            <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest">
              submitted: {circle.participants.length} participant{circle.participants.length !== 1 ? "s" : ""}
            </p>
            {circle.participants.length > 0 && (
              <p className="text-xs font-serif text-muted-foreground">
                {circle.participants
                  .filter((p) => p.name)
                  .map((p) => p.name)
                  .join(", ")}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setView("results")}
              className="font-serif text-sm text-primary hover:text-primary/70 transition-colors underline underline-offset-4"
            >
              See results →
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ── VIEW: RESULTS ──
  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="max-w-lg mx-auto w-full px-4 py-8 space-y-6">
        <NavTabs />

        {circle.participants.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="font-serif text-muted-foreground text-sm italic">
              No casts yet. Go to casting to submit yours.
            </p>
            <button
              onClick={() => setView("casting")}
              className="font-serif text-sm text-primary underline underline-offset-4"
            >
              ← go to casting
            </button>
          </div>
        ) : (
          <>
            {/* Group hexagram */}
            <div className="space-y-2">
              <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest text-center">
                the circle&apos;s hexagram
              </p>
              <div className="flex justify-center">
                <HexagramDisplay
                  lines={groupLines}
                  title={`Hexagram ${presentInfo.number}`}
                  changingLine={changingLine !== null ? changingLine - 1 : -1}
                  hexagramNumber={presentInfo.number}
                  hexagramName={presentInfo.name}
                  hexagramUrl={presentInfo.url}
                />
              </div>
            </div>

            {futureLines && futureInfo && (
              <div className="space-y-2">
                <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest text-center">
                  future influence (line {changingLine} changes)
                </p>
                <div className="flex justify-center">
                  <HexagramDisplay
                    lines={futureLines}
                    title={`Hexagram ${futureInfo.number}`}
                    changingLine={-1}
                    hexagramNumber={futureInfo.number}
                    hexagramName={futureInfo.name}
                    hexagramUrl={futureInfo.url}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Inquiry question */}
        {circle.inquiry && (
          <div className="p-4 rounded-xl bg-gradient-subtle border border-primary/20 shadow-soft text-center">
            <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest mb-2">the inquiry</p>
            <p className="text-sm font-serif text-primary font-medium leading-relaxed italic">
              &ldquo;{circle.inquiry}&rdquo;
            </p>
          </div>
        )}

        {/* The collection */}
        {circle.fragments.length > 0 && (
          <details className="rounded-xl border border-border bg-gradient-subtle shadow-soft">
            <summary className="px-4 py-3 text-xs font-serif text-muted-foreground uppercase tracking-widest cursor-pointer">
              the collection ({circle.fragments.length} fragment{circle.fragments.length !== 1 ? "s" : ""})
            </summary>
            <div className="px-4 pb-4 space-y-3">
              {circle.fragments.map((f, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-sm font-serif text-foreground leading-relaxed">{f.text}</p>
                  <p className="text-xs font-serif text-muted-foreground">
                    — {f.author ?? "anonymous"} · {relativeTime(f.addedAt)}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Individual casts */}
        {circle.participants.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-serif text-muted-foreground uppercase tracking-widest text-center">
              individual casts: {circle.participants.length}
            </p>
            {circle.participants.map((p) => {
              const pLines = p.numbers.slice(0, 6).map((n) => n % 2 === 1);
              const pInfo = getHexagramInfo(pLines);
              const who = p.name ?? p.deviceId.slice(0, 8);
              return (
                <div
                  key={p.deviceId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-subtle border border-border shadow-soft"
                >
                  <HexagramDisplay lines={pLines} title="" changingLine={-1} compact />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-serif text-primary font-semibold">{who}</p>
                    <p className="text-xs font-serif text-muted-foreground">
                      {pInfo.number}: {pInfo.name}
                    </p>
                    <p className="text-xs font-serif text-muted-foreground">
                      {relativeTime(p.submittedAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Export */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleExport}
            className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Export this snapshot ↓
          </button>
        </div>

        {/* How group calculation works */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => setExplainerOpen((v) => !v)}
            className="w-full px-5 py-3 text-xs font-serif text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between"
          >
            <span>How is the group hexagram calculated?</span>
            <span className="shrink-0 ml-2">{explainerOpen ? "▲" : "▼"}</span>
          </button>
          {explainerOpen && (
            <div className="px-5 pb-6 pt-2 space-y-3 text-xs font-serif text-foreground/70 leading-relaxed border-t border-border/20">
              <p>
                Each participant casts seven numbers — one for each of the six lines, plus one
                for the moving line. For any given line, the numbers from all participants are
                summed. If the sum is odd, the line is yang (solid). If even, it is yin (broken).
                This gives the group hexagram.
              </p>
              <p>
                For the moving line, the sum of all participants&apos; seventh numbers is taken
                modulo 6. If the remainder is zero, the moving line falls at position 6.
              </p>
              <p className="text-muted-foreground italic">
                Individual hexagrams — derived from each participant&apos;s own six numbers — are
                meaningful by-products. The group hexagram is the primary focus of the co-inquiry.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div className="py-8 border-t border-border">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground font-serif">
          <strong>Co-Inquiry: Group I Ching</strong> — collective inquiry through ancient wisdom
        </p>
        <p className="text-xs text-muted-foreground">Licensed under GNU AGPL v3.0</p>
      </div>
    </div>
  );
}
