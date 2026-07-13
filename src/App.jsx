import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import BookingLookup from "./pages/BookingLookup";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PreAdvice from "./pages/PreAdvice";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import VerifiedClientRoute from "./components/auth/VerifiedClientRoute";
import FormFieldValidation from "./components/FormFieldValidation";

const ClientShell = () => (
  <Layout>
    <Outlet />
  </Layout>
);

function App() {
  return (
    <>
      <FormFieldValidation />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword type="client" />} />
        <Route path="/booking-status" element={<BookingLookup />} />

        <Route element={<ProtectedRoute userType="client" />}>
          <Route element={<ClientShell />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />

            <Route element={<VerifiedClientRoute />}>
              <Route path="booking" element={<Booking />} />
              <Route path="booking-history" element={<BookingHistory />} />
              <Route path="pre-advice" element={<PreAdvice />} />
            </Route>
          </Route>
        </Route>

        <Route path="/client/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
