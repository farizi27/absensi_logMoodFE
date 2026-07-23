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
	import { Plus, LayoutGrid, List, UserPlus, Trash2, AlertTriangle } from "@lucide/svelte";

	let searchQuery = $state("");
	let viewMode = $state<"grid" | "table">("grid");
	
	// State for Add Modal
	let isAddModalOpen = $state(false);
	let newName = $state("");
	let newEmail = $state("");
	let newDivision = $state("IT Engineering");
	let newRole = $state("Karyawan");

	// State for Delete Modal
	let isDeleteModalOpen = $state(false);
	let employeeToDelete = $state<any>(null);

	// State for Toast Notification
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	// Loading State
	let isLoading = $state(false);

	let employees = $state([
		{ id: "EMP-001", name: "Budi Santoso", email: "budi@company.com", division: "IT Engineering", role: "Karyawan", status: "Aktif" as const },
		{ id: "EMP-002", name: "Siti Rahma", email: "siti@company.com", division: "Human Resources", role: "Admin", status: "Aktif" as const },
		{ id: "EMP-003", name: "Ahmad Rizky", email: "ahmad@company.com", division: "Marketing", role: "Karyawan", status: "Aktif" as const },
		{ id: "EMP-004", name: "Dewi Lestari", email: "dewi@company.com", division: "Finance", role: "Karyawan", status: "Nonaktif" as const }
	]);

	const filteredEmployees = $derived(
		employees.filter((e) =>
			e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			e.division.toLowerCase().includes(searchQuery.toLowerCase()) ||
			e.email.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}

	function openAddModal() {
		newName = "";
		newEmail = "";
		newDivision = "IT Engineering";
		newRole = "Karyawan";
		isAddModalOpen = true;
	}

	function closeAddModal() {
		isAddModalOpen = false;
	}

	async function handleAddEmployee() {
		if (!newName || !newEmail) {
			showToast("Mohon isi Nama Lengkap dan Email perusahaan.", "warning");
			return;
		}

		isLoading = true;
		
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 800));

		const newId = `EMP-00${employees.length + 1}`;
		employees = [
			...employees,
			{
				id: newId,
				name: newName,
				email: newEmail,
				division: newDivision,
				role: newRole,
				status: "Aktif"
			}
		];

		isLoading = false;
		closeAddModal();
		showToast(`Karyawan ${newName} berhasil ditambahkan!`, "success");
	}

	function confirmDelete(employee: any) {
		employeeToDelete = employee;
		isDeleteModalOpen = true;
	}

	async function handleDelete() {
		if (employeeToDelete) {
			isLoading = true;
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			employees = employees.filter(e => e.id !== employeeToDelete.id);
			isLoading = false;
			showToast(`Data karyawan ${employeeToDelete.name} berhasil dihapus.`, "success");
			employeeToDelete = null;
			isDeleteModalOpen = false;
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

	<div class="filter-bar">
		<div class="search-box">
			<Input placeholder="Cari nama karyawan, email, atau divisi..." bind:value={searchQuery} />
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

	{#if viewMode === 'grid'}
		<!-- Using EmployeeCard component -->
		<div class="cards-grid">
			{#each filteredEmployees as emp}
				<EmployeeCard
					name={emp.name}
					email={emp.email}
					position={emp.division}
					status={emp.status}
				>
					<Button size="sm" variant="ghost">Edit</Button>
					<Button size="sm" variant="danger" onClick={() => confirmDelete(emp)}>Hapus</Button>
				</EmployeeCard>
			{/each}
		</div>
	{:else}
		<!-- Using Card & Table UI components -->
		<Card padding="lg">
			<Table hoverable striped bordered>
				<thead>
					<tr>
						<th>Karyawan</th>
						<th>ID Karyawan</th>
						<th>Divisi</th>
						<th>Status</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredEmployees as emp}
						<tr>
							<td class="user-cell">
								<Avatar name={emp.name} size={36} />
								<div>
									<div class="name">{emp.name}</div>
									<div class="email">{emp.email}</div>
								</div>
							</td>
							<td>{emp.id}</td>
							<td>{emp.division}</td>
							<td>
								<Badge variant={emp.status === 'Aktif' ? 'success' : 'danger'}>
									{emp.status}
								</Badge>
							</td>
							<td>
								<div class="table-actions">
									<Button size="sm" variant="ghost">Edit</Button>
									<Button size="sm" variant="danger" onClick={() => confirmDelete(emp)}>
										<Trash2 size={16} />
									</Button>
								</div>
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
		<Input label="Nama Lengkap" placeholder="Masukkan nama karyawan" bind:value={newName} required />
		<Input label="Email Perusahaan" type="email" placeholder="contoh@company.com" bind:value={newEmail} required />
		
		<div class="form-group">
			<label for="division-select" class="form-label">Divisi</label>
			<select id="division-select" bind:value={newDivision} class="form-select">
				<option value="IT Engineering">IT Engineering</option>
				<option value="Human Resources">Human Resources</option>
				<option value="Marketing">Marketing</option>
				<option value="Finance">Finance</option>
				<option value="Operations">Operations</option>
			</select>
		</div>

		<div class="form-group">
			<label for="role-select" class="form-label">Role Akses</label>
			<select id="role-select" bind:value={newRole} class="form-select">
				<option value="Karyawan">Karyawan</option>
				<option value="Admin">Admin</option>
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

<!-- Modal Konfirmasi Hapus -->
<Modal open={isDeleteModalOpen} title="Konfirmasi Hapus Data" onClose={() => isDeleteModalOpen = false}>
	<div class="delete-confirmation">
		<div class="warning-icon">
			<AlertTriangle size={48} color="var(--color-danger)" />
		</div>
		<p>Apakah Anda yakin ingin menghapus data karyawan <strong>{employeeToDelete?.name}</strong>?</p>
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
		max-width: 400px;
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
