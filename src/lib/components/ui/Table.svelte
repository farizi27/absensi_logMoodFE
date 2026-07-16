<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children?: Snippet;
		striped?: boolean;
		hoverable?: boolean;
		bordered?: boolean;
	}

	let {
		children,
		striped = true,
		hoverable = true,
		bordered = true
	}: Props = $props();
</script>

<div class="table-wrapper">
	<table
		class={[
			"table",
			striped && "striped",
			hoverable && "hoverable",
			bordered && "bordered"
		]}
	>
		{@render children?.()}
	</table>
</div>

<style>
	.table-wrapper {
		width: 100%;
		overflow-x: auto;
		border-radius: var(--radius-lg);
	}

	.table {
		width: 100%;
		border-collapse: collapse;
		background: var(--color-surface);
	}

	.table :global(th),
	.table :global(td) {
		padding: .9rem 1rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border);
	}

	.table :global(th) {
		background: var(--color-background);
		color: var(--color-text);
		font-weight: 600;
		white-space: nowrap;
	}

	.table :global(td) {
		color: var(--color-text);
	}

	.striped :global(tbody tr:nth-child(even)) {
		background: var(--color-surface-secondary);
	}

	.hoverable :global(tbody tr:hover) {
		background: var(--color-primary-light);
	}

	.bordered {
		border: 1px solid var(--color-border);
	}

	.table :global(tbody tr:last-child td) {
		border-bottom: none;
	}
</style>