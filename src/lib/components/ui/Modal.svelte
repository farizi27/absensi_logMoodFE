<script lang="ts">
	import type { Snippet } from "svelte";
	import X from "@lucide/svelte/icons/x";

	interface Props {
		open: boolean;
		title?: string;
		children?: Snippet;
		footer?: Snippet;
		closeOnBackdrop?: boolean;
		onClose?: () => void;
	}

	let {
		open = false,
		title = "",
		children,
		footer,
		closeOnBackdrop = true,
		onClose
	}: Props = $props();

	function close() {
		onClose?.();
	}
    function handleKeydown(event: KeyboardEvent) {
        if(!open) return;
		if (event.key === "Escape") {
			close();
		}
	}
</script>
<svelte:window onkeydown={handleKeydown} />
{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
        class="backdrop"
        onclick={(e) => {
            if (e.target === e.currentTarget) {
                close();
            }
        }}
    >
		<div class="modal">
			<header class="header">
				<h2>{title}</h2>

				<button class="close" onclick={close}>
					<X size={20} />
				</button>
			</header>

			<section class="content">
				{@render children?.()}
			</section>

			{#if footer}
				<footer class="footer">
					{@render footer()}
				</footer>
			{/if}
		</div>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;

		display: flex;
		align-items: center;
		justify-content: center;

		background: rgba(0, 0, 0, .45);

		z-index: 999;
		padding: 1rem;

		animation: fade-in .2s ease;
	}

	.modal {
		width: 100%;
		max-width: 520px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;

		background: var(--color-surface);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);

		box-shadow: var(--shadow-lg);

		overflow: hidden;

		animation: slide-up .25s ease;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 1rem 1.25rem;

		border-bottom: 1px solid var(--color-border);
	}

	.header h2 {
		font-size: 1.1rem;
		margin: 0;
	}

	.close {
		display: flex;
		align-items: center;
		justify-content: center;

		background: transparent;
		border: none;
		cursor: pointer;

		padding: .35rem;
		border-radius: var(--radius-md);

		color: var(--color-text);
	}

	.close:hover {
		background: var(--color-surface-hover);
	}

	.content {
		padding: 1.25rem;
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		gap: .75rem;

		padding: 1rem 1.25rem;

		border-top: 1px solid var(--color-border);
	}
</style>