<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		onMenuClick?: () => void;

		children?: Snippet;
	}

	let {
		onMenuClick,
		children
	}: Props = $props();
</script>

<header>

	<div class="left">

		<button
			class="menu-button"
			type="button"
			onclick={onMenuClick}
			aria-label="Toggle sidebar"
		>
			☰
		</button>

	</div>

	<div class="center">

		{@render children?.()}

	</div>

</header>

<style>

	header {

		height: 70px;

		display: flex;

		align-items: center;

		justify-content: space-between;

		padding: 0 1.5rem;

		background: var(--color-surface);

		border-bottom: 1px solid var(--color-border);

	}

	.left {

		display: flex;

		align-items: center;

		gap: 1rem;

	}

	.menu-button {

		width: 42px;

		height: 42px;

		border: none;

		border-radius: var(--radius-md);

		background: transparent;

		cursor: pointer;

		font-size: 1.2rem;

		transition: .2s;

	}

	.menu-button:hover {

		background: var(--color-surface-hover);

	}

	.center {

		display: flex;

		align-items: center;

		gap: 1rem;

		margin-left: auto;

	}

</style>