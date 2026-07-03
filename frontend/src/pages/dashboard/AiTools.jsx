import { useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import FormField from "../../components/FormField.jsx";
import { api, apiError } from "../../services/api.js";

const config = {
  career: ["AI Career Explorer", "/ai/career-explorer", "Skills, degree, interests"],
  resume: ["Resume Analyzer", "/ai/resume-analyzer", "Paste resume text"],
  interview: ["Interview Prep", "/ai/interview-prep", "Company name"],
  company: ["Company Insights", "/ai/company-insights", "Company name"],
  skill: ["Skill Gap Finder", "/ai/skill-gap", "Current skills and target role"],
  mentor: ["AI Mentor Chat", "/ai/mentor-chat", "Ask anything"]
};

export default function AiTools({ tool }) {
  const [title, endpoint, placeholder] = config[tool];
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  async function run() {
    setError("");
    try {
      const payload = tool === "resume" ? { resumeText: input } : tool === "mentor" ? { message: input } : { query: input, company: input };
      const res = await api.post(endpoint, payload);
      setData(res.data.data);
    } catch (err) {
      setError(apiError(err));
    }
  }
  return <div className="grid gap-5">
    <Card className="bg-white/95">
      <h2 className="text-3xl font-black">{title}</h2>
      <FormField label={placeholder} textarea rows="5" value={input} onChange={(e) => setInput(e.target.value)} />
      <Button className="mt-4" onClick={run}>Generate</Button>
      {error && <p className="mt-3 font-semibold text-red-600">{error}</p>}
    </Card>
    {data && <Card className="bg-white/95"><pre className="whitespace-pre-wrap text-sm">{JSON.stringify(data, null, 2)}</pre></Card>}
  </div>;
}
