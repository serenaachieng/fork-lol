// features/decanting/steps/Step5_RecordWastage.jsx
import { ArrowLeftIcon, SaveIcon, AlertTriangleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Step5_RecordWastage({
  products, lines, updateLine, hasCalculableRows,
  isSaving, goPrevious, handleSave,
}) {
  return (
    <div className="decanting-form">
      <div className="decanting-step__intro">
        <h2 className="decanting-step__title">Record wastage and save</h2>
        <p className="decanting-step__subtitle">
          Add any weight lost during decanting (optional), then save the record.
        </p>
      </div>

      {hasCalculableRows && (
        <div className="setup-card setup-card--full">
          <div className="setup-card__header">
            <span className="setup-card__title">Wastage</span>
          </div>
          <p className="setup-card__subtitle">Optional, per product.</p>

          <div className="wastage-field-list">
            {lines
              .filter((line) => line.productId && line.requiredKg)
              .map((line, index) => {
                const product = products.find((p) => String(p.id) === String(line.productId));
                return (
                  <div className="login-form__field" key={index}>
                    <Label htmlFor={`wastage-${index}`}>
                      {product?.name || `product ${index + 1}`} (kg)
                    </Label>
                    <Input
                      id={`wastage-${index}`}
                      type="number"
                      min="0"
                      step="0.1"
                      inputMode="decimal"
                      placeholder="Optional"
                      value={line.wastageKg}
                      onChange={(e) => updateLine(index, { ...line, wastageKg: e.target.value })}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="info-banner info-banner--warning">
        <AlertTriangleIcon className="size-4" aria-hidden="true" />
        <p>Once saved, this record is final — it cannot be edited or deleted.</p>
      </div>

      <div className="decanting-actions decanting-actions--reverse-mobile">
        <Button variant="outline" onClick={goPrevious} disabled={isSaving}>
          <ArrowLeftIcon className="size-4" /> Previous
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !hasCalculableRows}>
          <SaveIcon className="size-4" />
          {isSaving ? 'Saving…' : 'Save decanting record'}
        </Button>
      </div>
    </div>
  );
}