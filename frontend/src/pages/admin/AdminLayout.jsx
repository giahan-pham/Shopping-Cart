import { Outlet } from "react-router-dom";

import AdminNav from "../../components/admin/AdminNavBar";

import "./styles/AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminNav />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;