import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiError } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import { AuthShell } from "./Signup.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", form);
      saveSession(data);
      navigate("/dashboard");
    } catch (err) {
      setError(apiError(err));
    }
  }

  return <AuthShell title="Welcome back">
    <form onSubmit={submit} className="grid gap-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <FormField label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <Button>Login</Button>
      <div className="flex justify-between text-sm"><Link className="font-bold text-primary" to="/forgot-password">Forgot Password</Link><Link to="/signup">Create account</Link></div>
    </form>
  </AuthShell>;
}
