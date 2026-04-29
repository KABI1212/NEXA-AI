import { useState } from "react";
import logoSrc from "../../assets/nexa-logo.png";

export default function Logo({ className = "", markOnly = false, light = false }) {
  const [failed, setFailed] = useState(false);
  if (!failed) {
    return (
      <img
        src={logoSrc}
        alt="Nexa AI"
        className={`object-contain ${className || "h-12 w-auto"}`}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="grid h-10 w-10 place-items-center rounded-md blue-gradient font-black italic text-white">N</div>
      {!markOnly && (
        <div className={light ? "text-white" : "text-ink"}>
          <div className="font-display text-xl font-black leading-none">Nexa AI</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-royal">Next Step fo the Future</div>
        </div>
      )}
    </div>
  );
}
