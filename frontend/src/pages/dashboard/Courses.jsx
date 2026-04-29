import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { api } from "../../services/api.js";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { api.get("/courses").then((r) => setCourses(r.data.courses)); }, []);
  return <div>
    <h2 className="font-display text-3xl font-black">Free Courses</h2>
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => <Card key={course._id} className="overflow-hidden bg-white/95 p-0">
        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.thumbnail}?auto=format&fit=crop&w=800&q=80)` }} />
        <div className="p-5">
          <span className="text-xs font-black uppercase text-gold">{course.category}</span>
          <h3 className="mt-1 font-display text-xl font-black">{course.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{course.description}</p>
          <div className="mt-4 flex items-center justify-between"><span className="font-bold">Free</span><Link to={`/dashboard/courses/${course.slug}`}><Button>Open</Button></Link></div>
        </div>
      </Card>)}
    </div>
  </div>;
}
