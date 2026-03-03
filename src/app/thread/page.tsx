"use client";

import { useReducer, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StepTransition } from "@/components/StepTransition";
import { ThreadWelcome } from "@/components/thread/ThreadWelcome";
import { TimingRitual } from "@/components/thread/TimingRitual";
import { ThreadAnalysis } from "@/components/thread/ThreadAnalysis";
import { ThreadReflection } from "@/components/thread/ThreadReflection";
import type { TemporalReading } from "@/types/thread";

interface ThreadPageState {
  currentStep: number;
  readings: TemporalReading[];
  username: string;
}

type ThreadAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "SET_READINGS"; readings: TemporalReading[] }
  | { type: "ADD_READING"; reading: TemporalReading }
  | { type: "REMOVE_READING"; id: string }
  | { type: "SET_USERNAME"; username: string };

function threadReducer(
  state: ThreadPageState,
  action: ThreadAction
): ThreadPageState {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case "GO_TO_STEP":
      return { ...state, currentStep: action.step };
    case "SET_READINGS":
      return { ...state, readings: action.readings };
    case "ADD_READING":
      return { ...state, readings: [...state.readings, action.reading] };
    case "REMOVE_READING":
      return {
        ...state,
        readings: state.readings.filter((r) => r.id !== action.id),
      };
    case "SET_USERNAME":
      return { ...state, username: action.username };
    default:
      return state;
  }
}

export default function ThreadPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(threadReducer, {
    currentStep: 0,
    readings: [],
    username: "",
  });
  const [loading, setLoading] = useState(true);

  // On mount: verify auth and load readings
  useEffect(() => {
    async function init() {
      const res = await fetch("/api/readings");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      // Get username from a simple profile endpoint or decode from the response
      // We'll use a cookie-based approach — fetch /api/auth/me
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const me = await meRes.json();
        dispatch({ type: "SET_USERNAME", username: me.username });
      }
      const readings = await res.json();
      dispatch({ type: "SET_READINGS", readings });
      setLoading(false);
    }
    init();
  }, [router]);

  async function handleSave(reading: Omit<TemporalReading, "id">) {
    const res = await fetch("/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inquiry: reading.inquiry,
        lines: reading.lines,
        changingLine: reading.changingLine,
        date: reading.date,
        label: reading.label,
        durations: reading.durations,
      }),
    });
    if (res.ok) {
      const { id } = await res.json();
      dispatch({ type: "ADD_READING", reading: { ...reading, id } });
    }
  }

  async function handleRemove(id: string) {
    const res = await fetch(`/api/readings/${id}`, { method: "DELETE" });
    if (res.ok) {
      dispatch({ type: "REMOVE_READING", id });
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <p className="font-serif text-muted-foreground">loading…</p>
      </div>
    );
  }

  const { currentStep, readings, username } = state;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ThreadWelcome
            onBegin={() => dispatch({ type: "NEXT_STEP" })}
            username={username}
          />
        );
      case 1:
        return (
          <div className="min-h-screen bg-gradient-warm py-12">
            <TimingRitual
              readings={readings}
              onSave={handleSave}
              onRemove={handleRemove}
              onNext={() => dispatch({ type: "NEXT_STEP" })}
            />
          </div>
        );
      case 2:
        return (
          <div className="bg-gradient-warm">
            <ThreadAnalysis
              readings={readings}
              onNext={() => dispatch({ type: "NEXT_STEP" })}
              onBack={() => dispatch({ type: "PREV_STEP" })}
            />
          </div>
        );
      case 3:
        return (
          <div className="bg-gradient-warm">
            <ThreadReflection
              readings={readings}
              username={username}
              onBackToAnalysis={() => dispatch({ type: "PREV_STEP" })}
              onStartNewThread={() => dispatch({ type: "GO_TO_STEP", step: 1 })}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm">
      {renderStep() && (
        <StepTransition stepKey={currentStep}>
          {renderStep()}
        </StepTransition>
      )}
      <div className="py-4 border-t border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4">
          <p className="text-xs text-muted-foreground font-serif">
            Thread of Selves · weching
          </p>
          <button
            onClick={handleLogout}
            className="text-xs font-serif text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            sign out
          </button>
        </div>
      </div>
    </div>
  );
}
