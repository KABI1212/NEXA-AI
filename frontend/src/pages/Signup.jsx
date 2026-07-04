import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiError } from "../services/api.js";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import Logo from "../components/Logo.jsx";
import { Sparkles } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}`, { state: { devOtp: data.devOtp } });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your Nexa AI account">
      <form onSubmit={submit} className="grid gap-4">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
        <FormField label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FormField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormField label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select aria-label="Profile type" className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          {["student", "fresher", "professional", "career-switcher", "job-seeker"].map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <FormField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <FormField label="Confirm Password" type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
        <Button disabled={loading} loading={loading}>{loading ? "Sending OTP..." : "Create Account"}</Button>
        <p className="text-sm text-center text-slate-500">Already have an account? <Link className="font-bold text-primary hover:text-primary-dark" to="/login">Login</Link></p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({ title, children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy via-navy-light to-navy px-4 py-10 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-[120px]" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Logo variant="light" className="h-12 mx-auto mb-4" />
          <div className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1 text-xs font-medium text-sky">
            <Sparkles className="h-3 w-3" />
            Next Step for the Future
          </div>
        </div>
        <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl border border-white/20">
          <h1 className="mb-6 text-center text-2xl font-black text-navy">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}