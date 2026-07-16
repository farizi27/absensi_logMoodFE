<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		title: string;
		value: string | number;

		description?: string;

		variant?:
			| "primary"
			| "success"
			| "warning"
			| "danger"
			| "secondary";

		icon?: Snippet;
	}

	let {
		title,
		value,
		description = "",
		variant = "primary",
		icon
	}: Props = $props();
</script>

<div class={["statistic-card", variant]}>

	<div class="header">

		<div class="icon">
			{#if icon}
				{@render icon()}
			{/if}
		</div>

	</div>

	<div class="content">

		<h2>{value}</h2>

		<h4>{title}</h4>

		{#if description}
			<p>{description}</p>
		{/if}

	</div>

</div>

<style>
	.statistic-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		padding: 1.5rem;

		background: var(--color-surface);

		border: 1px solid var(--color-border);

		border-radius: var(--radius-lg);

		box-shadow: var(--shadow-sm);

		transition: .25s;
	}

	.statistic-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-md);
	}

	.header {
		display: flex;
		justify-content: space-between;
	}

	.icon {
		width: 50px;
		height: 50px;

		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 50%;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: .4rem;
	}

	h2 {
		margin: 0;

		font-size: 2rem;

		font-weight: 700;

		color: var(--color-text);
	}

	h4 {
		margin: 0;

		font-size: 1rem;

		font-weight: 500;

		color: var(--color-text-light);
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

	.secondary .icon {
		background: var(--color-secondary-light);
		color: var(--color-secondary);
	}
</style>