import { CalendarDays, Trophy } from "lucide-react";
import logo from "../../assets/nexa-logo.png";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix} ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

export default function CertificateDesign({
  studentName,
  courseName,
  certificateId,
  completionDate,
  score,
  instructorName,
  qrUrl
}) {
  const navy = "#07152f";
  const gold = "#d4a017";
  const text = "#111827";
  const date = formatDate(completionDate);

  const corner = (position) => ({
    position: "absolute",
    width: 160,
    height: 160,
    borderColor: navy,
    borderStyle: "solid",
    ...position
  });

  return (
    <div style={{ width: 1122, height: 794, background: "#ffffff", color: text, position: "relative", overflow: "hidden", fontFamily: '"Times New Roman", Times, serif', padding: 42 }}>
      <div style={corner({ top: 24, left: 24, borderWidth: "16px 0 0 16px" })} />
      <div style={corner({ top: 24, right: 24, borderWidth: "16px 16px 0 0" })} />
      <div style={corner({ bottom: 24, left: 24, borderWidth: "0 0 16px 16px" })} />
      <div style={corner({ bottom: 24, right: 24, borderWidth: "0 16px 16px 0" })} />
      <div style={{ position: "absolute", top: 42, left: -8, width: 220, height: 5, background: gold, transform: "rotate(-45deg)" }} />
      <div style={{ position: "absolute", top: 42, right: -8, width: 220, height: 5, background: gold, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", bottom: 42, left: -8, width: 220, height: 5, background: gold, transform: "rotate(45deg)" }} />
      <div style={{ position: "absolute", bottom: 42, right: -8, width: 220, height: 5, background: gold, transform: "rotate(-45deg)" }} />

      <div style={{ position: "absolute", top: 60, left: 76, width: 138, height: 138, borderRadius: "50%", background: gold, color: navy, display: "grid", placeItems: "center", textAlign: "center", border: `6px double ${navy}`, fontWeight: 800, fontSize: 15, lineHeight: 1.15 }}>
        <div>
          <div style={{ fontSize: 20 }}>★ ★ ★</div>
          CERTIFICATE<br />OF<br />COMPLETION
          <div style={{ fontSize: 20 }}>★ ★ ★</div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <img src={logo} alt="Nexa AI" style={{ height: 78, width: "auto", objectFit: "contain", margin: "0 auto" }} />
        <div style={{ marginTop: 4, color: gold, letterSpacing: 3, fontWeight: 700 }}>— NEXT STEP TO THE FUTURE —</div>
      </div>
      <div style={{ position: "absolute", top: 82, right: 76, color: navy, fontSize: 18, fontWeight: 700 }}>Certificate ID: {certificateId}</div>

      <main style={{ textAlign: "center", marginTop: 36 }}>
        <h1 style={{ margin: 0, color: navy, fontSize: 56, fontWeight: 900, letterSpacing: 3 }}>CERTIFICATE</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, color: gold, fontWeight: 800, letterSpacing: 3, marginTop: 4 }}>
          <span style={{ width: 150, height: 2, background: gold }} />
          <span>— OF COMPLETION —</span>
          <span style={{ width: 150, height: 2, background: gold }} />
        </div>
        <p style={{ margin: "30px 0 0", fontSize: 24 }}>This is to certify that</p>
        <div style={{ marginTop: 10, color: navy, fontSize: 48, fontStyle: "italic", fontWeight: 900 }}>{studentName}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "16px auto 12px" }}>
          <span style={{ width: 260, height: 2, background: gold }} />
          <span style={{ width: 12, height: 12, background: gold, transform: "rotate(45deg)" }} />
          <span style={{ width: 260, height: 2, background: gold }} />
        </div>
        <p style={{ margin: 0, fontSize: 23 }}>has successfully completed the course</p>
        <div style={{ marginTop: 10, color: navy, fontSize: 22, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1 }}>{courseName}</div>
        <div style={{ margin: "18px auto", width: 420, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
        <p style={{ margin: 0, fontSize: 21 }}>and has achieved all the requirements and standards set by Nexa AI.</p>
      </main>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, width: 510, margin: "28px auto 0" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", borderTop: `2px solid ${gold}`, paddingTop: 10 }}>
          <CalendarDays color={gold} size={32} />
          <div><div style={{ color: navy, fontWeight: 800 }}>Date of Completion</div><div>{date}</div></div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", borderTop: `2px solid ${gold}`, paddingTop: 10 }}>
          <Trophy color={gold} size={32} />
          <div><div style={{ color: navy, fontWeight: 800 }}>Score Achieved</div><div>{score}%</div></div>
        </div>
      </section>

      <footer style={{ position: "absolute", left: 76, right: 76, bottom: 54, display: "grid", gridTemplateColumns: "230px 1fr 220px 142px", alignItems: "end", gap: 22 }}>
        <div style={{ borderTop: `2px solid ${gold}`, paddingTop: 9, textAlign: "center", color: navy, fontWeight: 800 }}>
          {instructorName}
          <div style={{ color: text, fontWeight: 400 }}>Course Instructor</div>
        </div>
        <div style={{ justifySelf: "center", width: 112, height: 112, borderRadius: "50%", background: gold, color: navy, display: "grid", placeItems: "center", textAlign: "center", border: `6px double ${navy}`, fontWeight: 900 }}>
          <div>★<br />NEXA AI<br />★</div>
        </div>
        <div style={{ borderTop: `2px solid ${gold}`, paddingTop: 4, textAlign: "center" }}>
          <div style={{ color: navy, fontFamily: '"Brush Script MT", "Times New Roman", cursive', fontSize: 34 }}>Kabilesh</div>
          <div style={{ color: navy, fontWeight: 800 }}>Kabilesh</div>
          <div>CEO, Nexa AI</div>
        </div>
        <div style={{ textAlign: "center" }}>
          {qrUrl && <img src={qrUrl} alt="Certificate QR code" style={{ width: 112, height: 112, objectFit: "contain", border: `3px solid ${gold}`, padding: 4, background: "#ffffff", margin: "0 auto" }} />}
          <div style={{ color: navy, fontWeight: 900, fontSize: 12, marginTop: 5 }}>SCAN TO VERIFY</div>
          <div style={{ fontSize: 10 }}>Verify this certificate at www.nexa.ai/verify</div>
        </div>
      </footer>
    </div>
  );
}
