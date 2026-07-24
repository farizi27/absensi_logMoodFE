<script lang="ts">
	import AttendanceCard from "$lib/components/attendance/AttendanceCard.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import EmptyState from "$lib/components/common/EmptyState.svelte";
	import { CheckCircle, Clock, AlertTriangle, UserX, Download } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { getAllAttendanceLogs } from "$lib/services/attendance.service";
	import { getDepartments } from "$lib/services/department.service";
	import type { AttendanceLog } from "$lib/types/attendance";
	import type { Department } from "$lib/types/department";

	// Initial date set to Today (YYYY-MM-DD)
	let searchQuery = $state("");
	let filterDivision = $state("Semua");
	let filterDate = $state(new Date().toISOString().split("T")[0]);

	let attendanceLogs = $state<AttendanceLog[]>([]);
	let departments = $state<Department[]>([]);
	let isLoading = $state(false);

	let selectedPhoto = $state<string | null>(null);
	let isPhotoModalOpen = $state(false);

	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}

	function viewPhoto(photoUrl: string) {
		selectedPhoto = photoUrl;
		isPhotoModalOpen = true;
	}

	async function loadData() {
		try {
			isLoading = true;
			const [logsRes, deptRes] = await Promise.all([
				getAllAttendanceLogs().catch(() => ({ data: [] })),
				getDepartments().catch(() => ({ data: [] }))
			]);
			attendanceLogs = logsRes.data || [];
			departments = deptRes.data || [];
		} catch (error: any) {
			console.error(error);
			showToast(error?.message || "Gagal mengambil data absensi", "danger");
		} finally {
			isLoading = false;
		}
	}

	onMount(loadData);

	// Summary Cards recalculated based on the selected filterDate!
	const dateFilteredLogs = $derived(
		attendanceLogs.filter((log) => {
			if (!filterDate) return true;
			// Extract YYYY-MM-DD from attendanceDate or createdAt
			const logDate = log.attendanceDate 
				? log.attendanceDate.split("T")[0] 
				: log.createdAt ? log.createdAt.split("T")[0] : "";
			return logDate === filterDate;
		})
	);

	const stats = $derived(() => {
		const logsForDate = dateFilteredLogs;
		const total = logsForDate.length;

		const presentCount = logsForDate.filter(l => l.attendanceStatus === "present").length;
		const lateCount = logsForDate.filter(l => l.attendanceStatus === "late").length;
		const absentCount = logsForDate.filter(l => l.attendanceStatus === "absent").length;
		const leaveCount = logsForDate.filter(l => l.attendanceStatus === "leave").length;

		const presentPct = total > 0 ? Math.round((presentCount / total) * 100) : 0;

		return [
			{
				title: "Hadir Tepat Waktu",
				value: presentCount.toString(),
				desc: `${presentPct}% dari total presensi`,
				color: "success" as const,
				iconComp: CheckCircle
			},
			{
				title: "Terlambat",
				value: lateCount.toString(),
				desc: "Melewati jam 08:00",
				color: "warning" as const,
				iconComp: Clock
			},
			{
				title: "Izin / Sakit",
				value: leaveCount.toString(),
				desc: "Keterangan izin",
				color: "primary" as const,
				iconComp: AlertTriangle
			},
			{
				title: "Tanpa Keterangan",
				value: absentCount.toString(),
				desc: "Alpha",
				color: "danger" as const,
				iconComp: UserX
			}
		];
	});

	// Filter records for table view
	const filteredRecords = $derived(
		attendanceLogs.filter((rec) => {
			const name = rec.employeeName ?? "";
			const matchName = name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchDiv = filterDivision === "Semua" || rec.departmentName === filterDivision;

			const logDate = rec.attendanceDate 
				? rec.attendanceDate.split("T")[0] 
				: rec.createdAt ? rec.createdAt.split("T")[0] : "";
			const matchDate = !filterDate || logDate === filterDate;

			return matchName && matchDiv && matchDate;
		})
	);

	function formatTime(timeStr: string | null): string {
		if (!timeStr) return "-";
		try {
			const date = new Date(timeStr);
			if (isNaN(date.getTime())) return timeStr;
			return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
		} catch {
			return timeStr;
		}
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return "-";
		try {
			const date = new Date(dateStr);
			if (isNaN(date.getTime())) return dateStr;
			return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
		} catch {
			return dateStr;
		}
	}

	function getStatusBadge(status: string): { label: string; variant: "success" | "warning" | "danger" | "info" } {
		switch (status) {
			case "present":
				return { label: "Hadir", variant: "success" };
			case "late":
				return { label: "Terlambat", variant: "warning" };
			case "absent":
				return { label: "Alpha", variant: "danger" };
			case "leave":
				return { label: "Izin", variant: "info" };
			default:
				return { label: status || "Hadir", variant: "success" };
		}
	}
</script>

<svelte:head>
	<title>Monitoring Absensi - Admin</title>
</svelte:head>

<Toast 
	visible={toastVisible} 
	message={toastMessage} 
	type={toastType} 
	onClose={() => toastVisible = false} 
/>

{#if isLoading}
	<Spinner fullscreen label="Memuat data presensi..." />
{/if}

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

	<!-- Stats Cards recalculated by date filter -->
	<div class="stats-grid">
		{#each stats() as stat}
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

	<!-- Filter Bar -->
	<Card padding="md">
		<div class="filter-bar">
			<div class="filter-item search-box">
				<Input placeholder="Cari nama karyawan..." bind:value={searchQuery} />
			</div>

			<div class="filter-item">
				<label for="division-select">Department:</label>
				<select id="division-select" bind:value={filterDivision} class="custom-select">
					<option value="Semua">Semua Department</option>
					{#each departments as dept}
						<option value={dept.departmentsName}>{dept.departmentsName}</option>
					{/each}
				</select>
			</div>

			<div class="filter-item">
				<label for="date-select">Tanggal:</label>
				<input id="date-select" type="date" bind:value={filterDate} class="custom-date" />
			</div>
		</div>
	</Card>

	<!-- Table UI components -->
	<Card padding="lg">
		<h2 class="card-title">Daftar Log Presensi</h2>
		<Table hoverable striped bordered>
			<thead>
				<tr>
					<th>Selfie</th>
					<th>Nama Karyawan</th>
					<th>Department</th>
					<th>Tanggal</th>
					<th>Jam Masuk</th>
					<th>Jam Keluar</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each filteredRecords as record}
					{@const statusBadge = getStatusBadge(record.attendanceStatus)}
					<tr>
						<td>
							{#if record.photoIn}
								<button class="photo-preview-btn" onclick={() => viewPhoto(record.photoIn!)} title="Lihat Foto Selfie">
									<Avatar src={record.photoIn} name={record.employeeName ?? "Selfie"} size={36} />
								</button>
							{:else}
								<span class="no-photo">-</span>
							{/if}
						</td>
						<td><strong>{record.employeeName ?? "Unknown"}</strong></td>
						<td>{record.departmentName ?? "-"}</td>
						<td>{formatDate(record.attendanceDate)}</td>
						<td>{formatTime(record.checkIn)}</td>
						<td>{formatTime(record.checkOut)}</td>
						<td>
							<Badge variant={statusBadge.variant}>
								{statusBadge.label}
							</Badge>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="7">
							<EmptyState
								title="Tidak ada log presensi"
								description="Belum ada catatan presensi karyawan yang sesuai dengan filter."
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Card>
</div>

<!-- Modal Detail Foto Selfie Admin -->
<Modal open={isPhotoModalOpen} title="Foto Selfie Presensi Karyawan" onClose={() => isPhotoModalOpen = false}>
	{#if selectedPhoto}
		<div class="modal-photo-content">
			<img src={selectedPhoto} alt="Foto Selfie Presensi Karyawan" class="full-photo" />
		</div>
	{/if}
</Modal>

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

	.photo-preview-btn {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.photo-preview-btn:hover {
		transform: scale(1.1);
	}

	.no-photo {
		color: var(--color-text-light);
		font-size: 0.9rem;
	}

	.modal-photo-content {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem 0;
	}

	.full-photo {
		max-width: 100%;
		max-height: 400px;
		border-radius: var(--radius-md, 12px);
		box-shadow: var(--shadow-md);
		object-fit: contain;
	}
</style>
