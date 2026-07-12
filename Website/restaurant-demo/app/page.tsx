export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6">
      <div className="text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
          Northova Digital
        </p>

        <h1 className="text-5xl font-bold text-[var(--primary)] md:text-7xl">
          Bella Vista
        </h1>

        <p className="mt-4 text-lg text-[var(--muted)]">
          Authentic Italian dining in Houston.
        </p>
      </div>
    </main>
  );
}
