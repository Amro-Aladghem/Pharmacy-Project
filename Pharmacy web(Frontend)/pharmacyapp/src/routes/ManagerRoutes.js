import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/PhUsersComponents/Dashboards/Dashboard";
import DashboardHome from "../components/PhUsersComponents/DashboardHomePage/DashboardHome";
import SubNavbar from "../components/SubNavbar/SubNavbar";
import SignIn from "../views/PhManager/SignInPage/SignIn";
import VerfiyPhUserAuth from "../components/PhUsersComponents/VerifyPhUserAuthPage/VerfiyPhUserAuth";
import ShowAdmins from "../views/PhManager/ShowAdminsPage/ShowAdmins";
import AddNewAdminPage from "../views/PhManager/AddNewAmdinPage/AddNewAdminPage";
import CustomersOrders from "../components/PhUsersComponents/CustomersOrders/CustomersOrders";
import PharmacyProducts from "../components/PhUsersComponents/PharmacyProducts/PharmacyProducts.";
import PharmacyAccountPage from "../views/PhManager/PharmacyAccountPage/PharmacyAccountPage";
import AddPhProductPage from "../components/PhUsersComponents/AddPhProductPage/AddPhProductPage";
import MeetingRequestsPage from "../components/PhUsersComponents/MeetingRequestsPage/MeetingRequestsPage";
import PreRegisterPage from "../views/PhManager/PreRegisterPage/PreRegisterPage";
import RegisterPage from "../views/PhManager/RegisterPage/RegisterPage";
import AddPharmacyPage from "../views/PhManager/AddPharmacyPage/AddPharmacyPage";

export function ManagerRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />}>
        <Route path="home" element={<DashboardHome />} />
        <Route path="admins/show" element={<ShowAdmins />} />
        <Route path="admins/add" element={<AddNewAdminPage />} />
        <Route path="live-orders" element={<CustomersOrders />} />
        <Route path="products" element={<PharmacyProducts />} />
        <Route path="ph/account" element={<PharmacyAccountPage />} />
        <Route path="ph/product/add" element={<AddPhProductPage />} />
        <Route path="live-meeting-requests" element={<MeetingRequestsPage />} />
      </Route>

      <Route element={<SubNavbar />}>
        <Route path="signin" element={<SignIn />} />
        <Route path="verify" element={<VerfiyPhUserAuth />} />
        <Route path="pre-register" element={<PreRegisterPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="ph/add" element={<AddPharmacyPage />} />
      </Route>
    </Routes>
  );
}

export default ManagerRoutes;
