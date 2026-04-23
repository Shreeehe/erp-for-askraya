export default function NurseVisitDetailPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-primary">Visit Detail</h1>
      <button className="w-full rounded-md bg-primary p-2 text-white">Check In</button>
      <div className="grid grid-cols-2 gap-2">
        <input className="rounded-md border p-2"="BP" />
        <input className="rounded-md border p-2"="Pulse" />
        <input className="rounded-md border p-2"="Temperature" />
        <input className="rounded-md border p-2"="SpO2" />
      </div>
      <button className="w-full rounded-md bg-success p-2 text-white">Check Out</button>
    </section>
  );
}
