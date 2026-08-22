"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, ChevronDown, Compass, Home, Map, Plus, Search, Users, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTravelData } from "@/components/shared/app-providers";

const workspaceLinks = [{ href: "/dashboard", label: "Overview", icon: Home }, { href: "/trips", label: "My trips", icon: Map }, { href: "/calendar", label: "Calendar", icon: CalendarDays }, { href: "/community", label: "Community", icon: Users }];
const planLinks = [{ href: "/trips/golden-triangle/cities", label: "Explore cities", icon: Search }, { href: "/trips/golden-triangle/budget", label: "Budget", icon: WalletCards }, { href: "/admin", label: "Admin demo", icon: BarChart3 }];

function NavigationLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Home }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
  return <Link href={href} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", active && "bg-secondary text-secondary-foreground")}><Icon className="size-[18px]" aria-hidden="true" />{label}</Link>;
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link href="/dashboard" className="flex items-center gap-2.5" aria-label="GlobeTrotter dashboard"><span className="grid size-10 place-items-center rounded-xl bg-foreground text-white shadow-sm"><Compass className="size-5" /></span>{!compact && <span><span className="block font-display text-sm font-extrabold tracking-tight">GlobeTrotter</span><span className="block text-[0.625rem] font-medium text-muted-foreground">Plan less. Live more.</span></span>}</Link>;
}

export function AppSidebar() {
  const { profile } = useTravelData();
  const initials = profile?.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "GT";
  return <aside className="hidden w-[248px] shrink-0 border-r bg-card px-4 py-6 lg:flex lg:flex-col"><Brand /><div className="mt-8"><p className="px-3 text-[0.625rem] font-extrabold uppercase tracking-[0.15em] text-muted-foreground">Workspace</p><nav className="mt-2 grid gap-0.5">{workspaceLinks.map((item) => <NavigationLink key={item.href} {...item} />)}</nav></div><div className="mt-6"><p className="px-3 text-[0.625rem] font-extrabold uppercase tracking-[0.15em] text-muted-foreground">Plan</p><nav className="mt-2 grid gap-0.5">{planLinks.map((item) => <NavigationLink key={item.href} {...item} />)}</nav></div><Link href="/trips/create" className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-foreground/85"><Plus className="size-4" />Plan a new trip</Link><div className="mt-auto border-t pt-5"><Link href="/profile" className="flex items-center gap-2.5 rounded-lg px-1 py-1 transition-colors hover:bg-muted"><span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-violet-300 to-indigo-500 text-xs font-extrabold text-white">{initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-extrabold">{profile?.name ?? "Loading profile"}</span><span className="block truncate text-[0.6875rem] text-muted-foreground">{profile?.city ?? ""}</span></span><ChevronDown className="size-4 text-muted-foreground" /></Link></div></aside>;
}
