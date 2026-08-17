
// components/common/WeightDialPicker.jsx
import { useRef, useEffect, useState, useCallback } from 'react';

export default function WeightDialPicker({
  min = 50,
  max = 5000,
  step = 50,
  value,
  onChange,
}) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  // Live value shown while scrolling, updated on every scroll event —
  // separate from `value` so the parent isn't re-rendered on every
  // pixel of scroll, only once the drag settles.
  const [liveValue, setLiveValue] = useState(value);

  const values = [];
  for (let v = min; v <= max; v += step) values.push(v);

  const ITEM_WIDTH = 56; // px — must match CSS .weight-dial__item width

  useEffect(() => {
    setLiveValue(value);
  }, [value]);

  // Scroll to the value on mount / when value changes externally
  useEffect(() => {
    if (!trackRef.current || isDragging) return;
    const index = values.indexOf(value);
    if (index === -1) return;
    trackRef.current.scrollTo({
      left: index * ITEM_WIDTH,
      behavior: 'auto',
    });
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const nearestValueAtScroll = () => {
    if (!trackRef.current) return value;
    const index = Math.round(trackRef.current.scrollLeft / ITEM_WIDTH);
    const clamped = Math.max(0, Math.min(index, values.length - 1));
    return values[clamped];
  };

  // Commits the snapped value to the parent once scrolling settles.
  const handleScrollEnd = useCallback(() => {
    const newValue = nearestValueAtScroll();
    if (newValue !== value) onChange(newValue);
  }, [value, onChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollTimeout = useRef(null);
  const onScroll = () => {
    setIsDragging(true);

    // Update the displayed number immediately, every tick — this is
    // what makes the reading feel live while dragging, rather than
    // only updating once the scroll stops.
    setLiveValue(nearestValueAtScroll());

    clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setIsDragging(false);
      handleScrollEnd();
    }, 100);
  };

  const formatLabel = (grams) =>
    grams >= 1000 ? `${(grams / 1000).toFixed(2).replace(/\.?0+$/, '')}kg` : `${grams}g`;

  return (
    <div className="weight-dial">
      <span className="weight-dial__reading">{formatLabel(liveValue)}</span>

      <div className="weight-dial__frame">
        <div className="weight-dial__center-marker" aria-hidden="true" />
        <div
          className="weight-dial__track"
          ref={trackRef}
          onScroll={onScroll}
          role="slider"
          aria-label="Custom bag size in grams"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={liveValue}
          tabIndex={0}
        >
          <div className="weight-dial__spacer" />
          {values.map((v) => (
            <div key={v} className="weight-dial__item">
              <span className="weight-dial__tick" />
              {v % (step * 5) === 0 && (
                <span className="weight-dial__label">{v >= 1000 ? `${v / 1000}kg` : v}</span>
              )}
            </div>
          ))}
          <div className="weight-dial__spacer" />
        </div>
      </div>
    </div>
  );
}