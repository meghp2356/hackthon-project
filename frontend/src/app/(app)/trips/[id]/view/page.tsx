import type { Metadata } from "next";
import { ItineraryPreviewScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "Itinerary preview" };
export default async function ViewPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <ItineraryPreviewScreen id={id} />; }
