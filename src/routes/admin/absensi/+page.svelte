<script lang="ts">
	import AttendanceCard from "$lib/components/attendance/AttendanceCard.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import { CheckCircle, Clock, AlertTriangle, UserX, Download } from "@lucide/svelte";

	let searchQuery = $state("");
	let filterDivision = $state("Semua");
	let filterDate = $state(new Date().toISOString().split("T")[0]);

	const attendanceStats = [
		{ title: "Hadir Tepat Waktu", value: "38", desc: "80% dari total", color: "success" as const, iconComp: CheckCircle },
		{ title: "Terlambat", value: "4", desc: "Perlu konfirmasi", color: "warning" as const, iconComp: Clock },
		{ title: "Izin / Sakit", value: "4", desc: "Dengan surat keterangan", color: "primary" as const, iconComp: AlertTriangle },
		{ title: "Tanpa Keterangan", value: "2", desc: "Alpha", color: "danger" as const, iconComp: UserX }
	];

	const attendanceRecords = [
		{ name: "Budi Santoso", division: "IT Engineering", date: "2026-07-22", checkIn: "07:55:12", checkOut: "17:02:40", status: "Hadir" },
		{ name: "Siti Rahma", division: "Human Resources", date: "2026-07-22", checkIn: "08:02:10", checkOut: "17:00:15", status: "Hadir" },
		{ name: "Ahmad Rizky", division: "Marketing", date: "2026-07-22", checkIn: "08:35:00", checkOut: "17:15:30", status: "Terlambat" },
		{ name: "Dewi Lestari", division: "Finance", date: "2026-07-22", checkIn: "-", checkOut: "-", status: "Izin" }
	];

	const filteredRecords = $derived(
		attendanceRecords.filter((rec) => {
			const matchName = rec.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchDiv = filterDivision === "Semua" || rec.division === filterDivision;
			const matchDate = !filterDate || rec.date === filterDate;
			return matchName && matchDiv && matchDate;
		})
	);
</script>

<svelte:head>
	<title>Monitoring Absensi - Admin</title>
</svelte:head>

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Monitoring Absensi</h1>
			<p>Pantau kehadiran karyawan secara real-time.</p>
		</div>
		<Button variant="secondary">
			<Download size={18} style="margin-right: 6px;" />
			Export Rekap
		</Button>
	</div>

	<!-- Using AttendanceCard components -->
	<div class="stats-grid">
		{#each attendanceStats as stat}
			<AttendanceCard
				title={stat.title}
				value={stat.value}
				description={stat.desc}
				color={stat.color}
			>
				{#snippet icon()}
					<stat.iconComp size={24} />
				{/snippet}
			</AttendanceCard>
		{/each}
	</div>

	<!-- Filter Bar using Card UI: Search Name, Filter Division, Filter Date -->
	<Card padding="md">
		<div class="filter-bar">
			<div class="filter-item search-box">
				<Input placeholder="Cari nama karyawan..." bind:value={searchQuery} />
			</div>

			<div class="filter-item">
				<label for="division-select">Divisi:</label>
				<select id="division-select" bind:value={filterDivision} class="custom-select">
					<option value="Semua">Semua Divisi</option>
					<option value="IT Engineering">IT Engineering</option>
					<option value="Human Resources">Human Resources</option>
					<option value="Marketing">Marketing</option>
					<option value="Finance">Finance</option>
					<option value="Operations">Operations</option>
				</select>
			</div>

			<div class="filter-item">
				<label for="date-select">Tanggal:</label>
				<input id="date-select" type="date" bind:value={filterDate} class="custom-date" />
			</div>
		</div>
	</Card>

	<!-- Table using Card & Table UI components -->
	<Card padding="lg">
		<h2 class="card-title">Daftar Log Presensi</h2>
		<Table hoverable striped bordered>
			<thead>
				<tr>
					<th>Nama Karyawan</th>
					<th>Divisi</th>
					<th>Tanggal</th>
					<th>Jam Masuk</th>
					<th>Jam Keluar</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredRecords as record}
					<tr>
						<td><strong>{record.name}</strong></td>
						<td>{record.division}</td>
						<td>{record.date}</td>
						<td>{record.checkIn}</td>
						<td>{record.checkOut}</td>
						<td>
							<Badge variant={record.status === 'Hadir' ? 'success' : record.status === 'Terlambat' ? 'warning' : 'info'}>
								{record.status}
							</Badge>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="6" class="no-data">Tidak ada data presensi yang sesuai dengan filter.</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Card>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header-action {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
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

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.25rem;
	}

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

	.card-title {
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--color-text);
	}

	.no-data {
		text-align: center;
		padding: 2rem;
		color: var(--color-text-light);
	}
</style>
