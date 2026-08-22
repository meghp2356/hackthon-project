import type { Metadata } from "next";
import { CityDiscoveryScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "Explore cities" };
export default async function CitiesPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <CityDiscoveryScreen id={id} />; }
