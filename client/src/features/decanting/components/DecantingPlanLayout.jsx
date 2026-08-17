// components/decanting/DecantingPlanLayout.jsx
import DecantingHeader from './DecantingHeader';
import StepProgress from './StepProgress';

export default function DecantingPlanLayout({ step, totalSteps = 5, stepLabel, children }) {
  return (
    <div className="decanting-layout">
      <DecantingHeader />
      <main className="decanting-main">
        <StepProgress step={step} totalSteps={totalSteps} label={stepLabel} />
        {children}
      </main>
    </div>
  );
}