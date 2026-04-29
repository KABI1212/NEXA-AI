import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CertificateDesign from "../../components/CertificateDesign.jsx";
import Button from "../../components/Button.jsx";
import { api } from "../../services/api.js";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [selected, setSelected] = useState(null);
  const certRef = useRef(null);
  useEffect(() => { api.get("/certificates/mine").then((r) => { setCertificates(r.data.certificates); setSelected(r.data.certificates[0]); }); }, []);
  async function downloadPdf() {
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", "a4");
    pdf.addImage(img, "PNG", 0, 0, 842, 595);
    pdf.save(`${selected?.certificateId || "nexa-certificate"}.pdf`);
  }
  const cert = selected || { certificateId: "NXA-2024-05128", studentName: "KABILESH", courseName: "Full Stack Web Development", instructorName: "Prof. Rahul Sharma", score: 92 };
  return <div className="grid gap-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-display text-3xl font-black">Certificates</h2>
      <div className="flex gap-2"><Button onClick={downloadPdf}>Download PDF</Button><a target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + "/verify/" + cert.certificateId)}`}><Button variant="light">Share LinkedIn</Button></a></div>
    </div>
    <div className="flex flex-wrap gap-2">{certificates.map((c) => <button className="rounded-md bg-white px-3 py-2 font-bold text-royal" onClick={() => setSelected(c)} key={c._id}>{c.courseName}</button>)}</div>
    <div ref={certRef}><CertificateDesign certificate={cert} /></div>
  </div>;
}
