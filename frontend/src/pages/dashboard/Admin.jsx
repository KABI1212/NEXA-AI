import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import { api } from "../../services/api.js";

export default function Admin() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [course, setCourse] = useState({ title: "", slug: "", category: "Web Development", instructor: "", description: "", premium: false, price: 0, modules: [{ title: "Intro", duration: "30m" }] });
  useEffect(() => {
    api.get("/admin/overview").then((r) => setOverview(r.data));
    api.get("/admin/users").then((r) => setUsers(r.data.users));
    api.get("/admin/certificates").then((r) => setCertificates(r.data.certificates));
  }, []);
  async function createCourse() {
    const payload = { ...course, slug: course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), premium: false, price: 0 };
    await api.post("/courses", payload);
    alert("Course created");
  }
  async function revoke(id) {
    await api.patch(`/certificates/${id}/revoke`);
    setCertificates((items) => items.map((c) => c._id === id ? { ...c, verified: false } : c));
  }
  return <div className="grid gap-5">
    <h2 className="font-display text-3xl font-black">Admin Panel</h2>
    {overview && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Object.entries(overview).map(([k, v]) => <Card key={k} className="bg-white/95"><p className="text-sm font-bold uppercase text-slate-500">{k}</p><b className="text-3xl text-royal">{v}</b></Card>)}</div>}
    <Card className="bg-white/95">
      <h3 className="font-display text-xl font-black">Upload Course Content</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {["title", "slug", "category", "instructor", "description"].map((key) => <FormField key={key} label={key} value={course[key]} onChange={(e) => setCourse({ ...course, [key]: e.target.value })} />)}
      </div>
      <Button className="mt-4" onClick={createCourse}>Create Course</Button>
    </Card>
    <Card className="bg-white/95"><h3 className="font-display text-xl font-black">Manage Users</h3><div className="mt-3 grid gap-2">{users.slice(0, 8).map((u) => <div key={u._id} className="flex justify-between rounded-md bg-slate-50 p-3"><span>{u.name} | {u.email}</span><b>{u.role}</b></div>)}</div></Card>
    <Card className="bg-white/95"><h3 className="font-display text-xl font-black">View / Revoke Certificates</h3><div className="mt-3 grid gap-2">{certificates.slice(0, 8).map((c) => <div key={c._id} className="flex items-center justify-between rounded-md bg-slate-50 p-3"><span>{c.certificateId} | {c.courseName}</span><Button variant="outline" onClick={() => revoke(c._id)} disabled={!c.verified}>{c.verified ? "Revoke" : "Revoked"}</Button></div>)}</div></Card>
  </div>;
}
