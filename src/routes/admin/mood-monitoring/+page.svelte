<script lang="ts">
	import MoodCard from "$lib/components/attendance/MoodCard.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Select from "$lib/components/ui/Select.svelte";
	import EmptyState from "$lib/components/common/EmptyState.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { onMount } from "svelte";
	import { getMoodJournals } from "$lib/services/mood.service";
	import type { MoodJournal, MoodLevel } from "$lib/types/mood";
	import { MOOD_LABEL, MOOD_EMOJI } from "$lib/types/mood";

	let searchQuery = $state("");
	let filterMood = $state("semua");

	const ALL_MOODS: MoodLevel[] = ["Excited", "Happy", "Neutral", "Tired", "Stressed"];

	const moodOptions = [
		{ label: "Semua Mood", value: "semua" },
		...ALL_MOODS.map(m => ({ label: MOOD_LABEL[m], value: m }))
	];

	// Data state
	let moodJournals = $state<MoodJournal[]>([]);
	let isLoading = $state(false);

	// Toast state
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}

	// Hitung statistik mood dari data
	const moodStats = $derived(() => {
		const total = moodJournals.length;
		return ALL_MOODS.map(mood => {
			const count = moodJournals.filter(j => j.moodLevel === mood).length;
			const pct = total > 0 ? Math.round((count / total) * 100) : 0;
			return { mood, count, percentage: `${pct}%` };
		});
	});

	// Filter records berdasarkan search dan mood filter
	const filteredRecords = $derived(
		moodJournals.filter((rec) => {
			const name = rec.employeeName ?? "";
			const matchName = name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchMood = filterMood === "semua" || rec.moodLevel === filterMood;
			return matchName && matchMood;
		})
	);

	function getMoodBadgeVariant(moodLevel: MoodLevel): "success" | "primary" | "warning" | "danger" {
		switch (moodLevel) {
			case "Excited":
			case "Happy":
				return "success";
			case "Neutral":
				return "primary";
			case "Tired":
				return "warning";
			case "Stressed":
				return "danger";
			default:
				return "primary";
		}
	}

	function formatTime(dateStr: string): string {
		try {
			const date = new Date(dateStr);
			return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
		} catch {
			return "-";
		}
	}

	function formatDate(dateStr: string): string {
		try {
			const date = new Date(dateStr);
			return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
		} catch {
			return "-";
		}
	}

	async function loadMoodJournals() {
		try {
			isLoading = true;
			const result = await getMoodJournals();
			moodJournals = result.data;
		} catch (error: any) {
			console.error(error);
			showToast(
				error?.message || "Gagal mengambil data mood journal",
				"danger"
			);
		} finally {
			isLoading = false;
		}
	}

	onMount(loadMoodJournals);
</script>

<svelte:head>
	<title>Mood Monitoring - Admin</title>
</svelte:head>

<Toast 
	visible={toastVisible} 
	message={toastMessage} 
	type={toastType} 
	onClose={() => toastVisible = false} 
/>

{#if isLoading}
	<Spinner fullscreen label="Memuat data mood..." />
{/if}

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Mood Monitoring</h1>
			<p>Pantau kondisi emosional dan tingkat stres harian karyawan.</p>
		</div>
	</div>

	<!-- Mood Summary Cards -->
	<div class="mood-cards">
		{#each moodStats() as item}
			<MoodCard
				mood={item.mood}
				count={item.count}
				percentage={item.percentage}
			/>
		{/each}
	</div>

	<Card padding="md">
		<div class="filter-bar">
			<div class="filter-item search-box">
				<Input placeholder="Cari nama karyawan..." bind:value={searchQuery} />
			</div>

			<div class="filter-item select-wrap">
				<Select
					label="Mood:"
					bind:value={filterMood}
					options={moodOptions}
				/>
			</div>
		</div>
	</Card>

	<!-- Mood Journal Logs Table -->
	<Card padding="lg">
		<h2 class="card-title">Jurnal Mood Karyawan</h2>
		<Table hoverable striped bordered>
			<thead>
				<tr>
					<th>Karyawan</th>
					<th>Status Mood</th>
					<th>Catatan</th>
					<th>Waktu</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredRecords as log}
					<tr>
						<td class="user-cell">
							<Avatar name={log.employeeName ?? "Unknown"} size={32} />
							<span><strong>{log.employeeName ?? "Unknown"}</strong></span>
						</td>
						<td>
							<Badge variant={getMoodBadgeVariant(log.moodLevel)}>
								{MOOD_EMOJI[log.moodLevel]} {MOOD_LABEL[log.moodLevel]}
							</Badge>
						</td>
						<td>{log.note ?? "-"}</td>
						<td>
							<div class="time-cell">
								<span>{formatTime(log.createdAt)}</span>
								<small>{formatDate(log.createdAt)}</small>
							</div>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4">
							<EmptyState
								title="Tidak ada log mood"
								description="Belum ada catatan mood karyawan yang sesuai dengan filter."
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Card>
</div>

<style>
	.filter-bar {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1.25rem;
	}

	.search-box {
		flex: 1;
		min-width: 240px;
	}

	.filter-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filter-item label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text);
		white-space: nowrap;
	}

	.select-wrap {
		min-width: 180px;
	}

	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
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

	.mood-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1.25rem;
	}

	.card-title {
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text);
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.time-cell {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.time-cell small {
		color: var(--color-text-light);
		font-size: 0.8rem;
	}
</style>
