import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import CertificateDesign from "../components/CertificateDesign.jsx";
import Logo from "../components/Logo.jsx";
import { api } from "../services/api.js";

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [id, setId] = useState(certificateId || "");
  const [result, setResult] = useState(null);

  async function verify(value = id) {
    if (!value) return;
    const { data } = await api.get(`/certificates/verify/${value}`).catch((e) => ({ data: e.response?.data || { valid: false } }));
    setResult(data);
  }

  useEffect(() => { if (certificateId) verify(certificateId); }, [certificateId]);

  return (
    <div className="min-h-screen bg-navy px-4 py-10">
      <div className="mx-auto grid max-w-7xl gap-5">
        <Card className="bg-white">
          <Logo className="mx-auto mb-5 h-10 w-auto" />
          <h1 className="text-center text-3xl font-black">Certificate Verification</h1>
          <div className="mx-auto mt-5 flex max-w-xl gap-2">
            <input className="min-h-11 flex-1 rounded-md border px-3" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter Certificate ID" />
            <Button onClick={() => verify()}>Verify</Button>
          </div>
          {result && (
            <div className={`mx-auto mt-5 max-w-xl rounded-md p-4 ${result.valid ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              <b>{result.valid ? "✓ This certificate is valid" : "✗ Certificate not found or revoked"}</b>
              {result.certificate && (
                <div className="mt-3 grid gap-1 text-sm">
                  <span>Student: {result.certificate.studentName}</span>
                  <span>Course: {result.certificate.courseName}</span>
                  <span>Date: {formatDate(result.certificate.completionDate || result.certificate.createdAt || result.certificate.issueDate)}</span>
                  <span>Score: {result.certificate.score}%</span>
                </div>
              )}
            </div>
          )}
        </Card>

        {result?.valid && result.certificate && (
          <div className="overflow-auto rounded-md bg-white p-4">
            <CertificateDesign
              studentName={result.certificate.studentName}
              courseName={result.certificate.courseName}
              certificateId={result.certificate.certificateId}
              completionDate={result.certificate.completionDate || result.certificate.createdAt || result.certificate.issueDate}
              score={result.certificate.score}
              instructorName={result.certificate.instructorName}
              qrUrl={result.certificate.qrUrl}
            />
          </div>
        )}
      </div>
    </div>
  );
}
