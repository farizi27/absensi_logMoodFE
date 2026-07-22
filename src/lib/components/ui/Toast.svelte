<script lang="ts">
	import { CheckCircle, AlertTriangle, Info, X } from "@lucide/svelte";

	interface Props {
		message: string;
		type?: "success" | "danger" | "warning" | "info";
		visible: boolean;
		onClose?: () => void;
	}

	let {
		message,
		type = "success",
		visible = false,
		onClose
	}: Props = $props();

	$effect(() => {
		if (visible) {
			const timer = setTimeout(() => {
				onClose?.();
			}, 3000);
			return () => clearTimeout(timer);
		}
	});
</script>

{#if visible}
	<div class="toast-wrapper">
		<div class="toast {type}">
			<div class="toast-icon">
				{#if type === "success"}
					<CheckCircle size={20} />
				{:else if type === "danger"}
					<AlertTriangle size={20} />
				{:else if type === "warning"}
					<AlertTriangle size={20} />
				{:else}
					<Info size={20} />
				{/if}
			</div>
			<span class="toast-message">{message}</span>
			<button class="toast-close" type="button" onclick={() => onClose?.()}>
				<X size={16} />
			</button>
		</div>
	</div>
{/if}

<style>
	.toast-wrapper {
		position: fixed;
		top: 1.5rem;
		right: 1.5rem;
		z-index: 9999;
		animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.25rem;
		border-radius: var(--radius-md, 10px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
		min-width: 280px;
		max-width: 420px;
	}

	.toast.success {
		background: #16a34a;
		color: #ffffff;
	}

	.toast.danger {
		background: #dc2626;
		color: #ffffff;
	}

	.toast.warning {
		background: #d97706;
		color: #ffffff;
	}

	.toast.info {
		background: #2563eb;
		color: #ffffff;
	}

	.toast-icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.toast-message {
		flex: 1;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.toast-close {
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		opacity: 0.7;
		transition: 0.2s;
		padding: 0.15rem;
		border-radius: 4px;
	}

	.toast-close:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.2);
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(40px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
