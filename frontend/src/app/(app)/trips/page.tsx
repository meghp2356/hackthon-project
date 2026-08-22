import type { Metadata } from "next";
import { TripsScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "My trips" };
export default function TripsPage() { return <TripsScreen />; }
