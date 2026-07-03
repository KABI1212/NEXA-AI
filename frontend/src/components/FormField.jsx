export default function FormField({ label, textarea = false, ...props }) {
  const Input = textarea ? "textarea" : "input";
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <Input
        className="min-h-11 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary/20 transition focus:border-primary focus:ring-4"
        {...props}
      />
    </label>
  );
}
