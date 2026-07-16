// src/lib/stores/auth.ts

import { writable } from "svelte/store";

interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "karyawan";

	photo?: string;
}

interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {

		subscribe,

		login(user: User, token: string) {

			localStorage.setItem("token", token);

			set({
				user,
				token,
				isAuthenticated: true
			});

		},

		logout() {

			localStorage.removeItem("token");

			set(initialState);

		},

		setUser(user: User) {

			update(state => ({
				...state,
				user
			}));

		},

		setToken(token: string) {

			localStorage.setItem("token", token);

			update(state => ({
				...state,
				token,
				isAuthenticated: true
			}));

		},

		reset() {

			localStorage.removeItem("token");

			set(initialState);

		}

	};

}

export const auth = createAuthStore();