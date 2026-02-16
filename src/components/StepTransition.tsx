"use client";

import { useEffect, useState, type ReactNode } from "react";

interface StepTransitionProps {
  stepKey: number;
  children: ReactNode;
}

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [displayedKey, setDisplayedKey] = useState(stepKey);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    if (stepKey === displayedKey) return;

    // Exit current
    setPhase("exit");

    const breathTimer = setTimeout(() => {
      setDisplayedKey(stepKey);
      setDisplayedChildren(children);
      setPhase("enter");

      const visibleTimer = setTimeout(() => {
        setPhase("visible");
      }, 50);

      return () => clearTimeout(visibleTimer);
    }, 600); // 400ms exit + 200ms breath

    return () => clearTimeout(breathTimer);
  }, [stepKey, children, displayedKey]);

  // On first mount, become visible
  useEffect(() => {
    const timer = setTimeout(() => setPhase("visible"), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`step-transition ${
        phase === "exit"
          ? "step-exit"
          : phase === "enter"
            ? "step-enter"
            : "step-visible"
      }`}
    >
      {displayedChildren}
    </div>
  );
}
