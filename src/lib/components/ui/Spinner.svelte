<script lang="ts">
	interface Props {
		size?: "sm" | "md" | "lg";
		variant?:
			| "primary"
			| "secondary"
			| "success"
			| "danger"
			| "warning";
		fullscreen?: boolean;
		label?: string;
	}

	let {
		size = "md",
		variant = "primary",
		fullscreen = false,
		label = "Loading..."
	}: Props = $props();
</script>

<div
	class={[
		"spinner-container",
		fullscreen && "fullscreen"
	]}
	role="status"
	aria-live="polite"
>
	<div
		class={[
			"spinner",
			size,
			variant
		]}
	></div>

	<span>{label}</span>
</div>

<style>
	.spinner-container {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: .75rem;
	}

	.fullscreen {
		position: fixed;
		inset: 0;
		background: rgba(255,255,255,.6);
		backdrop-filter: blur(2px);
		z-index: 9999;
	}

	.spinner {
		border-radius: 50%;
		border-style: solid;
		border-color: transparent;
		animation: spin .8s linear infinite;
	}

	/* Size */
	.sm {
		width: 24px;
		height: 24px;
		border-width: 3px;
	}

	.md {
		width: 40px;
		height: 40px;
		border-width: 4px;
	}

	.lg {
		width: 60px;
		height: 60px;
		border-width: 5px;
	}

	/* Variant */
	.primary {
		border-top-color: var(--color-primary);
		border-right-color: var(--color-primary);
	}

	.secondary {
		border-top-color: var(--color-secondary);
		border-right-color: var(--color-secondary);
	}

	.success {
		border-top-color: var(--color-success);
		border-right-color: var(--color-success);
	}

	.danger {
		border-top-color: var(--color-danger);
		border-right-color: var(--color-danger);
	}

	.warning {
		border-top-color: var(--color-warning);
		border-right-color: var(--color-warning);
	}

	span {
		font-size: .9rem;
		color: var(--color-text-light);
		user-select: none;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}
</style>