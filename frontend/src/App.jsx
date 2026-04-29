import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import DashboardHome from "./pages/dashboard/DashboardHome.jsx";
import Courses from "./pages/dashboard/Courses.jsx";
import CourseDetail from "./pages/dashboard/CourseDetail.jsx";
import Certificates from "./pages/dashboard/Certificates.jsx";
import AiTools from "./pages/dashboard/AiTools.jsx";
import Reports from "./pages/dashboard/Reports.jsx";
import Settings from "./pages/dashboard/Settings.jsx";
import Admin from "./pages/dashboard/Admin.jsx";
import VerifyCertificate from "./pages/VerifyCertificate.jsx";

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify/:certificateId?" element={<VerifyCertificate />} />
      <Route
        path="/onboarding"
        element={
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="career-explorer" element={<AiTools tool="career" />} />
        <Route path="resume-analyzer" element={<AiTools tool="resume" />} />
        <Route path="interview-prep" element={<AiTools tool="interview" />} />
        <Route path="company-insights" element={<AiTools tool="company" />} />
        <Route path="skill-gap-finder" element={<AiTools tool="skill" />} />
        <Route path="mentor-chat" element={<AiTools tool="mentor" />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:slug" element={<CourseDetail />} />
        <Route path="certificates" element={<Certificates />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
