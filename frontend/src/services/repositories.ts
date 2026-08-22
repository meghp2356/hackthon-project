import { mockAnalyticsRepository, mockCommunityRepository, mockDestinationRepository, mockProfileRepository, mockTripRepository } from "@/services/mock-repositories";

// Swap these bindings for REST-backed implementations when the API is available.
// Components must consume data through the provider/hooks, never through fixture files.
export const repositories = {
  trips: mockTripRepository,
  profile: mockProfileRepository,
  destinations: mockDestinationRepository,
  community: mockCommunityRepository,
  analytics: mockAnalyticsRepository,
};
