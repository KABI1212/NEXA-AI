import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Award, BarChart3, Bot, Brain, BriefcaseBusiness, Building2, FileText, Gauge, GraduationCap, LogOut, MessageCircle, Settings, Shield } from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  ["Dashboard", "/dashboard", Gauge],
  ["Career Explorer", "/dashboard/career-explorer", Brain],
  ["Courses", "/dashboard/courses", GraduationCap],
  ["Certificates", "/dashboard/certificates", Award],
  ["Resume Analyzer", "/dashboard/resume-analyzer", FileText],
  ["Interview Prep", "/dashboard/interview-prep", BriefcaseBusiness],
  ["Company Insights", "/dashboard/company-insights", Building2],
  ["Skill Gap Finder", "/dashboard/skill-gap-finder", BarChart3],
  ["AI Mentor Chat", "/dashboard/mentor-chat", MessageCircle],
  ["Reports", "/dashboard/reports", Bot],
  ["Settings", "/dashboard/settings", Settings]
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return <div className="dashboard-shell min-h-screen text-white">
    <div className="grid lg:grid-cols-[280px_1fr]">
      <aside className="sticky top-0 h-auto border-b border-white/10 bg-black/10 p-4 lg:h-screen lg:border-b-0 lg:border-r">
        <Logo light className="mb-6 h-14 w-auto" />
        <nav className="grid max-h-[72vh] gap-1 overflow-auto pr-1">
          {links.map(([label, path, Icon]) => <NavLink key={path} to={path} end={path === "/dashboard"} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? "bg-white text-ink" : "text-blue-100 hover:bg-white/10"}`}><Icon size={18} />{label}</NavLink>)}
          {user?.role === "admin" && <NavLink to="/dashboard/admin" className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold ${isActive ? "bg-white text-ink" : "text-blue-100 hover:bg-white/10"}`}><Shield size={18} />Admin Panel</NavLink>}
        </nav>
        <button onClick={() => { logout(); navigate("/"); }} className="mt-4 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-blue-100 hover:bg-white/10"><LogOut size={18} />Logout</button>
      </aside>
      <main className="min-w-0 p-4 lg:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div><p className="text-sm text-blue-100">Welcome back</p><h1 className="font-display text-2xl font-black">{user?.name || "Nexa Learner"}</h1></div>
          <div className="rounded-md bg-gold px-3 py-1 text-sm font-black text-navy">Free Access</div>
        </div>
        <Outlet />
      </main>
    </div>
  </div>;
}
