import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background lg:flex"><AppSidebar /><div className="min-w-0 flex-1"><MobileHeader /><main className="mx-auto w-full max-w-[1500px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 xl:px-12">{children}</main></div></div>;
}
