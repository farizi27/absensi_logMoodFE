<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Badge from "$lib/components/ui/Badge.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { Building2, Plus, Users, Trash2, AlertTriangle } from "@lucide/svelte";

	let isAddModalOpen = $state(false);
	let newDivName = $state("");
	let newDivDesc = $state("");

	// State for Delete Modal
	let isDeleteModalOpen = $state(false);
	let divToDelete = $state<any>(null);

	// State for Toast Notification
	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	// Loading State
	let isLoading = $state(false);

	let divisions = $state([
		{ id: 1, name: "IT Engineering", count: 12, description: "Pengembangan software & infrastruktur IT", status: "Aktif" },
		{ id: 2, name: "Human Resources", count: 6, description: "Manajemen SDM & rekrutmen karyawan", status: "Aktif" },
		{ id: 3, name: "Marketing", count: 10, description: "Pemasaran digital & branding perusahaan", status: "Aktif" },
		{ id: 4, name: "Finance", count: 8, description: "Pengelolaan keuangan & akutansi", status: "Aktif" },
		{ id: 5, name: "Operations", count: 12, description: "Operasional harian kantor & logistik", status: "Aktif" }
	]);

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

	async function handleAddDivision() {
		if (!newDivName) {
			showToast("Mohon isi Nama Divisi.", "warning");
			return;
		}

		isLoading = true;
		
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 800));

		divisions = [
			...divisions,
			{
				id: divisions.length + 1,
				name: newDivName,
				count: 0,
				description: newDivDesc || "Divisi baru perusahan",
				status: "Aktif"
			}
		];

		isLoading = false;
		closeAddModal();
		showToast(`Divisi ${newDivName} berhasil ditambahkan!`, "success");
	}

	function confirmDelete(div: any) {
		divToDelete = div;
		isDeleteModalOpen = true;
	}

	async function handleDelete() {
		if (divToDelete) {
			isLoading = true;
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 800));

			divisions = divisions.filter(d => d.id !== divToDelete.id);
			isLoading = false;
			showToast(`Data divisi ${divToDelete.name} berhasil dihapus.`, "success");
			divToDelete = null;
			isDeleteModalOpen = false;
		}
	}
</script>

<svelte:head>
	<title>Data Divisi - LogMood Admin</title>
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
			<p>Kelola daftar divisi dan alokasi karyawan.</p>
		</div>
		<Button onClick={openAddModal}>
			<Plus size={18} style="margin-right: 6px;" />
			Tambah Divisi
		</Button>
	</div>

	<!-- Using Card UI Component -->
	<div class="divisions-grid">
		{#each divisions as div}
			<Card hover border padding="lg">
				<div class="card-head">
					<div class="icon-wrap">
						<Building2 size={24} />
					</div>
					<Badge variant="info">
						<Users size={14} style="margin-right: 4px;" />
						{div.count} Anggota
					</Badge>
				</div>
				<h3 class="div-title">{div.name}</h3>
				<p class="div-desc">{div.description}</p>
				<div class="card-footer">
					<Button variant="ghost" size="sm">Kelola Divisi</Button>
					<Button variant="danger" size="sm" onClick={() => confirmDelete(div)}>
						<Trash2 size={16} />
					</Button>
				</div>
			</Card>
		{/each}
	</div>
</div>

<!-- Modal Tambah Divisi Baru -->
<Modal open={isAddModalOpen} title="Tambah Divisi Baru" onClose={closeAddModal}>
	<form onsubmit={(e) => { e.preventDefault(); handleAddDivision(); }} class="modal-form">
		<Input label="Nama Divisi" placeholder="Contoh: Quality Assurance" bind:value={newDivName} required />
		<Input label="Deskripsi Divisi" placeholder="Jelaskan peran divisi ini..." bind:value={newDivDesc} />
	</form>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeAddModal}>Batal</Button>
		<Button onClick={handleAddDivision}>
			<Plus size={18} style="margin-right: 6px;" />
			Simpan Divisi
		</Button>
	{/snippet}
</Modal>

<!-- Modal Konfirmasi Hapus -->
<Modal open={isDeleteModalOpen} title="Konfirmasi Hapus Divisi" onClose={() => isDeleteModalOpen = false}>
	<div class="delete-confirmation">
		<div class="warning-icon">
			<AlertTriangle size={48} color="var(--color-danger)" />
		</div>
		<p>Apakah Anda yakin ingin menghapus divisi <strong>{divToDelete?.name}</strong>?</p>
		<p class="text-muted">Semua data terkait divisi ini akan ikut terhapus.</p>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onClick={() => isDeleteModalOpen = false}>Batal</Button>
		<Button variant="danger" onClick={handleDelete}>
			Ya, Hapus Divisi
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
