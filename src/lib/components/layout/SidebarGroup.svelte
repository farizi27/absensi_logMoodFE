<script lang="ts">
	import type { Component } from "svelte";
	import SidebarItem from "./SidebarItem.svelte";

	interface NavigationItem {
		label: string;
		href: string;
		icon: Component;
		badge?: number | string;
		disabled?: boolean;
	}

	interface Props {
		title?: string;
		items: NavigationItem[];
		collapsed?: boolean;
	}

	let {
		title = "",
		items,
		collapsed = false
	}: Props = $props();
</script>

<div class="sidebar-group">

	{#if title && !collapsed}
		<div class="group-title">
			{title}
		</div>
	{/if}

	<div class="group-content">

		{#each items as item}

			<SidebarItem
                label={item.label}
                href={item.href}
                icon={item.icon}
                badge={item.badge}
                disabled={item.disabled}
                collapsed={collapsed}
            />

		{/each}

	</div>

</div>

<style>
	.sidebar-group {
		display: flex;
		flex-direction: column;
		gap: .4rem;
	}

	.group-title {
		padding: 0 .75rem;
		margin-bottom: .25rem;

		font-size: .75rem;
		font-weight: 600;

		text-transform: uppercase;
		letter-spacing: .08em;

		color: var(--color-text-light);
	}

	.group-content {
		display: flex;
		flex-direction: column;
		gap: .25rem;
	}
</style>