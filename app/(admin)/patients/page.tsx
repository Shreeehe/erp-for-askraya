import { PageHeader } from '@/components/page-header';

export default function PatientsPage() {
  return (
    <section className="space-y-4">
      <PageHeader title="Patients" />
      <div className="rounded-lg border bg-white p-4">Patient table with filters and CSV export.</div>
    </section>
  );
}
