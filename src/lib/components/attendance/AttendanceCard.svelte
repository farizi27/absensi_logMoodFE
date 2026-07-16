<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		title: string;
		value: string | number;
		description?: string;
		color?: "primary" | "success" | "warning" | "danger";
		icon?: Snippet;
	}

	let {
		title,
		value,
		description = "",
		color = "primary",
		icon
	}: Props = $props();
</script>

<div class={["attendance-card", color]}>

	<div class="header">

		<div class="icon">
			{#if icon}
				{@render icon()}
			{/if}
		</div>

	</div>

	<div class="content">

		<h4>{title}</h4>

		<h2>{value}</h2>

		{#if description}
			<p>{description}</p>
		{/if}

	</div>

</div>

<style>
	.attendance-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		padding: 1.5rem;

		border-radius: var(--radius-lg);

		background: var(--color-surface);

		border: 1px solid var(--color-border);

		box-shadow: var(--shadow-sm);

		transition: .25s;
	}

	.attendance-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-md);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.icon {
		width: 48px;
		height: 48px;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 50%;
	}

	h4 {
		margin: 0;
		font-size: .95rem;
		font-weight: 500;
		color: var(--color-text-light);
	}

	h2 {
		margin: .4rem 0;
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text);
	}

	p {
		margin: 0;
		font-size: .85rem;
		color: var(--color-text-light);
	}

	.primary .icon {
		background: var(--color-primary-light);
		color: var(--color-primary);
	}

	.success .icon {
		background: var(--color-success-light);
		color: var(--color-success);
	}

	.warning .icon {
		background: var(--color-warning-light);
		color: var(--color-warning);
	}

	.danger .icon {
		background: var(--color-danger-light);
		color: var(--color-danger);
	}
</style>