import { Skeleton } from "@/components/ui/skeleton";

export default function WorkspaceLoading() { return <div className="space-y-5"><Skeleton className="h-3 w-32" /><Skeleton className="h-9 w-64" /><Skeleton className="h-72 w-full" /></div>; }
