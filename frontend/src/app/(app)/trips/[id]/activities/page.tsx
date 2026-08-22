import type { Metadata } from "next";
import { ActivityDiscoveryScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "Find experiences" };
export default async function ActivitiesPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <ActivityDiscoveryScreen id={id} />; }
