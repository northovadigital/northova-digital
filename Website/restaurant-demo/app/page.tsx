import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main
        id="home"
        className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6"
      >
        <Container>
          <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-5xl font-bold text-[var(--primary)]">
              Bella Vista
            </h1>

            <p className="text-lg text-[var(--muted)]">
              Authentic Italian dining in Houston.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button>Reserve Table</Button>
              <Button variant="secondary">View Menu</Button>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}