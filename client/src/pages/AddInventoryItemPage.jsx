// features/InventoryManagement/pages/AddInventoryItemPage.jsx
//
// Full-page form for registering a new inventory item. No image
// upload (not needed). Category/Warehouse are included to match
// the reference layout, but the backend doesn't have real endpoints
// for these yet — this form will fail gracefully via createProduct's
// error path until that's built, same pattern as everywhere else.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../features/decanting/components/AppShell";
import FormField from "../features/InventoryManagement/components/FormField";
import Button from "../features/EmployeeLogIn/PrimaryButton";
import InfoNotice from "../features/InventoryManagement/components/InfoNotice";
import PrimaryButton from "../features/EmployeeLogIn/PrimaryButton";
//import { createProduct } from "../services/stockAPI";

const UNIT_OPTIONS = ["Bags", "Cans", "Bottles", "Units", "Boxes", "Kg"];
const CATEGORY_OPTIONS = ["Grains", "Canned Goods", "Liquids", "Household", "Other"];
const WAREHOUSE_OPTIONS = ["Main WH - Zone A", "Main WH - Zone B", "Cold Storage"];

export default function AddInventoryItemPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [warehouse, setWarehouse] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("");
  const [initialStock, setInitialStock] = useState("0");
  const [reorderAt, setReorderAt] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Item name is required.";
    if (!sku.trim()) next.sku = "SKU is required.";
    if (!category) next.category = "Select a category.";
    if (!warehouse) next.warehouse = "Select a warehouse.";
    if (!unit) next.unit = "Select a unit type.";
    if (weight !== "" && Number(weight) < 0) next.weight = "Weight can't be negative.";
    if (initialStock === "" || Number(initialStock) < 0) next.initialStock = "Enter a starting stock level.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSaving(true);
    setNotice(null);
    try {
      await createProduct({
        name: name.trim(),
        sku: sku.trim(),
        category,
        warehouse,
        weight: weight === "" ? undefined : Number(weight),
        unit,
        initialStock: Number(initialStock),
        reorderAt: reorderAt === "" ? 0 : Number(reorderAt),
      });
      navigate("/noc/inventory");
    } catch (err) {
      setNotice({ tone: "error", text: err.message || "Could not create the item. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="page-light">
        <main className="decanting-content">
          <nav className="breadcrumb">
            <span onClick={() => navigate("/noc/inventory")} className="breadcrumb__link">Inventory</span>
            <span className="breadcrumb__separator">/</span>
            <span className="breadcrumb__current">Add New Item</span>
          </nav>

          <h1 className="programme-select-heading">Add New Inventory Item</h1>

          {notice && <InfoNotice tone={notice.tone}>{notice.text}</InfoNotice>}

          <div className="setup-card setup-card--full">
            <div className="add-item-grid">
              <FormField
                id="item-name"
                label="Item name *"
                placeholder="e.g. Premium Parboiled Rice"
                value={name}
                error={errors.name}
                onChange={(e) => setName(e.target.value)}
              />

              <FormField
                id="item-sku"
                label="SKU *"
                placeholder="e.g. RICE-PB-001"
                value={sku}
                error={errors.sku}
                onChange={(e) => setSku(e.target.value)}
              />

              <FormField
                id="item-category"
                label="Category *"
                as="select"
                value={category}
                error={errors.category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </FormField>

              <FormField
                id="item-warehouse"
                label="Assigned warehouse *"
                as="select"
                value={warehouse}
                error={errors.warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              >
                <option value="">Select primary warehouse</option>
                {WAREHOUSE_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
              </FormField>

              <FormField
                id="item-weight"
                label="Weight per unit (kg)"
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                placeholder="e.g. 10"
                value={weight}
                error={errors.weight}
                onChange={(e) => setWeight(e.target.value)}
              />

              <FormField
                id="item-unit"
                label="Unit type *"
                as="select"
                value={unit}
                error={errors.unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="">Select unit</option>
                {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
              </FormField>

              <FormField
                id="item-initial-stock"
                label="Initial stock level"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="0"
                value={initialStock}
                error={errors.initialStock}
                onChange={(e) => setInitialStock(e.target.value)}
              />

              <FormField
                id="item-reorder"
                label="Low stock alert threshold"
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="e.g. 50"
                helperText="Trigger a low-stock warning when stock drops below this."
                value={reorderAt}
                onChange={(e) => setReorderAt(e.target.value)}
              />
            </div>
            <PrimaryButton onClick={() => navigate("/noc/inventory/add")}>
  <i className="ti ti-plus" aria-hidden="true" /> Add New Item
</PrimaryButton>

            <div className="decanting-actions">
              <Button variant="secondary" type="button" onClick={() => navigate("/noc/inventory")} disabled={isSaving}>
                Cancel
              </Button>
              <Button variant="primary" type="button" onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? "Creating…" : "Create item"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}