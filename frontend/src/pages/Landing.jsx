import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Bot, BriefcaseBusiness, CheckCircle2, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";

const features = [
  ["AI Career Explorer", Bot],
  ["Free Courses", GraduationCap],
  ["Resume Analyzer", BriefcaseBusiness],
  ["Interview Prep", Sparkles],
  ["Verified Certificates", Award],
  ["Admin Controls", ShieldCheck]
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/"><Logo className="h-12 w-auto" /></Link>
          <div className="hidden items-center gap-6 text-sm font-semibold lg:flex">
            {["Home", "Features", "Courses", "Certificates", "Access", "About", "Contact"].map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}
          </div>
          <div className="flex gap-2">
            <Link to="/login"><Button variant="outline">Login</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </div>
        </nav>
      </header>

      <section id="home" className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(18,200,255,.25),transparent_45%,rgba(214,162,51,.18))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-28">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="self-center">
            <div className="mb-5 inline-flex rounded-md border border-gold/40 px-3 py-1 text-sm font-semibold text-gold">Next Step for the Future</div>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">Learn Skills. Build Career. Earn Certificates.</h1>
            <p className="mt-6 max-w-2xl text-lg text-blue-100">AI-powered platform for career growth, job success, and skill mastery.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button>Start Free</Button></Link>
              <a href="#features"><Button variant="ghost">Watch Demo</Button></a>
            </div>
          </motion.div>
          <div className="glass grid rounded-lg p-5">
            <div className="rounded-lg bg-white p-5 text-navy">
              <Logo className="mx-auto mb-5 h-12 w-auto" />
              <div className="grid gap-3">
                {["Career score 92%", "Resume ATS score 84%", "Full Stack certificate ready", "Infosys interview roadmap"].map((item) => (
                  <div className="flex items-center gap-3 rounded-md bg-primary-light p-3 font-semibold" key={item}><CheckCircle2 className="text-primary" />{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-black">Why Nexa AI</h2>
        <p className="mt-2 max-w-2xl text-slate-600">A complete career operating system: discover, learn, prove, apply, and grow from one dashboard.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([name, Icon]) => (
            <Card key={name} className="transition hover:-translate-y-1 hover:shadow-lg">
              <Icon className="mb-4 text-primary" />
              <h3 className="text-xl font-bold">{name}</h3>
              <p className="mt-2 text-sm text-slate-600">Production-ready workflows with clean dashboards, analytics, free learning paths, and verified outcomes.</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="courses" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-black">Course Categories</h2>
          <div className="mt-7 flex flex-wrap gap-3">
            {["Web Development", "AI / Machine Learning", "Cybersecurity", "Data Science", "Cloud", "UI/UX", "Aptitude", "Communication", "Placement Prep", "Programming"].map((x) => (
              <span className="rounded-md bg-primary-light px-4 py-2 text-sm font-bold text-primary" key={x}>{x}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="access" className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-black">Free Access</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Courses", "Free", "All course content is open for every learner"],
            ["Certificates", "Free", "Complete requirements and unlock certificates"],
            ["AI Tools", "Free", "Career, resume, interview, and mentor tools included"]
          ].map(([plan, price, text]) => <Card key={plan}><h3 className="text-2xl font-bold">{plan}</h3><div className="mt-3 text-3xl font-black text-primary">{price}</div><p className="mt-3 text-slate-600">{text}</p></Card>)}
        </div>
      </section>

      <section id="certificates" className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-black">Verified Certificates</h2>
          <p className="mt-2 text-blue-100">Blue and gold certificate styling, QR verification, LinkedIn sharing, PDF download, and admin revocation.</p>
        </div>
      </section>

      <footer id="contact" className="bg-white px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Logo className="h-12 w-auto" />
          <p className="text-sm text-slate-600">Trusted by learners preparing for Infosys, TCS, Wipro, Cisco, Google, Amazon, and Microsoft.</p>
        </div>
      </footer>
    </div>
  );
}
