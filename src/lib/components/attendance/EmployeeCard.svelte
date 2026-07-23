<script lang="ts">
	import type { Snippet } from "svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";

	interface Props {
		name: string;
		email?: string;
		position?: string;
		photo?: string;
		status?: string;
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

	function getStatusVariant(s: string): "success" | "warning" | "danger" {
		const lower = s.toLowerCase();
		if (lower === "aktif" || lower === "active") return "success";
		if (lower === "nonaktif" || lower === "inactive") return "warning";
		return "danger";
	}
</script>

<Card hover border padding="md">
	<div class="employee-card-inner">
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
					variant={getStatusVariant(status)}
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
</Card>

<style>
	.employee-card-inner {
		display: flex;
		gap: 1rem;
		align-items: center;
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