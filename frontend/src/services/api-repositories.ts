import { apiClient } from "@/services/api-client";
import type {
  ActivityCatalogItem,
  AnalyticsOverview,
  AnalyticsRepository,
  BudgetItem,
  City,
  CommunityPost,
  CommunityRepository,
  CreateTripInput,
  DestinationRepository,
  ProfileRepository,
  Trip,
  TripRepository,
  TripStop,
  UserProfile,
} from "@/types/travel";

const asNumber = (value: unknown) => Number(value ?? 0);
const date = (value: unknown) => value ? new Date(String(value)).toISOString().slice(0, 10) : "";
const displayDate = (value: unknown) => value ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(String(value))) : "";

function mapCity(value: any): City {
  return { id: value.id, name: value.city ?? value.name, country: value.country ?? "India", flag: value.flag ?? "", rating: asNumber(value.rating), costLabel: value.costLabel ?? String(value.averageBudget ?? ""), image: value.imageUrl ?? value.image ?? "", description: value.description ?? "" };
}
function mapActivity(value: any): ActivityCatalogItem {
  return { id: value.id, name: value.name, city: value.destination?.city ?? value.city ?? "", category: value.type ?? value.category ?? "", duration: value.duration ?? `${value.durationMinutes ?? 0} min`, cost: asNumber(value.cost), description: value.description ?? "", icon: value.icon ?? "" };
}
function mapStop(value: any): TripStop {
  return { id: value.id, city: value.city, country: value.country ?? "India", flag: value.flag ?? "", startDate: displayDate(value.startDate), endDate: displayDate(value.endDate), activities: (value.activities ?? []).map((item: any) => ({ id: item.id, name: item.activity?.name ?? item.name, category: item.activity?.type ?? item.category ?? "", time: item.startTime ?? "", duration: item.duration ?? "", cost: asNumber(item.cost ?? item.activity?.cost), icon: item.icon ?? "" })) };
}
function mapTrip(value: any, stops: any[] = value.stops ?? []): Trip {
  const planned = asNumber(value.plannedBudget);
  return { id: value.id, name: value.title ?? value.name, cover: value.coverPhoto ?? value.cover ?? "", startDate: date(value.startDate), endDate: date(value.endDate), budget: planned, estimatedCost: asNumber(value.spentBudget), stops: stops.map(mapStop), status: value.status === "COMPLETED" ? "completed" : value.status === "ONGOING" ? "ongoing" : "upcoming", extraBudgetItems: [] };
}
async function getTrip(id: string) {
  const [tripResponse, itineraryResponse] = await Promise.all([apiClient<any>(`/api/trips/${id}`), apiClient<any>(`/api/itinerary/${id}`)]);
  return mapTrip(tripResponse.trip, itineraryResponse.stops);
}

export const apiTripRepository: TripRepository = {
  async getTrips() { const response = await apiClient<any>("/api/trips"); return Promise.all((response.trips ?? []).map((trip: any) => getTrip(trip.id))); },
  async getTrip(id) { try { return await getTrip(id); } catch { return null; } },
  async createTrip(input: CreateTripInput) { const response = await apiClient<any>("/api/trips", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: input.name, destinationCity: input.origin, startDate: input.startDate, endDate: input.endDate, plannedBudget: input.budget, description: input.description }) }); return mapTrip(response.trip); },
  async addStop(tripId, city) { await apiClient(`/api/itinerary/${tripId}/stops`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ city: city.name, country: city.country, startDate: new Date().toISOString(), endDate: new Date().toISOString() }) }); return (await getTrip(tripId)); },
  async removeStop(tripId, stopId) { await apiClient(`/api/itinerary/${tripId}/stops/${stopId}`, { method: "DELETE" }); return getTrip(tripId); },
  async moveStop(tripId, stopId, direction) { const trip = await getTrip(tripId); const index = trip.stops.findIndex((stop) => stop.id === stopId); const target = direction === "up" ? index - 1 : index + 1; if (index >= 0 && target >= 0 && target < trip.stops.length) { const stopOrder = [...trip.stops]; [stopOrder[index], stopOrder[target]] = [stopOrder[target], stopOrder[index]]; await apiClient(`/api/itinerary/${tripId}/stops/reorder`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stops: stopOrder.map((stop, order) => ({ id: stop.id, stopOrder: order })) }) }); } return getTrip(tripId); },
  async addActivity(tripId, stopId, activity) { await apiClient(`/api/activities/stops/${stopId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ activityId: activity.id, cost: activity.cost }) }); return getTrip(tripId); },
  async removeActivity(tripId, _stopId, activityId) { await apiClient(`/api/activities/trip-activities/${activityId}`, { method: "DELETE" }); return getTrip(tripId); },
  async moveActivity() { throw new Error("Activity reordering is not implemented by the backend."); },
  async addBudgetItem(tripId, item) { await apiClient(`/api/budget/${tripId}/expenses`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: item.label, amount: item.amount, category: item.category }) }); return getTrip(tripId); },
};

export const apiProfileRepository: ProfileRepository = {
  async getProfile() { const response = await apiClient<any>("/api/users/profile"); const user = response.user ?? response.profile; return { id: user.id, name: user.name ?? "", email: user.email, city: user.city ?? "", country: user.country ?? "", bio: user.bio ?? "", photo: user.photo, preferences: user.preferences ?? [] }; },
  async updateProfile(profile: UserProfile) { const response = await apiClient<any>("/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: profile.name, email: profile.email }) }); const user = response.user ?? response.profile ?? profile; return { ...profile, id: user.id ?? profile.id, name: user.name ?? profile.name, email: user.email ?? profile.email }; },
};

export const apiDestinationRepository: DestinationRepository = {
  async getFeaturedCities() { const response = await apiClient<any>("/api/cities"); return (response.cities ?? []).map(mapCity); },
  async getActivities() { const response = await apiClient<any>("/api/activities"); return (response.activities ?? []).map(mapActivity); },
};

export const apiCommunityRepository: CommunityRepository = { async getPosts(): Promise<CommunityPost[]> { return []; }, async toggleSaved() { return []; }, async toggleLiked() { return []; } };
export const apiAnalyticsRepository: AnalyticsRepository = { async getOverview(): Promise<AnalyticsOverview> { return { totalTrips: 0, travelers: 0, plannedValue: 0, savedPosts: 0, tripGrowth: [], destinations: [], communityPosts: 0, communityEngagement: 0 }; } };
