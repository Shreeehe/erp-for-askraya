export function ActivityFeed({ items }: { items: { id: string; note: string; created_at: string }[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-lg border bg-white p-3 text-sm">
          <p>{item.note}</p>
          <p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleString('en-IN')}</p>
        </li>
      ))}
    </ul>
  );
}
