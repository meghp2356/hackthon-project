"use client";

export default function WorkspaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="rounded-xl border bg-card p-9 text-center shadow-soft"><h1 className="font-display text-xl font-extrabold">This page needs a moment.</h1><p className="mt-2 text-sm text-muted-foreground">Please try loading it again.</p><button onClick={reset} className="mt-5 h-10 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground">Try again</button></section>; }
