<script lang="ts">
	import type { Snippet } from "svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";

	interface Props {
		name: string;
		email?: string;
		position?: string;
		photo?: string;
		status?: "Aktif" | "Nonaktif";
		children?: Snippet;
	}

	let {
		name,
		email = "",
		position = "",
		photo = "",
		status = "Aktif",
		children
	}: Props = $props();
</script>

<div class="employee-card">

	<Avatar
		src={photo}
		name={name}
		size="xl"
	/>

	<div class="content">

		<h3>{name}</h3>

		{#if email}
			<p>{email}</p>
		{/if}

		{#if position}
			<span>{position}</span>
		{/if}

		<div class="status">
			<Badge
				variant={status === "Aktif" ? "success" : "danger"}
			>
				{status}
			</Badge>
		</div>

		{#if children}
			<div class="actions">
				{@render children()}
			</div>
		{/if}

	</div>

</div>

<style>
	.employee-card {
		display: flex;
		gap: 1rem;
		align-items: center;

		padding: 1.25rem;

		background: var(--color-surface);

		border: 1px solid var(--color-border);

		border-radius: var(--radius-lg);

		box-shadow: var(--shadow-sm);

		transition: .25s;
	}

	.employee-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-md);
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: .4rem;
	}

	h3 {
		margin: 0;
		color: var(--color-text);
		font-size: 1.1rem;
	}

	p {
		margin: 0;
		color: var(--color-text-light);
		font-size: .9rem;
	}

	span {
		color: var(--color-primary);
		font-weight: 500;
		font-size: .9rem;
	}

	.status {
		margin-top: .3rem;
	}

	.actions {
		margin-top: .75rem;
		display: flex;
		gap: .5rem;
		flex-wrap: wrap;
	}
</style>