import { MobileVisitCard } from '@/components/mobile-visit-card';

export default function MyVisitsPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold text-primary">Today's Visits</h1>
      <MobileVisitCard patient="Ramesh Kumar" address="Indiranagar, Bangalore" time="10:30 AM" />
    </section>
  );
}
