import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
import CartSidePanel from "./components/cart/CartSidePanel";
import Toast from "./components/Toast";

import AuthPage from "./pages/AuthPage";
import RecordShoppingPage from "./pages/RecordShoppingPage";

import AdminLayout from "./pages/admin/AdminLayout";
import ManageRecords from "./pages/admin/ManageRecords";
import ManageCarts from "./pages/admin/ManageCarts";

import ProtectedRoute from "./components/ProtectedRoute";

import { getCart } from "./api/cartApi";
import { isLoggedIn } from "./api/authApi";

import "./App.css";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  //show toast message
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast]);

  function showToast(message, type = "success") {
    setToast({
      id: Date.now(),
      message,
      type,
    });
  }

  //Open cart panel after adding item
  async function openCartPanel() {
    if (!isLoggedIn()) {
      return;
    }

    try {
      const currentCart = await getCart();

      setCart(currentCart);
      setIsCartOpen(true);
    } catch (error) {
      showToast(error.message, "error");
    }
  }

  function closeCartPanel() {
    setIsCartOpen(false);
  }

  return (
    <div className="App">
      {!isAdminPage && (
        <NavBar onOpenCart={openCartPanel} />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />

      <Routes>
        <Route path="/" element={<Navigate to="/records" />} />

        <Route path="/auth" element={<AuthPage showToast={showToast} />} />

        <Route
          path="/records"
          element={
            <RecordShoppingPage
              setCart={setCart}
              openCartPanel={openCartPanel}
              showToast={showToast}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="records" replace />} />
          <Route path="records" element={<ManageRecords showToast={showToast} />} />
          <Route path="carts" element={<ManageCarts />} />
        </Route>
      </Routes>

      <CartSidePanel
        isOpen={isCartOpen}
        cart={cart}
        setCart={setCart}
        showToast={showToast}
        onClose={closeCartPanel}
      />
    </div>
  );
}

export default App;