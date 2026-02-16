"use client";

import { Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InquiryFormation } from "@/components/InquiryFormation";
import { Participants, type Participant } from "@/components/Participants";

interface CeremonyProps {
  inquiry: string;
  participants: Participant[];
  onInquiryChange: (value: string) => void;
  onParticipantsChange: (participants: Participant[]) => void;
  onGenerate: () => void;
  onBack: () => void;
  canGenerate: boolean;
}

export function Ceremony({
  inquiry,
  participants,
  onInquiryChange,
  onParticipantsChange,
  onGenerate,
  onBack,
  canGenerate,
}: CeremonyProps) {
  return (
    <div className="min-h-screen flex flex-col pt-4">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-serif tracking-wide text-primary text-center">
            The Ceremony
          </h2>

          <InquiryFormation
            inquiry={inquiry}
            onInquiryChange={onInquiryChange}
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
                onParticipantsChange={onParticipantsChange}
              />
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="font-serif text-muted-foreground hover:text-foreground"
            >
              Review Guidance
            </Button>

            <Button
              onClick={onGenerate}
              disabled={!canGenerate}
              size="lg"
              className="px-8 font-serif text-lg shadow-warm hover:shadow-meditation transition-all duration-300 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Co-Inquiry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
