// src/lib/services/auth.service.ts

import { get, post, put } from "./api";

import type {
    LoginRequest,
    LoginResponse,
	RegisterRequest,
	RegisterResponse,
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
   REGISTER
=========================== */

export function register(data: RegisterRequest) {
	return post<RegisterResponse>(
		"/auth/register",
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
	return put<{ success: boolean; message: string }>(
		"/auth/change-password",
		data
	);
}

export function updateProfile(data: { name: string }) {
	return put<{ success: boolean; message: string }>(
		"/auth/update-profile",
		data
	);
}