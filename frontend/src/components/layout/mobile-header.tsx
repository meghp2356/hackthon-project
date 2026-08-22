"use client";

import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/layout/app-sidebar";

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/95 px-5 backdrop-blur lg:hidden"><Brand compact /><div className="flex items-center gap-2"><Link href="/trips/create" className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground" aria-label="Plan a new trip"><Plus className="size-4" /></Link><button type="button" onClick={() => setOpen((value) => !value)} className="grid size-9 place-items-center rounded-lg border bg-card" aria-expanded={open} aria-label="Open navigation"><Menu className="size-4" /></button></div>{open && <nav className="absolute inset-x-0 top-16 border-b bg-card px-5 py-3 shadow-soft"><div className="grid gap-1"><Link onClick={() => setOpen(false)} href="/dashboard" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted">Overview</Link><Link onClick={() => setOpen(false)} href="/trips" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted">My trips</Link><Link onClick={() => setOpen(false)} href="/calendar" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted">Calendar</Link><Link onClick={() => setOpen(false)} href="/community" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted">Community</Link><Link onClick={() => setOpen(false)} href="/profile" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted">Profile</Link><Link onClick={() => setOpen(false)} href="/admin" className="rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted">Admin demo</Link></div></nav>}</header>;
}
