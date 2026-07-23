import { writable } from "svelte/store";
import { browser } from "$app/environment";

export type Theme = "light" | "dark";

function createThemeStore() {
	const initialTheme: Theme = browser
		? (localStorage.getItem("theme") as Theme) || "light"
		: "light";

	const { subscribe, set, update } = writable<Theme>(initialTheme);

	return {
		subscribe,
		toggle: () => {
			update((current) => {
				const nextTheme: Theme = current === "light" ? "dark" : "light";
				if (browser) {
					localStorage.setItem("theme", nextTheme);
					document.documentElement.setAttribute("data-theme", nextTheme);
				}
				return nextTheme;
			});
		},
		setTheme: (theme: Theme) => {
			if (browser) {
				localStorage.setItem("theme", theme);
				document.documentElement.setAttribute("data-theme", theme);
			}
			set(theme);
		},
		init: () => {
			if (browser) {
				const stored = localStorage.getItem("theme") as Theme;
				const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
					? "dark"
					: "light";
				const activeTheme = stored || preferred;
				document.documentElement.setAttribute("data-theme", activeTheme);
				set(activeTheme);
			}
		}
	};
}

export const theme = createThemeStore();
