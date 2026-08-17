// features/decanting/components/StepProgress.jsx
import { Progress } from "@/components/ui/progress";

const STEP_LABELS = ['Set up', 'Products', 'Quantities', 'Review', 'Confirm'];

export default function StepProgress({ step, totalSteps = 5 }) {
  const progressValue = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="step-progress">
      <div className="step-progress__meta">
        <span>Step {step} of {totalSteps}</span>
      </div>

      <div className="step-progress__track relative">
        {/* Connector line — shadcn Progress standing in for the old
            per-segment connector divs, positioned behind the nodes */}
        <Progress
          value={progressValue}
         className="absolute inset-x-4 top-4 -translate-y-1/2 gap-0 [&_[data-slot=progress-indicator]]:bg-emerald-600"
        />

        <div className="relative z-10 flex w-full justify-between">
          {STEP_LABELS.map((label, i) => {
            const stepNumber = i + 1;
            const isActive = stepNumber === step;
            const isComplete = stepNumber < step;

            return (
              <div key={label} className="step-progress__node-wrap flex flex-col items-center">
                <div
                  className={`step-progress__node ${isActive ? 'step-progress__node--active' : ''} ${isComplete ? 'step-progress__node--complete' : ''}`}
                >
                  {isComplete ? <i className="ti ti-check" aria-hidden="true" /> : stepNumber}
                </div>
                <span className={`step-progress__label ${isActive ? 'step-progress__label--active' : ''}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}