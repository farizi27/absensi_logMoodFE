<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		children?: Snippet;
		variant?:
			| "primary"
			| "secondary"
			| "success"
			| "danger"
			| "warning"
			| "info"
			| "ghost";
		size?: "sm" | "md" | "lg";
		rounded?: boolean;
	}

	let {
		children,
		variant = "primary",
		size = "md",
		rounded = true
	}: Props = $props();
</script>

<span
	class={[
		"badge",
		variant,
		size,
		rounded && "rounded"
	]}
>
	{@render children?.()}
</span>

<style>
	.badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: .35rem;

		font-weight: 600;
		line-height: 1;
		white-space: nowrap;

		user-select: none;
	}

	.rounded {
		border-radius: 999px;
	}

	/* Size */
	.sm {
		padding: .25rem .5rem;
		font-size: .7rem;
	}

	.md {
		padding: .35rem .75rem;
		font-size: .8rem;
	}

	.lg {
		padding: .5rem 1rem;
		font-size: .9rem;
	}

	/* Variants */
	.primary {
		background: var(--color-primary-light);
		color: var(--color-primary);
	}

	.secondary {
		background: var(--color-secondary-light);
		color: var(--color-secondary);
	}

	.success {
		background: var(--color-success-light);
		color: var(--color-success);
	}

	.danger {
		background: var(--color-danger-light);
		color: var(--color-danger);
	}

	.warning {
		background: var(--color-warning-light);
		color: var(--color-warning);
	}

	.info {
		background: var(--color-info-light);
		color: var(--color-info);
	}

	.ghost {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text);
	}
</style>