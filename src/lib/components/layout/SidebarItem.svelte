<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/state";
	import type { Component } from "svelte";

    interface Props {
        label: string;
        href: string;
        icon: Component;

        badge?: string | number;
        disabled?: boolean;
        collapsed?: boolean;
    }

	let {
		label,
		href,
		icon: Icon,
		badge,
		collapsed = false,
		disabled = false
	}: Props = $props();

	const active = $derived(page.url.pathname.startsWith(href));

	function navigate() {
		if (disabled) return;
		goto(href);
	}
</script>

<button
	class={[
		"sidebar-item",
		active && "active",
		collapsed && "collapsed",
		disabled && "disabled"
	]}
	onclick={navigate}
	disabled={disabled}
	type="button"
>
	<div class="icon">
		<Icon size={20} />
	</div>

	{#if !collapsed}
		<span>{label}</span>

		{#if badge}
			<small>{badge}</small>
		{/if}
	{/if}
</button>

<style>
	.sidebar-item {
		width: 100%;

		display: flex;
		align-items: center;
		gap: .75rem;

		padding: .8rem 1rem;

		border: none;
		border-radius: var(--radius-md);

		background: transparent;

		cursor: pointer;

		transition: .2s;
	}

	.sidebar-item:hover:not(:disabled) {
		background: var(--color-surface-hover);
		color: var(--color-text);
	}

	.sidebar-item.active {
		background: var(--color-primary);
		color: var(--color-text-white);
	}

	.sidebar-item.active .icon {
		color: inherit;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;

		color: var(--color-text-light);

		flex-shrink: 0;
	}

	span {
		flex: 1;
		text-align: left;

		font-size: .95rem;
		font-weight: 500;

		white-space: nowrap;
	}

	small {
		min-width: 20px;
		height: 20px;

		display: flex;
		align-items: center;
		justify-content: center;

		padding: 0 .4rem;

		border-radius: 999px;

		background: var(--color-danger);
		color: white;

		font-size: .75rem;
		font-weight: 600;
	}

	.collapsed {
		justify-content: center;
		padding: .8rem;
	}

	.disabled {
		opacity: .5;
		cursor: not-allowed;
	}
</style>