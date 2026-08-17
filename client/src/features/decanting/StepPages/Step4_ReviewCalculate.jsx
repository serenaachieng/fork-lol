// features/decanting/steps/Step4_ReviewCalculate.jsx
import { ArrowRightIcon, ArrowLeftIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MetricStat from '../components/MetricStat';

export default function Step4_ReviewCalculate({ plan, hasCalculableRows, linesOverMargin, goNext, goPrevious }) {
  return (
    <div className="decanting-form">
      <div className="decanting-step__intro">
        <h2 className="decanting-step__title">Plan preview</h2>
        {hasCalculableRows && (
          linesOverMargin === 0 ? (
            <Badge variant="secondary">All within margin</Badge>
          ) : (
            <Badge variant="destructive">
              {linesOverMargin} line{linesOverMargin > 1 ? 's' : ''} over margin
            </Badge>
          )
        )}
      </div>

      <div className="setup-card setup-card--full">
        <div className="setup-card__header">
          <span className="setup-card__title">Summary Metrics</span>
        </div>

        <section className="metrics-grid">
          <MetricStat label="Total required" value={plan?.summary?.totalRequiredKg ?? 0} unit="kg" />
          <MetricStat label="Total packed" value={plan?.summary?.totalPackedKg ?? 0} unit="kg" />
          <MetricStat label="Total bags" value={plan?.summary?.totalBags ?? 0} />
          <MetricStat label="Surplus" value={hasCalculableRows ? plan.summary.totalSurplusKg : '—'} unit={hasCalculableRows ? 'kg' : ''} />
          <MetricStat
            label="Shortfall"
            value={hasCalculableRows ? plan.summary.totalShortfallKg : '—'}
            unit={hasCalculableRows ? 'kg' : ''}
            variant={hasCalculableRows && plan.summary.totalShortfallKg > 0 ? 'error' : 'default'}
          />
        </section>

        {!hasCalculableRows && (
          <p className="decanting-step__subtitle">
            No calculable rows yet. Go back and add a product with a required weight.
          </p>
        )}
      </div>

      {hasCalculableRows && (
        <div className="setup-card setup-card--full">
          <div className="setup-card__header">
            <span className="setup-card__title">Product Breakdown</span>
          </div>

          <div className="product-line-list">
            {plan.plans.map((line, i) => (
              <div key={i} className="product-line-row">
                <p className="decanting-step__title" style={{ fontSize: 16 }}>
                  {line.productName || `Product ${i + 1}`}
                </p>
                <p className="decanting-step__subtitle">
                  {Object.entries(line.bags)
                    .filter(([, count]) => count > 0)
                    .map(([size, count]) => `${count} × ${size}`)
                    .join(', ')}
                  {' — '}
                  {line.totalBags} bag{line.totalBags !== 1 ? 's' : ''}, packed {line.packedKg}kg
                </p>
                {line.withinMargin ? (
                  <Badge variant="secondary">Within margin</Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangleIcon className="size-3" /> Over margin
                  </Badge>
                )}
                {line.surplusKg > 0 && (
                  <span className="decanting-step__subtitle"> · {line.surplusKg}kg surplus</span>
                )}
                {line.shortfallKg > 0 && (
                  <span className="decanting-step__subtitle"> · {line.shortfallKg}kg shortfall</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="decanting-actions">
        <Button variant="outline" onClick={goPrevious}>
          <ArrowLeftIcon className="size-4" /> Previous
        </Button>
        <Button onClick={goNext}>
          Next Step <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}