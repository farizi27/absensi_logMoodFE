<script lang="ts">
	import AppLayout from "$lib/components/layout/AppLayout.svelte";
	import { karyawanNavigation } from "$lib/config/navigations";
	import { onMount } from "svelte";
    import { auth } from "$lib/stores/auth";

    onMount(() => {
        auth.loadFromStorage();
    });
	let { children } = $props();
</script>

<AppLayout navigation={karyawanNavigation}>
	{@render children?.()}
</AppLayout>
