"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ThreadWelcomeProps {
  onBegin: () => void;
  username: string;
}

export function ThreadWelcome({ onBegin, username }: ThreadWelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-warm">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-4xl font-serif font-bold text-primary tracking-wide">
            thread of selves
          </h1>
          <p className="text-lg text-muted-foreground font-serif">
            welcome, {username}
          </p>
        </div>

        <div className="space-y-5 text-base text-foreground/80 font-serif leading-relaxed max-w-lg mx-auto">
          <p>
            This is a different kind of collective reading. The participants are
            your many selves at different moments — each with its own question,
            each receiving its own hexagram.
          </p>
          <p>
            The I Ching is not consulted here as a prediction machine. It is
            approached as an operator: the hexagram you receive describes the
            structural quality of your inquiry at this moment. Across time, the
            sequence of hexagrams traces a path through a 64-dimensional space
            — and that path has its own geometry.
          </p>
          <p>
            Your thread is not oriented toward an outcome. It is a record of
            where you have stood, and the shape of the movement between those
            standings.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 pt-4">
          <Button
            onClick={onBegin}
            size="lg"
            className="px-10 py-6 font-serif text-lg shadow-warm hover:shadow-meditation transition-all duration-300"
          >
            Enter the Thread
          </Button>
          <Link
            href="/"
            className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-muted-foreground/30"
          >
            ← group ceremony
          </Link>
        </div>
      </div>
    </div>
  );
}
