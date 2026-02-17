"use client";

import { MessageCircle } from "lucide-react";
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
          Shared Inquiry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your group's shared inquiry... (questions, statements, observations, or poetic reflections)"
            value={inquiry}
            onChange={(e) => onInquiryChange(e.target.value)}
            className="min-h-[120px] font-serif text-foreground placeholder:text-muted-foreground border-border focus:border-ring resize-none"
          />
          <div className="bg-meditation-glow p-3 rounded-lg">
            <p className="text-xs text-muted-foreground font-serif italic">
              The more specific and heartfelt your inquiry, the more profound
              the response will be.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
