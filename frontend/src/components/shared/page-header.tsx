import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: ReactNode; description: string; actions?: ReactNode }) {
  return <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">{eyebrow}</p><h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-[2rem]">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{description}</p></div>{actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}</header>;
}
