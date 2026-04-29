export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "blue-gradient text-white shadow-glow",
    ghost: "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15",
    light: "bg-white text-ink shadow-lg hover:bg-blue-50",
    dark: "bg-navy text-white hover:bg-ink",
    outline: "bg-transparent text-royal ring-1 ring-royal/30 hover:bg-blue-50"
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
