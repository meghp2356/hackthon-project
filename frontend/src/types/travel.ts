import { z } from "zod";

export const activitySchema = z.object({
  id: z.string(), name: z.string(), category: z.string(), time: z.string(), duration: z.string(), cost: z.number().nonnegative(), icon: z.string(),
});

export const budgetItemSchema = z.object({ id: z.string(), label: z.string(), amount: z.number().nonnegative(), category: z.string() });

export const tripStopSchema = z.object({
  id: z.string(), city: z.string(), country: z.string(), flag: z.string(), startDate: z.string(), endDate: z.string(), activities: z.array(activitySchema),
});

export const tripSchema = z.object({
  id: z.string(), name: z.string(), cover: z.string(), startDate: z.string(), endDate: z.string(), budget: z.number().nonnegative(), estimatedCost: z.number().nonnegative(), stops: z.array(tripStopSchema), status: z.enum(["ongoing", "upcoming", "completed"]), extraBudgetItems: z.array(budgetItemSchema).default([]),
});

export const profileSchema = z.object({
  id: z.string(), name: z.string(), email: z.string().email(), city: z.string(), country: z.string(), bio: z.string(), photo: z.string().optional(), preferences: z.array(z.string()).default([]),
});

export const citySchema = z.object({
  id: z.string(), name: z.string(), country: z.string(), flag: z.string(), rating: z.number(), costLabel: z.string(), image: z.string(), description: z.string(),
});

export const activityCatalogItemSchema = z.object({ id: z.string(), name: z.string(), city: z.string(), category: z.string(), duration: z.string(), cost: z.number().nonnegative(), description: z.string(), icon: z.string() });
export const communityPostSchema = z.object({ id: z.string(), user: z.string(), avatar: z.string(), title: z.string(), topic: z.string(), destination: z.string(), image: z.string(), likes: z.number().nonnegative(), comments: z.number().nonnegative(), saved: z.boolean().default(false), liked: z.boolean().default(false) });
export const analyticsSchema = z.object({ totalTrips: z.number(), travelers: z.number(), plannedValue: z.number(), savedPosts: z.number(), tripGrowth: z.array(z.object({ label: z.string(), value: z.number() })), destinations: z.array(z.object({ name: z.string(), trips: z.number(), share: z.number() })), communityPosts: z.number(), communityEngagement: z.number() });
export const createTripSchema = z.object({ name: z.string().trim().min(3, "Give your trip a name."), origin: z.string().trim().min(2, "Add a starting place."), startDate: z.string().min(1, "Choose a start date."), endDate: z.string().min(1, "Choose an end date."), budget: z.coerce.number().positive("Add a realistic trip budget."), description: z.string().max(600).optional() }).refine((value) => value.endDate >= value.startDate, { path: ["endDate"], message: "Your end date must be after your start date." });

export const apiErrorSchema = z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() });
export const apiResponseSchema = <T extends z.ZodTypeAny>(data: T) => z.object({ data, meta: z.record(z.string(), z.unknown()).optional() });

export type Activity = z.infer<typeof activitySchema>;
export type BudgetItem = z.infer<typeof budgetItemSchema>;
export type TripStop = z.infer<typeof tripStopSchema>;
export type Trip = z.infer<typeof tripSchema>;
export type UserProfile = z.infer<typeof profileSchema>;
export type City = z.infer<typeof citySchema>;
export type ActivityCatalogItem = z.infer<typeof activityCatalogItemSchema>;
export type CommunityPost = z.infer<typeof communityPostSchema>;
export type AnalyticsOverview = z.infer<typeof analyticsSchema>;
export type CreateTripInput = z.infer<typeof createTripSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;

export interface TripRepository {
  getTrips(): Promise<Trip[]>;
  getTrip(id: string): Promise<Trip | null>;
  createTrip(input: CreateTripInput): Promise<Trip>;
  addStop(tripId: string, city: City): Promise<Trip>;
  removeStop(tripId: string, stopId: string): Promise<Trip>;
  moveStop(tripId: string, stopId: string, direction: "up" | "down"): Promise<Trip>;
  addActivity(tripId: string, stopId: string, activity: ActivityCatalogItem): Promise<Trip>;
  removeActivity(tripId: string, stopId: string, activityId: string): Promise<Trip>;
  moveActivity(tripId: string, stopId: string, activityId: string, direction: "up" | "down"): Promise<Trip>;
  addBudgetItem(tripId: string, item: Omit<BudgetItem, "id">): Promise<Trip>;
}

export interface ProfileRepository {
  getProfile(): Promise<UserProfile>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;
}

export interface DestinationRepository {
  getFeaturedCities(): Promise<City[]>;
  getActivities(): Promise<ActivityCatalogItem[]>;
}

export interface CommunityRepository {
  getPosts(): Promise<CommunityPost[]>;
  toggleSaved(postId: string): Promise<CommunityPost[]>;
  toggleLiked(postId: string): Promise<CommunityPost[]>;
}

export interface AnalyticsRepository { getOverview(): Promise<AnalyticsOverview>; }
