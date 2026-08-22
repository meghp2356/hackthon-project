import type { Metadata } from "next";
import { SharedTripScreen } from "@/features/social/social-ui";

export const metadata: Metadata = { title: "Shared itinerary" };
export default async function SharedTripPage({ params }: { params: Promise<{ token: string }> }) { const { token } = await params; return <SharedTripScreen token={token} />; }
