import { useState } from "react";
import { api, apiError } from "../services/api.js";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";
import { AuthShell } from "./Signup.jsx";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      if (step === 1) {
        const { data } = await api.post("/auth/forgot-password", { email: form.email });
        setStep(2);
        if (data.devOtp) setForm((current) => ({ ...current, otp: data.devOtp }));
        setMessage(data.devOtp ? `OTP sent. Local mode OTP: ${data.devOtp}` : "OTP sent to email");
      } else {
        await api.post("/auth/reset-password", form);
        setMessage("Password updated. You can login now.");
      }
    } catch (err) {
      setMessage(apiError(err));
    }
  }
  return <AuthShell title="Reset password">
    <form onSubmit={submit} className="grid gap-4">
      {message && <div className="rounded-md bg-blue-50 p-3 text-sm font-semibold text-royal">{message}</div>}
      <FormField label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      {step === 2 && <>
        <FormField label="OTP" value={form.otp} onChange={(e) => setForm({ ...form, otp: e.target.value })} />
        <FormField label="New Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <FormField label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
      </>}
      <Button>{step === 1 ? "Send OTP" : "Update Password"}</Button>
    </form>
  </AuthShell>;
}
