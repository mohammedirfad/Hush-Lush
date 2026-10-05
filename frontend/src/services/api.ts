import type { AuthSession } from "../features/auth/auth-context";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string>;
};

export class ApiError extends Error {
  errors?: Record<string, string>;

  constructor(message: string, errors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  const data = (await response.json()) as T & ApiErrorBody;

  if (!response.ok) {
    throw new ApiError(data.message || "Request failed", data.errors);
  }

  return data as T;
}

export function loginUser(email: string, password: string) {
  return request<AuthSession>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export function loginAsGuest() {
  return request<AuthSession>("/api/auth/guest", {
    method: "POST"
  });
}

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  badge?: string;
  image: string;
};

export type MenuResponse = {
  categories: string[];
  items: MenuItem[];
};

export function fetchMenu(category: string, search: string) {
  const params = new URLSearchParams({ category, search });
  return request<MenuResponse>(`/api/menu?${params.toString()}`);
}
