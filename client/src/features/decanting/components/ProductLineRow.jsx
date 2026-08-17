// components/decanting/ProductLineRow.jsx
import { XIcon } from 'lucide-react';
import SelectField from '../components/SelectField';
import BagSizeChip from './BagSizeChip';
import { STANDARD_SIZES } from './BagSize';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProductLineRow({ index, products, line, onChange, onRemove, canRemove }) {
  const productOptions = products.map((p) => ({ value: String(p.id), label: p.name }));

  const handleField = (field) => (e) => {
    onChange({ ...line, [field]: e.target.value });
  };

  const toggleCustomSize = (size) => {
    const next = line.customSizes.includes(size)
      ? line.customSizes.filter((s) => s !== size)
      : [...line.customSizes, size];
    onChange({ ...line, customSizes: next });
  };

  return (
    <div className="product-line-row">
      <div className="product-line-row__top">
        <div className="product-line-row__select">
          <SelectField
            id={`product-${index}`}
            label="Product *"
            value={line.productId}
            onChange={handleField('productId')}
            options={[{ value: '', label: 'Select a product' }, ...productOptions]}
          />
        </div>
        {canRemove && (
          <button
            type="button"
            className="product-line-row__remove"
            onClick={onRemove}
            aria-label="Remove product line"
          >
            <XIcon className="size-4" />
          </button>
        )}
      </div>

      <div className="product-line-row__grid">
        <div className="login-form__field">
          <Label htmlFor={`required-${index}`}>Required weight (kg) *</Label>
          <Input
            id={`required-${index}`}
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            value={line.requiredKg}
            onChange={handleField('requiredKg')}
            placeholder="0.00"
          />
        </div>
        <div className="login-form__field">
          <Label htmlFor={`bulk-${index}`}>Actual bulk weighed (kg)</Label>
          <Input
            id={`bulk-${index}`}
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            value={line.actualBulkKg}
            onChange={handleField('actualBulkKg')}
            placeholder="Optional"
          />
        </div>
      </div>

      <label className="product-line-row__override">
        <input
          type="checkbox"
          checked={line.useOwnSizes}
          onChange={(e) => onChange({ ...line, useOwnSizes: e.target.checked })}
        />
        Use different bag sizes for this product
      </label>

      {line.useOwnSizes && (
        <div className="bag-size-chip-group">
          {STANDARD_SIZES.map((size) => (
            <BagSizeChip
              key={size}
              label={size}
              selected={line.customSizes.includes(size)}
              onToggle={() => toggleCustomSize(size)}
            />
          ))}
        </div>
      )}
    </div>
  );
}