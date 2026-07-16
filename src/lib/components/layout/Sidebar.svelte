<script lang="ts">
	import SidebarGroup from "./SidebarGroup.svelte";
	import type { Component } from "svelte";
    import type { NavigationGroup } from "$lib/config/navigations";
	interface NavigationItem {
		label: string;
		href: string;
		icon: Component;
		badge?: number | string;
		disabled?: boolean;
	}

	interface NavigationGroup {
		title: string;
		items: NavigationItem[];
	}

	interface Props {
		title?: string;
		logo?: string;
		navigation: NavigationGroup[];
		collapsed?: boolean;
	}

	let {
		title = "LogMood",
		logo = "",
		navigation,
		collapsed = false
	}: Props = $props();
</script>

<aside
	class={[
		"sidebar",
		collapsed && "collapsed"
	]}
>

	<div class="sidebar-header">

		{#if logo}
			<img
				src={logo}
				alt={title}
			/>
		{/if}

		{#if !collapsed}
			<h2>{title}</h2>
		{/if}

	</div>

	<nav class="sidebar-nav">

		{#each navigation as group}

			<SidebarGroup
				title={group.title}
				items={group.items}
				collapsed={collapsed}
			/>

		{/each}

	</nav>

</aside>

<style>

	.sidebar {

		width: 270px;

		height: 100vh;

		display: flex;

		flex-direction: column;

		padding: 1rem;

		background: var(--color-surface);

		border-right: 1px solid var(--color-border);

		transition: width .25s;
	}

	.collapsed {
		width: 88px;
	}

	.sidebar-header {

		display: flex;

		align-items: center;

		gap: .75rem;

		margin-bottom: 2rem;
	}

	.sidebar-header img {

		width: 40px;

		height: 40px;

		object-fit: contain;
	}

	.sidebar-header h2 {

		margin: 0;

		font-size: 1.2rem;

		color: var(--color-text);
	}

	.sidebar-nav {

		display: flex;

		flex-direction: column;

		gap: 1.5rem;

		flex: 1;
	}

</style>