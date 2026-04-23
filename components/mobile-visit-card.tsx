export function MobileVisitCard({ patient, address, time }: { patient: string; address: string; time: string }) {
  return (
    <article className="rounded-lg border bg-white p-4">
      <p className="font-medium">{patient}</p>
      <p className="text-xs text-slate-600">{address}</p>
      <p className="mt-2 text-sm text-primary">{time}</p>
    </article>
  );
}
