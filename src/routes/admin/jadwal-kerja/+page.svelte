<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { onMount } from "svelte";
	import {
		getWorkSchedules,
		createWorkSchedule,
		updateWorkSchedule,
		deleteWorkSchedule
	} from "$lib/services/workSchedule.service";
	import type { WorkSchedule } from "$lib/types/workSchedule";
	import { Clock, Plus, Pencil, Trash2, AlertTriangle, Timer } from "@lucide/svelte";
	import ConfirmDialog from "$lib/components/common/ConfirmDialog.svelte";
	import EmptyState from "$lib/components/common/EmptyState.svelte";

	// ── Data ────────────────────────────────────────────────
	let schedules = $state<WorkSchedule[]>([]);

	// ── Loading ──────────────────────────────────────────────
	let isLoading = $state(false);

	// ── Toast ────────────────────────────────────────────────
	let toastVisible  = $state(false);
	let toastMessage  = $state("");
	let toastType     = $state<"success" | "danger" | "warning" | "info">("success");

	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType    = type;
		toastVisible = true;
	}

	// ── Add Modal ────────────────────────────────────────────
	let isAddModalOpen    = $state(false);
	let newName           = $state("");
	let newStart          = $state("");
	let newEnd            = $state("");
	let newTolerance      = $state(0);

	function openAddModal() {
		newName      = "";
		newStart     = "";
		newEnd       = "";
		newTolerance = 0;
		isAddModalOpen = true;
	}
	function closeAddModal() { isAddModalOpen = false; }

	// ── Edit Modal ───────────────────────────────────────────
	let isEditModalOpen   = $state(false);
	let editId            = $state<number | null>(null);
	let editName          = $state("");
	let editStart         = $state("");
	let editEnd           = $state("");
	let editTolerance     = $state(0);

	function openEditModal(s: WorkSchedule) {
		editId        = s.id;
		editName      = s.scheduleName;
		// strip seconds from "HH:MM:SS" → "HH:MM"
		editStart     = s.startTime.slice(0, 5);
		editEnd       = s.endTime.slice(0, 5);
		editTolerance = s.toleranceMinutes;
		isEditModalOpen = true;
	}
	function closeEditModal() { isEditModalOpen = false; editId = null; }

	// ── Delete Modal ─────────────────────────────────────────
	let isDeleteModalOpen = $state(false);
	let schedToDelete     = $state<WorkSchedule | null>(null);

	function confirmDelete(s: WorkSchedule) {
		schedToDelete    = s;
		isDeleteModalOpen = true;
	}

	// ── Helpers ──────────────────────────────────────────────
	function formatTime(t: string) {
		// "08:00:00" → "08:00"
		return t.slice(0, 5);
	}

	function formatDuration(start: string, end: string) {
		const [sh, sm] = start.split(":").map(Number);
		const [eh, em] = end.split(":").map(Number);
		const total = (eh * 60 + em) - (sh * 60 + sm);
		const h = Math.floor(total / 60);
		const m = total % 60;
		if (m === 0) return `${h} jam`;
		return `${h} jam ${m} menit`;
	}

	// ── Load ─────────────────────────────────────────────────
	async function loadSchedules() {
		try {
			isLoading = true;
			const res = await getWorkSchedules();
			schedules = res.data;
		} catch (err: any) {
			showToast(err?.message ?? "Gagal memuat jadwal kerja", "danger");
		} finally {
			isLoading = false;
		}
	}

	onMount(loadSchedules);

	// ── CRUD ─────────────────────────────────────────────────
	async function handleAdd() {
		if (!newName || !newStart || !newEnd) {
			showToast("Nama jadwal, jam masuk, dan jam pulang wajib diisi", "warning");
			return;
		}
		try {
			isLoading = true;
			await createWorkSchedule({
				scheduleName: newName,
				startTime:    newStart,
				endTime:      newEnd,
				toleranceMinutes: newTolerance
			});
			await loadSchedules();
			closeAddModal();
			showToast("Jadwal kerja berhasil ditambahkan", "success");
		} catch (err: any) {
			showToast(err?.message ?? "Gagal menambahkan jadwal", "danger");
		} finally {
			isLoading = false;
		}
	}

	async function handleEdit() {
		if (!editId) return;
		if (!editName || !editStart || !editEnd) {
			showToast("Nama jadwal, jam masuk, dan jam pulang wajib diisi", "warning");
			return;
		}
		try {
			isLoading = true;
			await updateWorkSchedule(editId, {
				scheduleName: editName,
				startTime:    editStart,
				endTime:      editEnd,
				toleranceMinutes: editTolerance
			});
			await loadSchedules();
			closeEditModal();
			showToast("Jadwal kerja berhasil diperbarui", "success");
		} catch (err: any) {
			showToast(err?.message ?? "Gagal memperbarui jadwal", "danger");
		} finally {
			isLoading = false;
		}
	}

	async function handleDelete() {
		if (!schedToDelete) return;
		try {
			isLoading = true;
			await deleteWorkSchedule(schedToDelete.id);
			await loadSchedules();
			showToast("Jadwal kerja berhasil dihapus", "success");
			isDeleteModalOpen = false;
			schedToDelete     = null;
		} catch (err: any) {
			showToast(err?.message ?? "Gagal menghapus jadwal", "danger");
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Jadwal Kerja - LogMood Admin</title>
</svelte:head>

<Toast visible={toastVisible} message={toastMessage} type={toastType} onClose={() => toastVisible = false} />

{#if isLoading}
	<Spinner fullscreen label="Sedang memproses..." />
{/if}

<div class="page-container">

	<!-- Header -->
	<div class="header-action">
		<div>
			<h1>Jadwal Kerja</h1>
			<p>Kelola jadwal dan jam kerja karyawan.</p>
		</div>
		<Button onClick={openAddModal}>
			<Plus size={18} style="margin-right: 6px;" />
			Tambah Jadwal
		</Button>
	</div>

	<!-- Cards Grid -->
	{#if schedules.length === 0 && !isLoading}
		<EmptyState
			title="Belum ada jadwal kerja"
			description="Klik tombol 'Tambah Jadwal' untuk membuat jadwal baru."
		>
			{#snippet icon()}
				<Clock size={36} strokeWidth={1.5} />
			{/snippet}
		</EmptyState>
	{:else}
		<div class="schedules-grid">
			{#each schedules as sched (sched.id)}
				<Card hover border padding="lg">
					<!-- Icon header -->
					<div class="card-head">
						<div class="icon-wrap">
							<Clock size={22} />
						</div>
					</div>

					<h3 class="sched-title">{sched.scheduleName}</h3>

					<div class="time-row">
						<div class="time-block">
							<span class="time-label">Masuk</span>
							<span class="time-value">{formatTime(sched.startTime)}</span>
						</div>
						<div class="time-sep">→</div>
						<div class="time-block">
							<span class="time-label">Pulang</span>
							<span class="time-value">{formatTime(sched.endTime)}</span>
						</div>
					</div>

					<div class="meta-row">
						<div class="meta-item">
							<Timer size={14} />
							<span>Durasi: <strong>{formatDuration(sched.startTime, sched.endTime)}</strong></span>
						</div>
						<div class="meta-item">
							<Clock size={14} />
							<span>Toleransi: <strong>{sched.toleranceMinutes} menit</strong></span>
						</div>
					</div>

					<div class="card-footer">
						<Button variant="ghost" size="sm" onClick={() => openEditModal(sched)}>
							<Pencil size={15} style="margin-right: 4px;" />
							Edit
						</Button>
						<Button variant="danger" size="sm" onClick={() => confirmDelete(sched)}>
							<Trash2 size={15} />
						</Button>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>

<!-- ── Modal Tambah ──────────────────────────────────────── -->
<Modal open={isAddModalOpen} title="Tambah Jadwal Kerja" onClose={closeAddModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleAdd(); }} class="modal-form">
		<Input
			label="Nama Jadwal"
			placeholder="Contoh: Shift Pagi, Office Hours"
			bind:value={newName}
			required
		/>
		<div class="form-row">
			<div class="form-col">
				<label class="field-label">Jam Masuk</label>
				<input type="time" class="time-input" bind:value={newStart} required />
			</div>
			<div class="form-col">
				<label class="field-label">Jam Pulang</label>
				<input type="time" class="time-input" bind:value={newEnd} required />
			</div>
		</div>
		<div class="form-col">
			<label class="field-label">Toleransi Keterlambatan (menit)</label>
			<input
				type="number"
				class="time-input"
				min="0"
				max="120"
				placeholder="0"
				bind:value={newTolerance}
			/>
		</div>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeAddModal}>Batal</Button>
		<Button onClick={handleAdd}>
			<Plus size={16} style="margin-right: 6px;" />
			Simpan Jadwal
		</Button>
	{/snippet}
</Modal>

<!-- ── Modal Edit ────────────────────────────────────────── -->
<Modal open={isEditModalOpen} title="Edit Jadwal Kerja" onClose={closeEditModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleEdit(); }} class="modal-form">
		<Input
			label="Nama Jadwal"
			placeholder="Contoh: Shift Pagi, Office Hours"
			bind:value={editName}
			required
		/>
		<div class="form-row">
			<div class="form-col">
				<label class="field-label">Jam Masuk</label>
				<input type="time" class="time-input" bind:value={editStart} required />
			</div>
			<div class="form-col">
				<label class="field-label">Jam Pulang</label>
				<input type="time" class="time-input" bind:value={editEnd} required />
			</div>
		</div>
		<div class="form-col">
			<label class="field-label">Toleransi Keterlambatan (menit)</label>
			<input
				type="number"
				class="time-input"
				min="0"
				max="120"
				bind:value={editTolerance}
			/>
		</div>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeEditModal}>Batal</Button>
		<Button onClick={handleEdit}>
			<Pencil size={16} style="margin-right: 6px;" />
			Simpan Perubahan
		</Button>
	{/snippet}
</Modal>

<!-- ── Modal Hapus ───────────────────────────────────────── -->
<ConfirmDialog
	open={isDeleteModalOpen}
	title="Konfirmasi Hapus Jadwal"
	message={`Apakah Anda yakin ingin menghapus jadwal ${schedToDelete?.scheduleName}? Karyawan yang terhubung ke jadwal ini perlu diperbarui secara manual.`}
	confirmText="Ya, Hapus Jadwal"
	cancelText="Batal"
	variant="danger"
	onConfirm={handleDelete}
	onCancel={() => isDeleteModalOpen = false}
>
	{#snippet icon()}
		<AlertTriangle size={48} color="var(--color-danger)" />
	{/snippet}
</ConfirmDialog>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* ── Header ── */
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
		margin: 0;
	}

	/* ── Grid ── */
	.schedules-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.25rem;
	}

	/* ── Card ── */
	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	.icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--color-primary-light, #dbeafe);
		color: var(--color-primary, #2563eb);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sched-title {
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 1rem 0;
	}

	/* ── Time row ── */
	.time-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--color-background, #f8fafc);
		border-radius: var(--radius-md, 10px);
		padding: 0.75rem 1rem;
		margin-bottom: 0.75rem;
	}
	.time-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
		flex: 1;
	}
	.time-label {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--color-text-light);
		font-weight: 600;
	}
	.time-value {
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--color-primary, #2563eb);
		font-variant-numeric: tabular-nums;
	}
	.time-sep {
		color: var(--color-text-light);
		font-size: 1rem;
	}

	/* ── Meta row ── */
	.meta-row {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-bottom: 1rem;
	}
	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--color-text-light);
	}
	.meta-item strong {
		color: var(--color-text);
	}

	/* ── Card footer ── */
	.card-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid var(--color-border);
	}

	/* ── Modal Form ── */
	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.form-col {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.field-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
	}
	.time-input {
		padding: 0.6rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md, 8px);
		font-size: 0.9rem;
		color: var(--color-text);
		background: var(--color-surface, #fff);
		outline: none;
		transition: border-color 0.15s;
		width: 100%;
		box-sizing: border-box;
	}
	.time-input:focus {
		border-color: var(--color-primary, #2563eb);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}
</style>
