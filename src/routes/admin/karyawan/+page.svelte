<script lang="ts">
	import EmployeeCard from "$lib/components/attendance/EmployeeCard.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Card from "$lib/components/ui/Card.svelte";
	import Table from "$lib/components/ui/Table.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { Plus, LayoutGrid, List, UserPlus, Trash2, AlertTriangle, Pencil } from "@lucide/svelte";
	import EmptyState from "$lib/components/common/EmptyState.svelte";
	import { onMount } from "svelte";
	import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "$lib/services/employe.service";
	import { get } from "$lib/services/api";
	import type { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from "$lib/types/employee";
	import {getWorkSchedules} from "$lib/services/workSchedule.service"
	import type { fromAction } from "svelte/attachments";
	import { resolveRoute } from "$app/paths";

	// ========== DATA STATE ==========
	let employees = $state<Employee[]>([]);
	let departments = $state<{ id: number; departmentsName: string }[]>([]);
	let roles = $state<{ id: number; role_name: string }[]>([]);
	let workSchedules = $state<{ id: number; scheduleName: string }[]>([]);

	// ========== LOAD DATA ==========
	async function loadEmployees() {
		try {
			const result = await getEmployees();
			employees = result.data;
		} catch (err) {
			console.error("Gagal memuat data karyawan:", err);
			showToast("Gagal memuat data karyawan.", "danger");
		}
	}

	async function loadWorkSchedule() {
		try{
			const res = await getWorkSchedules();
			workSchedules = res.data;

		} catch(err){
			console.error("Gagal memuat data Work Schedule", err);
		}
	}

	function getWorkScheduleName(id: number | undefined) {
		return workSchedules.find((s) => s.id === id)?.scheduleName ?? "-";
	}

	async function loadDepartments() {
		try {
			const res = await get<{ success: boolean; data: { id: number; departmentsName: string }[] }>("/departments");
			departments = res.data || [];
		} catch (err) {
			console.error("Gagal memuat data divisi:", err);
		}
	}

	async function loadRoles() {
		try {
			const res = await get<{ success: boolean; data: { id: number; role_name: string }[] }>("/roles");
			roles = res.data || [];
		} catch (err) {
			console.error("Gagal memuat data role:", err);
		}
	}

	onMount(() => {
		loadEmployees();
		loadDepartments();
		loadRoles();
		loadWorkSchedule();
	});

	// ========== FILTER & VIEW STATE ==========
	let searchQuery = $state("");
	let filterDivision = $state("Semua");
	let filterWorkSchedule = $state("semua");
	let viewMode = $state<"grid" | "table">("table");

	// ========== ADD MODAL STATE ==========
	let isAddModalOpen = $state(false);
	let newEmployeeCode = $state("");
	let newFullName = $state("");
	let newPhone = $state("");
	let newDepartmentId = $state<number | undefined>(undefined);
	let newRoleId = $state<number | undefined>(undefined);
	let newWorkSchedule = $state<number | undefined>(undefined);

	// ========== EDIT MODAL STATE ==========
	let isEditModalOpen = $state(false);
	let editingEmployee = $state<Employee | null>(null);
	let editEmployeeCode = $state("");
	let editFullName = $state("");
	let editEmail = $state("");
	let editPhone = $state("");
	let editDepartmentId = $state<number | undefined>(undefined);
	let editRoleId = $state<number | undefined>(undefined);
	let editStatus = $state("");
	let editWorkSchedule = $state<number | undefined>(undefined);

	// ========== DELETE MODAL STATE ==========
	let isDeleteModalOpen = $state(false);
	let employeeToDelete = $state<Employee | null>(null);

	// ========== TOAST STATE ==========
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	// ========== LOADING STATE ==========
	let isLoading = $state(false);

	// ========== DERIVED ==========
	const filteredEmployees = $derived(
		employees.filter((e) => {
			const keyword = searchQuery.toLowerCase();

			const search =
				e.fullName.toLowerCase().includes(keyword) ||
				(e.email ?? "").toLowerCase().includes(keyword) ||
				e.employeeCode.toLowerCase().includes(keyword);

			const division =
				filterDivision === "Semua" ||
				e.department === filterDivision;
			
			const workSchedule =
				filterWorkSchedule === "semua" ||
				e.work_schedule === filterWorkSchedule;

			return search && division && workSchedule;
		})
	);

	// ========== TOAST HELPER ==========
	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}

	// ========== ADD EMPLOYEE ==========
	function openAddModal() {
		newEmployeeCode = "";
		newFullName = "";
		newPhone = "";
		newDepartmentId = departments.length > 0 ? departments[0].id : undefined;
		newRoleId = roles.length > 0 ? roles[0].id : undefined;
		newWorkSchedule = workSchedules.length > 0 ? workSchedules[0].id : undefined;
		isAddModalOpen = true;
	}

	function closeAddModal() {
		isAddModalOpen = false;
	}

	async function handleAddEmployee() {
		if (!newEmployeeCode || !newFullName || !newPhone) {
			showToast("Mohon isi Kode Karyawan, Nama Lengkap, dan No. Telepon.", "warning");
			return;
		}

		isLoading = true;

		try {
			const data: EmployeeCreateRequest = {
				employee_code: newEmployeeCode,
				full_name: newFullName,
				no_phone: newPhone,
				department_id: newDepartmentId,
				role_id: newRoleId,
				work_schedule_id : newWorkSchedule
			};

			await createEmployee(data);
			await loadEmployees();

			closeAddModal();
			showToast(`Karyawan ${newFullName} berhasil ditambahkan!`, "success");
		} catch (err: any) {
			showToast(err?.message || "Gagal menambahkan karyawan.", "danger");
		} finally {
			isLoading = false;
		}
	}

	// ========== EDIT EMPLOYEE ==========
	function openEditModal(emp: Employee) {
		editingEmployee = emp;
		editEmployeeCode = emp.employeeCode;
		editFullName = emp.fullName;
		editEmail = emp.email ?? "";
		editPhone = emp.phone ?? "";
		// mencari departement berdasarkan nama 
		const dept = departments.find(d => d.departmentsName === emp.department);
		editDepartmentId = dept ? dept.id : undefined;
		const role = roles.find(r => r.role_name === emp.role);
		editRoleId = role ? role.id : undefined;
		const schedule = workSchedules.find(s => s.scheduleName === emp.work_schedule);
		editWorkSchedule = schedule ? schedule.id : undefined;
		editStatus = emp.status;
		isEditModalOpen = true;
	}

	function closeEditModal() {
		isEditModalOpen = false;
		editingEmployee = null;
	}

	async function handleEditEmployee() {
		if (!editingEmployee) return;
		if (!editEmployeeCode || !editFullName || !editPhone) {
			showToast("Mohon isi Kode Karyawan, Nama Lengkap, dan No. Telepon.", "warning");
			return;
		}

		isLoading = true;

		try {
			const data: EmployeeUpdateRequest = {
				employee_code: editEmployeeCode,
				full_name: editFullName,
				email: editEmail || undefined,
				no_phone: editPhone,
				department_id: editDepartmentId,
				role_id: editRoleId,
				status: editStatus,
				work_schedule_id : editWorkSchedule
			};

			await updateEmployee(editingEmployee.id, data);
			await loadEmployees();

			closeEditModal();
			showToast(`Data karyawan ${editFullName} berhasil diperbarui!`, "success");
		} catch (err: any) {
			showToast(err?.message || "Gagal memperbarui data karyawan.", "danger");
		} finally {
			isLoading = false;
		}
	}

	// ========== DELETE EMPLOYEE ==========
	function confirmDelete(employee: Employee) {
		employeeToDelete = employee;
		isDeleteModalOpen = true;
	}

	async function handleDelete() {
		if (!employeeToDelete) return;

		isLoading = true;

		try {
			await deleteEmployee(employeeToDelete.id);
			await loadEmployees();

			showToast(`Data karyawan ${employeeToDelete.fullName} berhasil dihapus.`, "success");
			employeeToDelete = null;
			isDeleteModalOpen = false;
		} catch (err: any) {
			showToast(err?.message || "Gagal menghapus data karyawan.", "danger");
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Data Karyawan - LogMood Admin</title>
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
			<h1>Data Karyawan</h1>
			<p>Kelola data seluruh karyawan dan akses informasi divisi.</p>
		</div>
		<div class="action-buttons">
			<Button onClick={openAddModal}>
				<Plus size={18} style="margin-right: 6px;" />
				Tambah Karyawan
			</Button>
		</div>
	</div>
	<Card padding="md">
	<div class="filter-bar">
		<div class="search-box">
			<Input placeholder="Cari nama karyawan, email, atau kode karyawan..." bind:value={searchQuery} />
		</div>
		<div class="filter-item">
				<label for="division-filter-select">Divisi:</label>
				<select id="division-filter-select" bind:value={filterDivision} class="custom-select">
					<option value="Semua">Semua Divisi</option>
					{#each departments as dept}
						<option value={dept.departmentsName}>{dept.departmentsName}</option>
					{/each}
				</select>
			</div>
		<div class="view-toggle">
			<Button
				variant={viewMode === 'grid' ? 'primary' : 'ghost'}
				size="sm"
				onClick={() => viewMode = 'grid'}
			>
				<LayoutGrid size={18} />
			</Button>
			<Button
				variant={viewMode === 'table' ? 'primary' : 'ghost'}
				size="sm"
				onClick={() => viewMode = 'table'}
			>
				<List size={18} />
			</Button>
		</div>
	</div>
	</Card>

	{#if viewMode === 'grid'}
		<!-- menggunakan EmployeeCard component -->
		<div class="cards-grid">
			{#each filteredEmployees as emp}
				<EmployeeCard
					name={emp.fullName}
					email={emp.email ??"-" }
					position={emp.department ?? " -"}
					status={emp.status ?? "Nonaktif"}
					workSchedule = {emp.work_schedule ?? "-"}
				>
					<Button size="sm" variant="ghost" onClick={() => openEditModal(emp)}>
						<Pencil size={14} style="margin-right: 4px;" />
						Edit
					</Button>
					<Button size="sm" variant="danger" onClick={() => confirmDelete(emp)}>Hapus</Button>
				</EmployeeCard>
			{:else}
				<EmptyState
					title="Tidak ada karyawan ditemukan"
					description="Coba ubah kata kunci pencarian atau filter divisi."
				/>
			{/each}
		</div>
	{:else}
		<!-- Menggunakan Card & Table UI components -->
		<Card padding="lg">
			<Table hoverable striped bordered>
				<thead>
					<tr>
						<th>Karyawan</th>
						<th>ID Karyawan</th>
						<th>Divisi</th>
						<th>Role</th>
						<th>Jam Kerja</th>
						<th>Status</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredEmployees as emp}
						<tr>
							<td class="user-cell">
								<Avatar name={emp.fullName} size={36} />
								<div>
									<div class="name">{emp.fullName}</div>
									<div class="email">{emp.email ?? "-"}</div>
								</div>
							</td>
							<td>{emp.employeeCode}</td>
							<td>{emp.department ?? "-"}</td>
							<td>{emp.role ?? "-"}</td>
							<td>{emp.work_schedule ?? "-"}</td>
							<td>
								<Badge variant={emp.status === 'Active' ? 'success' : emp.status === 'Inactive' ? 'warning' : 'danger'}>
									{emp.status}
								</Badge>
							</td>
							<td>
								<div class="table-actions">
									<Button size="sm" variant="ghost" onClick={() => openEditModal(emp)}>
										<Pencil size={14} style="margin-right: 4px;" />
										Edit
									</Button>
									<Button size="sm" variant="danger" onClick={() => confirmDelete(emp)}>
										<Trash2 size={16} />
									</Button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7">
								<EmptyState
									title="Tidak ada karyawan ditemukan"
									description="Coba ubah kata kunci pencarian atau filter divisi."
								/>
							</td>
						</tr>
					{/each}
				</tbody>
			</Table>
		</Card>
	{/if}
</div>

<!-- Modal Tambah Karyawan Baru -->
<Modal open={isAddModalOpen} title="Tambah Karyawan Baru" onClose={closeAddModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleAddEmployee(); }} class="modal-form">
		<Input label="Kode Karyawan" placeholder="Contoh: EMP-001" bind:value={newEmployeeCode} required />
		<Input label="Nama Lengkap" placeholder="Masukkan nama karyawan" bind:value={newFullName} required />
		<Input label="No. Telepon" placeholder="08xxxxxxxxxx" bind:value={newPhone} required />
		
		<div class="form-group">
			<label for="add-division-select" class="form-label">Divisi</label>
			<select id="add-division-select" bind:value={newDepartmentId} class="form-select">
				{#each departments as dept}
					<option value={dept.id}>{dept.departmentsName}</option>
				{/each}
			</select>
		</div>
		<div class="form-group">
			<label for="add-role-select" class="form-label">Work Schedule</label>
			<select id="add-division-select" bind:value={newWorkSchedule} class="form-select">
				{#each workSchedules as work}
					<option value={work.id}>{work.scheduleName}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label for="add-role-select" class="form-label">Role Akses</label>
			<select id="add-role-select" bind:value={newRoleId} class="form-select">
				{#each roles as role}
					<option value={role.id}>{role.role_name}</option>
				{/each}
			</select>
		</div>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeAddModal}>Batal</Button>
		<Button onClick={handleAddEmployee}>
			<UserPlus size={18} style="margin-right: 6px;" />
			Simpan Karyawan
		</Button>
	{/snippet}
</Modal>

<!-- Modal Edit Karyawan -->
<Modal open={isEditModalOpen} title="Edit Data Karyawan" onClose={closeEditModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleEditEmployee(); }} class="modal-form">
		<Input label="Kode Karyawan" placeholder="Contoh: EMP-001" bind:value={editEmployeeCode} required />
		<Input label="Nama Lengkap" placeholder="Masukkan nama karyawan" bind:value={editFullName} required />
		<Input label="Email" type="email" placeholder="contoh@company.com" bind:value={editEmail} />
		<Input label="No. Telepon" placeholder="08xxxxxxxxxx" bind:value={editPhone} required />
		
		<div class="form-group">
			<label for="edit-division-select" class="form-label">Divisi</label>
			<select id="edit-division-select" bind:value={editDepartmentId} class="form-select">
				<option value={undefined}>-- Pilih Divisi --</option>
				{#each departments as dept}
					<option value={dept.id}>{dept.departmentsName}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label for="add-role-select" class="form-label">Work Schedule</label>
			<select id="add-division-select" bind:value={editWorkSchedule} class="form-select">
				{#each workSchedules as work}
					<option value={work.id}>{work.scheduleName}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label for="edit-role-select" class="form-label">Role Akses</label>
			<select id="edit-role-select" bind:value={editRoleId} class="form-select">
				<option value={undefined}>-- Pilih Role --</option>
				{#each roles as role}
					<option value={role.id}>{role.role_name}</option>
				{/each}
			</select>
		</div>

		<div class="form-group">
			<label for="edit-status-select" class="form-label">Status</label>
			<select id="edit-status-select" bind:value={editStatus} class="form-select">
				<option value="Active">Active</option>
				<option value="Inactive">Inactive</option>
				<option value="Resigned">Resigned</option>
			</select>
		</div>
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeEditModal}>Batal</Button>
		<Button onClick={handleEditEmployee}>
			<Pencil size={18} style="margin-right: 6px;" />
			Simpan Perubahan
		</Button>
	{/snippet}
</Modal>

<!-- Modal Konfirmasi Hapus -->
<Modal open={isDeleteModalOpen} title="Konfirmasi Hapus Data" onClose={() => isDeleteModalOpen = false}>
	<div class="delete-confirmation">
		<div class="warning-icon">
			<AlertTriangle size={48} color="var(--color-danger)" />
		</div>
		<p>Apakah Anda yakin ingin menghapus data karyawan <strong>{employeeToDelete?.fullName}</strong>?</p>
		<p class="text-muted">Tindakan ini tidak dapat dibatalkan dan semua data yang terkait mungkin akan hilang.</p>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onClick={() => isDeleteModalOpen = false}>Batal</Button>
		<Button variant="danger" onClick={handleDelete}>
			Ya, Hapus Data
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

	.filter-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.search-box {
		flex: 1;
		min-width: 400px;
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

	.custom-select{
		padding: 0.6rem 0.8rem;
		border-radius: var(--radius-md, 10px);
		border: 1px solid var(--color-border);
		background: var(--color-background);
		color: var(--color-text);
		font-size: 0.9rem;
		outline: none;
		transition: 0.2s;
	}

	.custom-select:focus {
		border-color: var(--color-primary);
	}

	.view-toggle {
		display: flex;
		gap: 0.25rem;
		background: var(--color-surface);
		padding: 0.25rem;
		border-radius: var(--radius-md, 10px);
		border: 1px solid var(--color-border);
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 1.25rem;
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.name {
		font-weight: 600;
		color: var(--color-text);
	}

	.email {
		font-size: 0.8rem;
		color: var(--color-text-light);
	}

	.table-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.modal-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-height: 80vh;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.form-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.form-select {
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md, 10px);
		border: 1px solid var(--color-border);
		background-color: var(--color-surface);
		color: var(--color-text);
		font-size: 0.95rem;
		outline: none;
		transition: 0.2s;
	}

	.form-select:focus {
		border-color: var(--color-primary);
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
