// ─────────────────────────────────────────────────────────────
// InventoryManagementPage.jsx
// ─────────────────────────────────────────────────────────────
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AppShell from "../features/decanting/components/AppShell";
import PageHeader from "../features/decanting/components/PageActivityHeader";
import SectionHeader from "../features/InventoryManagement/components/SectionHeader";
import StockManifestTable from "../features/InventoryManagement/components/StockManifestTable";
import AdjustStockModal from "../features/InventoryManagement/components/AdjustStockForm";
import MovementHistory from "../features/InventoryManagement/components/MovementHistory";
import InfoNotice from "../features/InventoryManagement/components/InfoNotice";
import { getManifest, getMovements, adjustStock } from "../services/stockAPI";

const CAN_ADJUST = ["manager", "admin"];

const INVENTORY_HEADING_STYLE = {
  fontFamily: "'Poppins', var(--font-family-sans)",
  fontSize: "32px",
  fontWeight: 700,
  color: "black",
  marginBottom: "8px",
};

// ─────────────────────────────────────────────────────────────
// TEST-ONLY SEED DATA
// Used when the backend can't be reached. Also acts as the target
// for local mutations from AdjustStockModal (quantity + threshold
// changes) and AddInventoryItemPage (new items) while there's no
// real backend to persist to — see useMockData below.
//
// DELETE this whole block, plus the isUsingMockData branch in
// loadManifest/handleAdjust, once the backend is live.
// ─────────────────────────────────────────────────────────────
let MOCK_PRODUCTS = [
  { id: "mock-1", name: "Maize Meal", sku: "SKU-MM10-01", unit: "Bags", onHand: 1250, reorderAt: 200, isShortfall: false, isLowStock: false, updatedAt: null },
  { id: "mock-2", name: "Canned Beans (400g)", sku: "SKU-CB40-12", unit: "Cans", onHand: 45, reorderAt: 100, isShortfall: false, isLowStock: true, updatedAt: null },
  { id: "mock-3", name: "Rice (10kg)", sku: "SKU-RC10-05", unit: "Bags", onHand: 850, reorderAt: 150, isShortfall: false, isLowStock: false, updatedAt: null },
  { id: "mock-4", name: "Cooking Oil", sku: "SKU-CO02-09", unit: "Bottles", onHand: 12, reorderAt: 50, isShortfall: true, isLowStock: true, updatedAt: null },
  { id: "mock-5", name: "Sugar (2kg)", sku: "SKU-SG02-03", unit: "Bags", onHand: 300, reorderAt: 80, isShortfall: false, isLowStock: false, updatedAt: null },
  { id: "mock-6", name: "Salt (1kg)", sku: "SKU-ST01-07", unit: "Bags", onHand: 18, reorderAt: 40, isShortfall: false, isLowStock: true, updatedAt: null },
];

// Recomputes the two status flags the same way the backend's SQL
// would, so a mock adjustment updates its badges correctly instead
// of staying frozen at whatever they were when seeded.
const recomputeFlags = (product) => ({
  ...product,
  isShortfall: product.onHand < 0,
  isLowStock: product.onHand >= 0 && product.onHand <= product.reorderAt,
});

export default function InventoryManagementPage() {
  const { user, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const [adjustingProduct, setAdjustingProduct] = useState(null);

  const [historyFor, setHistoryFor] = useState(null);
  const [movements, setMovements] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  const canAdjust = CAN_ADJUST.includes(user?.role);

  useEffect(() => {
    let cancelled = false;
    const loadManifest = async () => {
      try {
        const rows = await getManifest();
        if (!cancelled) { setProducts(rows); setLoadError(null); setIsUsingMockData(false); }
      } catch (err) {
        if (!cancelled) {
          console.warn("Stock API unreachable — using mock data for testing.", err);
          setProducts(MOCK_PRODUCTS);
          setLoadError(null);
          setIsUsingMockData(true);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    loadManifest();
    return () => { cancelled = true; };
  }, []);

  const reloadManifest = useCallback(async () => {
    if (isUsingMockData) {
      // Nothing to refetch — just reflect whatever's currently in
      // the local MOCK_PRODUCTS array (already mutated in place by
      // handleAdjust/handleCreateItem/handleUpdateThreshold below).
      setProducts([...MOCK_PRODUCTS]);
      return;
    }
    setIsLoading(true);
    try {
      setProducts(await getManifest());
      setLoadError(null);
    } catch (err) {
      console.warn("Stock API unreachable — using mock data for testing.", err);
      setProducts(MOCK_PRODUCTS);
      setIsUsingMockData(true);
      setLoadError(null);
    } finally {
      setIsLoading(false);
    }
  }, [isUsingMockData]);

  const handleAdjust = async (payload) => {
    setIsSaving(true);
    setNotice(null);

    if (isUsingMockData) {
      // Mutate the mock array locally instead of calling the API,
      // so the UI can be tested end-to-end with no backend at all.
      const index = MOCK_PRODUCTS.findIndex((p) => String(p.id) === String(payload.productId));
      if (index === -1) {
        setNotice({ tone: "error", text: "Could not find that product in the mock data." });
        setIsSaving(false);
        return false;
      }

      const before = MOCK_PRODUCTS[index].onHand;
      const after = before + payload.quantityDelta;
      MOCK_PRODUCTS[index] = recomputeFlags({ ...MOCK_PRODUCTS[index], onHand: after });
      setProducts([...MOCK_PRODUCTS]);

      setNotice(
        after < 0
          ? { tone: "warning", text: `Adjustment saved. This leaves ${after} on hand — the system now shows a shortfall.` }
          : { tone: "info", text: `Adjustment saved. New level: ${after}.` }
      );
      setIsSaving(false);
      return true;
    }

    try {
      const result = await adjustStock(payload);
      await reloadManifest();

      const warnings = [];
      if (result?.isShortfall) {
        warnings.push(`This leaves ${result.after} on hand — the system now shows a shortfall.`);
      }
      if (result?.isUnitMismatch) {
        warnings.push("The unit sent didn't match the unit on record; the recorded unit was kept.");
      }

      setNotice(
        warnings.length
          ? { tone: "warning", text: `Adjustment saved. ${warnings.join(" ")}` }
          : { tone: "info", text: `Adjustment saved. New level: ${result?.after}.` }
      );
      return true;
    } catch (err) {
      setNotice({ tone: "error", text: err.message || "Could not save the adjustment." });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Used by AdjustStockModal's new threshold-edit section.
  const handleUpdateThreshold = async (productId, newThreshold) => {
    if (isUsingMockData) {
      const index = MOCK_PRODUCTS.findIndex((p) => String(p.id) === String(productId));
      if (index === -1) return false;
      MOCK_PRODUCTS[index] = recomputeFlags({ ...MOCK_PRODUCTS[index], reorderAt: newThreshold });
      setProducts([...MOCK_PRODUCTS]);
      return true;
    }
    // Real API path — will be wired to updateReorderThreshold once
    // the backend endpoint exists.
    return false;
  };

  const handleViewHistory = async (product) => {
    setHistoryFor(product);
    setMovements([]);
    setHistoryError(null);
    setHistoryLoading(true);

    if (isUsingMockData) {
      // No real movement ledger for mock products — show an empty
      // history rather than erroring, since there's nothing to fetch.
      setMovements([]);
      setHistoryLoading(false);
      return;
    }

    try {
      setMovements(await getMovements(product.id));
    } catch (err) {
      setHistoryError(err.message || "Could not load movement history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="page-light">
        <PageHeader onLogout={logout} showBack={true} />

        <main className="decanting-content">
          <SectionHeader
            title="Inventory Management"
            subtitle="Current stock levels and manual adjustments."
            inlineHeadingStyle={INVENTORY_HEADING_STYLE}
          />

          {isUsingMockData && (
            <InfoNotice tone="warning">
              Showing test data — the inventory backend isn't reachable yet.
            </InfoNotice>
          )}

          {loadError && (
            <InfoNotice tone="error">
              {loadError} <button className="btn-link" onClick={reloadManifest}>Try again</button>
            </InfoNotice>
          )}

          {notice && <InfoNotice tone={notice.tone}>{notice.text}</InfoNotice>}

          <StockManifestTable
            products={products}
            isLoading={isLoading}
            canAdjust={canAdjust}
            onAdjustProduct={setAdjustingProduct}
            onViewHistory={handleViewHistory}
          />
        </main>

        {adjustingProduct && (
          <AdjustStockModal
            product={adjustingProduct}
            onSave={handleAdjust}
            onUpdateThreshold={handleUpdateThreshold}
            onClose={() => setAdjustingProduct(null)}
            isSaving={isSaving}
          />
        )}

        {historyFor && (
          <MovementHistory
            product={historyFor}
            movements={movements}
            isLoading={historyLoading}
            error={historyError}
            onClose={() => setHistoryFor(null)}
          />
        )}
      </div>
    </AppShell>
  );
}