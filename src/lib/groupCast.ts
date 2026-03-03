import type { CircleParticipant } from "@/types/circle";

// Lines: sum of each participant's numbers[i] (i=0..5) → odd=yang, even=yin
export function participantsToLines(participants: CircleParticipant[]): boolean[] {
  if (participants.length === 0) return [false, false, false, false, false, false];
  const lines: boolean[] = [];
  for (let i = 0; i < 6; i++) {
    const sum = participants.reduce((acc, p) => acc + p.numbers[i], 0);
    lines.push(sum % 2 === 1);
  }
  return lines;
}

// Changing line: sum of all numbers[6] → mod 6 (0→6)
export function participantsToChangingLine(participants: CircleParticipant[]): number | null {
  if (participants.length === 0) return null;
  const total = participants.reduce((sum, p) => sum + p.numbers[6], 0) % 6;
  return total === 0 ? 6 : total;
}
