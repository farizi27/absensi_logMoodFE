<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		type = "button",
		variant = "primary",
		size = "md",
		disabled = false,
		fullWidth = false,
		children,
		onClick
	}: {
		type?: "button" | "submit" | "reset";
		variant?:
			| "primary"
			| "secondary"
			| "success"
			| "danger"
			| "warning"
			| "ghost";
		size?: "sm" | "md" | "lg";
		disabled?: boolean;
		fullWidth?: boolean;
		children?: Snippet;
		onClick?: () => void;
	} = $props();
</script>

<button
	type={type}
	disabled={disabled}
	class={[
		"button",
		variant,
		size,
		fullWidth && "full"
	]}
	onclick={onClick}
>
	{@render children?.()}
</button>

<style>
	.button {
		border: none;
		cursor: pointer;
		border-radius: 10px;
		font-weight: 600;
		transition: 0.25s;
	}

	.button:hover:not(:disabled) {
		transform: translateY(-2px);
	}

	.button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.full {
		width: 100%;
	}

	/* Size */
	.sm {
		padding: 8px 16px;
		font-size: 0.9rem;
	}

	.md {
		padding: 12px 20px;
		font-size: 1rem;
	}

	.lg {
		padding: 15px 28px;
		font-size: 1.1rem;
	}

	/* Variant */
	.primary {
		background: var(--color-primary);
		color: var(--color-text-white);
	}

	.primary:hover {
		background: var(--color-primary-hover);
	}

	.secondary {
		background: var(--color-secondary);
		color: var(--color-text-white);
	}

	.secondary:hover {
		background: var(--color-secondary-hover);
	}

	.success {
		background: var(--color-success);
		color: var(--color-text-white);
	}

	.success:hover {
		background: var(--color-success);
	}

	.danger {
		background: var(--color-danger);
		color: var(--color-text-white);
	}

	.danger:hover {
		background: var(--color-danger);
	}

	.warning {
		background: var(--color-warning);
		color: var(--color-text-white);
	}

	.warning:hover {
		background: var(--color-warning);
	}

	.ghost {
		background: transparent;
		border: 1px solid var(--color-border);
		color: var(--color-text);
	}

	.ghost:hover {
		background: var(--color-surface);
	}
</style>