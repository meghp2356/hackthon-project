import type { Metadata } from "next";
import { CreateTripScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "Create a trip" };
export default function CreateTripPage() { return <CreateTripScreen />; }
