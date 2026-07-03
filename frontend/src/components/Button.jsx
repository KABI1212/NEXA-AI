export default function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "blue-gradient text-white shadow-lg",
    ghost: "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15",
    light: "bg-white text-navy shadow-lg hover:bg-primary-light",
    dark: "bg-navy text-white hover:bg-navy-light",
    outline: "bg-transparent text-primary ring-1 ring-primary/30 hover:bg-primary-light"
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
