'use client';

export default function Error({ reset }: { reset: () => void }) {
  return <div className="rounded-lg border bg-white p-4 text-center"><p className="mb-3">Unable to load this screen.</p><button className="rounded-md bg-[#052044] px-3 py-2 text-white" onClick={reset}>Retry</button></div>;
}
