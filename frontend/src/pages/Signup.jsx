import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiError } from "../services/api.js";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import Logo from "../components/Logo.jsx";

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

  return <AuthShell title="Create your Nexa AI account">
    <form onSubmit={submit} className="grid gap-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      <FormField label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <FormField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <FormField label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <select className="min-h-11 rounded-md border border-slate-200 px-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        {["student", "fresher", "professional", "career-switcher", "job-seeker"].map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
      <FormField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <FormField label="Confirm Password" type="password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
      <Button disabled={loading}>{loading ? "Sending OTP..." : "Register"}</Button>
      <p className="text-sm">Already have an account? <Link className="font-bold text-royal" to="/login">Login</Link></p>
    </form>
  </AuthShell>;
}

export function AuthShell({ title, children }) {
  return <div className="grid min-h-screen place-items-center bg-navy px-4 py-10">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-glow">
      <Logo className="mx-auto mb-5 h-16 w-auto" />
      <h1 className="mb-5 text-center font-display text-2xl font-black text-ink">{title}</h1>
      {children}
    </div>
  </div>;
}
