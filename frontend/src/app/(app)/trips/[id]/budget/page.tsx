import type { Metadata } from "next";
import { BudgetScreen } from "@/features/planner/planner-ui";

export const metadata: Metadata = { title: "Trip budget" };
export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <BudgetScreen id={id} />; }
