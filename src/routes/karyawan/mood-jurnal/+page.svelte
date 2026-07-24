<script lang="ts">
	import { onMount } from "svelte";
	import { getMyMoodJournals } from "$lib/services/mood.service";
	import { MOOD_LABEL, MOOD_EMOJI } from "$lib/types/mood";
	import type { MoodJournal } from "$lib/types/mood";
	import { AlertCircle, Loader, BookOpen } from "@lucide/svelte";

	let journals = $state<MoodJournal[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	function formatDate(isoString: string) {
		return new Date(isoString).toLocaleDateString("id-ID", {
			weekday: "long",
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	}

	function formatTime(isoString: string) {
		return new Date(isoString).toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit"
		});
	}

	onMount(async () => {
		try {
			loading = true;
			error = null;
			const res = await getMyMoodJournals();
			// Urutkan dari yang terbaru
			journals = res.data.sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		} catch (err: unknown) {
			const e = err as { message?: string };
			error = e?.message ?? "Gagal memuat riwayat jurnal mood.";
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Riwayat Jurnal Mood - Karyawan</title>
</svelte:head>

<div class="page-container">
	<div class="page-header">
		<div>
			<h1>Riwayat Jurnal Mood</h1>
			<p>Catatan mood dan kondisi emosional Anda selama bekerja.</p>
		</div>
	</div>

	{#if error}
		<div class="error-banner">
			<AlertCircle size={18} />
			<span>{error}</span>
		</div>
	{/if}

	{#if loading}
		<div class="loading-wrapper">
			<Loader size={28} class="spin" />
			<span>Memuat riwayat jurnal...</span>
		</div>
	{:else if journals.length === 0}
		<div class="empty-state">
			<BookOpen size={48} strokeWidth={1.5} />
			<p>Belum ada jurnal mood yang tercatat.</p>
			<span>Jurnal mood akan otomatis tersimpan saat Anda melakukan absensi.</span>
		</div>
	{:else}
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Tanggal</th>
						<th>Waktu</th>
						<th>Mood</th>
						<th>Catatan</th>
					</tr>
				</thead>
				<tbody>
					{#each journals as journal (journal.id)}
						<tr>
							<td class="col-date">{formatDate(journal.createdAt)}</td>
							<td class="col-time">{formatTime(journal.createdAt)}</td>
							<td class="col-mood">
								<span class="mood-pill">
									<span class="mood-emoji">{MOOD_EMOJI[journal.moodLevel]}</span>
									{MOOD_LABEL[journal.moodLevel]}
								</span>
							</td>
							<td class="col-note">
								{#if journal.note}
									<span class="note-text">"{journal.note}"</span>
								{:else}
									<span class="no-note">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.25rem;
	}

	.page-header p {
		color: var(--color-text-light);
		font-size: 0.95rem;
		margin: 0;
	}

	/* Error */
	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 1.25rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: var(--radius-md, 10px);
		color: #b91c1c;
		font-size: 0.9rem;
		font-weight: 500;
	}

	/* Loading */
	.loading-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 4rem 0;
		color: var(--color-text-light);
		font-size: 0.95rem;
	}

	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}

	/* Empty */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 4rem 1rem;
		color: var(--color-text-light);
		text-align: center;
		background: var(--color-surface, #f8fafc);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-lg, 16px);
	}

	.empty-state p {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.empty-state span {
		font-size: 0.875rem;
	}

	/* Table */
	.table-wrapper {
		overflow-x: auto;
		border-radius: var(--radius-lg, 16px);
		border: 1px solid var(--color-border);
		background: var(--color-surface, #fff);
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	thead {
		background: var(--color-background, #f8fafc);
		border-bottom: 1px solid var(--color-border);
	}

	th {
		padding: 0.9rem 1.25rem;
		text-align: left;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text-light);
		white-space: nowrap;
	}

	td {
		padding: 1rem 1.25rem;
		vertical-align: middle;
		border-bottom: 1px solid var(--color-border);
		color: var(--color-text);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover {
		background: var(--color-surface-hover, #f1f5f9);
	}

	.col-date {
		white-space: nowrap;
		font-weight: 500;
	}

	.col-time {
		white-space: nowrap;
		color: var(--color-text-light);
		font-size: 0.85rem;
	}

	.col-mood {
		white-space: nowrap;
	}

	.mood-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		background: #ede9fe;
		color: #6d28d9;
		font-weight: 600;
		font-size: 0.85rem;
	}

	.mood-emoji {
		font-size: 1rem;
	}

	.col-note {
		max-width: 320px;
	}

	.note-text {
		font-style: italic;
		color: var(--color-text-light);
		font-size: 0.875rem;
	}

	.no-note {
		color: var(--color-text-light);
		opacity: 0.5;
	}
</style>
