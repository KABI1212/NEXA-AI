export default function Card({ children, className = "" }) {
  return <div className={`rounded-lg border border-slate-200 bg-white p-5 text-slate-900 shadow-sm ${className}`}>{children}</div>;
}
