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
	import ConfirmDialog from "$lib/components/common/ConfirmDialog.svelte";

	// State for Add Modal
	let isAddModalOpen = $state(false);
	let newDeptName = $state("");
	let newDeptDesc = $state("");

	// State for Edit Modal
	let isEditModalOpen = $state(false);
	let editDeptId = $state<number | null>(null);
	let editDeptName = $state("");
	let editDeptDesc = $state("");

	// State for Delete Modal
	let isDeleteModalOpen = $state(false);
	let deptToDelete = $state<any>(null);

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
		newDeptName = "";
		newDeptDesc = "";
		isAddModalOpen = true;
	}

	function closeAddModal() {
		isAddModalOpen = false;
	}

	function openEditModal(department: Department) {
		editDeptId = department.id;
		editDeptName = department.departmentsName;
		editDeptDesc = department.description;
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
		editDeptId = null;
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

		if (!newDeptName || !newDeptDesc) {

			showToast(
				"Nama Department dan Deskripsi wajib diisi",
				"warning"
			);

			return;
		}

		try {

			isLoading = true;

			await createDepartment({
				departmentsName: newDeptName,
				description: newDeptDesc
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

		if (!editDeptId) return;

		if (!editDeptName || !editDeptDesc) {

			showToast(
				"Nama Department dan Deskripsi wajib diisi",
				"warning"
			);

			return;
		}

		try {

			isLoading = true;

			await updateDepartment(editDeptId, {
				departmentsName: editDeptName,
				description: editDeptDesc
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
		deptToDelete = div;
		isDeleteModalOpen = true;
	}

	async function handleDelete() {

		if (!deptToDelete) return;

		try {

			isLoading = true;

			await deleteDepartment(deptToDelete.id);

			await loadDepartments();

			showToast(
				"Department berhasil dihapus",
				"success"
			);

			isDeleteModalOpen = false;
			deptToDelete = null;

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
			<h1>Data Department</h1>
			<p>Kelola daftar department dan alokasi karyawan.</p>
		</div>
		<Button onClick={openAddModal}>
			<Plus size={18} style="margin-right: 6px;" />
			Tambah Department
		</Button>
	</div>

	<!-- Using Card UI Component -->
	<div class="departmentons-grid">
		{#each departments as department}
			<Card hover border padding="lg">
				<div class="card-head">
					<div class="icon-wrap">
						<Building2 size={24}/>
					</div>
				</div>
				<h3 class="dept-title">
					{department.departmentsName}
				</h3>
				<p class="dept-desc">
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

<!-- Modal Tambah Department Baru -->
<Modal open={isAddModalOpen} title="Tambah Department Baru" onClose={closeAddModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleAddDepartment(); }} class="modal-form">
		<Input label="Nama Department" placeholder="Contoh: Quality Assurance" bind:value={newDeptName} required />
		<Input label="Deskripsi Department" placeholder="Jelaskan peran department ini..." bind:value={newDeptDesc} />
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeAddModal}>Batal</Button>
		<Button onClick={handleAddDepartment}>
			<Plus size={18} style="margin-right: 6px;" />
			Simpan Department
		</Button>
	{/snippet}
</Modal>

<!-- Modal Edit Department -->
<Modal open={isEditModalOpen} title="Edit Department" onClose={closeEditModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleEditDepartment(); }} class="modal-form">
		<Input label="Nama Department" placeholder="Contoh: Quality Assurance" bind:value={editDeptName} required />
		<Input label="Deskripsi Department" placeholder="Jelaskan peran department ini..." bind:value={editDeptDesc} />
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
<ConfirmDialog
	open={isDeleteModalOpen}
	title="Konfirmasi Hapus Department"
	message={`Apakah Anda yakin ingin menghapus department ${deptToDelete?.departmentsName}? Semua data terkait department ini akan ikut terhapus.`}
	confirmText="Ya, Hapus Department"
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

	.departmentons-grid {
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

	.dept-title {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.5rem 0;
	}

	.dept-desc {
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
</style>
