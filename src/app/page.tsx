"use client";

import { useState, useMemo } from "react";
import { Sparkles, Stars, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RitualGuidance } from "@/components/RitualGuidance";
import { InquiryFormation } from "@/components/InquiryFormation";
import { Participants, type Participant } from "@/components/Participants";
import { HexagramDisplay } from "@/components/HexagramDisplay";
import { getHexagramInfo } from "@/lib/hexagrams";

export default function Home() {
  const [inquiry, setInquiry] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showResults, setShowResults] = useState(false);

  const groupLines = useMemo(() => {
    if (participants.length === 0)
      return [false, false, false, false, false, false];
    const lines: boolean[] = [];
    for (let i = 0; i < 6; i++) {
      const sum = participants.reduce((acc, p) => acc + p.numbers[i], 0);
      lines.push(sum % 2 === 1);
    }
    return lines;
  }, [participants]);

  const changingLine = useMemo(() => {
    if (participants.length === 0) return 0;
    const total =
      participants.reduce((sum, p) => sum + p.numbers[6], 0) % 6;
    return total === 0 ? 6 : total;
  }, [participants]);

  const futureLines = useMemo(() => {
    const lines = [...groupLines];
    lines[changingLine - 1] = !lines[changingLine - 1];
    return lines;
  }, [groupLines, changingLine]);

  const presentHexagram = useMemo(
    () => getHexagramInfo(groupLines),
    [groupLines]
  );
  const futureHexagram = useMemo(
    () => getHexagramInfo(futureLines),
    [futureLines]
  );

  const participantHexagrams = useMemo(
    () =>
      participants.map((p) => {
        const lines = p.numbers.slice(0, 6).map((n) => n % 2 === 1);
        return { name: p.name, lines, info: getHexagramInfo(lines) };
      }),
    [participants]
  );

  const canGenerate = participants.length > 0 && inquiry.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-warm">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">
              co-inquiry: group i ching
            </h1>
            <p className="text-lg text-muted-foreground font-serif">
              collective inquiry through ancient wisdom
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <RitualGuidance />
            </div>

            <div className="lg:col-span-3 space-y-6">
              <InquiryFormation
                inquiry={inquiry}
                onInquiryChange={setInquiry}
              />

              <Card className="bg-card border-border shadow-soft">
                <CardHeader>
                  <CardTitle className="font-serif text-primary flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Participants
                    participants={participants}
                    onParticipantsChange={setParticipants}
                  />
                </CardContent>
              </Card>

              {canGenerate && (
                <div className="text-center">
                  <Button
                    onClick={() => setShowResults(true)}
                    size="lg"
                    className="px-8 py-3 font-serif text-lg shadow-warm hover:shadow-meditation transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Co-Inquiry
                  </Button>
                </div>
              )}

              {showResults && (
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
                        <strong>Changing Line:</strong> Line {changingLine}{" "}
                        transforms the hexagram
                      </p>
                      <p className="font-serif text-sm text-muted-foreground">
                        {participants.length} participants contributed to this
                        co-inquiry
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-border">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-serif">
                <strong>Co-Inquiry: Group I Ching</strong> - collective inquiry
                through ancient wisdom
              </p>
              <p className="text-xs text-muted-foreground">
                Licensed under GNU AGPL v3.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
