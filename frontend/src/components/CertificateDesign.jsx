import { QRCodeSVG } from "qrcode.react";
import Logo from "./Logo.jsx";

export default function CertificateDesign({ certificate }) {
  const c = certificate || {};
  const verifyUrl = `${import.meta.env.VITE_APP_URL || window.location.origin}/verify/${c.certificateId || "NXA-2024-05128"}`;
  const date = c.issueDate ? new Date(c.issueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "25th April, 2024";

  return (
    <div className="certificate mx-auto">
      <div className="relative z-10 flex h-full flex-col items-center px-[7%] py-[4%] text-center">
        <div className="absolute left-[6%] top-[13%] grid h-[22%] w-[13%] place-items-center rounded-full border-[10px] border-gold bg-navy text-gold shadow-xl">
          <div className="text-[clamp(10px,1.4vw,18px)] font-bold uppercase leading-tight">Certificate<br />of<br />Completion</div>
        </div>
        <div className="absolute right-[7%] top-[9%] text-[clamp(10px,1.5vw,18px)]">Certificate ID: {c.certificateId || "NXA-2024-05128"}</div>
        <Logo className="h-[13%] w-auto" />
        <h1 className="mt-[2%] text-[clamp(34px,6vw,72px)] font-bold tracking-[0.18em] text-navy">CERTIFICATE</h1>
        <div className="gold-line w-[48%]" />
        <h2 className="mt-[1%] text-[clamp(18px,2.4vw,34px)] font-bold tracking-wider text-navy">OF COMPLETION</h2>
        <p className="mt-[1.5%] text-[clamp(14px,1.7vw,24px)]">This is to certify that</p>
        <div className="mt-[1.5%] w-[54%] border-b border-gold pb-1 text-[clamp(36px,6vw,72px)] font-semibold italic tracking-[0.12em] text-black">
          {c.studentName || "KABILESH"}
        </div>
        <p className="mt-[2%] text-[clamp(14px,1.7vw,24px)]">has successfully completed the course</p>
        <div className="mt-1 text-[clamp(22px,3.2vw,42px)] font-bold uppercase tracking-wide text-[#123b7f]">{c.courseName || "Full Stack Web Development"}</div>
        <div className="gold-line mt-[1.5%] w-[34%]" />
        <p className="mt-[2%] max-w-[56%] text-[clamp(13px,1.5vw,22px)]">and has achieved all the requirements and standards set by <b>Nexa AI.</b></p>
        <div className="mt-[2%] grid w-[48%] grid-cols-2 gap-5 text-left text-[clamp(12px,1.4vw,18px)]">
          <div><b>Date of Completion</b><br />{date}</div>
          <div><b>Score Achieved</b><br />{c.score || 92}%</div>
        </div>
        <div className="absolute bottom-[8%] left-[20%] w-[18%] border-t border-gold pt-2 text-[clamp(12px,1.4vw,20px)]">
          {c.instructorName || "Prof. Rahul Sharma"}<br /><span className="text-[0.85em]">Course Instructor</span>
        </div>
        <div className="absolute bottom-[8%] right-[22%] w-[16%] border-t border-gold pt-2 text-[clamp(12px,1.4vw,20px)]">
          <span className="font-[cursive] text-[#1f4fa3]">Kabilesh</span><br />Kabilesh<br /><span className="text-[0.85em]">CEO, Nexa AI</span>
        </div>
        <div className="absolute bottom-[7%] left-1/2 grid h-[13%] w-[11%] -translate-x-1/2 place-items-center rounded-full border-[8px] border-gold bg-navy text-gold">
          <b>NEXA AI</b>
        </div>
        <div className="absolute bottom-[17%] right-[8%] grid gap-2 text-center">
          {c.qrUrl ? <img src={c.qrUrl} alt="QR verify code" className="h-[130px] w-[130px] border-4 border-gold bg-white p-1" /> : <QRCodeSVG value={verifyUrl} size={130} className="border-4 border-gold bg-white p-1" />}
          <b className="text-[#123b7f]">SCAN TO VERIFY</b>
          <span className="text-sm">Verify at /verify</span>
        </div>
      </div>
    </div>
  );
}
