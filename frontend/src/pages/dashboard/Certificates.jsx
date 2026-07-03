import { useEffect, useRef, useState } from "react";
import { Award, CalendarDays, Download, Trophy, User } from "lucide-react";
import Card from "../../components/Card.jsx";
import Button from "../../components/Button.jsx";
import CertificateDesign from "../../components/CertificateDesign.jsx";
import { api } from "../../services/api.js";
import { downloadCertificatePdf } from "../../utils/certificatePdf.js";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix} ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [selected, setSelected] = useState(null);
  const certRef = useRef(null);

  useEffect(() => {
    api.get("/certificates/mine").then((r) => setCertificates(r.data.certificates || []));
  }, []);

  async function download(cert) {
    setSelected(cert);
    window.setTimeout(() => downloadCertificatePdf(certRef.current, cert.courseName), 100);
  }

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="text-3xl font-black">Certificates</h2>
        <p className="mt-1 text-blue-100">All earned certificates are ready for PDF download.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((cert) => (
          <Card key={cert._id || cert.certificateId} className="bg-white/95">
            <div className="mb-4 flex items-start justify-between gap-3">
              <Award className="text-gold" size={34} />
              <span className="rounded-md bg-primary-light px-2 py-1 text-xs font-black text-primary">{cert.certificateId}</span>
            </div>
            <h3 className="text-xl font-black text-navy">{cert.courseName}</h3>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <span className="flex items-center gap-2"><User size={16} /> {cert.studentName}</span>
              <span className="flex items-center gap-2"><CalendarDays size={16} /> {formatDate(cert.createdAt || cert.completionDate || cert.issueDate)}</span>
              <span className="flex items-center gap-2"><Trophy size={16} /> {cert.score}%</span>
            </div>
            <Button className="mt-5 w-full" onClick={() => download(cert)}><Download size={16} /> Download</Button>
          </Card>
        ))}
        {!certificates.length && <Card className="bg-white/95 md:col-span-2 xl:col-span-3">No certificates earned yet.</Card>}
      </div>

      <div className="fixed -left-[9999px] top-0">
        <div ref={certRef}>
          {selected && (
            <CertificateDesign
              studentName={selected.studentName}
              courseName={selected.courseName}
              certificateId={selected.certificateId}
              completionDate={selected.createdAt || selected.completionDate || selected.issueDate}
              score={selected.score}
              instructorName={selected.instructorName}
              qrUrl={selected.qrUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}
