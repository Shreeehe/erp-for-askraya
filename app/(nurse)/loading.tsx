export default function Loading() {
  return <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200" />)}</div>;
}
