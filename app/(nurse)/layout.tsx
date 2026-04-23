import Link from 'next/link';

export default function NurseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-50">
      <main className="flex-1 p-4">{children}</main>
      <nav className="grid grid-cols-3 border-t bg-white p-2 text-center text-sm">
        <Link href="/my-visits">My Visits</Link>
        <Link href="/my-visits">Check In</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    </div>
  );
}
