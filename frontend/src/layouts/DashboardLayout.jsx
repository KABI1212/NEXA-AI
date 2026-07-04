// @ts-nocheck
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Award, BarChart3, Bot, Brain, BriefcaseBusiness, Building2, FileText,
  Gauge, GraduationCap, LogOut, MessageCircle, Settings, Shield,
  ChevronLeft, Menu, X, Bell, Sparkles, MessageSquare
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  ["Dashboard", "/dashboard", Gauge],
  ["Career Chat", "/dashboard/career-chat", MessageSquare],
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const currentPage = links.find(([_, path]) => path === location.pathname) || ["Dashboard", "/dashboard"];

  return (
    <div className="dashboard-shell min-h-screen text-white">
      <div className="grid lg:grid-cols-[280px_1fr]">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] transform border-r border-white/10 bg-navy/95 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between p-4 lg:p-5">
            <Logo variant="light" className="h-9 w-auto" />
            <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-0.5 overflow-y-auto px-2 pb-4" style={{ maxHeight: "calc(100vh - 80px)" }}>
            {links.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
            {user?.role === "admin" && (
              <NavLink
                to="/dashboard/admin"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-gold to-amber-600 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Shield size={18} />
                Admin Panel
              </NavLink>
            )}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-navy/80 backdrop-blur-xl px-4 py-3 lg:px-7">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 lg:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs text-slate-400">Welcome back</p>
                <h2 className="text-lg font-bold text-white">{user?.name || "Nexa Learner"}</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />
              </button>
              <div className="hidden items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 sm:flex">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-xs font-bold text-gold">Free Access</span>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="p-4 lg:p-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}