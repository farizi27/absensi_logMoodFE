<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";

	interface Props {
		mood: "senang" | "biasa" | "sedih" | "marah" | "lelah";
		note?: string;
		date?: string;
	}

	let {
		mood,
		note = "",
		date = ""
	}: Props = $props();

	const moods = {
		senang: {
			emoji: "😊",
			color: "success",
			label: "Senang"
		},
		biasa: {
			emoji: "😐",
			color: "primary",
			label: "Biasa"
		},
		sedih: {
			emoji: "😔",
			color: "warning",
			label: "Sedih"
		},
		marah: {
			emoji: "😠",
			color: "danger",
			label: "Marah"
		},
		lelah: {
			emoji: "🥱",
			color: "secondary",
			label: "Lelah"
		}
	} as const;

	const current = $derived(moods[mood]);
</script>

<Card padding="lg" hover border>
	<div class={["mood-inner", current.color]}>
		<div class="emoji">
			{current.emoji}
		</div>
		<h3>{current.label}</h3>
		{#if note}
			<p>{note}</p>
		{/if}
		{#if date}
			<small>{date}</small>
		{/if}
	</div>
</Card>

<style>
	.mood-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: .75rem;
		height: 100%;
	}

	.emoji {
		font-size: 3rem;
	}

	h3 {
		margin: 0;
		color: var(--color-text);
	}

	p {
		margin: 0;
		color: var(--color-text-light);
		line-height: 1.5;
	}

	small {
		color: var(--color-text-light);
	}

	.success {
		border-top: 4px solid var(--color-success);
	}

	.primary {
		border-top: 4px solid var(--color-primary);
	}

	.warning {
		border-top: 4px solid var(--color-warning);
	}

	.danger {
		border-top: 4px solid var(--color-danger);
	}

	.secondary {
		border-top: 4px solid var(--color-secondary);
	}
</style>