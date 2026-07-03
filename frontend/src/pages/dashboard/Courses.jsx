import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Search } from "lucide-react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { api } from "../../services/api.js";

const filters = [
  ["All", ""],
  ["Web Dev", "Web Development"],
  ["AI/ML", "AI / Machine Learning"],
  ["Placement", "Placement Prep"],
  ["Cloud", "Cloud / DevOps"],
  ["Security", "Cybersecurity"],
  ["Data Science", "Data Science"]
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    Promise.all([api.get("/courses"), api.get("/users/dashboard")]).then(([courseRes, dashboardRes]) => {
      setCourses(courseRes.data.courses || []);
      setProgress(dashboardRes.data.progress || []);
    });
  }, []);

  const progressByCourse = useMemo(() => Object.fromEntries(progress.map((item) => [String(item.courseId), item])), [progress]);
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || course.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl font-black">Free Courses</h2>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input className="w-full rounded-md border border-slate-200 bg-white py-2 pl-10 pr-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map(([label, value]) => (
          <button key={label} onClick={() => setCategory(value)} className={`rounded-md px-4 py-2 text-sm font-bold ${category === value ? "bg-primary text-white" : "bg-white text-navy hover:bg-primary-light"}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredCourses.map((course) => {
          const itemProgress = progressByCourse[String(course._id)];
          const percent = itemProgress?.percentage || 0;
          const completed = Boolean(itemProgress?.completed);
          return (
            <Card key={course._id} className="overflow-hidden bg-white/95 p-0">
              <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.thumbnail}?auto=format&fit=crop&w=800&q=80)` }}>
                {completed && <div className="absolute right-3 top-3 rounded-md bg-gold px-3 py-1 text-sm font-black text-navy"><CheckCircle2 className="inline" size={16} /> Completed</div>}
              </div>
              <div className="p-5">
                <span className="text-xs font-black uppercase text-gold">{course.category}</span>
                <h3 className="mt-1 text-xl font-black">{course.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{course.description}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm font-bold"><span>{percent}% complete</span><span>{completed ? "Done" : percent > 0 ? "In progress" : "New"}</span></div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${completed ? "bg-green-600" : "bg-primary"}`} style={{ width: `${percent}%` }} /></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-bold">Free</span>
                  <Link to={`/dashboard/courses/${course.slug}`}>
                    <Button>{completed ? "Completed ✓" : percent > 0 ? "Continue" : "Start"}</Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
