<script lang="ts">
	import AppLayout from "$lib/components/layout/AppLayout.svelte";
	import { adminNavigation } from "$lib/config/navigations";

	let { children } = $props();
</script>

<AppLayout navigation={adminNavigation} title="Admin Portal">
	{@render children?.()}
</AppLayout>
