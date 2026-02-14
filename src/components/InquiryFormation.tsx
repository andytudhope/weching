"use client";

import { MessageCircle, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface InquiryFormationProps {
  inquiry: string;
  onInquiryChange: (value: string) => void;
}

export function InquiryFormation({
  inquiry,
  onInquiryChange,
}: InquiryFormationProps) {
  return (
    <Card className="bg-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="font-serif text-primary flex items-center">
          <MessageCircle className="w-5 h-5 mr-2" />
          Shared Inquiry Formation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm font-serif font-medium text-primary">
                <MessageCircle className="w-4 h-4 mr-2" />
                Group Process
              </div>
              <p className="text-sm text-muted-foreground font-serif">
                Each participant should first handwrite their individual inquiry
                in their journal. Then share and discuss to form a collective
                question.
              </p>
              <p className="text-sm text-muted-foreground font-serif">
                The process is intentionally messy and non-linear - conversation
                and synthesis are key.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm font-serif font-medium text-primary">
                <Pencil className="w-4 h-4 mr-2" />
                Crafting Your Inquiry
              </div>
              <p className="text-sm text-muted-foreground font-serif">
                Can be a question, statement, observation, or image. Poetry
                reflecting on your situation is also effective.
              </p>
              <p className="text-sm text-muted-foreground font-serif">
                The more specific and heartfelt, the more profound and precisely
                tailored the response will be.
              </p>
            </div>
          </div>
          <Textarea
            placeholder="Enter your group's shared inquiry... (questions, statements, observations, or poetic reflections)"
            value={inquiry}
            onChange={(e) => onInquiryChange(e.target.value)}
            className="min-h-[120px] font-serif text-foreground placeholder:text-muted-foreground border-border focus:border-ring resize-none"
          />
          <div className="bg-meditation-glow p-3 rounded-lg">
            <p className="text-xs text-muted-foreground font-serif italic">
              <strong>Note:</strong> The hardest part is arriving at the shared
              inquiry - this is where the real work begins. Take your time with
              this crucial step before proceeding to the seed ritual.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
