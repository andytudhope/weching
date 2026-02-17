"use client";

import { useReducer, useMemo, useEffect, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { StepTransition } from "@/components/StepTransition";
import { Welcome } from "@/components/steps/Welcome";
import { FormingTheQuestion } from "@/components/steps/FormingTheQuestion";
import { Preparation } from "@/components/steps/Preparation";
import { SeedMethod } from "@/components/steps/SeedMethod";
import { CountingProcess } from "@/components/steps/CountingProcess";
import { GroupCalculation } from "@/components/steps/GroupCalculation";
import { Ceremony } from "@/components/steps/Ceremony";
import { Results } from "@/components/steps/Results";
import { getHexagramInfo } from "@/lib/hexagrams";
import type { Participant } from "@/components/Participants";

const TOTAL_STEPS = 8;
const CEREMONY_STEP = 6;

interface CeremonyState {
  currentStep: number;
  inquiry: string;
  participants: Participant[];
}

type CeremonyAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "SET_INQUIRY"; inquiry: string }
  | { type: "SET_PARTICIPANTS"; participants: Participant[] }
  | { type: "RESET" };

function ceremonyReducer(
  state: CeremonyState,
  action: CeremonyAction
): CeremonyState {
  switch (action.type) {
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS - 1),
      };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.step };
    case "SET_INQUIRY":
      return { ...state, inquiry: action.inquiry };
    case "SET_PARTICIPANTS":
      return { ...state, participants: action.participants };
    case "RESET":
      return { currentStep: 0, inquiry: "", participants: [] };
    default:
      return state;
  }
}

export default function Home() {
  const [state, dispatch] = useReducer(ceremonyReducer, {
    currentStep: 0,
    inquiry: "",
    participants: [],
  });

  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsReturning(
        localStorage.getItem("hasCompletedGuidance") === "true"
      );
    }
  }, []);

  // Mark guidance as completed when reaching ceremony step
  useEffect(() => {
    if (state.currentStep === CEREMONY_STEP && typeof window !== "undefined") {
      localStorage.setItem("hasCompletedGuidance", "true");
      setIsReturning(true);
    }
  }, [state.currentStep]);

  const { inquiry, participants, currentStep } = state;

  const groupLines = useMemo(() => {
    if (participants.length === 0)
      return [false, false, false, false, false, false];
    const lines: boolean[] = [];
    for (let i = 0; i < 6; i++) {
      const sum = participants.reduce((acc, p) => acc + p.numbers[i], 0);
      lines.push(sum % 2 === 1);
    }
    return lines;
  }, [participants]);

  const changingLine = useMemo(() => {
    if (participants.length === 0) return 0;
    const total =
      participants.reduce((sum, p) => sum + p.numbers[6], 0) % 6;
    return total === 0 ? 6 : total;
  }, [participants]);

  const futureLines = useMemo(() => {
    const lines = [...groupLines];
    lines[changingLine - 1] = !lines[changingLine - 1];
    return lines;
  }, [groupLines, changingLine]);

  const presentHexagram = useMemo(
    () => getHexagramInfo(groupLines),
    [groupLines]
  );
  const futureHexagram = useMemo(
    () => getHexagramInfo(futureLines),
    [futureLines]
  );

  const participantHexagrams = useMemo(
    () =>
      participants.map((p) => {
        const lines = p.numbers.slice(0, 6).map((n) => n % 2 === 1);
        return { name: p.name, lines, info: getHexagramInfo(lines) };
      }),
    [participants]
  );

  const canGenerate = participants.length >= 2 && inquiry.trim().length > 0;

  const next = () => dispatch({ type: "NEXT_STEP" });
  const prev = () => dispatch({ type: "PREV_STEP" });
  const goTo = (step: number) => dispatch({ type: "GO_TO_STEP", step });
  const skipToCeremony = () => goTo(CEREMONY_STEP);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Welcome
            onBegin={next}
            onSkip={skipToCeremony}
            isReturning={isReturning}
          />
        );
      case 1:
        return (
          <Preparation
            onContinue={next}
            onBack={prev}
            onSkip={skipToCeremony}
          />
        );
      case 2:
        return (
          <FormingTheQuestion
            onContinue={next}
            onBack={prev}
            onSkip={skipToCeremony}
          />
        );
      case 3:
        return (
          <SeedMethod
            onContinue={next}
            onBack={prev}
            onSkip={skipToCeremony}
          />
        );
      case 4:
        return (
          <CountingProcess
            onContinue={next}
            onBack={prev}
            onSkip={skipToCeremony}
          />
        );
      case 5:
        return (
          <GroupCalculation
            onContinue={next}
            onBack={prev}
          />
        );
      case 6:
        return (
          <Ceremony
            inquiry={inquiry}
            participants={participants}
            onInquiryChange={(v) =>
              dispatch({ type: "SET_INQUIRY", inquiry: v })
            }
            onParticipantsChange={(p) =>
              dispatch({ type: "SET_PARTICIPANTS", participants: p })
            }
            onGenerate={next}
            onBack={prev}
            canGenerate={canGenerate}
          />
        );
      case 7:
        return (
          <Results
            inquiry={inquiry}
            participants={participants}
            groupLines={groupLines}
            futureLines={futureLines}
            changingLine={changingLine}
            presentHexagram={presentHexagram}
            futureHexagram={futureHexagram}
            participantHexagrams={participantHexagrams}
            onNewCeremony={() => dispatch({ type: "RESET" })}
            onModify={() => goTo(CEREMONY_STEP)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      <StepTransition stepKey={currentStep}>{renderStep()}</StepTransition>
      <div className="py-8 border-t border-border">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground font-serif">
            <strong>Co-Inquiry: Group I Ching</strong> — collective inquiry
            through ancient wisdom
          </p>
          <p className="text-xs text-muted-foreground">
            Licensed under GNU AGPL v3.0
          </p>
        </div>
      </div>
    </div>
  );
}
