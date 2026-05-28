import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";

import AuthPage from "./pages/AuthPage";
import RecordShoppingPage from "./pages/RecordShoppingPage";
import CartPage from "./pages/CartPage";

import ManageRecords from "./pages/admin/ManageRecords";
import ManageCarts from "./pages/admin/ManageCarts";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/" element={<Navigate to="/records" />} />

        {/* Public routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/records" element={<RecordShoppingPage />} />

        {/* Logged-in user routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/records"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageRecords />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/carts"
          element={
            <ProtectedRoute requiredRole="admin">
              <ManageCarts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;