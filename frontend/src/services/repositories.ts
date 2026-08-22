import { apiAnalyticsRepository, apiCommunityRepository, apiDestinationRepository, apiProfileRepository, apiTripRepository } from "@/services/api-repositories";

// Swap these bindings for REST-backed implementations when the API is available.
// Components must consume data through the provider/hooks, never through fixture files.
export const repositories = {
  trips: apiTripRepository,
  profile: apiProfileRepository,
  destinations: apiDestinationRepository,
  community: apiCommunityRepository,
  analytics: apiAnalyticsRepository,
};
