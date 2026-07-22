<script lang="ts">
	import type { Snippet } from "svelte";
	import { Menu, Power, Sun, Moon } from "@lucide/svelte";
	import { auth } from "$lib/stores/auth";
	import { theme } from "$lib/stores/theme";
	import { logout } from "$lib/services/auth.service";
	import { goto } from "$app/navigation";
	import Avatar from "../ui/Avatar.svelte";

	interface Props {
		onMenuClick?: () => void;
		children?: Snippet;
	}

	let {
		onMenuClick,
		children
	}: Props = $props();

	async function handleLogout() {
		try {
			await logout();
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			auth.logout();
			goto("/login");
		}
	}
</script>

<header>
	<div class="left">
		<button
			class="menu-button"
			type="button"
			onclick={onMenuClick}
			aria-label="Toggle sidebar"
		>
			<Menu size={22} />
		</button>
	</div>

	<div class="right">
		<div class="user-info">
			<Avatar name={$auth.user?.name ?? "Ahmad Farizi"} size="sm"/>
			<span class="name">{$auth.user?.name ?? "Ahmad Farizi"}</span>
		</div>

		{@render children?.()}

		<!-- Theme Toggle Button (Light/Dark Mode) -->
		<button
			class="theme-toggle-btn"
			type="button"
			onclick={() => theme.toggle()}
			title={$theme === "dark" ? "Mode Terang (Light)" : "Mode Gelap (Dark)"}
			aria-label="Toggle theme mode"
		>
			{#if $theme === "dark"}
				<Sun size={18} />
			{:else}
				<Moon size={18} />
			{/if}
		</button>

		<!-- Logout Button -->
		<button
			class="logout-circle-btn"
			type="button"
			onclick={handleLogout}
			title="Keluar / Logout"
			aria-label="Logout"
		>
			<Power size={18} />
		</button>
	</div>
</header>

<style>
	header {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 1.5rem;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		position: sticky;
		top: 0;
		z-index: 50;
		transition: background 0.3s ease, border-color 0.3s ease;
	}

	.left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.menu-button {
		width: 40px;
		height: 40px;
		border: none;
		border-radius: var(--radius-md, 10px);
		background: transparent;
		color: var(--color-text);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: 0.2s;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-right: 15px;
	}

	.menu-button:hover {
		background: var(--color-surface-hover);
	}

	.right {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-left: auto;
	}

	.theme-toggle-btn {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		border: 1px solid var(--color-border);
		background: var(--color-surface-hover);
		color: var(--color-text);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.theme-toggle-btn:hover {
		transform: scale(1.06);
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.logout-circle-btn {
		width: 38px;
		height: 38px;
		border-radius: 50%;
		border: none;
		background: #fef2f2;
		color: #ef4444;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 1px 3px rgba(239, 68, 68, 0.15);
	}

	.logout-circle-btn:hover {
		background: #ef4444;
		color: #ffffff;
		transform: scale(1.06);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
	}

	.name {
		font-size: 14px;
		font-weight: 500;
		color: var(--color-text);
		margin-left: 8px;
	}
</style>