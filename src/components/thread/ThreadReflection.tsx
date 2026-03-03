"use client";

import { useMemo } from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { analyzeThread } from "@/lib/operators";
import { exportThread, downloadMarkdown } from "@/lib/exportThread";
import { getHexagramInfo } from "@/lib/hexagrams";
import type { TemporalReading } from "@/types/thread";

interface ThreadReflectionProps {
  readings: TemporalReading[];
  username: string;
  onBackToAnalysis: () => void;
  onStartNewThread: () => void;
}

export function ThreadReflection({
  readings,
  username,
  onBackToAnalysis,
  onStartNewThread,
}: ThreadReflectionProps) {
  const analysis = useMemo(() => analyzeThread(readings), [readings]);

  const firstInfo = useMemo(
    () => getHexagramInfo(readings[0].lines),
    [readings]
  );

  function handleDownload() {
    const md = exportThread(readings);
    const date = new Date().toISOString().slice(0, 10);
    downloadMarkdown(md, `thread-of-selves-${username}-${date}.md`);
  }

  return (
    <div className="min-h-screen flex flex-col pt-4">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-serif font-bold text-primary">
              reflection
            </h2>
            <p className="text-sm font-serif text-muted-foreground">
              {username} · {readings.length} readings
            </p>
          </div>

          <Card className="bg-card border-border shadow-soft">
            <CardHeader>
              <CardTitle className="font-serif text-primary text-lg">
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-serif text-sm text-foreground/80">
              <p>
                <strong>First reading:</strong> {readings[0].date} ·{" "}
                <a
                  href={firstInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  Hexagram {firstInfo.number}: {firstInfo.name}
                </a>
              </p>
              <p>
                <strong>Most recent:</strong> {readings[readings.length - 1].date} ·{" "}
                <a
                  href={analysis.presentHexagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-primary transition-colors"
                >
                  Hexagram {analysis.presentHexagram.number}: {analysis.presentHexagram.name}
                </a>
              </p>
              <p>
                <strong>Net transformation:</strong> Hamming weight{" "}
                {analysis.netHammingWeight} ({analysis.netTrigramCharacter === "both" ? "both trigrams" : `${analysis.netTrigramCharacter} trigram`})
              </p>
            </CardContent>
          </Card>

          <div className="p-6 rounded-2xl bg-meditation-glow border border-border/40 text-center space-y-4">
            <p className="font-serif text-foreground/70 leading-relaxed text-sm max-w-md mx-auto">
              The thread does not predict. It maps the path you have already
              walked — the character of each moment, the geometry of the
              movement between them.
            </p>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="font-serif"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Thread as Markdown
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={onBackToAnalysis}
              className="font-serif text-muted-foreground hover:text-foreground"
            >
              ← Back to Analysis
            </Button>
            <Button
              variant="outline"
              onClick={onStartNewThread}
              className="font-serif"
            >
              Add Another Reading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
