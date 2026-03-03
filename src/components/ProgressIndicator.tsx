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
  phase: GenerationPhase
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
    <div className="rounded-xl border border-border-subtle bg-surface p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Pipeline
        </h3>
      </div>

      <div className="space-y-0">
        {steps.map((step, i) => {
          const status = getStepStatus(step, phase);
          const isLast = i === steps.length - 1;

          return (
            <div key={step.label} className="flex items-start gap-3.5">
              {/* Timeline rail */}
              <div className="flex flex-col items-center">
                {/* Node */}
                {status === "complete" && (
                  <div className="w-6 h-6 rounded-full bg-success/15 border border-success/40 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {status === "active" && (
                  <div className="w-6 h-6 rounded-full bg-accent/15 border border-accent/50 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                )}
                {status === "pending" && (
                  <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-dim" />
                  </div>
                )}

                {/* Connecting line */}
                {!isLast && (
                  <div
                    className={`w-[2px] h-5 my-0.5 ${
                      status === "complete"
                        ? "bg-success/30"
                        : status === "active"
                          ? "progress-active-line"
                          : "bg-border-subtle"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-sm pt-0.5 ${
                  status === "active"
                    ? "text-foreground font-medium"
                    : status === "complete"
                      ? "text-success"
                      : "text-dim"
                }`}
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
