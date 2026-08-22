import type { Metadata } from "next";
import { CalendarScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "Calendar" };
export default function CalendarPage() { return <CalendarScreen />; }
