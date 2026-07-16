<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		title?: string;
		description?: string;
		children?: Snippet;
		icon?: Snippet;
	}

	let {
		title = "Tidak ada data",
		description = "Belum ada data yang dapat ditampilkan.",
		children,
		icon
	}: Props = $props();
</script>

<div class="empty-state">

	{#if icon}
		<div class="icon">
			{@render icon()}
		</div>
	{/if}

	<h3>{title}</h3>

	<p>{description}</p>

	{#if children}
		<div class="actions">
			{@render children()}
		</div>
	{/if}

</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		gap: 1rem;

		padding: 3rem 2rem;

		text-align: center;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;

		width: 72px;
		height: 72px;

		border-radius: 50%;

		background: var(--color-primary-light);
		color: var(--color-primary);
	}

	h3 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text);
	}

	p {
		margin: 0;
		max-width: 420px;

		color: var(--color-text-light);
		line-height: 1.5;
	}

	.actions {
		margin-top: .5rem;
		display: flex;
		gap: .75rem;
	}
</style>