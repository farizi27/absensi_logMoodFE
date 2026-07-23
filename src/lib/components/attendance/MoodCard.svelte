<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import type { MoodLevel } from "$lib/types/mood";
	import { MOOD_LABEL, MOOD_EMOJI } from "$lib/types/mood";

	interface Props {
		mood: MoodLevel;
		count?: number;
		percentage?: string;
	}

	let {
		mood,
		count = 0,
		percentage = "0%"
	}: Props = $props();

	const colorMap: Record<MoodLevel, string> = {
		Excited: "success",
		Happy: "success",
		Neutral: "primary",
		Tired: "secondary",
		Stressed: "danger"
	};

	const currentColor = $derived(colorMap[mood]);
	const currentEmoji = $derived(MOOD_EMOJI[mood]);
	const currentLabel = $derived(MOOD_LABEL[mood]);
</script>

<Card padding="lg" hover border>
	<div class={["mood-inner", currentColor]}>
		<div class="emoji">
			{currentEmoji}
		</div>
		<h3>{currentLabel}</h3>
		<p>{count} Karyawan</p>
		<small>{percentage} Total</small>
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