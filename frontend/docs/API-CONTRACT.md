# GlobeTrotter frontend API contract

The frontend currently uses deterministic mock repositories. Future API implementations must preserve these domain shapes so UI components and feature hooks do not change.

## Transport conventions

- Base URL: `NEXT_PUBLIC_API_BASE_URL`
- Successful responses: `{ "data": T, "meta": { ...optional } }`
- Error responses: `{ "code": "STRING_CODE", "message": "Human-readable message", "details": {} }`
- Dates use ISO-8601 (`YYYY-MM-DD`); display formatting is a frontend concern.
- List routes support `page`, `limit`, `q`, `sort`, and feature-specific filters.
- Authentication is expected to use secure HTTP-only session cookies. The frontend must never handle database credentials.

## Required resources

### Profile

- `GET /v1/me` -> `UserProfile`
- `PATCH /v1/me` with editable profile fields -> `UserProfile`
- Profile uploads need a separate signed-upload or media endpoint; the frontend stores image previews only in mock mode.

### Trips

- `GET /v1/trips?status=&q=&page=&limit=` -> `Trip[]`
- `POST /v1/trips` -> `Trip`
- `GET /v1/trips/:tripId` -> `Trip`
- `PATCH /v1/trips/:tripId` -> `Trip`
- `DELETE /v1/trips/:tripId` -> `204`
- `POST /v1/trips/:tripId/stops` with a destination identifier -> `Trip`
- `PATCH /v1/trips/:tripId/stops/:stopId/order` with `{ "direction": "up" | "down" }` -> `Trip`
- `DELETE /v1/trips/:tripId/stops/:stopId` -> `Trip`
- `POST /v1/trips/:tripId/stops/:stopId/activities` with an activity identifier and optional time -> `Trip`
- `PATCH /v1/trips/:tripId/stops/:stopId/activities/:activityId/order` with `{ "direction": "up" | "down" }` -> `Trip`
- `DELETE /v1/trips/:tripId/stops/:stopId/activities/:activityId` -> `Trip`
- `POST /v1/trips/:tripId/budget-items` with `{ label, category, amount }` -> `Trip`

### Destinations and activities

- `GET /v1/destinations?country=&q=&budget=&page=` -> `City[]`
- `GET /v1/activities?cityId=&category=&q=&budget=&page=` -> `Activity[]`

### Future resources

- Community: `GET /v1/community/posts?topic=&destination=&q=&page=` -> paginated `CommunityPost[]`
- Community: `POST /v1/community/posts/:postId/bookmark` and `DELETE /v1/community/posts/:postId/bookmark` -> `CommunityPost`
- Community: `POST /v1/community/posts/:postId/like` and `DELETE /v1/community/posts/:postId/like` -> `CommunityPost`
- Community publishing: `POST /v1/community/posts` -> `CommunityPost`; the current mock UI saves a validated local draft only.
- Calendar: derived from `GET /v1/trips` unless the backend provides a schedule endpoint.
- Shared itinerary: `GET /v1/shared-trips/:token` returns a public-safe `Trip` projection only.
- Analytics: `GET /v1/admin/analytics?from=&to=` returns a pre-aggregated `AnalyticsOverview` for authorized admins.

## Frontend integration rule

Route components must use repositories/hooks only. Fixture imports are allowed exclusively inside mock repository modules. API errors must be normalized by `api-client.ts` and rendered as user-friendly states.

## Mock mutations to replace

- Profile save and local image-preview persistence.
- Bookmark and like toggles in the community feed.
- Trip creation, stop/activity changes, and manual budget items.
- Public-share token validation and link generation.
