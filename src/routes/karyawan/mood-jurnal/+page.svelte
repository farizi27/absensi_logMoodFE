<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";

	let selectedMood = $state("😄");
	let notes = $state("");

	const moods = [
		{ emoji: "😄", label: "Sangat Senang" },
		{ emoji: "😊", label: "Senang" },
		{ emoji: "😐", label: "Netral" },
		{ emoji: "😔", label: "Sedih / Lelah" },
		{ emoji: "😡", label: "Stres / Kesal" }
	];

	function handleSubmit() {
		alert(`Jurnal Mood Berhasil Disimpan: ${selectedMood}`);
	}
</script>

<svelte:head>
	<title>Jurnal Mood - Karyawan</title>
</svelte:head>

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Jurnal Mood Harian</h1>
			<p>Bagikan perasaan dan kondisi emosional Anda saat bekerja hari ini.</p>
		</div>
	</div>

	<Card border padding="lg">
		<div class="journal-card-content">
			<h3>Bagaimana Perasaanmu Hari Ini?</h3>
			<div class="emoji-selector">
				{#each moods as item}
					<button
						type="button"
						class="emoji-btn"
						class:active={selectedMood === item.emoji}
						onclick={() => selectedMood = item.emoji}
					>
						<span class="emoji">{item.emoji}</span>
						<span class="label">{item.label}</span>
					</button>
				{/each}
			</div>

			<div class="input-group">
				<label for="mood-notes">Catatan Tambahan (Opsional)</label>
				<textarea
					id="mood-notes"
					rows="4"
					placeholder="Tuliskan apa yang membuatmu merasa demikian atau tantangan hari ini..."
					bind:value={notes}
				></textarea>
			</div>

			<Button fullWidth onClick={handleSubmit}>Simpan Jurnal Mood</Button>
		</div>
	</Card>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 640px;
		margin: 0 auto;
		width: 100%;
	}

	.header-action h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.25rem;
	}

	.header-action p {
		color: var(--color-text-light);
		font-size: 0.95rem;
	}

	.journal-card-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.journal-card-content h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-text);
		text-align: center;
	}

	.emoji-selector {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 0.75rem;
	}

	.emoji-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 0.5rem;
		border-radius: var(--radius-md, 12px);
		border: 1px solid var(--color-border);
		background: var(--color-background);
		cursor: pointer;
		transition: 0.2s;
	}

	.emoji-btn:hover {
		background: var(--color-surface-hover);
		transform: translateY(-2px);
	}

	.emoji-btn.active {
		border-color: var(--color-primary);
		background: var(--color-primary-light, #dbeafe);
	}

	.emoji {
		font-size: 2rem;
		margin-bottom: 0.35rem;
	}

	.label {
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--color-text);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.input-group label {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--color-text);
	}

	textarea {
		width: 100%;
		padding: 0.8rem;
		border-radius: var(--radius-md, 10px);
		border: 1px solid var(--color-border);
		background: var(--color-background);
		color: var(--color-text);
		font-family: inherit;
		font-size: 0.95rem;
		outline: none;
		box-sizing: border-box;
	}

	textarea:focus {
		border-color: var(--color-primary);
	}
</style>
