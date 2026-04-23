export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#052044] p-4">
      <section className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <header className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">Aksraya Health Care</p>
          <h1 className="text-2xl font-semibold text-[#052044]">ERP Portal</h1>
        </header>
        {children}
      </section>
    </main>
  );
}
