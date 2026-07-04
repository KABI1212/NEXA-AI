// @ts-nocheck
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight, Bot, GraduationCap, BriefcaseBusiness, Sparkles, Award, ShieldCheck,
  Star, ChevronRight, Users, BookOpen, FileCheck, TrendingUp, Clock,
  CheckCircle2, Quote, Mail, MapPin, Phone, ExternalLink, Menu, X
} from "lucide-react";
import Logo from "../components/Logo.jsx";
import Button from "../components/Button.jsx";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

function Section({ id, children, className = "" }) {
  return <section id={id} className={`py-20 ${className}`}>{children}</section>;
}

const features = [
  { icon: Bot, title: "AI Career Explorer", desc: "Discover your ideal career path with AI-powered insights and personalized roadmaps." },
  { icon: GraduationCap, title: "Free Courses", desc: "Access premium courses completely free with certificates upon completion." },
  { icon: BriefcaseBusiness, title: "Resume Analyzer", desc: "Get ATS score, keyword suggestions, and professional improvement tips." },
  { icon: Sparkles, title: "Interview Prep", desc: "Company-specific preparation with mock interviews and coding challenges." },
  { icon: Award, title: "Verified Certificates", desc: "Earn QR-verified, shareable certificates recognized by top employers." },
  { icon: ShieldCheck, title: "Admin Controls", desc: "Full course management, user oversight, and certificate administration." }
];

const stats = [
  { icon: Users, value: "50K+", label: "Active Learners" },
  { icon: BookOpen, value: "100+", label: "Free Courses" },
  { icon: FileCheck, value: "10K+", label: "Certificates Issued" },
  { icon: TrendingUp, value: "92%", label: "Career Success Rate" }
];

const testimonials = [
  { name: "Priya S.", role: "Full Stack Developer at TCS", text: "Nexa AI's career explorer helped me identify my strengths and land my dream job at TCS. The free courses were incredibly comprehensive." },
  { name: "Rahul K.", role: "AI Engineer at Infosys", text: "The interview prep and resume analyzer gave me the confidence to crack technical rounds. Highly recommended for every job seeker!" },
  { name: "Ananya M.", role: "Data Scientist at Amazon", text: "From skill gap analysis to certification, Nexa AI guided me through every step of my career transition into data science." }
];

const courses = [
  { title: "Full Stack Web Development", level: "Beginner", modules: 24, students: "12K+" },
  { title: "AI & Machine Learning", level: "Intermediate", modules: 18, students: "8.5K+" },
  { title: "Cloud Architecture", level: "Advanced", modules: 15, students: "6.2K+" },
  { title: "Data Science Fundamentals", level: "Beginner", modules: 20, students: "15K+" },
  { title: "Cybersecurity Essentials", level: "Intermediate", modules: 16, students: "7.8K+" },
  { title: "UI/UX Design Masterclass", level: "All Levels", modules: 22, students: "9.1K+" }
];

export default function Landing() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5" : "bg-transparent"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* ===== NAVBAR ===== */}
      <header className={navClass}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:py-4">
          <Link to="/"><Logo className="h-9 w-auto lg:h-10" /></Link>
          <div className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {[
              { label: "Home", href: "#home" },
              { label: "Features", href: "#features" },
              { label: "Courses", href: "#courses" },
              { label: "Certificates", href: "#certificates" },
              { label: "Testimonials", href: "#testimonials" }
            ].map((item) => (
              <a href={item.href} key={item.label}
                className="text-slate-600 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                {item.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
            <Link to="/signup"><Button size="sm" className="shadow-lg shadow-primary/20">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button></Link>
          </div>
          <button className="lg:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="border-t bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              {["Home", "Features", "Courses", "Certificates", "Testimonials"].map((item) => (
                <a href={`#${item.toLowerCase()}`} key={item} onClick={() => setMobileMenu(false)}
                  className="text-slate-600 hover:text-primary font-medium py-2">{item}</a>
              ))}
              <div className="flex gap-2 pt-2 border-t">
                <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Login</Button></Link>
                <Link to="/signup" className="flex-1"><Button className="w-full">Sign Up</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* ===== HERO ===== */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky rounded-full blur-[150px] opacity-20" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-sky/30 bg-sky/10 px-4 py-1.5 text-sm font-medium text-sky mb-6">
                <Sparkles className="h-4 w-4" />
                Next Step for the Future
              </div>
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl lg:text-7xl">
                Learn Skills. <br />
                <span className="gradient-text">Build Career.</span> {" "}
                <span className="text-gold">Earn Certificates.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-300 leading-relaxed">
                AI-powered platform that guides you from learning to earning. Discover careers, master skills, ace interviews, and get verified certificates — all in one place, completely free.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button variant="gradient" size="lg" className="shadow-xl shadow-primary/30 group">
                    Start Free <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    Explore Features
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-navy flex items-center justify-center text-[10px] font-bold text-white">
                      {["P", "R", "A", "K"][i - 1]}
                    </div>
                  ))}
                </div>
                <span>Trusted by <strong className="text-white">50K+</strong> learners worldwide</span>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="relative">
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <Logo variant="light" className="h-10 mx-auto" />
                </div>
                <div className="grid gap-3">
                  {[
                    { icon: CheckCircle2, text: "Career score 92% — Top Match", color: "text-accent" },
                    { icon: CheckCircle2, text: "Resume ATS score 84% — Strong", color: "text-sky" },
                    { icon: CheckCircle2, text: "Full Stack certificate ready", color: "text-primary" },
                    { icon: CheckCircle2, text: "Infosys interview roadmap", color: "text-gold" }
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                      <item.icon className={`h-5 w-5 shrink-0 ${item.color}`} />
                      <span className="text-sm font-medium text-white">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">100%</div>
                    <div className="text-xs text-slate-400">Free Access</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-gold">24/7</div>
                    <div className="text-xs text-slate-400">AI Support</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-sky to-accent rounded-full blur-2xl opacity-40 -z-10" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary rounded-full blur-3xl opacity-30 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <Section className="bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <stat.icon className="h-8 w-8 mx-auto text-primary mb-3" />
                <div className="text-3xl font-black text-navy">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== FEATURES ===== */}
      <Section id="features" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">Why Nexa AI</span>
            <h2 className="text-4xl font-black text-navy md:text-5xl">Your Complete <span className="gradient-text">Career OS</span></h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-lg">
              Discover, learn, prove, apply, and grow — all from one intelligent dashboard powered by AI.
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-navy">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== COURSES ===== */}
      <Section id="courses" className="bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent mb-4">Free Courses</span>
            <h2 className="text-4xl font-black text-navy md:text-5xl">Premium Courses. <span className="text-accent">Zero Cost.</span></h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-lg">Industry-relevant courses designed by experts, completely free with verified certificates.</p>
          </motion.div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">{course.level}</span>
                  <span className="text-xs text-slate-400">{course.modules} modules</span>
                </div>
                <h3 className="font-bold text-navy group-hover:text-primary transition-colors">{course.title}</h3>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course.students}</span>
                  <span className="flex items-center gap-1 text-primary font-medium"><Star className="h-3.5 w-3.5 fill-current" /> Free</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="text-center mt-12">
            <Link to="/dashboard/courses"><Button variant="outline" size="lg">View All Courses <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
          </motion.div>
        </div>
      </Section>

      {/* ===== CERTIFICATES ===== */}
      <Section id="certificates" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-block rounded-full bg-gold/20 px-4 py-1.5 text-sm font-semibold text-gold mb-4">Verified Certificates</span>
              <h2 className="text-4xl font-black text-white md:text-5xl">
                Earn Industry-<span className="text-gold">Recognized</span> Certificates
              </h2>
              <p className="mt-4 text-lg text-slate-300 leading-relaxed">
                Each certificate features QR verification, unique ID, gold seal, and PDF download. Share on LinkedIn, include in your resume, and let employers verify instantly.
              </p>
              <div className="mt-8 grid gap-3">
                {[
                  "QR Code Verification — Instant authenticity check",
                  "Unique Certificate ID — Tamper-proof tracking",
                  "PDF Download — Share anywhere, anytime",
                  "LinkedIn Ready — Boost your profile",
                  "Admin Revocation — Enterprise-grade security"
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-gold shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/verify"><Button variant="gold" size="lg">Verify a Certificate <ExternalLink className="h-4 w-4 ml-1" /></Button></Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gold to-amber-500 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Certificate of Completion</h3>
                  <div className="mt-4 border border-gold/30 rounded-lg p-4 bg-white/5">
                    <div className="text-3xl font-bold text-gold mb-1">★ ★ ★</div>
                    <div className="text-white font-bold text-lg">Student Name</div>
                    <div className="text-sm text-slate-400 mt-1">has completed the course</div>
                    <div className="text-gold font-bold mt-1">Full Stack Web Development</div>
                    <div className="mt-4 flex justify-center">
                      <div className="w-16 h-16 bg-white/10 border border-gold/30 rounded flex items-center justify-center text-xs text-slate-400">QR</div>
                    </div>
                    <div className="mt-3 flex justify-center gap-4 text-xs text-slate-400">
                      <span>ID: NEXA-001</span>
                      <span>Date: 2026-07-03</span>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">Scan to verify at www.nexa.ai/verify</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ===== TESTIMONIALS ===== */}
      <Section id="testimonials" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div {...fadeUp} className="text-center mb-14">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent mb-4">Testimonials</span>
            <h2 className="text-4xl font-black text-navy md:text-5xl">What Our <span className="gradient-text">Learners</span> Say</h2>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                <Quote className="h-8 w-8 text-primary/20 mb-3" />
                <p className="text-slate-600 leading-relaxed">"{t.text}"</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="font-bold text-navy">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                  <div className="flex gap-0.5 mt-2">
                    {[...Array(5)].map((_, s) => <Star key={s} className="h-4 w-4 fill-gold text-gold" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ===== AI FEATURES ===== */}
      <Section className="bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative bg-gradient-to-br from-primary/5 via-blue-50 to-accent/5 rounded-3xl p-8 md:p-14 border border-primary/10">
            <motion.div {...fadeUp} className="text-center mb-10">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">AI-Powered</span>
              <h2 className="text-4xl font-black text-navy md:text-5xl">6 Smart AI Tools <span className="gradient-text">at Your Fingertips</span></h2>
              <p className="mt-4 max-w-2xl mx-auto text-slate-500">From career exploration to interview preparation, our AI mentors guide you at every step.</p>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Bot, title: "Career Explorer", desc: "AI suggests best careers, salaries, and roadmaps based on your profile." },
                { icon: FileCheck, title: "Resume Analyzer", desc: "ATS score, keyword optimization, and professional summary suggestions." },
                { icon: Sparkles, title: "Interview Prep", desc: "Company-specific questions, coding tests, and mock interviews." },
                { icon: BriefcaseBusiness, title: "Company Insights", desc: "Hiring process, salary data, culture, and preparation tips." },
                { icon: TrendingUp, title: "Skill Gap Finder", desc: "Identify missing skills, recommended courses, and 30/90-day plans." },
                { icon: Bot, title: "Mentor Chat", desc: "24/7 AI career mentor for personalized guidance and Q&A." }
              ].map((tool, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy text-sm">{tool.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{tool.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div {...fadeUp} className="text-center mt-10">
              <Link to="/signup"><Button variant="gradient" size="lg">Try AI Tools Free <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ===== CTA ===== */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl font-black text-white md:text-5xl">Ready to Take the <span className="gradient-text">Next Step?</span></h2>
            <p className="mt-4 text-lg text-slate-300">Join 50,000+ learners who are building their careers with Nexa AI. Completely free, forever.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/signup"><Button variant="gradient" size="xl" className="shadow-2xl shadow-primary/30">
                Start Free <ArrowRight className="h-5 w-5 ml-1" />
              </Button></Link>
              <Link to="/login"><Button variant="outline" size="xl" className="border-white/20 text-white hover:bg-white/10">
                Sign In
              </Button></Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> No credit card</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Lifetime access</span>
              <span className="flex items-center gap-1"><Award className="h-4 w-4" /> Free certificates</span>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-navy border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo variant="light" className="h-10" />
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                AI-powered career guidance, learning, and certification platform. Your next step to the future starts here.
              </p>
              <div className="mt-4 flex gap-3">
                {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((s) => (
                  <a key={s} href="#" className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-xs text-slate-400 hover:bg-primary/20 hover:text-primary transition-all">
                    {s[0]}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                {["Courses", "Certificates", "AI Tools", "Career Explorer", "Resume Analyzer", "Interview Prep"].map((item) => (
                  <a key={item} href="#" className="hover:text-primary transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                {["About Us", "Careers", "Blog", "Partners", "Privacy Policy", "Terms of Service"].map((item) => (
                  <a key={item} href="#" className="hover:text-primary transition-colors">{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <div className="flex flex-col gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> hello@nexa.ai</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Bengaluru, India</span>
                <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +91-XXXXXXXXXX</span>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Nexa AI. All rights reserved. "Next Step for the Future"</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}