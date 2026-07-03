import { useEffect, useMemo, useState } from "react";
import Card from "../../components/Card.jsx";
import { api } from "../../services/api.js";

function useCountUp(value) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    setCount(0);
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const id = setInterval(() => {
      current += 1;
      setCount(Math.min(target, Math.round(increment * current)));
      if (current >= steps) clearInterval(id);
    }, 1000 / steps);
    return () => clearInterval(id);
  }, [value]);
  return count;
}

function StatCard({ label, value, suffix = "" }) {
  const count = useCountUp(value);
  return (
    <Card className="bg-white/95">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <div className="mt-2 text-4xl font-black text-primary">{count}{suffix}</div>
    </Card>
  );
}

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/users/dashboard"), api.get("/courses")]).then(([dashboardRes, coursesRes]) => {
      setData(dashboardRes.data);
      setCourses(coursesRes.data.courses || []);
    });
  }, []);

  const cards = data || { careerScore: 0, resumeScore: 0, coursesCompleted: 0, certificatesEarned: 0, missingSkills: [], jobsTrending: [], progress: [] };
  const progressByCourse = useMemo(() => Object.fromEntries((cards.progress || []).map((item) => [String(item.courseId), item])), [cards.progress]);
  const careerScore = useCountUp(cards.careerScore);
  const ringStyle = {
    background: `conic-gradient(var(--primary) ${careerScore * 3.6}deg, #e5e7eb 0deg)`
  };

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-white/95">
          <p className="text-sm font-bold text-slate-500">Career Score</p>
          <div className="mt-4 grid place-items-center">
            <div className="grid h-28 w-28 place-items-center rounded-full" style={ringStyle}>
              <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-3xl font-black text-primary">{careerScore}%</div>
            </div>
          </div>
        </Card>
        <StatCard label="Resume Score" value={cards.resumeScore} suffix="%" />
        <StatCard label="Courses Completed" value={cards.coursesCompleted} />
        <StatCard label="Certificates Earned" value={cards.certificatesEarned} />
      </div>

      <Card className="bg-white/95">
        <h2 className="text-xl font-black text-navy">My Courses</h2>
        <div className="mt-4 grid gap-3">
          {courses.map((course) => {
            const item = progressByCourse[String(course._id)];
            const percent = item?.percentage || 0;
            const status = item?.completed ? "Completed" : percent > 0 ? "In Progress" : "Not Started";
            return (
              <div key={course._id} className="rounded-md border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <b>{course.title}</b>
                  <span className={`rounded-md px-2 py-1 text-xs font-black ${item?.completed ? "bg-green-50 text-green-700" : percent > 0 ? "bg-primary-light text-primary" : "bg-slate-100 text-slate-600"}`}>{status}</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${item?.completed ? "bg-green-600" : "bg-primary"}`} style={{ width: `${percent}%` }} /></div>
                <p className="mt-1 text-sm font-bold text-slate-500">{percent}% progress</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-white/95"><h2 className="text-xl font-black">Missing Skills</h2><div className="mt-3 flex flex-wrap gap-2">{cards.missingSkills.map((x) => <span key={x} className="rounded-md bg-primary-light px-3 py-1 text-sm font-bold text-primary">{x}</span>)}</div></Card>
        <Card className="bg-white/95"><h2 className="text-xl font-black">Jobs Trending</h2><div className="mt-3 grid gap-2">{cards.jobsTrending.map((x) => <div key={x} className="rounded-md bg-slate-50 p-3 font-semibold">{x}</div>)}</div></Card>
      </div>
    </div>
  );
}
