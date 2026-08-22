import type { Metadata } from "next";
import { ProfileScreen } from "@/features/social/social-ui";

export const metadata: Metadata = { title: "Your profile" };
export default function ProfilePage() { return <ProfileScreen />; }
