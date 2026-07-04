// @ts-nocheck
import { CalendarDays, Trophy, Award } from "lucide-react";

// @ts-ignore
function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return `${day}${suffix} ${date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
}

const templates = {
  blue: {
    bg: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 40%, #0F172A 100%)",
    border: "4px solid #2563EB",
    text: "#FFFFFF",
    accent: "#38BDF8",
    gold: "#D4A017",
    cardBg: "rgba(255,255,255,0.05)",
    sealBg: "linear-gradient(135deg, #2563EB, #38BDF8)",
    ribbon: "#2563EB",
  },
  dark: {
    bg: "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0A0A0A 100%)",
    border: "4px solid #14B8A6",
    text: "#E2E8F0",
    accent: "#14B8A6",
    gold: "#F59E0B",
    cardBg: "rgba(255,255,255,0.03)",
    sealBg: "linear-gradient(135deg, #14B8A6, #10B981)",
    ribbon: "#14B8A6",
  },
  gold: {
    bg: "linear-gradient(135deg, #1A1203 0%, #2D1F08 50%, #1A1203 100%)",
    border: "4px solid #D4A017",
    text: "#FFF8E7",
    accent: "#F59E0B",
    gold: "#FFD700",
    cardBg: "rgba(212,160,23,0.08)",
    sealBg: "linear-gradient(135deg, #D4A017, #FFD700)",
    ribbon: "#D4A017",
  },
  white: {
    bg: "#FFFFFF",
    border: "3px solid #0F172A",
    text: "#0F172A",
    accent: "#2563EB",
    gold: "#D4A017",
    cardBg: "#F8FAFC",
    sealBg: "linear-gradient(135deg, #0F172A, #1E40AF)",
    ribbon: "#0F172A",
  },
  glass: {
    bg: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 50%, rgba(15,23,42,0.95) 100%)",
    border: "2px solid rgba(56,189,248,0.4)",
    text: "#F1F5F9",
    accent: "#38BDF8",
    gold: "#D4A017",
    cardBg: "rgba(255,255,255,0.06)",
    sealBg: "linear-gradient(135deg, #2563EB, #14B8A6)",
    ribbon: "linear-gradient(90deg, #2563EB, #38BDF8, #14B8A6)",
  },
};

/* Ribbon component */
function Ribbon({ color, label }) {
  return (
    <div style={{
      position: "absolute", top: 30, right: -30,
      background: color || "#2563EB",
      color: "#FFFFFF", padding: "6px 40px",
      fontSize: 12, fontWeight: 700, letterSpacing: 2,
      transform: "rotate(45deg)",
      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
      zIndex: 10,
    }}>
      {label || "★ VERIFIED ★"}
    </div>
  );
}

export default function CertificateDesign({
  studentName = "Student Name",
  courseName = "Course Name",
  certificateId = "NEXA-000000",
  completionDate,
  score = 100,
  instructorName = "Instructor",
  qrUrl,
  template = "blue",
  ceoName = "Kabilesh",
}) {
  const t = templates[template] || templates.blue;
  const date = formatDate(completionDate);
  const isLight = template === "white";

  return (
    <div className="certificate-times" style={{
      width: 1122, height: 794,
      background: t.bg,
      color: t.text,
      position: "relative",
      overflow: "hidden",
      border: t.border,
      boxShadow: `0 20px 70px rgba(0,0,0,0.3)`,
      padding: 0,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Decorative corner patterns */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 100, height: 100, borderTop: `4px solid ${t.gold}`, borderLeft: `4px solid ${t.gold}`, opacity: 0.6 }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 100, height: 100, borderTop: `4px solid ${t.gold}`, borderRight: `4px solid ${t.gold}`, opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 100, height: 100, borderBottom: `4px solid ${t.gold}`, borderLeft: `4px solid ${t.gold}`, opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 100, height: 100, borderBottom: `4px solid ${t.gold}`, borderRight: `4px solid ${t.gold}`, opacity: 0.6 }} />

      {/* Ribbon */}
      <Ribbon color={t.ribbon} label="★ VERIFIED ★" />

      {/* Inner border */}
      <div style={{
        flex: 1,
        margin: 28,
        border: `2px solid ${t.gold}30`,
        borderRadius: 8,
        padding: "24px 40px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: t.cardBg,
      }}>
        {/* Top section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Gold Seal */}
          <div style={{
            width: 100, height: 100,
            borderRadius: "50%",
            background: t.sealBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `4px double ${t.gold}`,
            boxShadow: `0 0 20px ${t.gold}40`,
          }}>
            <div style={{ textAlign: "center", color: "#FFFFFF", lineHeight: 1.2 }}>
              <div style={{ fontSize: 16, fontWeight: 900 }}>★</div>
              <div style={{ fontSize: 10, fontWeight: 700 }}>NEXA</div>
              <div style={{ fontSize: 10, fontWeight: 700 }}>AI</div>
              <div style={{ fontSize: 16, fontWeight: 900 }}>★</div>
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: 4, color: t.accent, marginBottom: 4 }}>
              — NEXT STEP FOR THE FUTURE —
            </div>
            <h1 style={{
              margin: 0,
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: 6,
              color: t.gold,
              fontFamily: "'Times New Roman', Times, serif",
            }}>
              CERTIFICATE
            </h1>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
              marginTop: 4,
            }}>
              <span style={{ width: 100, height: 2, background: t.gold, opacity: 0.5 }} />
              <span style={{ color: t.accent, fontSize: 14, fontWeight: 600, letterSpacing: 3 }}>OF COMPLETION</span>
              <span style={{ width: 100, height: 2, background: t.gold, opacity: 0.5 }} />
            </div>
          </div>

          {/* Certificate ID */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.accent, letterSpacing: 1 }}>Certificate ID</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.gold }}>{certificateId}</div>
          </div>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 18, color: t.text, opacity: 0.8, margin: 0 }}>This is to certify that</p>

          {/* Student Name */}
          <div style={{
            fontSize: 42,
            fontWeight: 900,
            color: t.gold,
            fontStyle: "italic",
            margin: "12px 0",
            textShadow: `0 2px 4px rgba(0,0,0,0.1)`,
            letterSpacing: 1,
          }}>
            {studentName}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0" }}>
            <span style={{ width: 80, height: 1, background: t.gold, opacity: 0.4 }} />
            <span style={{ width: 8, height: 8, background: t.gold, transform: "rotate(45deg)", opacity: 0.6 }} />
            <span style={{ width: 80, height: 1, background: t.gold, opacity: 0.4 }} />
          </div>

          <p style={{ fontSize: 16, color: t.text, opacity: 0.8, margin: "4px 0" }}>has successfully completed the course</p>

          <div style={{
            fontSize: 24,
            fontWeight: 900,
            color: t.accent,
            textTransform: "uppercase",
            letterSpacing: 2,
            margin: "8px 0",
            padding: "8px 24px",
            border: `1px solid ${t.accent}30`,
            borderRadius: 4,
          }}>
            {courseName}
          </div>

          <p style={{ fontSize: 14, color: t.text, opacity: 0.7, margin: "12px 0 0" }}>
            and has achieved all the requirements and standards set by Nexa AI.
          </p>

          {/* Score bar */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <Trophy size={24} color={t.gold} />
            <div style={{ width: 200, height: 6, background: `${t.gold}20`, borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${score}%`, height: "100%", background: t.gold, borderRadius: 3 }} />
            </div>
            <span style={{ fontWeight: 700, color: t.gold, fontSize: 16 }}>{score}%</span>
          </div>
        </div>

        {/* Bottom section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr 200px 120px",
          gap: 16,
          alignItems: "end",
          borderTop: `1px solid ${t.gold}30`,
          paddingTop: 16,
          marginTop: 8,
        }}>
          {/* Instructor */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              borderTop: `2px solid ${t.gold}`,
              paddingTop: 8,
              fontSize: 14,
              fontWeight: 700,
              color: t.accent,
            }}>
              {instructorName}
            </div>
            <div style={{ fontSize: 11, color: t.text, opacity: 0.6, marginTop: 2 }}>Course Instructor</div>
          </div>

          {/* Dates */}
          <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <CalendarDays size={18} color={t.gold} style={{ margin: "0 auto 4px" }} />
              <div style={{ fontSize: 10, fontWeight: 600, color: t.accent }}>ISSUE DATE</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{date}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <Award size={18} color={t.gold} style={{ margin: "0 auto 4px" }} />
              <div style={{ fontSize: 10, fontWeight: 600, color: t.accent }}>COMPLETION</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{date}</div>
            </div>
          </div>

          {/* CEO Signature */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 28,
              fontFamily: "'Brush Script MT', 'Times New Roman', cursive",
              color: t.gold,
              borderTop: `2px solid ${t.gold}`,
              paddingTop: 8,
              lineHeight: 1,
            }}>
              {ceoName}
            </div>
            <div style={{ fontSize: 11, color: t.text, opacity: 0.6, marginTop: 2 }}>CEO, Nexa AI</div>
          </div>

          {/* QR Code */}
          <div style={{ textAlign: "center" }}>
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="Verify Certificate"
                style={{
                  width: 90, height: 90,
                  border: `2px solid ${t.gold}`,
                  borderRadius: 4,
                  padding: 4,
                  background: "#FFFFFF",
                }}
              />
            ) : (
              <div style={{
                width: 90, height: 90,
                border: `2px dashed ${t.gold}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 9,
                color: t.gold,
                background: `${t.gold}10`,
              }}>
                QR CODE
              </div>
            )}
            <div style={{ fontSize: 9, fontWeight: 700, color: t.accent, marginTop: 4, letterSpacing: 1 }}>
              SCAN TO VERIFY
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}