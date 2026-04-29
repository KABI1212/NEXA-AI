import Report from "../models/Report.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAiJson } from "../utils/ai.js";
import { isLocalMode } from "../utils/dataMode.js";
import { saveReport as saveLocalReport } from "../utils/localStore.js";

const aiSystem = "You are Nexa AI, a career guidance mentor. Return practical, concise JSON for a SaaS dashboard.";

export const careerExplorer = asyncHandler(async (req, res) => {
  const fallback = {
    bestCareers: ["Full Stack Developer", "AI Engineer", "Cloud Developer"],
    salaryRange: "₹6 LPA - ₹28 LPA",
    roadmap: ["HTML/CSS/JS", "React + Node", "Databases", "Cloud deployment", "Portfolio projects"],
    companiesHiring: ["TCS", "Infosys", "Wipro", "Google", "Amazon"]
  };
  const data = await generateAiJson(aiSystem, `Suggest careers for ${JSON.stringify(req.body)}`, fallback);
  await saveReport(req.user._id, "career", "Career Explorer", data);
  res.json({ data });
});

export const resumeAnalyzer = asyncHandler(async (req, res) => {
  const fallback = {
    atsScore: 78,
    improvements: ["Add measurable achievements", "Include role-specific keywords", "Move projects above certifications"],
    missingKeywords: ["REST API", "MongoDB", "CI/CD", "Cloud"],
    betterSummary: "Full-stack developer with strong React, Node.js, and deployment skills.",
    roleMatch: "82%"
  };
  const data = await generateAiJson(aiSystem, `Analyze this resume text for ATS: ${req.body.resumeText || "No text provided"}`, fallback);
  await saveReport(req.user._id, "resume", "Resume Analyzer", data);
  res.json({ data });
});

export const interviewPrep = asyncHandler(async (req, res) => {
  const company = req.body.company || "Infosys";
  const fallback = {
    company,
    hrQuestions: ["Tell me about yourself", "Why should we hire you?", "Describe a challenge you solved"],
    technicalRounds: ["Core fundamentals", "Project deep dive", "Coding and debugging"],
    codingTests: ["Arrays", "Strings", "SQL basics"],
    answers: ["Use STAR format and include measurable impact."],
    mockInterview: ["Introduce yourself in 60 seconds", "Explain your best project architecture"]
  };
  const data = await generateAiJson(aiSystem, `Create interview prep for ${company}`, fallback);
  await saveReport(req.user._id, "interview", `${company} Interview Prep`, data);
  res.json({ data });
});

export const companyInsights = asyncHandler(async (req, res) => {
  const company = req.body.company || "TCS";
  const fallback = {
    company,
    hiringProcess: ["Aptitude", "Technical interview", "HR round"],
    salary: "₹3.5 LPA - ₹18 LPA depending on role",
    workCulture: "Process-driven with structured growth paths",
    crackTips: ["Practice aptitude daily", "Prepare two strong projects", "Revise CS fundamentals"]
  };
  const data = await generateAiJson(aiSystem, `Give company insights for ${company}`, fallback);
  await saveReport(req.user._id, "company", `${company} Insights`, data);
  res.json({ data });
});

export const skillGap = asyncHandler(async (req, res) => {
  const fallback = {
    missingSkills: ["TypeScript", "System design", "Docker", "Cloud deployment"],
    recommendedCourses: ["Full Stack Web Development", "Cloud Foundations", "Interview Prep"],
    projects: ["Job portal", "AI resume analyzer", "Cloud-deployed portfolio"],
    thirtyDayPlan: ["Refresh JS", "Build React components", "Ship one API"],
    ninetyDayPlan: ["Complete full-stack app", "Deploy", "Practice interviews", "Apply weekly"]
  };
  const data = await generateAiJson(aiSystem, `Find skill gaps from ${JSON.stringify(req.body)}`, fallback);
  await saveReport(req.user._id, "skill-gap", "Skill Gap Finder", data);
  res.json({ data });
});

export const mentorChat = asyncHandler(async (req, res) => {
  const fallback = { answer: "Start with your target role, compare required skills, build one portfolio project, then practice interview stories weekly." };
  const data = await generateAiJson(aiSystem, `Answer as AI mentor: ${req.body.message}`, fallback);
  res.json({ data });
});

async function saveReport(userId, type, title, data) {
  if (isLocalMode()) {
    return saveLocalReport({ userId, type, title, data });
  }

  return Report.create({ userId, type, title, data });
}
