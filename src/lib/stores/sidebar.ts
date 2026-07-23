import { writable } from "svelte/store";

export interface SidebarState {
	collapsed: boolean;
	mobileOpen: boolean;
}

function createSidebarStore() {
	const { subscribe, set, update } = writable<SidebarState>({
		collapsed: false,
		mobileOpen: false
	});

	return {
		subscribe,

		toggle() {
			update((state) => ({
				...state,
				collapsed: !state.collapsed,
				mobileOpen: !state.mobileOpen
			}));
		},

		toggleMobile() {
			update((state) => ({
				...state,
				mobileOpen: !state.mobileOpen
			}));
		},

		openMobile() {
			update((state) => ({
				...state,
				mobileOpen: true
			}));
		},

		closeMobile() {
			update((state) => ({
				...state,
				mobileOpen: false
			}));
		},

		open() {
			update((state) => ({
				...state,
				collapsed: false,
				mobileOpen: true
			}));
		},

		close() {
			update((state) => ({
				...state,
				collapsed: true,
				mobileOpen: false
			}));
		}
	};
}

export const sidebar = createSidebarStore();