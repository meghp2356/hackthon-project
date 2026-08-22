import type { City, Trip, UserProfile } from "@/types/travel";

export const mockProfile: UserProfile = {
  id: "user-alex-morgan", name: "Alex Morgan", email: "alex@example.com", city: "New Delhi", country: "India",
  bio: "Food lover, city walker, and weekend explorer. Always looking for the next great coffee shop.", preferences: ["Food trails", "Local culture", "Slow mornings"],
};

export const mockTrips: Trip[] = [
  {
    id: "golden-triangle", name: "Golden Triangle Escape", cover: "/travel/taj-mahal-hero.png", startDate: "2026-09-10", endDate: "2026-09-15", budget: 120000, estimatedCost: 108500, status: "upcoming", extraBudgetItems: [{ id: "stay", label: "Accommodation", amount: 85400, category: "Stay" }, { id: "transport", label: "Inter-city transport", amount: 20200, category: "Transport" }],
    stops: [
      { id: "delhi", city: "Delhi", country: "India", flag: "IN", startDate: "Sep 10", endDate: "Sep 11", activities: [{ id: "chandni", name: "Chandni Chowk breakfast", category: "Food", time: "09:00", duration: "1.5h", cost: 450, icon: "food" }, { id: "humayun", name: "Humayun's Tomb", category: "Culture", time: "11:00", duration: "2h", cost: 40, icon: "culture" }] },
      { id: "agra", city: "Agra", country: "India", flag: "IN", startDate: "Sep 12", endDate: "Sep 13", activities: [{ id: "taj", name: "Sunrise at the Taj Mahal", category: "Sightseeing", time: "06:00", duration: "3h", cost: 1300, icon: "sight" }] },
      { id: "jaipur", city: "Jaipur", country: "India", flag: "IN", startDate: "Sep 14", endDate: "Sep 15", activities: [{ id: "hawa", name: "Hawa Mahal & old city", category: "Sightseeing", time: "10:00", duration: "3h", cost: 200, icon: "sight" }] },
    ],
  },
  {
    id: "kerala-backwaters", name: "Kerala Backwaters", cover: "/travel/jaipur-hawa-mahal.png", startDate: "2026-11-03", endDate: "2026-11-09", budget: 95000, estimatedCost: 84000, status: "upcoming", extraBudgetItems: [{ id: "kerala-stay", label: "Accommodation", amount: 84000, category: "Stay" }],
    stops: [{ id: "kochi", city: "Kochi", country: "India", flag: "IN", startDate: "Nov 3", endDate: "Nov 9", activities: [] }],
  },
];

export const mockCities: City[] = [
  { id: "agra", name: "Agra", country: "India", flag: "IN", rating: 4.8, costLabel: "Comfortable", image: "/travel/taj-mahal-hero.png", description: "Mughal history, sunrise views, and unforgettable food." },
  { id: "jaipur", name: "Jaipur", country: "India", flag: "IN", rating: 4.8, costLabel: "Comfortable", image: "/travel/jaipur-hawa-mahal.png", description: "A pink city of grand forts, craft, and color." },
  { id: "udaipur", name: "Udaipur", country: "India", flag: "IN", rating: 4.9, costLabel: "Easygoing", image: "/travel/jaipur-hawa-mahal.png", description: "Lakeside sunsets and a wonderfully unhurried pace." },
  { id: "varanasi", name: "Varanasi", country: "India", flag: "IN", rating: 4.7, costLabel: "Easygoing", image: "/travel/taj-mahal-hero.png", description: "Ancient lanes, riverside rituals, and deep atmosphere." },
];

export const mockActivities = [
  { id: "amber-fort", name: "Amber Fort", city: "Jaipur", category: "Culture", duration: "3h", cost: 550, description: "A slow climb through one of Rajasthan's most memorable hilltop forts.", icon: "culture" },
  { id: "ganga-aarti", name: "Ganga aarti", city: "Varanasi", category: "Experience", duration: "1.5h", cost: 0, description: "An atmospheric evening ceremony on the ghats.", icon: "experience" },
  { id: "city-palace", name: "City Palace", city: "Udaipur", category: "Sightseeing", duration: "2.5h", cost: 350, description: "Courtyards, galleries, and views above Lake Pichola.", icon: "sight" },
  { id: "backwater-ride", name: "Backwater canoe ride", city: "Kochi", category: "Experience", duration: "3h", cost: 1800, description: "A quieter way to explore Kerala's palm-lined waterways.", icon: "experience" },
  { id: "delhi-food-walk", name: "Delhi street-food walk", city: "Delhi", category: "Food", duration: "2h", cost: 900, description: "A guided tasting through trusted old-city favourites.", icon: "food" },
];

export const mockCommunityPosts = [
  { id: "jaipur-route", user: "Aarav Shah", avatar: "AS", title: "A perfectly unhurried four days in Jaipur", topic: "Culture", destination: "Jaipur", image: "/travel/jaipur-hawa-mahal.png", likes: 128, comments: 19, saved: false, liked: false },
  { id: "agra-sunrise", user: "Meera Rao", avatar: "MR", title: "How to make a Taj Mahal sunrise feel less rushed", topic: "Planning", destination: "Agra", image: "/travel/taj-mahal-hero.png", likes: 94, comments: 12, saved: true, liked: false },
  { id: "udaipur-evening", user: "Ishaan Kapoor", avatar: "IK", title: "The one Udaipur evening I would plan again", topic: "Food", destination: "Udaipur", image: "/travel/jaipur-hawa-mahal.png", likes: 77, comments: 8, saved: false, liked: true },
];
