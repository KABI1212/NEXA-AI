import { useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../services/api.js";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", role: user?.role || "student" });
  async function save() {
    const { data } = await api.put("/users/profile", form);
    setUser(data.user);
  }
  return <Card className="max-w-2xl bg-white/95">
    <h2 className="text-3xl font-black">Settings</h2>
    <div className="mt-5 grid gap-4">
      <FormField label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      {user?.role !== "admin" && (
        <select aria-label="Profile type" className="min-h-11 rounded-md border border-slate-200 px-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          {["student", "fresher", "professional", "career-switcher", "job-seeker"].map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      )}
      <Button onClick={save}>Save Profile</Button>
    </div>
  </Card>;
}
