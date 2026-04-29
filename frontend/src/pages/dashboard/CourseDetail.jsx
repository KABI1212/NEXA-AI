import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { api } from "../../services/api.js";

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  useEffect(() => { api.get(`/courses/${slug}`).then((r) => { setCourse(r.data.course); setProgress(r.data.progress); }); }, [slug]);
  if (!course) return <p>Loading...</p>;
  async function completeAll() {
    const watchedModules = course.modules.map((m) => m._id);
    const { data } = await api.post(`/courses/${course._id}/progress`, { watchedModules, assignmentsDone: true, quizPassed: true, finalPassed: true, quizScore: 92, finalScore: 94 });
    setProgress(data.progress);
  }
  return <div className="grid gap-5">
    <Card className="bg-white/95">
      <h2 className="font-display text-3xl font-black">{course.title}</h2>
      <p className="mt-2 text-slate-600">{course.description}</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full blue-gradient" style={{ width: `${progress?.percentage || 0}%` }} /></div>
      <p className="mt-2 font-bold text-royal">{progress?.percentage || 0}% complete</p>
    </Card>
    <div className="grid gap-3">
      {course.modules.map((module, i) => <Card key={module._id} className="flex items-center gap-3 bg-white/95"><CheckCircle2 className={progress?.watchedModules?.includes(module._id) ? "text-royal" : "text-slate-300"} /><div><h3 className="font-bold">{i + 1}. {module.title}</h3><p className="text-sm text-slate-500">{module.duration} | Assignment: {module.assignment || "Practice task"}</p></div></Card>)}
    </div>
    <Button onClick={completeAll}>Mark Requirements Complete and Unlock Certificate</Button>
  </div>;
}
