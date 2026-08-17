// features/InventoryManagement/mockInventoryData.js
//
// TEST-ONLY shared mock store. Both InventoryManagementPage and
// AddInventoryItemPage import this same array so changes made on
// one page (adjustments, new items, threshold edits) are visible
// on the other during local testing with no backend.
//
// DELETE this file once the backend is live.
export const MOCK_PRODUCTS = [
  { id: "mock-1", name: "Maize Meal", sku: "SKU-MM10-01", unit: "Bags", onHand: 1250, reorderAt: 200, isShortfall: false, isLowStock: false, updatedAt: null },
  { id: "mock-2", name: "Canned Beans (400g)", sku: "SKU-CB40-12", unit: "Cans", onHand: 45, reorderAt: 100, isShortfall: false, isLowStock: true, updatedAt: null },
  { id: "mock-3", name: "Rice (10kg)", sku: "SKU-RC10-05", unit: "Bags", onHand: 850, reorderAt: 150, isShortfall: false, isLowStock: false, updatedAt: null },
  { id: "mock-4", name: "Cooking Oil", sku: "SKU-CO02-09", unit: "Bottles", onHand: 12, reorderAt: 50, isShortfall: true, isLowStock: true, updatedAt: null },
  { id: "mock-5", name: "Sugar (2kg)", sku: "SKU-SG02-03", unit: "Bags", onHand: 300, reorderAt: 80, isShortfall: false, isLowStock: false, updatedAt: null },
  { id: "mock-6", name: "Salt (1kg)", sku: "SKU-ST01-07", unit: "Bags", onHand: 18, reorderAt: 40, isShortfall: false, isLowStock: true, updatedAt: null },
];

export const recomputeFlags = (product) => ({
  ...product,
  isShortfall: product.onHand < 0,
  isLowStock: product.onHand >= 0 && product.onHand <= product.reorderAt,
});