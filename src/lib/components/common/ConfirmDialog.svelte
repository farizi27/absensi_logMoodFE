<script lang="ts">
	import type { Snippet } from "svelte";
	import Modal from "../ui/Modal.svelte";
	import Button from "../ui/Button.svelte";

	interface Props {
		open: boolean;
		title?: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		variant?: "primary" | "danger";
		onConfirm?: () => void;
		onCancel?: () => void;
		icon?: Snippet;
	}

	let {
		open = false,
		title = "Konfirmasi",
		message,
		confirmText = "Ya",
		cancelText = "Batal",
		variant = "primary",
		onConfirm,
		onCancel,
		icon
	}: Props = $props();
</script>

<Modal
	{open}
	{title}
	onClose={onCancel}
>
	<div class="content">

		{#if icon}
			<div class="icon">
				{@render icon()}
			</div>
		{/if}

		<p>{message}</p>

	</div>

	{#snippet footer()}

		<Button
			variant="ghost"
			onClick={onCancel}
		>
			{cancelText}
		</Button>

		<Button
			{variant}
			onClick={onConfirm}
		>
			{confirmText}
		</Button>

	{/snippet}
</Modal>

<style>
	.content{
		display:flex;
		flex-direction:column;
		align-items:center;
		text-align:center;
		gap:1rem;
	}

	.icon{
		display:flex;
		align-items:center;
		justify-content:center;
	}
</style>