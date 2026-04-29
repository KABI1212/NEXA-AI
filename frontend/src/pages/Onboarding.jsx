import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import FormField from "../components/FormField.jsx";

export default function Onboarding() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ qualification: "", department: "", skills: "", interests: "", experience: "", dreamJob: "", dreamCompany: "", preferredCountry: "", salaryGoal: "" });
  async function submit(e) {
    e.preventDefault();
    const payload = { ...form, skills: form.skills.split(",").map((x) => x.trim()).filter(Boolean), interests: form.interests.split(",").map((x) => x.trim()).filter(Boolean) };
    const { data } = await api.put("/users/onboarding", payload);
    setUser(data.user);
    navigate("/dashboard");
  }
  return <div className="min-h-screen bg-navy px-4 py-10">
    <form onSubmit={submit} className="mx-auto max-w-4xl rounded-lg bg-white p-6">
      <Logo className="mb-6 h-14 w-auto" />
      <h1 className="font-display text-3xl font-black">Personalize your career dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Object.keys(form).map((key) => <FormField key={key} label={key.replace(/([A-Z])/g, " $1")} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />)}
      </div>
      <Button className="mt-6">Generate Dashboard</Button>
    </form>
  </div>;
}
