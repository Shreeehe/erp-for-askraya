export function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <article className="rounded-lg border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
    </article>
  );
}
