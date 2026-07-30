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
		let message = `Error ${response.status}: ${response.statusText}`;

		try {
			const error = await response.json();
			message = error.message ?? message;
		} catch {
			// Response bukan JSON (e.g. sendStatus(401))
		}

		throw new Error(message);
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

// --- Form Data helpers (for multer endpoints) ---

async function requestFormData<T>(
	endpoint: string,
	method: string,
	data: Record<string, string>
): Promise<T> {
	const token =
		typeof localStorage !== "undefined"
			? localStorage.getItem("token")
			: null;

	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		formData.append(key, value);
	}

	const headers = new Headers();
	// Do NOT set Content-Type — browser sets it with boundary for FormData
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		method,
		headers,
		body: formData
	});

	if (!response.ok) {
		let message = `Error ${response.status}: ${response.statusText}`;

		try {
			const error = await response.json();
			message = error.message ?? message;
		} catch {
			// Response bukan JSON (e.g. sendStatus(401))
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


export function postForm<T>(
	endpoint: string,
	data: Record<string, string>
) {
	return requestFormData<T>(endpoint, "POST", data);
}

export function putForm<T>(
	endpoint: string,
	data: Record<string, string>
) {
	return requestFormData<T>(endpoint, "PUT", data);
}

// --- get blob
export async function getBlob(
	endpoint: string,
	options: RequestInit = {}
): Promise<Blob> {
	const token =
		typeof localStorage !== "undefined"
			? localStorage.getItem("token")
			: null;

	const headers = new Headers(options.headers);

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers
	});

	if (!response.ok) {
		let message = `Error ${response.status}: ${response.statusText}`;

		try {
			const error = await response.json();
			message = error.message ?? message;
		} catch {
			// File response bukan JSON
		}

		throw {
			message,
			status: response.status
		} satisfies ApiError;
	}

	return response.blob();
}