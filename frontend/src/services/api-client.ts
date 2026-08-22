import { apiErrorSchema, type ApiError } from "@/types/travel";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiClientError extends Error {
  constructor(public readonly error: ApiError, public readonly status?: number) { super(error.message); }
}

export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) throw new ApiClientError({ code: "API_NOT_CONFIGURED", message: "No API base URL has been configured." });
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, credentials: "include", headers: { Accept: "application/json", ...init?.headers } });
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const error = apiErrorSchema.safeParse(payload).success ? apiErrorSchema.parse(payload) : { code: "REQUEST_FAILED", message: "Something went wrong. Please try again." };
    throw new ApiClientError(error, response.status);
  }
  return response.json() as Promise<T>;
}
