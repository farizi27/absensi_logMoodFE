<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { onMount } from "svelte";
	import {
		getDepartments,
		createDepartment,
		updateDepartment,
		deleteDepartment
	} from "$lib/services/department.service";
	import type {
		Department
	} from "$lib/types/department";
	import { Building2, Plus, Users, Trash2, AlertTriangle, Pencil } from "@lucide/svelte";

	// State for Add Modal
	let isAddModalOpen = $state(false);
	let newDivName = $state("");
	let newDivDesc = $state("");

	// State for Edit Modal
	let isEditModalOpen = $state(false);
	let editDivId = $state<number | null>(null);
	let editDivName = $state("");
	let editDivDesc = $state("");

	// State for Delete Modal
	let isDeleteModalOpen = $state(false);
	let divToDelete = $state<any>(null);

	// State for Toast Notification
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	// Loading State
	let isLoading = $state(false);

	let departments = $state<Department[]>([]);

	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}

	function openAddModal() {
		newDivName = "";
		newDivDesc = "";
		isAddModalOpen = true;
	}

	function closeAddModal() {
		isAddModalOpen = false;
	}

	function openEditModal(department: Department) {
		editDivId = department.id;
		editDivName = department.departmentsName;
		editDivDesc = department.description;
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
		editDivId = null;
	}

	async function loadDepartments() {
		try {
			isLoading = true;

			const result = await getDepartments();
			console.log('API result:', result);
			departments = result.data;
		} catch (error) {
			console.error(error);

			showToast(
				"Gagal mengambil data department",
				"danger"
			);
		} finally {
			isLoading = false;
		}
	}

	onMount(loadDepartments);

	async function handleAddDepartment() {

		if (!newDivName || !newDivDesc) {

			showToast(
				"Nama Department dan Deskripsi wajib diisi",
				"warning"
			);

			return;
		}

		try {

			isLoading = true;

			await createDepartment({
				departmentsName: newDivName,
				description: newDivDesc
			});

			await loadDepartments();

			closeAddModal();

			showToast(
				"Department berhasil ditambahkan",
				"success"
			);

		} catch (error: any) {

			console.error(error);

			showToast(
				error?.message || "Gagal menambahkan Department",
				"danger"
			);

		} finally {

			isLoading = false;

		}

	}

	async function handleEditDepartment() {

		if (!editDivId) return;

		if (!editDivName || !editDivDesc) {

			showToast(
				"Nama Department dan Deskripsi wajib diisi",
				"warning"
			);

			return;
		}

		try {

			isLoading = true;

			await updateDepartment(editDivId, {
				departmentsName: editDivName,
				description: editDivDesc
			});

			await loadDepartments();

			closeEditModal();

			showToast(
				"Department berhasil diperbarui",
				"success"
			);

		} catch (error: any) {

			console.error(error);

			showToast(
				error?.message || "Gagal memperbarui Department",
				"danger"
			);

		} finally {

			isLoading = false;

		}

	}

	function confirmDelete(div: any) {
		divToDelete = div;
		isDeleteModalOpen = true;
	}

	async function handleDelete() {

		if (!divToDelete) return;

		try {

			isLoading = true;

			await deleteDepartment(divToDelete.id);

			await loadDepartments();

			showToast(
				"Department berhasil dihapus",
				"success"
			);

			isDeleteModalOpen = false;
			divToDelete = null;

		} catch (error: any) {

			console.error(error);

			showToast(
				error?.message || "Gagal menghapus Department",
				"danger"
			);

		} finally {

			isLoading = false;

		}

	}
</script>

<svelte:head>
	<title>Data departments - LogMood Admin</title>
</svelte:head>

<!-- Toast Notification -->
<Toast 
	visible={toastVisible} 
	message={toastMessage} 
	type={toastType} 
	onClose={() => toastVisible = false} 
/>

{#if isLoading}
	<Spinner fullscreen label="Sedang memproses..." />
{/if}

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Data Divisi</h1>
			<p>Kelola daftar department dan alokasi karyawan.</p>
		</div>
		<Button onClick={openAddModal}>
			<Plus size={18} style="margin-right: 6px;" />
			Tambah Department
		</Button>
	</div>

	<!-- Using Card UI Component -->
	<div class="divisions-grid">
		{#each departments as department}
			<Card hover border padding="lg">
				<div class="card-head">
					<div class="icon-wrap">
						<Building2 size={24}/>
					</div>
				</div>
				<h3 class="div-title">
					{department.departmentsName}
				</h3>
				<p class="div-desc">
					{department.description}
				</p>
				<div class="card-footer">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => openEditModal(department)}
					>
						<Pencil size={16} style="margin-right: 4px;" />
						Edit
					</Button>
					<Button
						variant="danger"
						size="sm"
						onClick={() => confirmDelete(department)}
					>
						<Trash2 size={16}/>
					</Button>

				</div>

			</Card>
		{/each}
	</div>
</div>

<!-- Modal Tambah Divisi Baru -->
<Modal open={isAddModalOpen} title="Tambah Divisi Baru" onClose={closeAddModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleAddDepartment(); }} class="modal-form">
		<Input label="Nama Department" placeholder="Contoh: Quality Assurance" bind:value={newDivName} required />
		<Input label="Deskripsi Department" placeholder="Jelaskan peran divisi ini..." bind:value={newDivDesc} />
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeAddModal}>Batal</Button>
		<Button onClick={handleAddDepartment}>
			<Plus size={18} style="margin-right: 6px;" />
			Simpan Department
		</Button>
	{/snippet}
</Modal>

<!-- Modal Edit Divisi -->
<Modal open={isEditModalOpen} title="Edit Department" onClose={closeEditModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleEditDepartment(); }} class="modal-form">
		<Input label="Nama Department" placeholder="Contoh: Quality Assurance" bind:value={editDivName} required />
		<Input label="Deskripsi Department" placeholder="Jelaskan peran divisi ini..." bind:value={editDivDesc} />
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeEditModal}>Batal</Button>
		<Button onClick={handleEditDepartment}>
			<Pencil size={18} style="margin-right: 6px;" />
			Simpan Perubahan
		</Button>
	{/snippet}
</Modal>

<!-- Modal Konfirmasi Hapus -->
<Modal open={isDeleteModalOpen} title="Konfirmasi Hapus Department" onClose={() => isDeleteModalOpen = false}>
	<div class="delete-confirmation">
		<div class="warning-icon">
			<AlertTriangle size={48} color="var(--color-danger)" />
		</div>
		<p>Apakah Anda yakin ingin menghapus department <strong>{divToDelete?.departmentsName}</strong>?</p>
		<p class="text-muted">Semua data terkait department ini akan ikut terhapus.</p>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onClick={() => isDeleteModalOpen = false}>Batal</Button>
		<Button variant="danger" onClick={handleDelete}>
			Ya, Hapus Department
		</Button>
	{/snippet}
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

	.divisions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.25rem;
	}

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

	.div-title {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.5rem 0;
	}

	.div-desc {
		font-size: 0.875rem;
		color: var(--color-text-light);
		margin: 0 0 1rem 0;
	}

	.card-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.delete-confirmation {
		text-align: center;
		padding: 1rem 0;
	}

	.warning-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}
	
	.delete-confirmation p {
		margin-bottom: 0.5rem;
		color: var(--color-text);
	}

	.delete-confirmation .text-muted {
		color: var(--color-text-light);
		font-size: 0.9rem;
	}
</style>
