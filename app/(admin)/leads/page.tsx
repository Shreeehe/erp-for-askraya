import { PageHeader } from '@/components/page-header';

const statuses = ['new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost'];

export default function LeadsPage() {
  return (
    <section>
      <PageHeader title="Leads Pipeline" action={<button className="rounded-md bg-primary px-3 py-2 text-white">New Lead</button>} />
      <div className="grid gap-4 md:grid-cols-6">
        {statuses.map((status) => (
          <div key={status} className="rounded-lg border bg-white p-3">
            <h3 className="mb-2 text-sm font-semibold uppercase">{status}</h3>
            <p className="rounded-md bg-slate-50 p-2 text-sm">Drag lead cards here</p>
          </div>
        ))}
      </div>
    </section>
  );
}
