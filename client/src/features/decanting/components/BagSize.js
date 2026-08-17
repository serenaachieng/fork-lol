// src/features/decanting/components/BagSize.js
export const STANDARD_SIZES = ['0.5kg', '1kg', '2kg', '5kg', '10kg'];

export const sizesToKg = (sizeLabels) =>
  sizeLabels.map((label) => parseFloat(label));