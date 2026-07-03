import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, FileText, Lock, NotebookPen, PlayCircle, Trophy } from "lucide-react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import CertificateDesign from "../../components/CertificateDesign.jsx";
import { api } from "../../services/api.js";
import { downloadCertificatePdf } from "../../utils/certificatePdf.js";

function scoreAnswers(questions = [], answers = {}) {
  if (!questions.length) return 100;
  const correct = questions.filter((item, index) => answers[index] === item.answer).length;
  return Math.round((correct / questions.length) * 100);
}

function videoSrc(url) {
  if (!url) return "";
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
}

function Assessment({ title, questions, answers, setAnswers, result, onSubmit }) {
  return (
    <Card className="bg-white/95">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-black text-navy">{title}</h3>
        {result && <span className={`rounded-md px-3 py-1 text-sm font-bold ${result.passed ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>Score: {result.score}%</span>}
      </div>
      <div className="mt-4 grid gap-4">
        {questions.map((question, index) => (
          <div key={question.question} className="rounded-md border border-slate-200 p-4">
            <p className="font-bold">{index + 1}. {question.question}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {question.options.map((option) => (
                <label key={option} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${answers[index] === option ? "border-primary bg-primary-light text-primary" : "border-slate-200 bg-white"}`}>
                  <input type="radio" name={`${title}-${index}`} checked={answers[index] === option} onChange={() => setAnswers((current) => ({ ...current, [index]: option }))} />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Button className="mt-4" onClick={onSubmit}>Submit {title}</Button>
    </Card>
  );
}

export default function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState("video");
  const [notes, setNotes] = useState("");
  const [noteMap, setNoteMap] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [finalAnswers, setFinalAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [message, setMessage] = useState("");
  const iframeRef = useRef(null);
  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const certRef = useRef(null);

  useEffect(() => {
    api.get(`/courses/${slug}`).then((r) => {
      setCourse(r.data.course);
      setProgress(r.data.progress || null);
      setQuizResult(r.data.progress?.quizScore ? { score: r.data.progress.quizScore, passed: r.data.progress.quizPassed } : null);
      setFinalResult(r.data.progress?.finalScore ? { score: r.data.progress.finalScore, passed: r.data.progress.finalPassed } : null);
    });
  }, [slug]);

  const watchedModules = useMemo(() => new Set(progress?.watchedModules || []), [progress]);
  const modules = course?.modules || [];
  const activeModule = modules[activeIndex];
  const watchedCount = watchedModules.size;
  const percentage = modules.length ? Math.round((watchedCount / modules.length) * 100) : 0;
  const allWatched = modules.length > 0 && watchedCount === modules.length;
  const completed = Boolean(progress?.completed || (allWatched && quizResult?.passed && finalResult?.passed));

  useEffect(() => {
    if (!course || !activeModule) return;
    const map = {};
    modules.forEach((module) => {
      const value = localStorage.getItem(`nexa_notes_${course._id}_${module._id}`) || "";
      if (value.trim()) map[module._id] = true;
    });
    setNoteMap(map);
    setNotes(localStorage.getItem(`nexa_notes_${course._id}_${activeModule._id}`) || "");
  }, [course, activeModule, modules]);

  useEffect(() => {
    if (!course || !activeModule) return;
    const key = `nexa_notes_${course._id}_${activeModule._id}`;
    localStorage.setItem(key, notes);
    setNoteMap((current) => ({ ...current, [activeModule._id]: Boolean(notes.trim()) }));
  }, [notes, course, activeModule]);

  async function saveProgress(payload) {
    const { data } = await api.post(`/courses/${course._id}/progress`, payload);
    setProgress(data.progress);
    if (data.certificate) setCertificate(data.certificate);
    return data;
  }

  async function markWatched(moduleId = activeModule?._id) {
    if (!course || !moduleId || watchedModules.has(moduleId)) return;
    const nextWatched = Array.from(new Set([...(progress?.watchedModules || []), moduleId]));
    await saveProgress({
      watchedModules: nextWatched,
      assignmentsDone: true,
      quizPassed: quizResult?.passed || progress?.quizPassed || false,
      quizScore: quizResult?.score || progress?.quizScore || 0,
      finalPassed: finalResult?.passed || progress?.finalPassed || false,
      finalScore: finalResult?.score || progress?.finalScore || 0
    });
  }

  useEffect(() => {
    if (!course || !activeModule || !iframeRef.current) return;

    const loadApi = () =>
      new Promise((resolve) => {
        if (window.YT?.Player) return resolve();
        const existing = document.querySelector("script[src='https://www.youtube.com/iframe_api']");
        window.onYouTubeIframeAPIReady = () => resolve();
        if (!existing) {
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(script);
        }
      });

    let cancelled = false;
    loadApi().then(() => {
      if (cancelled || !iframeRef.current) return;
      if (playerRef.current?.destroy) playerRef.current.destroy();
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onStateChange: (event) => {
            window.clearInterval(pollRef.current);
            if (event.data === 0) {
              markWatched(activeModule._id);
            }
            if (event.data === 1) {
              pollRef.current = window.setInterval(() => {
                const duration = playerRef.current?.getDuration?.() || 0;
                const current = playerRef.current?.getCurrentTime?.() || 0;
                if (duration && current / duration >= 0.8) {
                  window.clearInterval(pollRef.current);
                  markWatched(activeModule._id);
                }
              }, 2000);
            }
          }
        }
      });
    });

    return () => {
      cancelled = true;
      window.clearInterval(pollRef.current);
      if (playerRef.current?.destroy) playerRef.current.destroy();
      playerRef.current = null;
    };
  }, [course, activeModule?._id]);

  async function submitQuiz() {
    const score = scoreAnswers(course.quiz, quizAnswers);
    const passed = score >= 60;
    setQuizResult({ score, passed });
    await saveProgress({
      watchedModules: Array.from(watchedModules),
      assignmentsDone: true,
      quizPassed: passed,
      quizScore: score,
      finalPassed: finalResult?.passed || progress?.finalPassed || false,
      finalScore: finalResult?.score || progress?.finalScore || 0
    });
  }

  async function submitFinal() {
    const score = scoreAnswers(course.finalTest, finalAnswers);
    const passed = score >= 60;
    setFinalResult({ score, passed });
    await saveProgress({
      watchedModules: Array.from(watchedModules),
      assignmentsDone: true,
      quizPassed: quizResult?.passed || progress?.quizPassed || false,
      quizScore: quizResult?.score || progress?.quizScore || 0,
      finalPassed: passed,
      finalScore: score
    });
  }

  useEffect(() => {
    if (!course || !allWatched || !quizResult?.passed || !finalResult?.passed || progress?.completed) return;
    saveProgress({
      watchedModules: modules.map((module) => module._id),
      assignmentsDone: true,
      quizPassed: true,
      quizScore: quizResult.score,
      finalPassed: true,
      finalScore: finalResult.score,
      completed: true
    }).then(() => api.post("/certificates/issue", { courseId: course._id }).then((r) => setCertificate(r.data.certificate)).catch(() => {}));
    setMessage("Congratulations! You have completed this course!");
  }, [course, allWatched, quizResult?.passed, finalResult?.passed, progress?.completed]);

  useEffect(() => {
    if (!course || !progress?.completed || certificate) return;
    api.post("/certificates/issue", { courseId: course._id }).then((r) => setCertificate(r.data.certificate)).catch(() => {});
  }, [course, progress?.completed, certificate]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="grid gap-5">
      <div className={`sticky top-0 z-20 rounded-md p-3 text-white shadow-lg ${percentage === 100 ? "bg-green-600" : percentage > 0 ? "bg-primary" : "bg-slate-500"}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <b>Course Progress: {watchedCount} of {modules.length} modules watched ({percentage}%)</b>
          <div className="h-2 w-56 overflow-hidden rounded-full bg-white/30"><div className="h-full bg-white" style={{ width: `${percentage}%` }} /></div>
        </div>
      </div>

      {message && <div className="rounded-md bg-green-50 p-4 text-lg font-black text-green-700">{message}</div>}

      <Card className="bg-white/95">
        <h2 className="text-3xl font-black text-navy">{course.title}</h2>
        <p className="mt-2 text-slate-600">{course.description}</p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
        <Card className="bg-white/95">
          <div className="mb-4">
            <div className="flex justify-between text-sm font-bold"><span>{watchedCount} of {modules.length} watched</span><span>{percentage}%</span></div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-primary" style={{ width: `${percentage}%` }} /></div>
          </div>
          <div className="grid gap-2">
            {modules.map((module, index) => {
              const unlocked = index === 0 || watchedModules.has(modules[index - 1]?._id);
              const watched = watchedModules.has(module._id);
              return (
                <button
                  key={module._id}
                  disabled={!unlocked}
                  onClick={() => { setActiveIndex(index); setTab("video"); }}
                  className={`flex items-center gap-3 rounded-md border p-3 text-left ${activeIndex === index ? "border-primary bg-primary-light" : "border-slate-200 bg-white"} ${!unlocked ? "opacity-60" : ""}`}
                >
                  {watched ? <CheckCircle2 className="text-green-600" size={20} /> : unlocked ? <PlayCircle className="text-primary" size={20} /> : <Lock className="text-slate-400" size={20} />}
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{index + 1}. {module.title}</span>
                    <span className="text-sm text-slate-500">{module.duration}</span>
                  </span>
                  {noteMap[module._id] && <NotebookPen className="text-gold" size={18} />}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card className="bg-white/95">
            <div className="mb-4 flex gap-2">
              <button className={`rounded-md px-4 py-2 font-bold ${tab === "video" ? "bg-primary text-white" : "bg-slate-100"}`} onClick={() => setTab("video")}>Video</button>
              <button className={`rounded-md px-4 py-2 font-bold ${tab === "notes" ? "bg-primary text-white" : "bg-slate-100"}`} onClick={() => setTab("notes")}><NotebookPen className="inline" size={16} /> My Notes</button>
            </div>
            {tab === "video" ? (
              <div>
                <div className="aspect-video overflow-hidden rounded-md bg-navy">
                  <iframe key={activeModule._id} ref={iframeRef} className="h-full w-full" src={videoSrc(activeModule.videoUrl)} title={activeModule.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="mt-4">
                  <div>
                    <h3 className="text-2xl font-black text-navy">{activeModule.title}</h3>
                    <p className="text-slate-600">{activeModule.duration} · Assignment: {activeModule.assignment || "Practice task"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="mb-3 text-xl font-black text-navy">My Notes for {activeModule.title}</h3>
                <textarea className="min-h-72 w-full rounded-md border border-slate-200 p-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Write your notes for this module..." />
              </div>
            )}
          </Card>

          {allWatched && (
            <div className="grid gap-4">
              <Assessment title="Quiz" questions={course.quiz || []} answers={quizAnswers} setAnswers={setQuizAnswers} result={quizResult} onSubmit={submitQuiz} />
              <Assessment title="Final Test" questions={course.finalTest || []} answers={finalAnswers} setAnswers={setFinalAnswers} result={finalResult} onSubmit={submitFinal} />
            </div>
          )}
        </div>
      </div>

      <Card className="bg-white/95">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-black text-navy"><Trophy className="text-gold" /> Certificate</h3>
            <p className="text-slate-600">{completed ? "Your certificate is unlocked." : "Complete all modules and assessments to unlock your certificate."}</p>
          </div>
          <Button disabled={!completed} onClick={() => downloadCertificatePdf(certRef.current, course.title)}>
            {completed ? "Download Certificate" : "Complete all modules & assessments to unlock"}
          </Button>
        </div>
      </Card>

      <div className="fixed -left-[9999px] top-0">
        <div ref={certRef}>
          <CertificateDesign
            studentName={certificate?.studentName || "Nexa Learner"}
            courseName={certificate?.courseName || course.title}
            certificateId={certificate?.certificateId || "Pending"}
            completionDate={certificate?.completionDate || certificate?.createdAt || new Date()}
            score={certificate?.score || Math.round(((quizResult?.score || 0) + (finalResult?.score || 0)) / 2) || 0}
            instructorName={certificate?.instructorName || course.instructor}
            qrUrl={certificate?.qrUrl}
          />
        </div>
      </div>
    </div>
  );
}
