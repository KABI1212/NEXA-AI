import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { api, apiError } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import { AuthShell } from "./Signup.jsx";

export default function VerifyOtp() {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const email = params.get("email") || "";
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    if (devOtp) setOtp(devOtp.split(""));
  }, [devOtp]);

  useEffect(() => {
    const id = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  async function verify() {
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp: otp.join("") });
      saveSession(data);
      navigate("/onboarding");
    } catch (err) {
      setError(apiError(err));
    }
  }
  async function resend() {
    const { data } = await api.post("/auth/resend-otp", { email });
    if (data.devOtp) {
      setDevOtp(data.devOtp);
      setOtp(data.devOtp.split(""));
    }
    setTimer(60);
  }
  return <AuthShell title="Verify email OTP">
    <div className="grid gap-4">
      {error && <div className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
      {devOtp && <div className="rounded-md bg-primary-light p-3 text-sm font-semibold text-primary">Local mode OTP: {devOtp}</div>}
      <div className="grid grid-cols-6 gap-2">
        {otp.map((digit, i) => <input key={i} maxLength="1" className="h-12 rounded-md border text-center text-xl font-black" value={digit} onChange={(e) => {
          const next = [...otp]; next[i] = e.target.value.replace(/\D/g, ""); setOtp(next);
        }} />)}
      </div>
      <Button onClick={verify}>Activate Account</Button>
      <Button variant="outline" disabled={timer > 0} onClick={resend}>Resend OTP {timer > 0 ? `(${timer}s)` : ""}</Button>
    </div>
  </AuthShell>;
}
