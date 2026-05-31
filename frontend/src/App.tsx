/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { ProductionPlanning } from "./pages/admin/Planning";
import { ProductionHistory } from "./pages/admin/ProductionHistory";
import { KitchenList } from "./pages/admin/KitchenList";
import { KitchenDetail } from "./pages/admin/KitchenDetail";
import { WastageReport } from "./pages/admin/WastageReport";
import { RequestStock } from "./pages/admin/RequestStock";
import { ChefQueue } from "./pages/chef/Queue";
import { ChefStock } from "./pages/chef/Stock";
import { ChefDashboard } from "./pages/chef/Dashboard";
import { Login } from "./pages/Login";

const AppContent = () => {
  const [user, setUser] = React.useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };
  
  const role = user?.role || 'Chef';

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Shell user={user} onLogout={handleLogout}>
      <Routes>
        {/* Admin Routes */}
        {role === 'Admin' && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/history" element={<ProductionHistory />} />
            <Route path="/admin/planning" element={<ProductionPlanning />} />
            <Route path="/admin/kitchens" element={<KitchenList />} />
            <Route path="/admin/kitchens/:id?" element={<KitchenDetail />} />
            <Route path="/admin/reports" element={<WastageReport />} />
            <Route path="/admin/request-stock" element={<RequestStock />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        )}

        {/* Chef Routes */}
        {role === 'Chef' && (
          <>
            <Route path="/chef/dashboard" element={<ChefDashboard user={user} />} />
            <Route path="/chef/queue" element={<ChefQueue user={user} />} />
            <Route path="/chef/stock" element={<ChefStock user={user} />} />
            <Route path="*" element={<Navigate to="/chef/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Shell>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

