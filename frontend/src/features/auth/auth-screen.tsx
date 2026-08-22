"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, MapPin, ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Brand } from "@/components/layout/app-sidebar";

const loginSchema = z.object({ email: z.string().email("Enter a valid email address."), password: z.string().min(8, "Password must be at least 8 characters.") });
const registerSchema = z.object({ name: z.string().min(2, "Enter your full name."), email: z.string().email("Enter a valid email address."), location: z.string().min(2, "Tell us where you are based."), password: z.string().min(8, "Password must be at least 8 characters.") });
const fieldClass = "mt-2 h-11 w-full rounded-lg border bg-card px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15";

export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isLogin = mode === "login";
  const heading = isLogin ? "Let’s get you travelling." : "Welcome aboard.";
  const copy = isLogin ? "Pick up right where your next journey begins." : "A few details and you’re ready to plan.";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const result = (isLogin ? loginSchema : registerSchema).safeParse(values);
    if (!result.success) { setError(result.error.issues[0]?.message ?? "Please check the form and try again."); return; }
    setError(null); setSubmitting(true);
    window.setTimeout(() => router.push("/dashboard"), 350);
  }

  return <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]"><section className="relative hidden overflow-hidden bg-foreground p-10 text-white lg:flex lg:flex-col"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(109,93,252,0.42),transparent_26%),radial-gradient(circle_at_80%_80%,rgba(200,241,105,0.18),transparent_22%)]" /><div className="relative"><Brand /><span className="mt-24 block text-[0.6875rem] font-extrabold uppercase tracking-[0.16em] text-white/60">Make it yours</span><h1 className="mt-4 max-w-lg font-display text-5xl font-extrabold leading-[1.05] tracking-[-0.06em]">Go somewhere<br /><em className="font-inherit not-italic text-[hsl(var(--accent))]">worth remembering.</em></h1><p className="mt-6 max-w-md text-base leading-7 text-white/70">Bring the routes, places, and little details together in one beautifully calm travel workspace.</p></div><div className="relative mt-auto rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"><p className="text-sm font-bold">“The itinerary finally feels like part of the trip.”</p><p className="mt-2 text-xs text-white/55">— Alex Morgan, GlobeTrotter member</p></div></section><section className="flex items-center justify-center px-5 py-10 sm:px-8"><div className="w-full max-w-md"><div className="lg:hidden"><Brand /><div className="my-12 h-px bg-border" /></div><p className="eyebrow">{isLogin ? "Welcome back" : "Create account"}</p><h2 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.045em]">{heading}</h2><p className="mt-2 text-sm text-muted-foreground">{copy}</p><form className="mt-8 space-y-5" onSubmit={submit} noValidate>{!isLogin && <label className="block text-sm font-bold">Full name<input className={fieldClass} name="name" autoComplete="name" placeholder="Alex Morgan" /></label>}<label className="block text-sm font-bold">Email address<div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className={`${fieldClass} pl-10`} name="email" type="email" autoComplete="email" placeholder="you@example.com" /></div></label>{!isLogin && <label className="block text-sm font-bold">Where are you based?<div className="relative"><MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className={`${fieldClass} pl-10`} name="location" autoComplete="address-level2" placeholder="New Delhi, India" /></div></label>}<label className="block text-sm font-bold">Password<div className="relative"><LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input className={`${fieldClass} px-10`} name="password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></label>{isLogin && <div className="flex justify-end"><button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button></div>}{error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-3 text-sm font-semibold text-red-700">{error}</p>}<button disabled={submitting} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">{submitting ? "Opening your workspace…" : isLogin ? "Sign in" : "Create account"}<ArrowRight className="size-4" /></button></form><p className="mt-7 text-center text-sm text-muted-foreground">{isLogin ? "New to GlobeTrotter?" : "Already have an account?"} <Link href={isLogin ? "/register" : "/login"} className="font-bold text-primary hover:underline">{isLogin ? "Create an account" : "Sign in"}</Link></p></div></section></main>;
}
