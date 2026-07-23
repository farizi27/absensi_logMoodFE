import { writable, get } from "svelte/store";
import { jwtDecode } from "jwt-decode";

interface User {
    id: number;
    email: string | null;
    role: 1 | 2;
	name: string;
}

interface JwtPayload {
    id: number;
    email: string | null;
    role: 1 | 2;
	name: string,
    iat: number;
    exp: number;
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

        login(token: string) {
            const payload = jwtDecode<JwtPayload>(token);

            localStorage.setItem("token", token);

            set({
                token,
                isAuthenticated: true,
                user: {
                    id: payload.id,
                    email: payload.email,
					name: payload.name,
                    role: payload.role
                }
            });
        },
		loadFromStorage() {
			const token = localStorage.getItem("token");

			if (!token) return;

			try {
				const payload = jwtDecode<JwtPayload>(token);

				set({
					token,
					isAuthenticated: true,
					user: {
						id: payload.id,
						name: payload.name,
						email: payload.email,
						role: payload.role
					}
				});
			} catch (error) {
				localStorage.removeItem("token");
				set(initialState);
			}
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
        },

        isAdmin() {
            return get({ subscribe }).user?.role === 1;
        },

        isEmployee() {
            return get({ subscribe }).user?.role === 2;
        }
    };
}


export const auth = createAuthStore();