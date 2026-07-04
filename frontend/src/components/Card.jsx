export default function Card({ className = "", children, hover = true, ...props }) {
  const base = "bg-white rounded-xl p-5 border border-slate-100 shadow-sm";
  const hoverClass = hover ? "hover:shadow-md hover:border-primary/20 transition-all duration-300" : "";
  return (
    <div className={`${base} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}