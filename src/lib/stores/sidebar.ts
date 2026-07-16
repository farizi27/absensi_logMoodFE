import { writable } from "svelte/store";

function createSidebarStore() {
	const { subscribe, set, update } = writable({
		collapsed: false
	});

	return {
		subscribe,

		toggle() {
			update((state) => ({
				...state,
				collapsed: !state.collapsed
			}));
		},

		open() {
			set({
				collapsed: false
			});
		},

		close() {
			set({
				collapsed: true
			});
		}
	};
}

export const sidebar = createSidebarStore();