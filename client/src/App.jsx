import { BrowserRouter, Routes, Route, Navigate }  from 'react-router-dom';
import { AuthProvider }                            from './context/AuthContext';
import ProtectedRoute                              from './components/layout/ProtectedRoute';
import { PACKING }                                 from './routes/paths';
import LandingPage                                 from './pages/LandingPage';
import LoginPage                                   from './pages/LoginPage';
import GuestLoginPage                              from './pages/GuestLoginPage';
import GuestHomePage                               from './pages/GuestHomePage';

import SelectProgrammeScreen                       from './pages/SelectProgrammeScreen';
import SelectNOCjob                                from './pages/SelectNOCjob';

import ProcurementDashboard                        from './pages/ProcurementDashboard';
import DecantingPage                               from './pages/DecantingPage';
import PackingPage                                 from './pages/PackingPage';
import InventoryManagementPage                     from './pages/InventoryManagementPage';
import ManagerActivityScreen                       from './pages/ManagerActivityScreen';
import AddInventoryItemPage from './pages/AddInventoryItemPage';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/guest" element={<GuestLoginPage />} /> 
        <Route path="/noc/decanting"   element={<DecantingPage />} />
        <Route path="/manager"       element={<ManagerActivityScreen />} />
        <Route path="/noc/inventory" element={<InventoryManagementPage />} />  
        <Route path="/noc/procurement" element={<ProcurementDashboard />} />
       <Route path={PACKING.board}         element={<PackingPage />} />
       <Route path="/noc/inventory/add" element={<AddInventoryItemPage />} />
       
        <Route path={PACKING.detailPattern} element={<PackingPage />} />
        

        {/* TEMP: Packing moved out of ProtectedRoute for local testing.
            Move this back inside <ProtectedRoute> before deploying —
            this is not meant to stay public. */}
       
        {/* Protected — manager only */}
        <Route element={<ProtectedRoute roles={['manager']} />}>
        </Route>
        
       
        {/* Protected — any logged-in user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/programmes" element={<SelectProgrammeScreen />} />
          <Route path="/noc"             element={<SelectNOCjob />} />
          <Route path="/noc/inventory"   element={<InventoryManagementPage />} />
          {/* Packing routes removed from here temporarily — see above */}
        </Route>

        {/* ── Guest-only ────────────────────────────────────── */}
        <Route element={<ProtectedRoute roles={['guest']} />}>
          <Route path="/guest-home" element={<GuestHomePage />} />
        </Route>

        {/* ── Redirects ─────────────────────────────────────── */}
        <Route path="/inventory" element={<Navigate to="/noc/inventory" replace />} />
        <Route path="/decanting" element={<Navigate to="/noc/decanting" replace />} />
        
        <Route path="/noc/packing/:slipId"
               element={<Navigate to={PACKING.board} replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;