"use client";

import { Download, Stars, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HexagramDisplay } from "@/components/HexagramDisplay";
import { exportSession, downloadMarkdown } from "@/lib/exportSession";
import type { Participant } from "@/components/Participants";

interface HexagramInfo {
  number: number;
  name: string;
  url: string;
}

interface ResultsProps {
  inquiry: string;
  participants: Participant[];
  groupLines: boolean[];
  futureLines: boolean[];
  changingLine: number;
  presentHexagram: HexagramInfo;
  futureHexagram: HexagramInfo;
  participantHexagrams: {
    name: string;
    lines: boolean[];
    info: HexagramInfo;
  }[];
  onNewCeremony: () => void;
  onModify: () => void;
}

export function Results({
  inquiry,
  participants,
  groupLines,
  futureLines,
  changingLine,
  presentHexagram,
  futureHexagram,
  participantHexagrams,
  onNewCeremony,
  onModify,
}: ResultsProps) {
  return (
    <div className="min-h-screen flex flex-col pt-4">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="bg-card border-border shadow-meditation">
            <CardHeader>
              <CardTitle className="font-serif text-primary text-center flex items-center justify-center">
                <Stars className="w-5 h-5 mr-2" />
                Co-Inquiry Results
                <Users className="w-5 h-5 ml-2" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inquiry && (
                <div className="mb-6 p-4 bg-meditation-glow rounded-lg">
                  <h3 className="font-serif font-medium text-primary mb-2">
                    Your Inquiry:
                  </h3>
                  <p className="font-serif text-foreground/80 italic">
                    &ldquo;{inquiry}&rdquo;
                  </p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <HexagramDisplay
                  lines={groupLines}
                  title="Present Situation"
                  changingLine={changingLine - 1}
                  hexagramNumber={presentHexagram.number}
                  hexagramName={presentHexagram.name}
                  hexagramUrl={presentHexagram.url}
                />
                <HexagramDisplay
                  lines={futureLines}
                  title="Future Influence"
                  changingLine={-1}
                  hexagramNumber={futureHexagram.number}
                  hexagramName={futureHexagram.name}
                  hexagramUrl={futureHexagram.url}
                />
              </div>

              <Separator className="my-6" />

              <h4 className="font-serif font-medium text-primary text-center mb-4">
                Individual Hexagrams
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                {participantHexagrams.map((ph, i) => (
                  <HexagramDisplay
                    key={i}
                    lines={ph.lines}
                    title={ph.name}
                    changingLine={-1}
                    hexagramNumber={ph.info.number}
                    hexagramName={ph.info.name}
                    hexagramUrl={ph.info.url}
                    compact
                  />
                ))}
              </div>

              <Separator className="my-6" />

              <div className="text-center space-y-3">
                <p className="font-serif text-muted-foreground">
                  <strong>Changing Line:</strong> Line {changingLine} transforms
                  the hexagram
                </p>
                <p className="font-serif text-sm text-muted-foreground">
                  {participants.length} participants contributed to this
                  co-inquiry
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    const md = exportSession({
                      inquiry,
                      participants,
                      presentHexagram,
                      futureHexagram,
                      groupLines,
                      futureLines,
                      changingLine,
                      participantHexagrams,
                    });
                    const date = new Date().toISOString().slice(0, 10);
                    downloadMarkdown(md, `co-inquiry-${date}.md`);
                  }}
                  className="font-serif"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Session
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={onModify}
              className="font-serif text-muted-foreground hover:text-foreground"
            >
              Modify Ceremony
            </Button>
            <Button
              onClick={onNewCeremony}
              className="font-serif shadow-warm hover:shadow-meditation transition-all duration-300"
            >
              New Ceremony
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
