export function POSLayout() {
  return (
    <main className="fixed inset-0 flex flex-col items-center gap-6 overflow-y-auto bg-background p-6">
      <section className="h-[320px] w-full max-w-[1200px] rounded-lg border border-border bg-muted" />
      <section className="h-[320px] w-full max-w-[1200px] rounded-lg border border-border bg-background" />
    </main>
  )
}
