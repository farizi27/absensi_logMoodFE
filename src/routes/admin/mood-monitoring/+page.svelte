<script lang="ts">
	import MoodCard from "$lib/components/attendance/MoodCard.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import Input from "$lib/components/ui/Input.svelte";

	let searchQuery = $state("");
	let filterMood = $state("Semua");
	let filterDate = $state(new Date().toISOString().split("T")[0]);

	const moodGridData = [
		{ mood: "senang" as const, note: "18 Karyawan", date: "45% Total" },
		{ mood: "biasa" as const, note: "14 Karyawan", date: "35% Total" },
		{ mood: "sedih" as const, note: "6 Karyawan", date: "15% Total" },
		{ mood: "lelah" as const, note: "4 Karyawan", date: "10% Total" },
		{ mood: "marah" as const, note: "0 Karyawan", date: "0% Total" }
	];

	const moodLogs = [
		{ name: "Budi Santoso", mood: "senang" as const, note: "Project sprint selesai lebih cepat!", time: "08:10 AM" },
		{ name: "Siti Rahma", mood: "senang" as const, note: "Hari yang produktif bersama tim", time: "08:15 AM" },
		{ name: "Ahmad Rizky", mood: "biasa" as const, note: "Sedikit lelah dari perjalanan jauh", time: "08:40 AM" },
		{ name: "Dewi Lestari", mood: "lelah" as const, note: "Lembur tugas akuntansi minggu ini", time: "09:00 AM" }
	];
	const filteredRecords = $derived(
		moodLogs.filter((rec) => {
			const matchName = rec.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchDiv = filterMood === "Semua"|| rec.mood === filterMood.toLowerCase();
			return matchName && matchDiv;
		})
	);
</script>

<svelte:head>
	<title>Mood Monitoring - Admin</title>
</svelte:head>



<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Mood Monitoring</h1>
			<p>Pantau kondisi emosional dan tingkat stres harian karyawan.</p>
		</div>
	</div>

		<!-- Using MoodCard components for Mood Summary -->
	<div class="mood-cards">
		{#each moodGridData as item}
			<MoodCard
				mood={item.mood}
				note={item.note}
				date={item.date}
			/>
		{/each}
	</div>

	<Card padding="md">
			<div class="filter-bar">
				<div class="filter-item search-box">
					<Input placeholder="Cari nama karyawan..." bind:value={searchQuery} />
				</div>
	
				<div class="filter-item">
					<label for="division-select">Mood:</label>
					<select id="division-select" bind:value={filterMood} class="custom-select">
						<option value="Semua">Semua Mood</option>
						<option value="Senang">Senang</option>
						<option value="Sedih">Sedih</option>
						<option value="Biasa">Biasa</option>
						<option value="Lelah">Lelah</option>
						<option value="Marah">Marah</option>
					</select>
				</div>
			</div>
	</Card>

	<!-- Using Card, Table & Avatar components for Mood Journal Logs -->
	<Card padding="lg">
		<h2 class="card-title">Jurnal Mood Karyawan Hari Ini</h2>
		<Table hoverable striped bordered>
			<thead>
				<tr>
					<th>Karyawan</th>
					<th>Status Mood</th>
					<th>Catatan / Evaluasi</th>
					<th>Waktu Log</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredRecords as log}
					<tr>
						<td class="user-cell">
							<Avatar name={log.name} size={32} />
							<span><strong>{log.name}</strong></span>
						</td>
						<td>
							<Badge variant={log.mood === 'senang' ? 'success' : log.mood === 'biasa' ? 'primary' : 'warning'}>
								{log.mood.toUpperCase()}
							</Badge>
						</td>
						<td>{log.note}</td>
						<td>{log.time}</td>
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

	.custom-select,
	.custom-date {
		padding: 0.6rem 0.8rem;
		border-radius: var(--radius-md, 10px);
		border: 1px solid var(--color-border);
		background: var(--color-background);
		color: var(--color-text);
		font-size: 0.9rem;
		outline: none;
		transition: 0.2s;
	}

	.custom-select:focus,
	.custom-date:focus {
		border-color: var(--color-primary);
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
</style>
