import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function downloadCertificatePdf(element, courseName = "Certificate") {
  if (!element) return;
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF("landscape", "pt", "a4");
  pdf.addImage(img, "PNG", 0, 0, 842, 595);
  pdf.save(`NEXA-AI-Certificate-${courseName.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-")}.pdf`);
}
