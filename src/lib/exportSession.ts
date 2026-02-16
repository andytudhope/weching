interface HexagramInfo {
  number: number;
  name: string;
  url: string;
}

interface SessionData {
  inquiry: string;
  participants: { name: string; numbers: number[] }[];
  presentHexagram: HexagramInfo;
  futureHexagram: HexagramInfo;
  groupLines: boolean[];
  futureLines: boolean[];
  changingLine: number;
  participantHexagrams: {
    name: string;
    lines: boolean[];
    info: HexagramInfo;
  }[];
}

function renderLine(yang: boolean): string {
  return yang ? "━━━━━━━━━" : "━━━━ ━━━━";
}

function renderHexagram(lines: boolean[], changingLine?: number): string {
  const rows: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const marker = changingLine !== undefined && i === changingLine ? "  ◄" : "";
    rows.push(`${renderLine(lines[i])}  ${i + 1}${marker}`);
  }
  return rows.join("\n");
}

export function exportSession(data: SessionData): string {
  const date = new Date().toISOString().slice(0, 10);
  const names = data.participants.map((p) => p.name).join(", ");

  const individualSection = data.participantHexagrams
    .map(
      (ph) =>
        `### ${ph.name} — Hexagram ${ph.info.number}: ${ph.info.name}\n[Link](${ph.info.url})\n\n\`\`\`\n${renderHexagram(ph.lines)}\n\`\`\``
    )
    .join("\n\n");

  return `# Co-Inquiry: Group I Ching Session

**Date:** ${date}
**Inquiry:** "${data.inquiry}"
**Participants:** ${names}

---

## Present Situation — Hexagram ${data.presentHexagram.number}: ${data.presentHexagram.name}
[Link](${data.presentHexagram.url})

\`\`\`
${renderHexagram(data.groupLines, data.changingLine - 1)}
\`\`\`

**Changing Line:** ${data.changingLine}

## Future Influence — Hexagram ${data.futureHexagram.number}: ${data.futureHexagram.name}
[Link](${data.futureHexagram.url})

\`\`\`
${renderHexagram(data.futureLines)}
\`\`\`

---

## Individual Hexagrams

${individualSection}

---

*${data.participants.length} participants contributed to this co-inquiry*
`;
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
