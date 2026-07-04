import { lazy, Suspense } from "react";
import CareerChat from "./features/career/CareerChat.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

const Landing = lazy(() => import("./pages/Landing.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.jsx"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout.jsx"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome.jsx"));
const Courses = lazy(() => import("./pages/dashboard/Courses.jsx"));
const CourseDetail = lazy(() => import("./pages/dashboard/CourseDetail.jsx"));
const Certificates = lazy(() => import("./pages/dashboard/Certificates.jsx"));
const AiTools = lazy(() => import("./pages/dashboard/AiTools.jsx"));
const Reports = lazy(() => import("./pages/dashboard/Reports.jsx"));
const Settings = lazy(() => import("./pages/dashboard/Settings.jsx"));
const Admin = lazy(() => import("./pages/dashboard/Admin.jsx"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate.jsx"));
const CareerChatPage = lazy(() => import("./pages/dashboard/CareerChat.jsx"));

function PrivateRoute({ children }) {
  const { token, user } = useAuth();
  return token || user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-navy font-bold text-white">Loading...</div>}>
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
          <Route path="career-chat" element={<CareerChatPage />} />
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
    </Suspense>
  );
}
