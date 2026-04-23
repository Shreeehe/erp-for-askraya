export function DrawerForm({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <aside className="fixed right-0 top-0 h-screen w-full max-w-md border-l bg-white p-6 shadow-xl">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </aside>
  );
}
