<script lang="ts">
	import AppLayout from "$lib/components/layout/AppLayout.svelte";
	import { adminNavigation } from "$lib/config/navigations";
	import { onMount } from "svelte";
    import { auth } from "$lib/stores/auth";
	import {get} from "svelte/store";
	import {goto} from "$app/navigation";
	import Toast from "$lib/components/ui/Toast.svelte";

	// Toast
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");
	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}
    onMount(() => {
        auth.loadFromStorage();
		const state = get(auth);
		if (!state.isAuthenticated) {
			showToast("Silahkan login terlebih dahulu", "danger");
			setTimeout(() => {
				goto("/login");
			}, 500); // 0,5 detik
		}});

	let { children } = $props();
</script>
<Toast 
	visible={toastVisible} 
	message={toastMessage} 
	type={toastType} 
	onClose={() => toastVisible = false} 
/>
<AppLayout navigation={adminNavigation} title="Admin Portal">
	{@render children?.()}
</AppLayout>
