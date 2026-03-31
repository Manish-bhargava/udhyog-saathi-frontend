import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// --- CORE FEATURE IMPORTS ---
import { LandingPage } from "./features/landing";
import LoginPage from "./features/authentication/pages/LoginPage";
import SignupPage from "./features/authentication/pages/SignupPage";
import OnboardingPage from "./features/onboarding/pages/OnboardingPage";
import TourPage from "./features/onboarding/pages/TourPage";
import DashboardLayout from "./features/dashboards/pages/DashboardLayout";
import DashboardPage from "./features/dashboards/pages/DashboardPage";
import ProfilePage from "./features/profiles/pages/ProfilePage";
import BillingPage from "./features/billing/pages/billing.jsx";
import ChatInterface from "./features/aiAssistant/ChatInterface";
import TermsOfUsage from "./features/landing/pages/TermsOfUsagePage.jsx";
import AboutUs from "./features/landing/pages/AboutUsPage.jsx";
import PrivacyPolicy from "./features/landing/pages/PrivacyPolicyPage.jsx";

import PakkaBillsPage from "./features/bills/pages/PakkaBillsPage";
import KachaBillsPage from "./features/bills/pages/KachaBillsPage";
import InventoryPage from "./features/Inventory/InventoryPage";
import WarehousesPage from "./features/Inventory/WarehousesPage";
import { BillPageProvider } from "./features/bills/BillPageContext";
import { InventoryProvider } from "./features/Inventory/InventoryContext";
// Raw materials now use the same UI as finished products
import { RiPhoneCameraFill, RiSpace } from "react-icons/ri";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
  const [isNewUser, setIsNewUser] = useState(
    localStorage.getItem("isNewUser") === "true",
  );

  useEffect(() => {
    const syncAppState = () => {
      setIsAuth(!!localStorage.getItem("token"));
      setIsNewUser(localStorage.getItem("isNewUser") === "true");
    };
    window.addEventListener("storage", syncAppState);
    syncAppState();
    return () => window.removeEventListener("storage", syncAppState);
  }, []);

  return (
    <BillPageProvider>
      <InventoryProvider>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<TermsOfUsage />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/onboarding"
          element={
            isAuth ? <OnboardingPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/tour"
          element={isAuth ? <TourPage /> : <Navigate to="/login" replace />}
        />

        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              !isAuth ? (
                <Navigate to="/login" replace />
              ) : isNewUser ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <DashboardPage />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isAuth ? <ProfilePage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="bills">
            <Route
              path="template"
              element={
                <div className="p-8 text-gray-500 font-medium">
                  Bill Templates - Coming Soon
                </div>
              }
            />
            <Route path="pakka" element={<PakkaBillsPage />} />
            <Route path="kacha" element={<KachaBillsPage />} />
          </Route>
          <Route
            path="/ai-assistant"
            element={
              isAuth ? <ChatInterface /> : <Navigate to="/login" replace />
            }
          />

          {/* <Route
            path="/reports"
            element={
              <div className="p-8 text-gray-500 font-medium">
                Business Reports - Coming Soon
              </div>
            }
          /> */}
          {/* TODO: Implement Reports feature */}
          <Route path="/billing" element={<BillingPage />} />
          <Route path="inventory">
            <Route path="finished" element={isAuth ? <InventoryPage /> : <Navigate to="/login" replace />}/>
            <Route path="raw" element={isAuth ? <InventoryPage variant="raw" /> : <Navigate to="/login" replace />}/>
            <Route path="warehouses" element={isAuth ? <WarehousesPage /> : <Navigate to="/login" replace />}/>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </InventoryProvider>
    </BillPageProvider>
  );
}

export default App;
