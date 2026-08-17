// features/decanting/steps/Step2_BagSizes.jsx
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BagSizeChip from '../components/BagSizeChip';
import CustomSizeInput from '../components/CustomSizeInput';
import { STANDARD_SIZES } from '../components/BagSize';

export default function Step2_BagSizes({ defaultSizes, toggleDefaultSize, goNext, goPrevious }) {
  const handleAddCustom = (grams) => {
    const label = grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;
    if (!defaultSizes.includes(label)) {
      toggleDefaultSize(label);
    }
  };

  return (
    <div className="decanting-form">
      <div className="decanting-step__intro">
        <h2 className="decanting-step__title">Choose default bag sizes</h2>
        <p className="decanting-step__subtitle">
          Applies to every product below. You can override this on any individual row.
        </p>
      </div>

      <div className="setup-week-grid">
        <div className="setup-card setup-card--week">
          <div className="setup-card__header">
            <span className="setup-card__title">Standard Sizes</span>
          </div>
          <p className="setup-card__subtitle">
            Select all the bag sizes your team packs by default.
          </p>
          <div className="bag-size-chip-group">
            {STANDARD_SIZES.map((size) => (
              <BagSizeChip
                key={size}
                label={size}
                selected={defaultSizes.includes(size)}
                onToggle={() => toggleDefaultSize(size)}
              />
            ))}
          </div>
        </div>

        <div className="setup-card setup-card--notes">
          <div className="setup-card__header">
            <span className="setup-card__title">Custom Size</span>
          </div>
          <p className="setup-card__subtitle">
            Scroll to select the exact weight.
          </p>
          <CustomSizeInput onAdd={handleAddCustom} />
        </div>
      </div>

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