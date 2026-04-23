'use client';

export default function Error({ reset }: { reset: () => void }) {
  return <div className="rounded-lg border bg-white p-6 text-center"><h2 className="mb-2 text-lg font-semibold text-[#052044]">Something went wrong</h2><p className="mb-4 text-sm text-slate-600">Please try again.</p><button className="rounded-md bg-[#052044] px-3 py-2 text-white" onClick={reset}>Retry</button></div>;
}
