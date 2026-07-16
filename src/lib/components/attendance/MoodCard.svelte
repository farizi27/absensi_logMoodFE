<script lang="ts">
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

<div class={["mood-card", current.color]}>

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

<style>
	.mood-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		padding: 1.5rem;
		gap: .75rem;

		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		background: var(--color-surface);

		box-shadow: var(--shadow-sm);

		transition: .2s;
	}

	.mood-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-md);
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