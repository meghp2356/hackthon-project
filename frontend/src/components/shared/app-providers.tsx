"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { repositories } from "@/services/repositories";
import type { ActivityCatalogItem, AnalyticsOverview, BudgetItem, City, CommunityPost, CreateTripInput, Trip, UserProfile } from "@/types/travel";

type TravelState = { profile: UserProfile | null; trips: Trip[]; cities: City[]; activities: ActivityCatalogItem[]; posts: CommunityPost[]; analytics: AnalyticsOverview | null; isLoading: boolean; error: string | null };
type TravelData = TravelState & {
  createTrip(input: CreateTripInput): Promise<Trip>;
  addStop(tripId: string, city: City): Promise<void>;
  removeStop(tripId: string, stopId: string): Promise<void>;
  moveStop(tripId: string, stopId: string, direction: "up" | "down"): Promise<void>;
  addActivity(tripId: string, stopId: string, activity: ActivityCatalogItem): Promise<void>;
  removeActivity(tripId: string, stopId: string, activityId: string): Promise<void>;
  moveActivity(tripId: string, stopId: string, activityId: string, direction: "up" | "down"): Promise<void>;
  addBudgetItem(tripId: string, item: Omit<BudgetItem, "id">): Promise<void>;
  updateProfile(profile: UserProfile): Promise<void>;
  toggleSaved(postId: string): Promise<void>;
  toggleLiked(postId: string): Promise<void>;
};

const TravelDataContext = createContext<TravelData | null>(null);
const initialState: TravelState = { profile: null, trips: [], cities: [], activities: [], posts: [], analytics: null, isLoading: true, error: null };

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TravelState>(initialState);

  useEffect(() => {
    let active = true;
    Promise.all([repositories.profile.getProfile(), repositories.trips.getTrips(), repositories.destinations.getFeaturedCities(), repositories.destinations.getActivities(), repositories.community.getPosts(), repositories.analytics.getOverview()])
      .then(([profile, trips, cities, activities, posts, analytics]) => { if (active) setState({ profile, trips, cities, activities, posts, analytics, isLoading: false, error: null }); })
      .catch(() => { if (active) setState({ ...initialState, isLoading: false, error: "We couldn't load your travel workspace." }); });
    return () => { active = false; };
  }, []);

  const replaceTrip = useCallback((trip: Trip) => setState((current) => ({ ...current, trips: current.trips.some((item) => item.id === trip.id) ? current.trips.map((item) => item.id === trip.id ? trip : item) : [trip, ...current.trips] })), []);
  const createTrip = useCallback(async (input: CreateTripInput) => { const trip = await repositories.trips.createTrip(input); replaceTrip(trip); return trip; }, [replaceTrip]);
  const addStop = useCallback(async (tripId: string, city: City) => replaceTrip(await repositories.trips.addStop(tripId, city)), [replaceTrip]);
  const removeStop = useCallback(async (tripId: string, stopId: string) => replaceTrip(await repositories.trips.removeStop(tripId, stopId)), [replaceTrip]);
  const moveStop = useCallback(async (tripId: string, stopId: string, direction: "up" | "down") => replaceTrip(await repositories.trips.moveStop(tripId, stopId, direction)), [replaceTrip]);
  const addActivity = useCallback(async (tripId: string, stopId: string, activity: ActivityCatalogItem) => replaceTrip(await repositories.trips.addActivity(tripId, stopId, activity)), [replaceTrip]);
  const removeActivity = useCallback(async (tripId: string, stopId: string, activityId: string) => replaceTrip(await repositories.trips.removeActivity(tripId, stopId, activityId)), [replaceTrip]);
  const moveActivity = useCallback(async (tripId: string, stopId: string, activityId: string, direction: "up" | "down") => replaceTrip(await repositories.trips.moveActivity(tripId, stopId, activityId, direction)), [replaceTrip]);
  const addBudgetItem = useCallback(async (tripId: string, item: Omit<BudgetItem, "id">) => replaceTrip(await repositories.trips.addBudgetItem(tripId, item)), [replaceTrip]);
  const updateProfile = useCallback(async (profile: UserProfile) => { const next = await repositories.profile.updateProfile(profile); setState((current) => ({ ...current, profile: next })); }, []);
  const replacePosts = useCallback((posts: CommunityPost[]) => setState((current) => ({ ...current, posts })), []);
  const toggleSaved = useCallback(async (postId: string) => replacePosts(await repositories.community.toggleSaved(postId)), [replacePosts]);
  const toggleLiked = useCallback(async (postId: string) => replacePosts(await repositories.community.toggleLiked(postId)), [replacePosts]);
  const value = useMemo<TravelData>(() => ({ ...state, createTrip, addStop, removeStop, moveStop, addActivity, removeActivity, moveActivity, addBudgetItem, updateProfile, toggleSaved, toggleLiked }), [state, createTrip, addStop, removeStop, moveStop, addActivity, removeActivity, moveActivity, addBudgetItem, updateProfile, toggleSaved, toggleLiked]);
  return <TravelDataContext.Provider value={value}>{children}</TravelDataContext.Provider>;
}

export function useTravelData() {
  const context = useContext(TravelDataContext);
  if (!context) throw new Error("useTravelData must be used within AppProviders.");
  return context;
}
