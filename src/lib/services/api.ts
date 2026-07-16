// src/lib/services/api.ts

import { API_BASE_URL } from "$lib/config/env";

export interface ApiError {
	message: string;
	status: number;
}

async function request<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const token =
		typeof localStorage !== "undefined"
			? localStorage.getItem("token")
			: null;

	const headers = new Headers(options.headers);

	headers.set("Content-Type", "application/json");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers
	});

	if (!response.ok) {
		let message = "Terjadi kesalahan.";

		try {
			const error = await response.json();
			message = error.message ?? message;
		} catch {
			// Abaikan jika respons bukan JSON
		}

		throw {
			message,
			status: response.status
		} satisfies ApiError;
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json();
}

// get function
export function get<T>(endpoint: string){
    return request<T>(endpoint);
}

// post function
export function post<T>(
	endpoint: string,
	body: unknown
) {
	return request<T>(endpoint, {
		method: "POST",
		body: JSON.stringify(body)
	});
}

// put function
export function put<T>(
	endpoint: string,
	body: unknown
) {
	return request<T>(endpoint, {
		method: "PUT",
		body: JSON.stringify(body)
	});
}

// patch function
export function patch<T>(
	endpoint: string,
	body: unknown
) {
	return request<T>(endpoint, {
		method: "PATCH",
		body: JSON.stringify(body)
	});
}

// delete function
export function del<T>(endpoint: string) {
	return request<T>(endpoint, {
		method: "DELETE"
	});
}