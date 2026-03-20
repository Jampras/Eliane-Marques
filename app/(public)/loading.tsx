import { Container } from '@/components/ui/Container';

export default function PublicLoading() {
  return (
    <div className="bg-[color:var(--aveia)] pt-20 lg:pt-24">
      <section className="py-12 lg:py-16">
        <Container>
          <div className="mx-auto max-w-6xl animate-pulse space-y-10">
            <div className="mx-auto h-7 w-40 border border-[color:var(--linho)] bg-[color:var(--manteiga)]" />
            <div className="mx-auto h-14 max-w-3xl bg-[color:var(--manteiga)]" />
            <div className="mx-auto h-5 max-w-2xl bg-[color:var(--theme-state-info-bg)]" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="border border-[color:var(--linho)] bg-[color:var(--manteiga)] p-6 shadow-[var(--theme-card-shadow)]"
                >
                  <div className="mb-5 h-44 border border-[color:var(--linho)] bg-[color:var(--aveia)]" />
                  <div className="mb-4 h-4 w-24 bg-[color:var(--theme-button-ghost-hover)]" />
                  <div className="mb-4 h-8 w-3/4 bg-[color:var(--aveia)]" />
                  <div className="mb-2 h-4 bg-[color:var(--theme-admin-login-panel-soft)]" />
                  <div className="mb-8 h-4 w-5/6 bg-[color:var(--theme-state-info-bg)]" />
                  <div className="h-10 w-32 border border-[color:var(--linho)] bg-[color:var(--aveia)]" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
