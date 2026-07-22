<script lang="ts">
	import type { Snippet } from "svelte";
	import Card from "$lib/components/ui/Card.svelte";

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

<Card padding="lg" hover border>
	<div class={["statistic-inner", variant]}>

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
</Card>

<style>
	.statistic-inner {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
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