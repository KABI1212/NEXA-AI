import { useEffect, useState } from "react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import { api } from "../../services/api.js";

export default function Reports() {
  const [reports, setReports] = useState([]);
  useEffect(() => { api.get("/reports").then((r) => setReports(r.data.reports)); }, []);
  function exportJson() {
    const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "nexa-ai-reports.json";
    a.click();
  }
  return <div>
    <div className="flex items-center justify-between"><h2 className="font-display text-3xl font-black">Reports</h2><Button onClick={exportJson}>Export</Button></div>
    <div className="mt-5 grid gap-3">
      {reports.map((report) => <Card key={report._id} className="bg-white/95"><div className="flex justify-between"><b>{report.title}</b><span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-black uppercase text-royal">{report.type}</span></div><pre className="mt-3 whitespace-pre-wrap text-xs">{JSON.stringify(report.data, null, 2)}</pre></Card>)}
      {!reports.length && <Card className="bg-white/95">AI reports will appear here after you use the tools.</Card>}
    </div>
  </div>;
}
