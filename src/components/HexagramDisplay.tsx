"use client";

interface HexagramDisplayProps {
  lines: boolean[];
  title: string;
  changingLine: number;
  hexagramNumber?: number;
  hexagramName?: string;
  hexagramUrl?: string;
  compact?: boolean;
}

export function HexagramDisplay({
  lines,
  title,
  changingLine,
  hexagramNumber,
  hexagramName,
  hexagramUrl,
  compact,
}: HexagramDisplayProps) {
  return (
    <div
      className={`flex flex-col items-center shadow-soft ${
        compact
          ? "space-y-2 p-3 bg-gradient-subtle rounded-xl"
          : "space-y-4 p-6 bg-gradient-subtle rounded-2xl"
      }`}
    >
      <h3
        className={`font-serif font-semibold text-primary ${
          compact ? "text-sm mb-0" : "text-xl mb-2"
        }`}
      >
        {title}
      </h3>
      <div className="flex flex-col-reverse space-y-1 space-y-reverse">
        {lines.map((isYang, index) => (
          <div key={index} className="flex items-center space-x-1">
            {!compact && (
              <span className="text-xs font-serif text-muted-foreground w-4">
                {index + 1}
              </span>
            )}
            <div className={`relative ${compact ? "w-16" : "w-28"}`}>
              {isYang ? (
                <div
                  className={`w-full h-1 bg-primary rounded-full transition-all duration-300 ${
                    changingLine === index
                      ? "shadow-meditation animate-pulse"
                      : ""
                  }`}
                />
              ) : (
                <div className="flex justify-between">
                  <div
                    className={`w-[44%] h-1 bg-primary rounded-full transition-all duration-300 ${
                      changingLine === index
                        ? "shadow-meditation animate-pulse"
                        : ""
                    }`}
                  />
                  <div
                    className={`w-[44%] h-1 bg-primary rounded-full transition-all duration-300 ${
                      changingLine === index
                        ? "shadow-meditation animate-pulse"
                        : ""
                    }`}
                  />
                </div>
              )}
              {changingLine === index && (
                <div className="absolute -right-8 top-0 w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>
      {hexagramNumber && hexagramName && hexagramUrl && (
        <a
          href={hexagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-serif text-primary hover:text-accent transition-colors duration-200 underline underline-offset-2 ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          Hexagram {hexagramNumber}: {hexagramName}
        </a>
      )}
    </div>
  );
}
