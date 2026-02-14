"use client";

import { UserPlus, X } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface Participant {
  name: string;
  numbers: number[];
}

interface ParticipantsProps {
  participants: Participant[];
  onParticipantsChange: (participants: Participant[]) => void;
}

export function Participants({
  participants,
  onParticipantsChange,
}: ParticipantsProps) {
  const [name, setName] = useState("");

  const addParticipant = () => {
    if (name.trim()) {
      const participant: Participant = {
        name: name.trim(),
        numbers: [0, 0, 0, 0, 0, 0, 0],
      };
      onParticipantsChange([...participants, participant]);
      setName("");
    }
  };

  const removeParticipant = (index: number) => {
    onParticipantsChange(participants.filter((_, i) => i !== index));
  };

  const updateNumber = (
    participantIndex: number,
    numberIndex: number,
    value: string
  ) => {
    const num = parseInt(value) || 0;
    const updated = [...participants];
    updated[participantIndex].numbers[numberIndex] = num;
    onParticipantsChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            placeholder="Participant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addParticipant()}
            className="flex-1"
          />
          <Button onClick={addParticipant} className="px-6">
            <UserPlus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <div className="bg-meditation-glow p-3 rounded-lg">
          <p className="text-sm text-muted-foreground font-serif">
            <strong>Note:</strong> Each participant enters 7 numbers from their
            seed ritual: 6 pile counts (for hexagram lines) + 1 changing line
            pile. Individual hexagrams are meaningful bonus by-products, but the
            group hexagram is the primary focus.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {participants.map((participant, pIndex) => (
          <Card key={pIndex} className="bg-card border-border shadow-soft">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg font-serif">
                <span>{participant.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(pIndex)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {participant.numbers.map((num, nIndex) => (
                  <div
                    key={nIndex}
                    className="flex flex-col items-center space-y-1"
                  >
                    <label className="text-xs font-medium text-muted-foreground">
                      {nIndex < 6 ? `Line ${nIndex + 1}` : "Change"}
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={num || ""}
                      onChange={(e) =>
                        updateNumber(pIndex, nIndex, e.target.value)
                      }
                      className="w-16 text-center h-10"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="font-serif">Add participants to begin the reading</p>
        </div>
      )}
    </div>
  );
}
