<script lang="ts">
	import type { Snippet } from "svelte";
	import Spinner from "../ui/Spinner.svelte";

	interface Props {
		loading?: boolean;
		label?: string;
		children?: Snippet;
	}

	let {
		loading = false,
		label = "Loading...",
		children
	}: Props = $props();
</script>

{#if loading}
	<div class="loading">
		<Spinner />

		{#if label}
			<p>{label}</p>
		{/if}
	</div>
{:else}
	{@render children?.()}
{/if}

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		padding: 2rem;
		gap: 1rem;
	}

	p {
		color: var(--color-text-light);
		font-size: .9rem;
	}
</style>