import type { Metadata } from "next";
import { ItineraryScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "Itinerary" };
export default async function TripPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <ItineraryScreen id={id} />; }
