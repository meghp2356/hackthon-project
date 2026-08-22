import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { Trip } from "@/types/travel";
import { cn, formatCurrency } from "@/lib/utils";

const statusLabels = { ongoing: "In progress", upcoming: "Upcoming", completed: "Completed" } as const;

export function TripCard({ trip, className }: { trip: Trip; className?: string }) {
  const route = trip.stops.map((stop) => stop.city).join(" · ");
  const percentage = Math.min(Math.round((trip.estimatedCost / trip.budget) * 100), 100);
  return <Link href={`/trips/${trip.id}`} className={cn("group overflow-hidden rounded-xl border bg-card shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift", className)}><div className="relative aspect-[16/9] overflow-hidden"><Image src={trip.cover} alt={`${trip.name} travel cover`} fill sizes="(min-width: 1024px) 430px, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-foreground backdrop-blur">{statusLabels[trip.status]}</span><ArrowUpRight className="absolute bottom-4 right-4 size-5 text-white" /></div><div className="p-5"><h3 className="font-display text-lg font-extrabold tracking-[-0.035em]">{trip.name}</h3><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-3.5" />{route}</p><div className="mt-5 flex items-center justify-between text-xs font-semibold text-muted-foreground"><span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{trip.startDate} — {trip.endDate}</span><span>{formatCurrency(trip.estimatedCost)}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} /></div></div></Link>;
}
