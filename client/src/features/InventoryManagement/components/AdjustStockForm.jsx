// features/InventoryManagement/components/AdjustStockModal.jsx
//
// Single-product stock adjustment modal, opened from a row's
// "Adjust" button on StockManifestTable. Same validation/save
// logic as the original AdjustStockForm, scoped to one product —
// plus a threshold-edit section for updating the low-stock warning
// level independently of a quantity change.
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FormField from "./FormField";
import Button from "./Button";

const REASONS = [
  "Stock count correction",
  "Damaged / spoiled",
  "Expired",
  "Spillage",
  "Donation not captured at receiving",
  "Other (explain below)",
];

export default function AdjustStockModal({
  product,
  onSave,
  onUpdateThreshold,
  onClose,
  isSaving = false,
}) {
  // Quantity adjustment state
  const [direction, setDirection] = useState("add");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  // Threshold edit state
  const [newReorderAt, setNewReorderAt] = useState(
    String(product.reorderAt ?? "")
  );
  const [isSavingThreshold, setIsSavingThreshold] = useState(false);
  const [thresholdError, setThresholdError] = useState(null);
  const [thresholdSaved, setThresholdSaved] = useState(false);

  const validate = () => {
    const next = {};
    const magnitude = Number(amount);

    if (amount === "" || !Number.isFinite(magnitude)) {
      next.amount = "Enter a quantity.";
    } else if (magnitude <= 0) {
      next.amount = "Enter a quantity greater than zero.";
    }

    if (!reason) {
      next.reason = "A reason is required for manual adjustments.";
    }

    if (reason === "Other (explain below)" && !note.trim()) {
      next.note = "Describe the reason.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const magnitude = Number(amount);
    const quantityDelta =
      direction === "remove" ? -magnitude : magnitude;

    const fullReason = note.trim()
      ? `${reason} — ${note.trim()}`
      : reason;

    const ok = await onSave({
      productId: Number.isNaN(Number(product.id))
        ? product.id
        : Number(product.id),
      quantityDelta,
      unit: product.unit || undefined,
      reason: fullReason,
    });

    if (ok) onClose();
  };

  const handleSaveThreshold = async () => {
    const value = Number(newReorderAt);

    if (!Number.isFinite(value) || value < 0) {
      setThresholdError("Enter a valid threshold.");
      return;
    }

    setIsSavingThreshold(true);
    setThresholdError(null);

    const ok = await onUpdateThreshold?.(product.id, value);

    setIsSavingThreshold(false);

    if (ok) {
      setThresholdSaved(true);

      setTimeout(() => {
        setThresholdSaved(false);
      }, 1600);
    } else {
      setThresholdError("Could not update the threshold.");
    }
  };

  const projectedLevel =
    direction === "remove"
      ? product.onHand - (Number(amount) || 0)
      : product.onHand + (Number(amount) || 0);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="modal-card--form sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>
            Adjust stock — {product.name}
          </DialogTitle>

          <DialogDescription>
            {product.sku} · {product.onHand} {product.unit} currently on
            hand. Corrections are logged against your name and cannot be
            edited afterwards.
          </DialogDescription>
        </DialogHeader>

        {/* Quantity adjustment */}
        <FormField
          id="adjust-direction"
          label="Direction"
          as="select"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="add">Add to stock</option>
          <option value="remove">Remove from stock</option>
        </FormField>

        <FormField
          id="adjust-amount"
          label={`Quantity${product.unit ? ` (${product.unit})` : ""}`}
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          placeholder="e.g. 12"
          value={amount}
          error={errors.amount}
          helperText={`New level will be ${projectedLevel} ${product.unit}`}
          onChange={(e) => setAmount(e.target.value)}
        />

        <FormField
          id="adjust-reason"
          label="Reason"
          as="select"
          value={reason}
          error={errors.reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select a reason</option>

          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </FormField>

        <FormField
          id="adjust-note"
          label="Note"
          as="textarea"
          rows={2}
          placeholder="Any extra detail for the audit trail"
          value={note}
          error={errors.note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="modal-actions">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving…" : "Save adjustment"}
          </Button>
        </div>

        {/* Low stock warning threshold */}
        <div className="threshold-edit-section">
          <span className="setup-card__title">
            Low stock warning
          </span>

          <p className="setup-card__subtitle">
            Currently alerts when stock drops below{" "}
            {product.reorderAt} {product.unit}.
          </p>

          <div className="threshold-edit-row">
            <FormField
              id="edit-threshold"
              label="New threshold"
              type="number"
              min="0"
              value={newReorderAt}
              error={thresholdError}
              onChange={(e) => setNewReorderAt(e.target.value)}
            />

            <Button
              variant="secondary"
              type="button"
              onClick={handleSaveThreshold}
              disabled={isSavingThreshold}
            >
              {isSavingThreshold
                ? "Saving…"
                : "Update threshold"}
            </Button>
          </div>

          {thresholdSaved && (
            <span className="threshold-saved-msg">
              <i
                className="ti ti-check"
                aria-hidden="true"
              />{" "}
              Updated
            </span>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

        
      
    


  



  
