export type UserRole = "admin" | "karyawan";

export interface User {
	id: string;
	name: string;
	email: string;

	role: UserRole;

	photo?: string;

	division?: string;

	position?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;

	user: User;
}

export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}