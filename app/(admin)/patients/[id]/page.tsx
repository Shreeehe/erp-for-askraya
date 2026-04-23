export default function PatientDetailPage() {
  const tabs = ['Overview', 'Cases', 'Care Plan', 'Visits', 'Invoices', 'Documents'];
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">Patient Detail</h1>
      <div className="flex flex-wrap gap-2">{tabs.map((t) => <span key={t} className="rounded-full border px-3 py-1 text-sm">{t}</span>)}</div>
      <div className="rounded-lg border bg-white p-4">Tabbed patient content.</div>
    </section>
  );
}
