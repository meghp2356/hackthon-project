import type { Metadata } from "next";
import { CommunityScreen } from "@/features/social/social-ui";

export const metadata: Metadata = { title: "Community" };
export default function CommunityPage() { return <CommunityScreen />; }
