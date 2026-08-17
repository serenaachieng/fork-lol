// src/pages/DecantingPage.jsx
//
// Decanting calculator + logging screen for Nourish Our Children.
// Two-step flow: calculate a preview (no save), then explicitly
// save the final record. Once saved, records are write-once —
// matches the backend's write-once design (decanting.service.js).
//
// UI is sequential: one step visible at a time (currentStep state),
// all rendered from this single page/component. Step1-5 are plain
// presentational components that receive everything via props —
// there's no router-level navigation between them, so no state is
// ever lost switching steps.
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// API layer — real backend calls, not mocked.
import {
  getProducts,
  calculateDecantingPlan,
  recordDecanting,
} from '../services/decantingAPI';

// Bag size constants + the label→kg conversion helper.
import { STANDARD_SIZES, sizesToKg } from '../features/decanting/components/BagSize';

// Persistent nav shell — desktop sidebar / mobile bottom nav.
// Wraps every activity page (Packing, Collection, Decanting, Delivery).
import AppShell from '../features/decanting/components/AppShell';

// Page-level header — back button, user name/avatar, status, logout.
import PageHeader from '../features/decanting/components/PageActivityHeader';

// Step progress bar ("Step X of 5").
import StepProgress from '../features/decanting/components/StepProgress';

// The five step components — presentational only, no state of their own.
import Step1_SetUpWeek from '../features/decanting/StepPages/Step1_SetUpWeek';
import Step2_BagSizes from '../features/decanting/StepPages/Step2_BagSizes';
import Step3_ProductLines from '../features/decanting/StepPages/Step3_ProductLines';
import Step4_ReviewCalculate from '../features/decanting/StepPages/Step4_ReviewCalculate';
import Step5_RecordWastage from '../features/decanting/StepPages/Step5_RecordWastage';

// Shared UI components.
import InfoBanner from '../features/decanting/components/InfoBanner';
import { Button } from '@/components/ui/button';

const TOTAL_STEPS = 5;

// Factory for a blank product line — keeps "add another product"
// simple and avoids accidentally sharing state between rows.
const emptyLine = () => ({
  productId: '',
  requiredKg: '',
  actualBulkKg: '',   // optional — backend only calculates surplus/
                      // shortfall if this is filled in
  useOwnSizes: false, // per-row override of the default bag sizes
  customSizes: [],
  wastageKg: '',      // only used at save time, not during preview
});

const DecantingPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // ── Step navigation ──────────────────────────────────────────
  // 1 = Set up the week, 2 = Bag sizes, 3 = Product lines,
  // 4 = Review/calculate preview, 5 = Wastage + save.
  const [currentStep, setCurrentStep] = useState(1);

  // ── Reference data ──────────────────────────────────────────
  const [products, setProducts] = useState([]);

  // ── Step 1: week + notes ────────────────────────────────────
  const [weekOf, setWeekOf] = useState('');
  const [notes, setNotes] = useState('');

  // ── Step 2: plan-wide default bag sizes ─────────────────────
  // Starts empty — user must actively select sizes rather than
  // having everything pre-selected for them.
  const [defaultSizes, setDefaultSizes] = useState([]);

  // ── Step 3: repeatable product lines ─────────────────────────
  const [lines, setLines] = useState([emptyLine()]);

  // ── Step 4: calculated result ────────────────────────────────
  const [plan, setPlan] = useState(null);          // result of /calculate
  const [isCalculating, setIsCalculating] = useState(false);

  // ── Step 5: save state ────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Shared error banner — used by both step-navigation guards and
  // the calculate/save API calls, so there's one place errors show.
  const [error, setError] = useState('');

  // Load the product list once on mount.
  // NOTE: reusing the procurement products endpoint as a stopgap —
  // decanting.service.js has getDecantableProducts commented out,
  // so there's no dry-goods-only endpoint yet. This will show all
  // products, not just decantable ones, until that's fixed
  // backend-side. Not something to fix here — just a known limit.
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load products:', err);
      }
    };
    loadProducts();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Toggle a bag size on/off in the plan-wide default set.
  const toggleDefaultSize = (size) => {
    setDefaultSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Update a single line by index without mutating the array in place.
  const updateLine = (index, updatedLine) => {
    setLines((prev) => prev.map((line, i) => (i === index ? updatedLine : line)));
  };

  const addLine = () => {
    setLines((prev) => [...prev, emptyLine()]);
  };

  const removeLine = (index) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  // Build the "items" array the backend expects, from raw form
  // state. Only lines with both a product and a required weight
  // are included — half-filled rows are silently ignored rather
  // than causing a validation error, since the user might still
  // be mid-typing.
  const buildItemsPayload = () =>
    lines
      .filter((line) => line.productId && line.requiredKg)
      .map((line) => {
        const product = products.find((p) => String(p.id) === String(line.productId));
        return {
          productId: line.productId,
          productName: product?.name,
          requiredKg: Number(line.requiredKg),
          // Only send actualBulkKg if it was actually entered —
          // matches the backend's own optional check.
          actualBulkKg: line.actualBulkKg ? Number(line.actualBulkKg) : undefined,
          // Per-line override only sent if the checkbox is on —
          // otherwise the backend falls back to the plan-wide
          // default automatically (resolveSizes logic). Converted
          // to kg since the API takes numbers, not display labels.
          selectedSizes: line.useOwnSizes ? sizesToKg(line.customSizes) : undefined,
          wastageKg: line.wastageKg ? Number(line.wastageKg) : undefined,
        };
      });

  // Calls /calculate — a pure preview, nothing is persisted here.
  // On success, advances the UI straight to Step 4 so the user sees
  // the result immediately.
  const handleCalculate = async () => {
    setError('');
    const items = buildItemsPayload();

    if (items.length === 0) {
      setError('Add at least one product with a required weight before calculating.');
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateDecantingPlan({
        selectedSizes: sizesToKg(defaultSizes),
        items,
      });
      setPlan(result);
      setCurrentStep(4);
    } catch (err) {
      // Backend throws plain Error messages (e.g. "Bag size cannot
      // exceed 5 kg.") — surface them directly rather than a
      // generic fallback, since they're already user-readable.
      setError(err.message || 'Could not calculate the plan. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Calls POST /api/decanting — the actual, irreversible save.
  const handleSave = async () => {
    setError('');

    if (!weekOf) {
      setError('Please select which dispatch week this is for.');
      return;
    }
    if (!plan) {
      // Force a calculate pass before allowing save — keeps the
      // two-step "preview then commit" flow honest.
      setError('Calculate the plan before saving.');
      return;
    }

    // Wastage sanity check: recording more wastage than a line's
    // required weight is almost certainly a typo (e.g. 500 instead
    // of 50), and once saved this record can never be corrected.
    const invalidWastageLine = lines.find((line) => {
      if (!line.wastageKg) return false;
      const wastage = Number(line.wastageKg);
      const required = Number(line.requiredKg);
      return required > 0 && wastage > required;
    });

    if (invalidWastageLine) {
      const product = products.find(
        (p) => String(p.id) === String(invalidWastageLine.productId)
      );
      setError(
        `Wastage for ${product?.name || 'a product'} (${invalidWastageLine.wastageKg}kg) can't exceed its required weight (${invalidWastageLine.requiredKg}kg). Please check for a typo.`
      );
      return;
    }

    setIsSaving(true);
    try {
      // userId is NOT sent from the frontend — the backend pulls it
      // from the authenticated JWT itself, never trusted from the client.
      await recordDecanting({
        weekOf,
        notes,
        selectedSizes: sizesToKg(defaultSizes),
        items: buildItemsPayload(),
      });
      setSavedSuccess(true);
    } catch (err) {
      setError(err.message || 'Could not save the decanting record. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Step navigation guards ───────────────────────────────────
  // "Next" just moves forward, except:
  //  - Step 1 → 2 requires a week to be selected
  //  - Step 2 → 3 requires at least one default bag size
  //  - Step 3 → 4 actually triggers the calculate call (Step 4 is
  //    the preview, so there's nothing to show without calculating)
  //  - Step 4 → 5 requires a successful calculation to exist
  const goNext = () => {
    setError('');

    if (currentStep === 1 && !weekOf) {
      setError('Please select which dispatch week this is for.');
      return;
    }

    if (currentStep === 2 && defaultSizes.length === 0) {
      setError('Select at least one default bag size before continuing.');
      return;
    }

    if (currentStep === 3) {
      handleCalculate(); // advances to step 4 itself on success
      return;
    }

    if (currentStep === 4 && !hasCalculableRows) {
      setError('Go back and calculate a plan before continuing.');
      return;
    }

    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const goPrevious = () => {
    setError('');
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  // Derived values used across steps 4 and 5.
  const linesOverMargin = plan?.summary?.linesOverMargin ?? 0;
  const hasCalculableRows = plan && plan.plans && plan.plans.length > 0;

  // Everything every step component might need, bundled into one
  // object so each <StepN .../> call below stays short. Individual
  // step components only destructure the props they actually use.
  const stepProps = {
    products,
    weekOf, setWeekOf,
    notes, setNotes,
    defaultSizes, toggleDefaultSize,
    lines, updateLine, addLine, removeLine,
    plan, hasCalculableRows, linesOverMargin,
    isCalculating, isSaving,
    goNext, goPrevious, handleSave,
    currentStep, totalSteps: TOTAL_STEPS,
  };

  return (
    // AppShell renders the persistent nav — desktop sidebar /
    // mobile bottom tab bar — around every activity page.
    <AppShell>
      <div className="decanting-layout">
        {/* Page-level header: back button, user info, logout. */}
        <PageHeader
          showBack
          onLogout={handleLogout}
          onInfo={() => navigate('/programmes/noc/info')}
        />

        <main className="decanting-main">
          {savedSuccess ? (
            // ── Post-save state ──────────────────────────────────
            // Once saved, the form is replaced entirely rather than
            // left editable — reinforces that the record is now
            // final (matches the backend's write-once design).
            <div className="decanting-step__intro">
              <h2 className="decanting-step__title">✓ Decanting record saved</h2>
              <p className="decanting-step__subtitle" style={{ marginBottom: 16 }}>
                This record is now final and cannot be edited or deleted.
              </p>
              <Button onClick={() => navigate('/programmes/noc')}>
                Back to Nourish Our Children
              </Button>
            </div>
          ) : (
            <>
              {/* Page title + subtitle, shown on every step. */}
              <div className="decanting-step__intro">
                <h1 className="decanting-step__title">Decanting</h1>
                <p className="decanting-step__subtitle">
                  Plan the week's bulk split and log what actually got packed.
                </p>
              </div>

              {/* "Step X of 5" progress bar. */}
              <StepProgress step={currentStep} totalSteps={TOTAL_STEPS} />

              {/* Single shared error banner for validation, calculate,
                  and save failures — keeps error handling in one place. */}
              {error && <InfoBanner variant="error">{error}</InfoBanner>}

              {/* Only the current step's component renders — everything
                  else is unmounted, but state lives here in the page,
                  not in the step components, so nothing is lost. */}
              {currentStep === 1 && <Step1_SetUpWeek {...stepProps} />}
              {currentStep === 2 && <Step2_BagSizes {...stepProps} />}
              {currentStep === 3 && <Step3_ProductLines {...stepProps} />}
              {currentStep === 4 && <Step4_ReviewCalculate {...stepProps} />}
              {currentStep === 5 && <Step5_RecordWastage {...stepProps} />}
            </>
          )}
        </main>
      </div>
    </AppShell>
  );
};

export default DecantingPage;