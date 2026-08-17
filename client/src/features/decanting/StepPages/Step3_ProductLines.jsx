// features/decanting/steps/Step3_ProductLines.jsx
import { ArrowRightIcon, ArrowLeftIcon, PlusIcon, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductLineRow from '../components/ProductLineRow';

export default function Step3_ProductLines({
  products, lines, updateLine, addLine, removeLine,
  goNext, goPrevious, isCalculating,
}) {
  return (
    <div className="decanting-form">
      <div className="decanting-step__intro">
        <h2 className="decanting-step__title">Add product lines</h2>
        <p className="decanting-step__subtitle">
          Specify the products and quantities for this decanting batch.
        </p>
      </div>

      <div className="setup-card setup-card--full">
        <div className="setup-card__header">
          <span className="setup-card__title">Product Lines</span>
        </div>
        <p className="setup-card__subtitle">
          Add every product you'll be decanting this week, with the required weight.
        </p>

        <div className="product-line-list">
          {lines.map((line, index) => (
            <ProductLineRow
              key={index}
              index={index}
              products={products}
              line={line}
              onChange={(updated) => updateLine(index, updated)}
              onRemove={() => removeLine(index)}
              canRemove={lines.length > 1}
            />
          ))}
        </div>

        <Button variant="ghost" type="button" onClick={addLine} className="w-fit">
          <PlusIcon className="size-4" /> Add another product
        </Button>
      </div>

      <div className="info-banner info-banner--info">
        <InfoIcon className="size-4" aria-hidden="true" />
        <p>
          Calculating is just a preview. Nothing is saved until you press{' '}
          <strong>Save decanting record</strong> on the last step.
        </p>
      </div>

      <div className="decanting-actions">
        <Button variant="outline" onClick={goPrevious} disabled={isCalculating}>
          <ArrowLeftIcon className="size-4" /> Previous
        </Button>
        <Button onClick={goNext} disabled={isCalculating}>
          {isCalculating ? 'Calculating…' : 'Calculate plan'}
        </Button>
      </div>
    </div>
  );
}