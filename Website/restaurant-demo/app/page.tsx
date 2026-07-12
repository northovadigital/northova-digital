import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--cream)] px-6">
      <Container>
  <div className="flex min-h-screen flex-col items-center justify-center gap-6">
    <h1 className="text-5xl font-bold text-[var(--primary)]">
      Bella Vista
    </h1>

    <div className="flex gap-4">
      <Button>Reserve Table</Button>

      <Button variant="secondary">
        View Menu
      </Button>
    </div>
  </div>
</Container>
      
    </main>
  );
}
