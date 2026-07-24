<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import EmptyState from "$lib/components/common/EmptyState.svelte";
	import { Image } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { getMyAttendanceHistory } from "$lib/services/attendance.service";
	import type { AttendanceLog } from "$lib/types/attendance";

	let logs = $state<AttendanceLog[]>([]);
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

	function formatTime(timeStr: string | null): string {
		if (!timeStr) return "-";
		try {
			const date = new Date(timeStr);
			if (isNaN(date.getTime())) return timeStr;
			return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
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
				return { label: "Tepat Waktu", variant: "success" };
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

	function viewPhoto(photoUrl: string) {
		selectedPhoto = photoUrl;
		isPhotoModalOpen = true;
	}

	async function loadHistory() {
		try {
			isLoading = true;
			const res = await getMyAttendanceHistory();
			logs = res.data || [];
		} catch (error: any) {
			console.error(error);
			showToast(error?.message || "Gagal mengambil riwayat presensi", "danger");
		} finally {
			isLoading = false;
		}
	}

	onMount(loadHistory);
</script>

<svelte:head>
	<title>Riwayat Absensi - Karyawan</title>
</svelte:head>

<Toast 
	visible={toastVisible} 
	message={toastMessage} 
	type={toastType} 
	onClose={() => toastVisible = false} 
/>

{#if isLoading}
	<Spinner fullscreen label="Memuat riwayat..." />
{/if}

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Riwayat Absensi</h1>
			<p>Daftar riwayat kehadiran presensi bulanan Anda.</p>
		</div>
	</div>

	<Card border padding="lg">
		<Table hoverable striped bordered>
			<thead>
				<tr>
					<th>Foto Selfie</th>
					<th>Tanggal</th>
					<th>Jam Masuk</th>
					<th>Jam Keluar</th>
					<th>Status</th>
				</tr>
			</thead>
			<tbody>
				{#each logs as item}
					{@const statusInfo = getStatusBadge(item.attendanceStatus)}
					<tr>
						<td>
							{#if item.photoIn}
								<button class="photo-preview-btn" onclick={() => viewPhoto(item.photoIn!)} title="Klik untuk lihat foto full">
									<Avatar src={item.photoIn} name="Selfie Presensi" size={42} />
								</button>
							{:else}
								<span class="no-photo">-</span>
							{/if}
						</td>
						<td><strong>{formatDate(item.attendanceDate)}</strong></td>
						<td>{formatTime(item.checkIn)}</td>
						<td>{formatTime(item.checkOut)}</td>
						<td>
							<Badge variant={statusInfo.variant}>
								{statusInfo.label}
							</Badge>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="5">
							<EmptyState
								title="Tidak ada riwayat"
								description="Belum ada data presensi yang tercatat."
							/>
						</td>
					</tr>
				{/each}
			</tbody>
		</Table>
	</Card>
</div>

<!-- Modal Detail Foto Selfie Presensi -->
<Modal open={isPhotoModalOpen} title="Foto Selfie Presensi" onClose={() => isPhotoModalOpen = false}>
	{#if selectedPhoto}
		<div class="modal-photo-content">
			<img src={selectedPhoto} alt="Foto Selfie Presensi" class="full-photo" />
		</div>
	{/if}
</Modal>

<style>
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
