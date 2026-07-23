<script lang="ts">
	import SidebarGroup from "./SidebarGroup.svelte";
	import type { NavigationGroup } from "$lib/config/navigations";
	import { X, Power } from "@lucide/svelte";
	import { auth } from "$lib/stores/auth";
	import { goto } from "$app/navigation";

	interface Props {
		title?: string;
		logo?: string;
		navigation: NavigationGroup[];
		collapsed?: boolean;
		onClose?: () => void;
	}

	let {
		title = "LogMood",
		logo = "",
		navigation,
		collapsed = false,
		onClose
	}: Props = $props();

	function handleLogout() {
		auth.logout();
		goto("/login");
	}
</script>

<aside
	class={[
		"sidebar",
		collapsed && "collapsed"
	]}
>
	<div class="sidebar-header">
		<div class="brand">
			{#if logo}
				<img src={logo} alt={title} />
			{:else}
				<div class="logo-badge">
					{title.slice(0, 2).toUpperCase()}
				</div>
			{/if}

			{#if !collapsed}
				<h2>{title}</h2>
			{/if}
		</div>

		{#if onClose && !collapsed}
			<button
				type="button"
				class="close-btn"
				onclick={onClose}
				aria-label="Close menu"
			>
				<X size={20} />
			</button>
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

	<div class="sidebar-footer">
		<button
			type="button"
			class="logout-btn"
			onclick={handleLogout}
			title="Keluar"
		>
			<Power size={20} />
			{#if !collapsed}
				<span>Keluar / Logout</span>
			{/if}
		</button>
	</div>
</aside>

<style>
	.sidebar {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 1.25rem 1rem;
		background: var(--color-surface);
		border-right: 1px solid var(--color-border);
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.sidebar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.75rem;
		padding: 0 0.25rem;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		overflow: hidden;
	}

	.logo-badge {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md, 10px);
		background: var(--color-primary);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.9rem;
		flex-shrink: 0;
	}

	.sidebar-header img {
		width: 36px;
		height: 36px;
		object-fit: contain;
		flex-shrink: 0;
	}

	.sidebar-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
		white-space: nowrap;
		letter-spacing: -0.02em;
	}

	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		border-radius: var(--radius-sm, 6px);
		background: transparent;
		color: var(--color-text-light);
		cursor: pointer;
		transition: 0.2s;
	}

	.close-btn:hover {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		flex: 1;
	}

	.sidebar-footer {
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.logout-btn {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: var(--radius-md, 10px);
		background: transparent;
		color: var(--color-danger, #ef4444);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: 0.2s;
	}

	.logout-btn:hover {
		background: #fef2f2;
	}

	.collapsed .logout-btn {
		justify-content: center;
		padding: 0.75rem;
	}
</style>