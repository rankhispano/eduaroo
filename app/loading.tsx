export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 h-64 animate-pulse rounded-3xl bg-white shadow-sm" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-44 animate-pulse rounded-2xl bg-white shadow-sm" />
          ))}
        </div>
      </div>
    </main>
  );
}
