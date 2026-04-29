import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import { api } from "../../services/api.js";

export default function DashboardHome() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/users/dashboard").then((r) => setData(r.data)); }, []);
  const cards = data || { careerScore: 92, resumeScore: 76, coursesCompleted: 1, certificatesEarned: 1, missingSkills: [], jobsTrending: [] };
  return <div className="grid gap-5">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        ["Career Score", `${cards.careerScore}%`],
        ["Resume Score", `${cards.resumeScore}%`],
        ["Courses Completed", cards.coursesCompleted],
        ["Certificates Earned", cards.certificatesEarned]
      ].map(([label, value]) => <Card key={label} className="bg-white/95"><p className="text-sm font-bold text-slate-500">{label}</p><div className="mt-2 text-4xl font-black text-royal">{value}</div></Card>)}
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="bg-white/95"><h2 className="font-display text-xl font-black">Missing Skills</h2><div className="mt-3 flex flex-wrap gap-2">{cards.missingSkills.map((x) => <span key={x} className="rounded-md bg-blue-50 px-3 py-1 text-sm font-bold text-royal">{x}</span>)}</div></Card>
      <Card className="bg-white/95"><h2 className="font-display text-xl font-black">Jobs Trending</h2><div className="mt-3 grid gap-2">{cards.jobsTrending.map((x) => <div key={x} className="rounded-md bg-slate-50 p-3 font-semibold">{x}</div>)}</div></Card>
    </div>
  </div>;
}
