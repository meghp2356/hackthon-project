import type { Metadata } from "next";
import { AdminScreen } from "@/features/social/social-ui";

export const metadata: Metadata = { title: "Admin analytics" };
export default function AdminPage() { return <AdminScreen />; }
