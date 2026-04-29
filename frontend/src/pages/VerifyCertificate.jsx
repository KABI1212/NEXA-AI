import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import Logo from "../components/Logo.jsx";
import { api } from "../services/api.js";

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
  return <div className="grid min-h-screen place-items-center bg-navy px-4">
    <Card className="w-full max-w-xl">
      <Logo className="mx-auto mb-5 h-16 w-auto" />
      <h1 className="text-center font-display text-3xl font-black">Certificate Verification</h1>
      <div className="mt-5 flex gap-2"><input className="min-h-11 flex-1 rounded-md border px-3" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter Certificate ID" /><Button onClick={() => verify()}>Verify</Button></div>
      {result && <div className={`mt-5 rounded-md p-4 ${result.valid ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
        <b>{result.valid ? "Valid / Verified" : "Not verified"}</b>
        {result.certificate && <div className="mt-3 grid gap-1 text-sm"><span>Name: {result.certificate.studentName}</span><span>Course: {result.certificate.courseName}</span><span>Date: {new Date(result.certificate.issueDate).toLocaleDateString()}</span><span>Issued by Nexa AI</span></div>}
      </div>}
    </Card>
  </div>;
}
