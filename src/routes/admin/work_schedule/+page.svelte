<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import Empty from "$lib/components/common/EmptyState.svelte";
	import { onMount } from "svelte";
	import {
		getWorkSchedules,
		createWorkSchedule,
		updateWorkSchedule,
		deleteWorkSchedule
	} from "$lib/services/workSchedule.service";
	import type { WorkSchedule } from "$lib/types/workSchedule";
	import { Clock, Plus, Pencil, Trash2, AlertTriangle, Timer, ArrowRight, CalendarClock } from "@lucide/svelte";

	// ─── State ─────────────────────────────────────────────
	let schedules    = $state<WorkSchedule[]>([]);
	let isLoading    = $state(false);

	// Toast
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType    = $state<"success" | "danger" | "warning" | "info">("success");

	function showToast(msg: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = msg; toastType = type; toastVisible = true;
	}

	// Add Modal
	let isAddOpen    = $state(false);
	let newName      = $state("");
	let newStart     = $state("");
	let newEnd       = $state("");
	let newTolerance = $state(0);

	function openAdd() { newName = ""; newStart = ""; newEnd = ""; newTolerance = 0; isAddOpen = true; }
	function closeAdd() { isAddOpen = false; }

	// Edit Modal
	let isEditOpen   = $state(false);
	let editId       = $state<number | null>(null);
	let editName     = $state("");
	let editStart    = $state("");
	let editEnd      = $state("");
	let editTolerance = $state(0);

	function openEdit(s: WorkSchedule) {
		editId = s.id;
		editName = s.scheduleName;
		editStart = s.startTime.slice(0, 5);
		editEnd   = s.endTime.slice(0, 5);
		editTolerance = s.toleranceMinutes;
		isEditOpen = true;
	}
	function closeEdit() { isEditOpen = false; editId = null; }

	// Delete Modal
	let isDeleteOpen  = $state(false);
	let schedToDelete = $state<WorkSchedule | null>(null);
	function confirmDelete(s: WorkSchedule) { schedToDelete = s; isDeleteOpen = true; }

	// ─── Helpers ───────────────────────────────────────────
	function fmt(t: string) { return t.slice(0, 5); }

	function duration(start: string, end: string) {
		const [sh, sm] = start.split(":").map(Number);
		const [eh, em] = end.split(":").map(Number);
		const mins = (eh * 60 + em) - (sh * 60 + sm);
		const h = Math.floor(mins / 60);
		const m = mins % 60;
		return m === 0 ? `${h} jam` : `${h} jam ${m} mnt`;
	}

	function themeColor(idx: number) {
		const colors = [
			{ main: "var(--color-primary)", light: "var(--color-primary-light)" },
			{ main: "var(--color-secondary)", light: "color-mix(in srgb, var(--color-secondary) 15%, transparent)" },
			{ main: "var(--color-success)", light: "color-mix(in srgb, var(--color-success) 15%, transparent)" },
			{ main: "var(--color-warning)", light: "color-mix(in srgb, var(--color-warning) 15%, transparent)" },
			{ main: "var(--color-danger)", light: "color-mix(in srgb, var(--color-danger) 15%, transparent)" }
		];
		return colors[idx % colors.length];
	}

	// ─── API ───────────────────────────────────────────────
	async function load() {
		try {
			isLoading = true;
			const res = await getWorkSchedules();
			schedules = res.data;
		} catch (e: any) {
			showToast(e?.message ?? "Gagal memuat jadwal kerja", "danger");
		} finally { isLoading = false; }
	}
	onMount(load);

	async function handleAdd() {
		if (!newName || !newStart || !newEnd) {
			showToast("Nama jadwal, jam masuk, dan jam pulang wajib diisi", "warning");
			return;
		}
		try {
			isLoading = true;
			await createWorkSchedule({ scheduleName: newName, startTime: newStart, endTime: newEnd, toleranceMinutes: newTolerance });
			await load();
			closeAdd();
			showToast("Jadwal berhasil ditambahkan");
		} catch (e: any) {
			showToast(e?.message ?? "Gagal menambahkan jadwal", "danger");
		} finally { isLoading = false; }
	}

	async function handleEdit() {
		if (!editId || !editName || !editStart || !editEnd) {
			showToast("Semua field wajib diisi", "warning");
			return;
		}
		try {
			isLoading = true;
			await updateWorkSchedule(editId, { scheduleName: editName, startTime: editStart, endTime: editEnd, toleranceMinutes: editTolerance });
			await load();
			closeEdit();
			showToast("Jadwal berhasil diperbarui");
		} catch (e: any) {
			showToast(e?.message ?? "Gagal memperbarui jadwal", "danger");
		} finally { isLoading = false; }
	}

	async function handleDelete() {
		if (!schedToDelete) return;
		try {
			isLoading = true;
			await deleteWorkSchedule(schedToDelete.id);
			await load();
			showToast("Jadwal berhasil dihapus");
			isDeleteOpen = false; schedToDelete = null;
		} catch (e: any) {
			showToast(e?.message ?? "Gagal menghapus jadwal", "danger");
		} finally { isLoading = false; }
	}
</script>

<svelte:head>
	<title>Jadwal Kerja – LogMood Admin</title>
</svelte:head>

<Toast visible={toastVisible} message={toastMessage} type={toastType} onClose={() => toastVisible = false} />
{#if isLoading}<Spinner fullscreen label="Sedang memproses..." />{/if}

<!-- ════════════════════════════════════ PAGE ════════════════════════════════════ -->
<div class="page">

	<!-- Header -->
	<div class="page-header">
		<div class="header-left">
			<div class="header-icon">
				<CalendarClock size={22} />
			</div>
			<div>
				<h1>Jadwal Kerja</h1>
				<p>Kelola jam kerja dan toleransi keterlambatan karyawan.</p>
			</div>
		</div>
		<Button onClick={openAdd}>
			<Plus size={16} style="margin-right:6px;" />
			Tambah Jadwal
		</Button>
	</div>

	<!-- Summary bar -->
	{#if schedules.length > 0}
		<div class="stat-cards">
			<Card hover border padding="md">
				<div class="stat-inner">
					<div class="stat-icon" style="background:var(--color-primary-light); color:var(--color-primary)">
						<CalendarClock size={20} />
					</div>
					<div>
						<span class="stat-num">{schedules.length}</span>
						<span class="stat-label">Total Jadwal</span>
					</div>
				</div>
			</Card>
			<Card hover border padding="md">
				<div class="stat-inner">
					<div class="stat-icon" style="background:color-mix(in srgb, var(--color-success) 15%, transparent); color:var(--color-success)">
						<Timer size={20} />
					</div>
					<div>
						<span class="stat-num">{Math.min(...schedules.map(s => s.toleranceMinutes))} mnt</span>
						<span class="stat-label">Toleransi Min</span>
					</div>
				</div>
			</Card>
			<Card hover border padding="md">
				<div class="stat-inner">
					<div class="stat-icon" style="background:color-mix(in srgb, var(--color-warning) 15%, transparent); color:var(--color-warning)">
						<Clock size={20} />
					</div>
					<div>
						<span class="stat-num">{Math.max(...schedules.map(s => s.toleranceMinutes))} mnt</span>
						<span class="stat-label">Toleransi Maks</span>
					</div>
				</div>
			</Card>
		</div>
	{/if}

	<!-- Grid -->
	{#if schedules.length === 0 && !isLoading}
		<Empty
			title="Belum ada jadwal kerja"
			description='Klik tombol "Tambah Jadwal" untuk membuat jadwal baru.'
		>
			{#snippet icon()}<Clock size={36} strokeWidth={1.5} />{/snippet}
			<Button onClick={openAdd} size="sm">
				<Plus size={15} style="margin-right:5px;"/>Buat Jadwal Pertama
			</Button>
		</Empty>
	{:else}
		<div class="grid">
			{#each schedules as sched, i (sched.id)}
				<div class="sched-card" style="--accent:{themeColor(i).main}">
					<!-- Accent top bar -->
					<div class="card-accent"></div>

					<div class="card-body">
						<!-- Title row -->
						<div class="card-title-row">
							<div class="card-icon" style="background:{themeColor(i).light}; color:{themeColor(i).main}">
								<Clock size={18}/>
							</div>
							<h3 class="card-title">{sched.scheduleName}</h3>
						</div>

						<!-- Time display -->
						<div class="time-display">
							<div class="time-block">
								<span class="time-tag">Masuk</span>
								<span class="time-big" style="color:{themeColor(i).main}">{fmt(sched.startTime)}</span>
							</div>

							<div class="time-arrow">
								<ArrowRight size={18} color="var(--color-text-light)" />
							</div>

							<div class="time-block">
								<span class="time-tag">Pulang</span>
								<span class="time-big" style="color:{themeColor(i).main}">{fmt(sched.endTime)}</span>
							</div>
						</div>

						<!-- Meta chips -->
						<div class="chip-row">
							<div class="chip">
								<Timer size={12} />
								{duration(sched.startTime, sched.endTime)} kerja
							</div>
							<div class="chip chip-warn">
								<Clock size={12} />
								Toleransi {sched.toleranceMinutes} mnt
							</div>
						</div>
					</div>

					<!-- Card footer -->
					<div class="card-footer">
						<button class="action-btn edit-btn" onclick={() => openEdit(sched)}>
							<Pencil size={14}/> Edit
						</button>
						<button class="action-btn delete-btn" onclick={() => confirmDelete(sched)}>
							<Trash2 size={14}/>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- ════════ Modal Tambah ════════ -->
<Modal open={isAddOpen} title="Tambah Jadwal Kerja" onClose={closeAdd}>
	<form onsubmit={(e) => { e.preventDefault(); handleAdd(); }} class="modal-form">
		<Input label="Nama Jadwal" placeholder="Contoh: Shift Pagi, Office Hours" bind:value={newName} required />

		<div class="form-row">
			<Input label="Jam Masuk" type="time" bind:value={newStart} required />
			<Input label="Jam Pulang" type="time" bind:value={newEnd} required />
		</div>

		<Input
			label="Toleransi Keterlambatan (menit)"
			type="number"
			placeholder="0"
			bind:value={newTolerance}
		/>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeAdd}>Batal</Button>
		<Button onClick={handleAdd}><Plus size={15} style="margin-right:5px;"/>Simpan Jadwal</Button>
	{/snippet}
</Modal>

<!-- ════════ Modal Edit ════════ -->
<Modal open={isEditOpen} title="Edit Jadwal Kerja" onClose={closeEdit}>
	<form onsubmit={(e) => { e.preventDefault(); handleEdit(); }} class="modal-form">
		<Input label="Nama Jadwal" placeholder="Contoh: Shift Pagi" bind:value={editName} required />

		<div class="form-row">
			<Input label="Jam Masuk" type="time" bind:value={editStart} required />
			<Input label="Jam Pulang" type="time" bind:value={editEnd} required />
		</div>

		<Input
			label="Toleransi Keterlambatan (menit)"
			type="number"
			placeholder="0"
			bind:value={editTolerance}
		/>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeEdit}>Batal</Button>
		<Button onClick={handleEdit}><Pencil size={15} style="margin-right:5px;"/>Simpan Perubahan</Button>
	{/snippet}
</Modal>

<!-- ════════ Modal Hapus ════════ -->
<Modal open={isDeleteOpen} title="Konfirmasi Hapus" onClose={() => isDeleteOpen = false}>
	<div class="delete-body">
		<div class="delete-icon"><AlertTriangle size={44} /></div>
		<p>Yakin ingin menghapus jadwal <strong>"{schedToDelete?.scheduleName}"</strong>?</p>
		<p class="delete-sub">Tindakan ini tidak dapat dibatalkan.</p>
	</div>
	{#snippet footer()}
		<Button variant="ghost" onClick={() => isDeleteOpen = false}>Batal</Button>
		<Button variant="danger" onClick={handleDelete}>Ya, Hapus</Button>
	{/snippet}
</Modal>

<style>
	/* ── Page ── */
	.page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	/* ── Header ── */
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.header-left {
		display: flex;
		align-items: center;
		gap: 0.875rem;
	}
	.header-icon {
		width: 46px;
		height: 46px;
		border-radius: 14px;
		background: var(--color-primary-light, #dbeafe);
		color: var(--color-primary, #2563eb);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.page-header h1 {
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 0.15rem;
	}
	.page-header p {
		color: var(--color-text-light);
		font-size: 0.875rem;
		margin: 0;
	}

	/* ── Stat Cards ── */
	.stat-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	.stat-inner {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.stat-num {
		display: block;
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--color-text);
		font-variant-numeric: tabular-nums;
		line-height: 1.2;
	}
	.stat-label {
		display: block;
		font-size: 0.75rem;
		color: var(--color-text-light);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 0.1rem;
	}

	/* ── Grid ── */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.25rem;
	}

	/* ── Schedule Card ── */
	.sched-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg, 16px);
		overflow: hidden;
		transition: box-shadow 0.2s, transform 0.2s;
		display: flex;
		flex-direction: column;
	}
	.sched-card:hover {
		box-shadow: 0 8px 24px rgba(0,0,0,0.08);
		transform: translateY(-2px);
	}
	.card-accent {
		height: 4px;
		background: var(--accent);
	}
	.card-body {
		padding: 1.25rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* Title row */
	.card-title-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.card-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.card-title {
		font-size: 1.05rem;
		font-weight: 650;
		color: var(--color-text);
		margin: 0;
		line-height: 1.3;
	}

	/* Time display */
	.time-display {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--color-background, #f8fafc);
		border-radius: var(--radius-md, 10px);
		padding: 0.875rem 1rem;
	}
	.time-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.2rem;
		flex: 1;
	}
	.time-tag {
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--color-text-light);
	}
	.time-big {
		font-size: 1.5rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
	}
	.time-arrow {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* Chips */
	.chip-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		padding: 0.3rem 0.65rem;
		border-radius: 999px;
		font-size: 0.78rem;
		font-weight: 500;
		background: var(--color-primary-light);
		color: var(--color-primary);
	}
	.chip-warn {
		background: color-mix(in srgb, var(--color-warning) 15%, transparent);
		color: var(--color-warning);
	}

	/* Card footer */
	.card-footer {
		padding: 0.75rem 1.25rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		background: var(--color-background, #f8fafc);
	}
	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.85rem;
		border-radius: var(--radius-sm, 8px);
		border: 1px solid var(--color-border);
		cursor: pointer;
		font-size: 0.82rem;
		font-weight: 500;
		transition: background 0.15s, border-color 0.15s, color 0.15s;
		background: var(--color-surface);
		color: var(--color-text);
	}
	.edit-btn:hover {
		background: var(--color-primary-light);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}
	.delete-btn {
		color: var(--color-danger);
		border-color: transparent;
	}
	.delete-btn:hover {
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border-color: color-mix(in srgb, var(--color-danger) 20%, transparent);
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
	/* ── Delete confirm ── */
	.delete-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		text-align: center;
	}
	.delete-icon {
		width: 72px;
		height: 72px;
		border-radius: 20px;
		background: color-mix(in srgb, var(--color-danger) 15%, transparent);
		color: var(--color-danger);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.delete-body p {
		margin: 0;
		color: var(--color-text);
		font-size: 0.95rem;
	}
	.delete-sub {
		color: var(--color-text-light) !important;
		font-size: 0.85rem !important;
	}
</style>
