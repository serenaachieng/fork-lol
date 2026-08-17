// components/decanting/CustomSizeInput.jsx
import { useState, useRef } from 'react';
import WeightDialPicker from '../components/WeightDialPicker';
import SecondaryButton from '../components/SecondaryButton';

export default function CustomSizeInput({ onAdd }) {
  const [grams, setGrams] = useState(750);
  const [justAdded, setJustAdded] = useState(false);
  const resetTimeout = useRef(null);

  const label = grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`;

  const handleAdd = () => {
    onAdd(grams);
    setJustAdded(true);
    clearTimeout(resetTimeout.current);
    resetTimeout.current = setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="custom-size-field">
      <WeightDialPicker value={grams} onChange={setGrams} />

      <SecondaryButton
        onClick={handleAdd}
        className={justAdded ? 'btn-secondary-outline--confirmed' : ''}
      >
        {justAdded ? (
          <>
            <i className="ti ti-check" aria-hidden="true" /> Added {label}
          </>
        ) : (
          `Add ${label}`
        )}
      </SecondaryButton>

      <span className="visually-hidden" role="status" aria-live="polite">
        {justAdded ? `${label} bag size added` : ''}
      </span>
    </div>
  );
}