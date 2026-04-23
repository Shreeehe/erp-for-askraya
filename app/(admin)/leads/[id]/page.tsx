import { ActivityFeed } from '@/components/activity-feed';

export default function LeadDetailPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-primary">Lead Detail</h1>
      <button className="rounded-md bg-success px-3 py-2 text-white">Convert to Patient</button>
      <ActivityFeed items={[{ id: '1', note: 'Initial call completed', created_at: new Date().toISOString() }]} />
    </section>
  );
}
