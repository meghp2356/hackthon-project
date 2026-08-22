import { mockActivities, mockCities, mockCommunityPosts, mockProfile, mockTrips } from "@/data/fixtures";
import { communityPostSchema, profileSchema, tripSchema, type ActivityCatalogItem, type AnalyticsOverview, type AnalyticsRepository, type BudgetItem, type City, type CommunityPost, type CommunityRepository, type CreateTripInput, type DestinationRepository, type ProfileRepository, type Trip, type TripRepository, type UserProfile } from "@/types/travel";

const STORAGE_KEY = "globetrotter.mock-trips.v2";
const PROFILE_STORAGE_KEY = "globetrotter.mock-profile.v1";
const COMMUNITY_STORAGE_KEY = "globetrotter.mock-community.v1";
const delay = (ms = 140) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T,>(value: T): T => structuredClone(value);
let cache: Trip[] | null = null;
let profileCache: UserProfile | null = null;
let communityCache: CommunityPost[] | null = null;
const zTrips = tripSchema.array();

function total(trip: Trip) { return trip.extraBudgetItems.reduce((sum, item) => sum + item.amount, 0) + trip.stops.flatMap((stop) => stop.activities).reduce((sum, activity) => sum + activity.cost, 0); }
function withTotal(trip: Trip): Trip { return { ...trip, estimatedCost: total(trip) }; }
function readTrips() {
  if (cache) return cache;
  if (typeof window !== "undefined") {
    try {
      const parsed = zTrips.safeParse(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null"));
      if (parsed.success) { cache = parsed.data.map(withTotal); return cache; }
    } catch { /* Fall through to deterministic fixtures. */ }
  }
  cache = clone(mockTrips).map(withTotal);
  return cache;
}
function persist(trips: Trip[]) { cache = trips; if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trips)); }
function readProfile() { if (profileCache) return profileCache; if (typeof window !== "undefined") { try { const parsed = profileSchema.safeParse(JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? "null")); if (parsed.success) { profileCache = parsed.data; return profileCache; } } catch { /* Use fixture profile. */ } } profileCache = clone(mockProfile); return profileCache; }
function persistProfile(profile: UserProfile) { profileCache = profile; if (typeof window !== "undefined") window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile)); }
function readCommunity() { if (communityCache) return communityCache; if (typeof window !== "undefined") { try { const parsed = communityPostSchema.array().safeParse(JSON.parse(window.localStorage.getItem(COMMUNITY_STORAGE_KEY) ?? "null")); if (parsed.success) { communityCache = parsed.data; return communityCache; } } catch { /* Use fixture community feed. */ } } communityCache = clone(mockCommunityPosts); return communityCache; }
function persistCommunity(posts: CommunityPost[]) { communityCache = posts; if (typeof window !== "undefined") window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(posts)); }
function updateTrip(tripId: string, transform: (trip: Trip) => Trip): Trip {
  const current = readTrips(); let result: Trip | null = null;
  const next = current.map((trip) => { if (trip.id !== tripId) return trip; result = withTotal(transform(trip)); return result; });
  if (!result) throw new Error("Trip not found.");
  persist(next); return clone(result);
}
function displayDate(date: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(`${date}T12:00:00`)); }
function move<T>(items: T[], id: string, direction: "up" | "down", identity: (item: T) => string) {
  const index = items.findIndex((item) => identity(item) === id); const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return items;
  const next = [...items]; [next[index], next[target]] = [next[target], next[index]]; return next;
}

export const mockTripRepository: TripRepository = {
  async getTrips() { await delay(); return clone(readTrips()); },
  async getTrip(id) { await delay(); return clone(readTrips().find((trip) => trip.id === id) ?? null); },
  async createTrip(input: CreateTripInput) {
    await delay(); const id = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now().toString(36)}`;
    const trip: Trip = withTotal({ id, name: input.name, cover: "/travel/taj-mahal-hero.png", startDate: input.startDate, endDate: input.endDate, budget: input.budget, estimatedCost: 0, status: "upcoming", extraBudgetItems: [], stops: [{ id: `${id}-origin`, city: input.origin, country: "To be confirmed", flag: "START", startDate: displayDate(input.startDate), endDate: displayDate(input.endDate), activities: [] }] });
    persist([trip, ...readTrips()]); return clone(trip);
  },
  async addStop(tripId: string, city: City) { await delay(); return updateTrip(tripId, (trip) => trip.stops.some((stop) => stop.city === city.name && stop.country === city.country) ? trip : { ...trip, stops: [...trip.stops, { id: `${city.id}-${Date.now().toString(36)}`, city: city.name, country: city.country, flag: city.flag, startDate: "To be scheduled", endDate: "", activities: [] }] }); },
  async removeStop(tripId: string, stopId: string) { await delay(); return updateTrip(tripId, (trip) => ({ ...trip, stops: trip.stops.filter((stop) => stop.id !== stopId) })); },
  async moveStop(tripId: string, stopId: string, direction: "up" | "down") { await delay(); return updateTrip(tripId, (trip) => ({ ...trip, stops: move(trip.stops, stopId, direction, (stop) => stop.id) })); },
  async addActivity(tripId: string, stopId: string, activity: ActivityCatalogItem) { await delay(); return updateTrip(tripId, (trip) => ({ ...trip, stops: trip.stops.map((stop) => stop.id !== stopId || stop.activities.some((item) => item.name === activity.name) ? stop : { ...stop, activities: [...stop.activities, { id: `${activity.id}-${Date.now().toString(36)}`, name: activity.name, category: activity.category, duration: activity.duration, cost: activity.cost, icon: activity.icon, time: `${String(10 + Math.min(stop.activities.length, 8)).padStart(2, "0")}:00` }] }) })); },
  async removeActivity(tripId: string, stopId: string, activityId: string) { await delay(); return updateTrip(tripId, (trip) => ({ ...trip, stops: trip.stops.map((stop) => stop.id === stopId ? { ...stop, activities: stop.activities.filter((activity) => activity.id !== activityId) } : stop) })); },
  async moveActivity(tripId: string, stopId: string, activityId: string, direction: "up" | "down") { await delay(); return updateTrip(tripId, (trip) => ({ ...trip, stops: trip.stops.map((stop) => stop.id === stopId ? { ...stop, activities: move(stop.activities, activityId, direction, (activity) => activity.id) } : stop) })); },
  async addBudgetItem(tripId: string, item: Omit<BudgetItem, "id">) { await delay(); return updateTrip(tripId, (trip) => ({ ...trip, extraBudgetItems: [...trip.extraBudgetItems, { ...item, id: `budget-${Date.now().toString(36)}` }] })); },
};

export const mockProfileRepository: ProfileRepository = { async getProfile() { await delay(80); return clone(readProfile()); }, async updateProfile(profile) { await delay(); persistProfile(profile); return clone(profile); } };
export const mockDestinationRepository: DestinationRepository = { async getFeaturedCities() { await delay(); return clone(mockCities); }, async getActivities() { await delay(); return clone(mockActivities); } };
export const mockCommunityRepository: CommunityRepository = {
  async getPosts() { await delay(); return clone(readCommunity()); },
  async toggleSaved(postId) { await delay(); const posts = readCommunity().map((post) => post.id === postId ? { ...post, saved: !post.saved } : post); persistCommunity(posts); return clone(posts); },
  async toggleLiked(postId) { await delay(); const posts = readCommunity().map((post) => post.id === postId ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) } : post); persistCommunity(posts); return clone(posts); },
};
export const mockAnalyticsRepository: AnalyticsRepository = { async getOverview() { await delay(); const posts = readCommunity(); const trips = readTrips(); const overview: AnalyticsOverview = { totalTrips: trips.length + 126, travelers: 2847, plannedValue: trips.reduce((sum, trip) => sum + trip.estimatedCost, 0) + 4260000, savedPosts: posts.filter((post) => post.saved).length + 912, tripGrowth: [{ label: "Jan", value: 38 }, { label: "Feb", value: 52 }, { label: "Mar", value: 45 }, { label: "Apr", value: 67 }, { label: "May", value: 61 }, { label: "Jun", value: 82 }, { label: "Jul", value: 76 }, { label: "Aug", value: 94 }], destinations: [{ name: "Jaipur", trips: 82, share: 27 }, { name: "Agra", trips: 74, share: 24 }, { name: "Udaipur", trips: 69, share: 22 }, { name: "Kochi", trips: 55, share: 18 }], communityPosts: posts.length + 381, communityEngagement: 18.4 }; return clone(overview); } };
