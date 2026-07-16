<script lang="ts">
	import type { Snippet } from "svelte";

	interface Props {
		text: string;
		position?: "top" | "bottom" | "left" | "right";
		children?: Snippet;
	}

	let {
		text,
		position = "top",
		children
	}: Props = $props();
</script>

<div class="tooltip-container">
	<div>
		{@render children?.()}
	</div>

	<span
		class={[
			"tooltip",
			position
		]}
		role="tooltip"
	>
		{text}
	</span>
</div>

<style>
	.tooltip-container {
		position: relative;
		display: inline-flex;
	}

	.tooltip {
		position: absolute;

		padding: .45rem .75rem;

		border-radius: var(--radius-md);

		background: var(--color-text);
		color: var(--color-surface);

		font-size: .8rem;
		white-space: nowrap;

		pointer-events: none;

		opacity: 0;

		transition: opacity .2s ease;

		z-index: 1000;
	}

	.tooltip-container:hover .tooltip,
	.tooltip-container:focus-within .tooltip {
		opacity: 1;
	}

	.top {
		bottom: calc(100% + .5rem);
		left: 50%;
		transform: translateX(-50%);
	}

	.bottom {
		top: calc(100% + .5rem);
		left: 50%;
		transform: translateX(-50%);
	}

	.left {
		right: calc(100% + .5rem);
		top: 50%;
		transform: translateY(-50%);
	}

	.right {
		left: calc(100% + .5rem);
		top: 50%;
		transform: translateY(-50%);
	}
</style>