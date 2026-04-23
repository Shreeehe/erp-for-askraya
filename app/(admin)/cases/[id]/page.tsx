import { ActivityFeed } from '@/components/activity-feed';

export default function CaseDetailPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">Case Detail</h1>
      <textarea className="w-full rounded-md border p-2"="Resolution notes" />
      <ActivityFeed items={[{ id: 'n1', note: 'Case note added', created_at: new Date().toISOString() }]} />
    </section>
  );
}
