"use client";

import { BookOpen, Flower2, Hand, Calculator } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function RitualGuidance() {
  return (
    <Card className="bg-warm-stone border-border shadow-soft sticky top-8">
      <CardHeader>
        <CardTitle className="font-serif text-primary text-center flex items-center justify-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Ritual Guidance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-serif font-medium text-primary mb-3 flex items-center">
            <Flower2 className="w-4 h-4 mr-2" />
            Preparation
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-serif font-medium mb-2">Creating Space</h4>
              <p className="text-sm text-warm-stone-foreground/80 mb-2">
                Create a centered and centering space, uncluttered and unfettered
                from outside distractions. Shut off devices and notifications.
              </p>
              <p className="text-sm text-warm-stone-foreground/80">
                Set up an altar - a flat space with cloth to prevent seeds from
                rolling or mixing. Decorate with meaningful objects: crystals,
                stones, driftwood, or natural pieces.
              </p>
            </div>
            <div>
              <h4 className="font-serif font-medium mb-2">Seed Selection</h4>
              <p className="text-sm text-warm-stone-foreground/80 mb-2">
                Prepare a small dish with seeds approximately the size of rice
                grains. Rice works well, or any seeds that are easy to manipulate
                and count without difficulty.
              </p>
              <p className="text-sm text-warm-stone-foreground/80">
                Seeds that are too small make counting challenging. Focus on
                odd/even totals rather than exact counts.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-serif font-medium text-primary mb-3 flex items-center">
            <Hand className="w-4 h-4 mr-2" />
            The Seed Method
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-serif font-medium mb-2">
                Hexagram Formation
              </h4>
              <p className="text-sm text-warm-stone-foreground/80 mb-2">
                Form 6 piles of seeds in a column. Each pile creates a line based
                on odd or even count:
              </p>
              <ul className="text-sm text-warm-stone-foreground/80 space-y-1 ml-4">
                <li>
                  {"• "}
                  <strong>Odd number</strong> = Yang (solid line) ——
                </li>
                <li>
                  {"• "}
                  <strong>Even number</strong> = Yin (broken line) — —
                </li>
                <li>• Line 1 at bottom, counting up to Line 6 at top</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-medium mb-2">Pinch Technique</h4>
              <p className="text-sm text-warm-stone-foreground/80 mb-2">
                The core ritual: focused, contemplative gathering of piles in a
                flow state. Take each pinch with thumb, index, and middle fingers
                (other fingers supporting).
              </p>
              <ul className="text-sm text-warm-stone-foreground/80 space-y-1 ml-4">
                <li>• Not too small, not too large</li>
                <li>• Relaxed, without stress</li>
                <li>• Gentle, slow, rhythmic movements</li>
                <li>• Maintain attention on the shared inquiry</li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-medium mb-2">Changing Line</h4>
              <p className="text-sm text-warm-stone-foreground/80 mb-2">
                Form a 7th pile to the right of your column. This determines the
                changing line:
              </p>
              <ul className="text-sm text-warm-stone-foreground/80 space-y-1 ml-4">
                <li>• Count seeds in 7th pile</li>
                <li>• Divide by 6, remainder = changing line</li>
                <li>• If remainder is 0, changing line is 6</li>
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-serif font-medium text-primary mb-3 flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Counting Process
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-warm-stone-foreground/80">
              Count carefully while maintaining contemplative mode. Group seeds
              in pairs or sets of five to quickly determine odd/even for each
              pile.
            </p>
            <p className="text-sm text-warm-stone-foreground/80">
              Keep each pile distinct throughout the process. Record your 7
              numbers (6 pile counts + 1 changing line pile) and enter them here.
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-serif font-medium text-primary mb-2">
            Group Calculation
          </h4>
          <p className="text-sm text-warm-stone-foreground/80 mb-2">
            Each line combines by adding odd/even values:
          </p>
          <ul className="text-sm text-warm-stone-foreground/80 space-y-1 ml-4">
            <li>• odd + odd = even (yin)</li>
            <li>• even + even = even (yin)</li>
            <li>• odd + even = odd (yang)</li>
          </ul>
          <p className="text-sm text-warm-stone-foreground/80 mt-2">
            All 7th pile totals combine to determine the collective changing
            line.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
