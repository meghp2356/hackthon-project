import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

const labels: Record<string, { title: string; description: string; milestone: string }> = {
  trips: { title: "Your journeys are next.", description: "Trip creation, itinerary building, discovery, budgets, and calendar planning will arrive together in the next product milestone.", milestone: "Milestone 2" },
  calendar: { title: "Your travel calendar is next.", description: "A responsive month view driven by your trips is planned for the core planning milestone.", milestone: "Milestone 2" },
  community: { title: "Travel inspiration is next.", description: "The community feed, saved ideas, and sharing tools are planned for the finishing milestone.", milestone: "Milestone 3" },
  profile: { title: "Your profile is next.", description: "Profile editing, travel preferences, and image preview are planned for the finishing milestone.", milestone: "Milestone 3" },
};

export default async function PlannedRoutePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const section = labels[slug[0]] ?? { title: "This journey is being mapped.", description: "This route is planned in the GlobeTrotter roadmap and will be completed in a later milestone.", milestone: "Coming soon" };
  return <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center"><span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary"><Compass className="size-6" /></span><p className="eyebrow mt-6">{section.milestone}</p><h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em]">{section.title}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{section.description}</p><Link href="/dashboard" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">Back to overview <ArrowRight className="size-4" /></Link></section>;
}
