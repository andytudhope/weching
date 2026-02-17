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

  // Always keep displayed children in sync when the step hasn't changed
  // This ensures controlled inputs (textareas, inputs) reflect current state
  useEffect(() => {
    if (stepKey === displayedKey) {
      setDisplayedChildren(children);
    }
  }, [children, stepKey, displayedKey]);

  useEffect(() => {
    if (stepKey === displayedKey) return;

    // Exit current
    setPhase("exit");

    const breathTimer = setTimeout(() => {
      setDisplayedKey(stepKey);
      setDisplayedChildren(children);
      setPhase("enter");

      // Scroll to top when transitioning to a new step
      window.scrollTo(0, 0);

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
