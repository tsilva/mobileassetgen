"use client";

import { GenerationPhase } from "@/types";

interface ProgressIndicatorProps {
  phase: GenerationPhase;
}

interface Step {
  label: string;
  phases: GenerationPhase[];
}

const steps: Step[] = [
  {
    label: "Generating logo",
    phases: ["generating-logo"],
  },
  {
    label: "Processing icon assets",
    phases: ["processing-assets"],
  },
  {
    label: "Generating feature graphic",
    phases: ["generating-feature"],
  },
  {
    label: "Processing feature graphic",
    phases: ["processing-feature"],
  },
];

function getStepStatus(
  step: Step,
  phase: GenerationPhase,
  stepIndex: number
): "pending" | "active" | "complete" {
  if (step.phases.includes(phase)) return "active";

  const phaseOrder: GenerationPhase[] = [
    "generating-logo",
    "processing-assets",
    "generating-feature",
    "processing-feature",
    "complete",
  ];

  const currentIdx = phaseOrder.indexOf(phase);
  const stepPhaseIdx = phaseOrder.indexOf(step.phases[0]);

  if (currentIdx > stepPhaseIdx) return "complete";
  return "pending";
}

export default function ProgressIndicator({ phase }: ProgressIndicatorProps) {
  if (phase === "idle" || phase === "error") return null;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const status = getStepStatus(step, phase, i);
          return (
            <div key={step.label} className="flex items-center gap-3 text-sm">
              {status === "complete" && (
                <svg
                  className="h-4 w-4 text-success flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {status === "active" && (
                <svg
                  className="h-4 w-4 text-primary animate-spin flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {status === "pending" && (
                <div className="h-4 w-4 rounded-full border-2 border-muted flex-shrink-0" />
              )}
              <span
                className={
                  status === "active"
                    ? "text-foreground"
                    : status === "complete"
                      ? "text-success"
                      : "text-muted-foreground"
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
