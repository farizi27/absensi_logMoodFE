<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children?: Snippet;
		padding?: "none" | "sm" | "md" | "lg";
		hover?: boolean;
		border?: boolean;
	}

	let {
		children,
		padding = "md",
		hover = false,
		border = true
	}: Props = $props();
</script>

<div
	class={[
		"card",
		padding,
		hover && "hover",
		border && "border"
	]}
>
	{@render children?.()}
</div>

<style>
	.card {
		background: var(--color-surface);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
		transition:
			transform .2s ease,
			box-shadow .2s ease;
	}

	.border {
		border: 1px solid var(--color-border);
	}

	.hover:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-md);
	}

	.none {
		padding: 0;
	}

	.sm {
		padding: .75rem;
	}

	.md {
		padding: 1rem;
	}

	.lg {
		padding: 1.5rem;
	}
</style>