<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import EmptyState from "$lib/components/common/EmptyState.svelte";
	import StatisticCard from "$lib/components/attendance/StatisticCard.svelte";
	import type { DashboardResponse } from "$lib/types/dashboard";
	import { Users, ClipboardCheck, Smile, Building2 } from "@lucide/svelte";

	import { onMount } from "svelte";
	import { getDashboard } from "$lib/services/dashboard.service";

	let dashboard = $state<DashboardResponse["data"] | null>(null);

	onMount(async () => {
		try {
			const result = await getDashboard();

			dashboard = result.data;

		} catch (err) {
			console.error(err);
		}
	});
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
	<StatisticCard
		title="Total Karyawan"
		value={`${dashboard?.summary.totalEmployees ?? 0}`}
		description="Karyawan Aktif"
		variant="primary"
	>
		{#snippet icon()}
			<Users size={24} />
		{/snippet}
	</StatisticCard>

	<StatisticCard
		title="Kehadiran Hari Ini"
		value={`${dashboard?.summary.attendanceToday ?? 0}`}
		description={`${dashboard?.summary.attendancePercentage ?? 0}% Hadir`}
		variant="success"
	>
		{#snippet icon()}
			<ClipboardCheck size={24} />
		{/snippet}
	</StatisticCard>

	<StatisticCard
		title="Mood Hari Ini"
		value={dashboard?.summary.averageMood ?? "-"}
		description="Mood Terbanyak Hari Ini"
		variant="warning"
	>
		{#snippet icon()}
			<Smile size={24} />
		{/snippet}
	</StatisticCard>

	<StatisticCard
		title="Total Divisi"
		value={`${dashboard?.summary.totalDepartments ?? 0}`}
		description="Divisi Aktif"
		variant="secondary"
	>
		{#snippet icon()}
			<Building2 size={24} />
		{/snippet}
	</StatisticCard>
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
			{#if dashboard?.recentAttendance?.length}
				{#each dashboard.recentAttendance as row}
					<tr>
						<td class="user-cell">
							<Avatar name={row.employeeName} size={32} />
							<strong>{row.employeeName}</strong>
						</td>

						<td>{row.department ?? "-"}</td>

						<td>
							{row.checkIn
								? new Date(row.checkIn).toLocaleTimeString("id-ID", {
										hour: "2-digit",
										minute: "2-digit"
								})
								: "-"}
						</td>

						<td>
							<Badge
								variant={
									row.attendanceStatus === "present"
										? "success"
										: row.attendanceStatus === "late"
										? "warning"
										: "danger"
								}
							>
								{
									row.attendanceStatus === "present"
										? "Tepat Waktu"
										: row.attendanceStatus === "late"
										? "Terlambat"
										: "Tidak Hadir"
								}
							</Badge>
						</td>

						<td>{row.mood ?? "-"}</td>
					</tr>
				{/each}
			{:else}
				<tr>
					<td colspan="5" style="text-align:center; padding:2rem;">
						<EmptyState
							title="Tidak ada log presensi"
							description="Belum ada catatan presensi karyawan."
						/>
					</td>
				</tr>
			{/if}
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
