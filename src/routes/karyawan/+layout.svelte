<script lang="ts">
	import AppLayout from "$lib/components/layout/AppLayout.svelte";
	import { karyawanNavigation } from "$lib/config/navigations";

	let { children } = $props();
</script>

<AppLayout navigation={karyawanNavigation}>
	{@render children?.()}
</AppLayout>
