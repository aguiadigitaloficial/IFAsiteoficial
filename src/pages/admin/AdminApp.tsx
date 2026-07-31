import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminAuthProvider } from "../../auth/AdminAuthContext";
import "../../content-pages.css";

const AdminDashboardPage = lazy(() => import("./AdminDashboardPage"));
const AdminEventsPage = lazy(() => import("./AdminEventsPage"));
const AdminPartnersPage = lazy(() => import("./AdminPartnersPage"));
const AdminGuard = lazy(() => import("./AdminGuard"));
const AdminLayout = lazy(() => import("./AdminLayout"));
const AdminLoginPage = lazy(() => import("./AdminLoginPage"));

function AdminFallback() {
  return (
    <div className="admin-auth-screen">
      <span className="page-spinner" />
      <p>Carregando...</p>
    </div>
  );
}

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <Suspense fallback={<AdminFallback />}>
        <Routes>
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="eventos" element={<AdminEventsPage />} />
              <Route path="parceiros" element={<AdminPartnersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </AdminAuthProvider>
  );
}
