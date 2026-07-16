// src/lib/services/auth.service.ts

import { get, post } from "./api";

import type {
    LoginRequest,
    LoginResponse,
    User,
    ChangePasswordRequest
} from "$lib/types/auth";

/* ===========================
   LOGIN
=========================== */

export function login(data: LoginRequest) {
	return post<LoginResponse>(
		"/auth/login",
		data
	);
}

/* ===========================
   PROFILE
=========================== */

export function getProfile() {
	return get<User>(
		"/auth/profile"
	);
}

/* ===========================
   CHANGE PASSWORD
=========================== */

export function changePassword(
	data: ChangePasswordRequest
) {
	return post<void>(
		"/auth/change-password",
		data
	);
}

/* ===========================
   REFRESH TOKEN
=========================== */

export function refreshToken() {
	return post<LoginResponse>(
		"/auth/refresh",
		{}
	);
}

/* ===========================
   LOGOUT
=========================== */

export function logout() {
	return post<void>(
		"/auth/logout",
		{}
	);
}