<script lang="ts">
	import { onMount } from "svelte";
	import { theme } from "$lib/stores/theme";
	import "$lib/theme/global.css";
	import "$lib/theme/variable.css";

	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

{@render children?.()}