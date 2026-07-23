<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import StatisticCard from "$lib/components/attendance/StatisticCard.svelte";
	import { Users, ClipboardCheck, Smile, Building2 } from "@lucide/svelte";

	const stats = [
		{ title: "Total Karyawan", value: "48", description: "+4 bulan ini", variant: "primary" as const, iconComponent: Users },
		{ title: "Kehadiran Hari Ini", value: "42 / 48", description: "87.5% Hadir", variant: "success" as const, iconComponent: ClipboardCheck },
		{ title: "Mood Rata-rata", value: "Senang (4.2/5)", description: "Stabil minggu ini", variant: "warning" as const, iconComponent: Smile },
		{ title: "Total Divisi", value: "6 Divisi", description: "Semua aktif", variant: "secondary" as const, iconComponent: Building2 }
	];

	const recentAttendance = [
		{ name: "Budi Santoso", division: "IT Engineering", time: "07:55 AM", status: "Tepat Waktu", mood: "😄 Senang" },
		{ name: "Siti Rahma", division: "Human Resources", time: "08:02 AM", status: "Tepat Waktu", mood: "😊 Baik" },
		{ name: "Ahmad Rizky", division: "Marketing", time: "08:25 AM", status: "Terlambat", mood: "😐 Netral" },
		{ name: "Dewi Lestari", division: "Finance", time: "07:48 AM", status: "Tepat Waktu", mood: "😄 Senang" }
	];
</script>

<svelte:head>
	<title>Dashboard Admin - LogMood</title>
</svelte:head>

<div class="dashboard-page">
	<div class="header-section">
		<div>
			<h1>Dashboard Overview</h1>
			<p>Ringkasan statistik kehadiran dan mood karyawan hari ini.</p>
		</div>
	</div>

	<!-- Stats Grid using StatisticCard Component -->
	<div class="stats-grid">
		{#each stats as item}
			<StatisticCard
				title={item.title}
				value={item.value}
				description={item.description}
				variant={item.variant}
			>
				{#snippet icon()}
					<item.iconComponent size={24} />
				{/snippet}
			</StatisticCard>
		{/each}
	</div>

	<!-- Recent Attendance using Card, Table, Avatar & Badge Components -->
	<Card padding="lg">
		<h2 class="card-title">Absensi & Mood Terkini</h2>
		<Table hoverable striped bordered>
			<thead>
				<tr>
					<th>Karyawan</th>
					<th>Divisi</th>
					<th>Waktu Masuk</th>
					<th>Status</th>
					<th>Mood</th>
				</tr>
			</thead>
			<tbody>
				{#each recentAttendance as row}
					<tr>
						<td class="user-cell">
							<Avatar name={row.name} size={32} />
							<span><strong>{row.name}</strong></span>
						</td>
						<td>{row.division}</td>
						<td>{row.time}</td>
						<td>
							<Badge variant={row.status === 'Tepat Waktu' ? 'success' : 'warning'}>
								{row.status}
							</Badge>
						</td>
						<td>{row.mood}</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Card>
</div>

<style>
	.dashboard-page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.header-section h1 {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.25rem;
	}

	.header-section p {
		color: var(--color-text-light);
		font-size: 0.95rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
