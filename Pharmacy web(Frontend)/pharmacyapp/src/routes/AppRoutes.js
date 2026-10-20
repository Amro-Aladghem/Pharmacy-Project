import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import CustomerRoutes from "./CustomerRoutes";
import ManagerRoutes from "./ManagerRoutes";
import AlertProvider from "../contexts/AlertContext";
import { PhUserAuthProvider } from "../contexts/PhUserAuthContext";
import { ConfirmProvider } from "../contexts/ConfirmContext";

export function AppRoutes() {
  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        <Route
          path="/manager/*"
          element={
            <PhUserAuthProvider>
              <ConfirmProvider>
                <AlertProvider>
                  <ManagerRoutes />
                </AlertProvider>
              </ConfirmProvider>
            </PhUserAuthProvider>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
