<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { onMount } from "svelte";
	import { auth } from "$lib/stores/auth";
	import { getEmployee, updateEmployee } from "$lib/services/employe.service";
	import { changePassword, updateProfile } from "$lib/services/auth.service";

	// Profile info (readonly display)
	let employeeId = $state<number | null>(null);
	let name = $state("");
	let email = $state("");
	let department = $state("");
	let employeeCode = $state("");
	let phone = $state("");

	// Edit name
	let editName = $state("");
	let isEditingName = $state(false);

	// Change password
	let oldPassword = $state("");
	let newPassword = $state("");
	let confirmPassword = $state("");
	let isEditingPassword = $state(false);

	let isLoading = $state(false);
	let isSavingName = $state(false);
	let isSavingPassword = $state(false);

	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}

	onMount(async () => {
		auth.loadFromStorage();
		if ($auth.user) {
			employeeId = $auth.user.id;
			name = $auth.user.name || "";
			email = $auth.user.email || "";
			editName = name;

			// Fetch full employee data to get department
			try {
				isLoading = true;
				const res = await getEmployee($auth.user.id);
				const emp = res.data;
				department = emp.department || "-";
				employeeCode = emp.employeeCode || "";
				phone = emp.phone || "";
			} catch (err) {
				console.error("Gagal memuat data karyawan:", err);
			} finally {
				isLoading = false;
			}
		}
	});

	async function handleSaveName() {
		if (!editName.trim()) {
			showToast("Nama tidak boleh kosong", "warning");
			return;
		}

		try {
			isSavingName = true;
			await updateProfile({ name: editName.trim() });
			name = editName.trim();
			isEditingName = false;
			showToast("Nama berhasil diperbarui", "success");
		} catch (err: any) {
			showToast(err?.message || "Gagal memperbarui nama", "danger");
		} finally {
			isSavingName = false;
		}
	}

	async function handleSavePassword() {
		if (!oldPassword || !newPassword || !confirmPassword) {
			showToast("Semua kolom password wajib diisi", "warning");
			return;
		}
		if (newPassword !== confirmPassword) {
			showToast("Password baru dan konfirmasi tidak cocok", "warning");
			return;
		}
		if (newPassword.length < 6) {
			showToast("Password baru minimal 6 karakter", "warning");
			return;
		}

		try {
			isSavingPassword = true;
			await changePassword({ oldPassword, newPassword });
			oldPassword = "";
			newPassword = "";
			confirmPassword = "";
			isEditingPassword = false;
			showToast("Password berhasil diubah", "success");
		} catch (err: any) {
			showToast(err?.message || "Gagal mengubah password", "danger");
		} finally {
			isSavingPassword = false;
		}
	}

	function cancelEditName() {
		editName = name;
		isEditingName = false;
	}

	function cancelEditPassword() {
		oldPassword = "";
		newPassword = "";
		confirmPassword = "";
		isEditingPassword = false;
	}
</script>

<svelte:head>
	<title>Profil Saya - LogMood</title>
</svelte:head>

<Toast
	visible={toastVisible}
	message={toastMessage}
	type={toastType}
	onClose={() => toastVisible = false}
/>

{#if isLoading}
	<Spinner fullscreen label="Memuat profil..." />
{/if}

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Profil Saya</h1>
			<p>Kelola informasi akun dan pengaturan profil Anda.</p>
		</div>
	</div>

	<!-- Info Card -->
	<Card border padding="lg">
		<div class="profile-card-content">
			<div class="avatar-section">
				<Avatar name={name || "Karyawan"} size={80} />
				<div class="user-meta">
					<h2>{name || "Karyawan"}</h2>
					<span class="role-badge">Karyawan</span>
					{#if department && department !== "-"}
						<span class="dept-badge">{department}</span>
					{/if}
				</div>
			</div>

			<!-- Info readonly -->
			<div class="info-grid">
				<div class="info-item">
					<span class="info-label">Email</span>
					<span class="info-value">{email || "-"}</span>
				</div>
				<div class="info-item">
					<span class="info-label">Department</span>
					<span class="info-value">{department || "-"}</span>
				</div>
			</div>
		</div>
	</Card>

	<!-- Edit Nama -->
	<Card border padding="lg">
		<div class="section-header">
			<div>
				<h3 class="section-title">Nama Lengkap</h3>
				<p class="section-desc">Perbarui nama tampilan Anda.</p>
			</div>
			{#if !isEditingName}
				<Button size="sm" variant="ghost" onClick={() => isEditingName = true}>Edit</Button>
			{/if}
		</div>

		{#if isEditingName}
			<div class="edit-form">
				<Input label="Nama Lengkap" bind:value={editName} placeholder="Masukkan nama lengkap" />
				<div class="form-actions">
					<Button variant="ghost" size="sm" onClick={cancelEditName}>Batal</Button>
					<Button size="sm" onClick={handleSaveName}>
						{#if isSavingName}Menyimpan...{:else}Simpan{/if}
					</Button>
				</div>
			</div>
		{:else}
			<p class="current-value">{name || "-"}</p>
		{/if}
	</Card>

	<!-- Ganti Password -->
	<Card border padding="lg">
		<div class="section-header">
			<div>
				<h3 class="section-title">Password</h3>
				<p class="section-desc">Ganti password akun Anda untuk keamanan.</p>
			</div>
			{#if !isEditingPassword}
				<Button size="sm" variant="ghost" onClick={() => isEditingPassword = true}>Ganti Password</Button>
			{/if}
		</div>

		{#if isEditingPassword}
			<div class="edit-form">
				<Input label="Password Lama" type="password" bind:value={oldPassword} placeholder="Masukkan password lama" />
				<Input label="Password Baru" type="password" bind:value={newPassword} placeholder="Minimal 6 karakter" />
				<Input label="Konfirmasi Password Baru" type="password" bind:value={confirmPassword} placeholder="Ulangi password baru" />
				<div class="form-actions">
					<Button variant="ghost" size="sm" onClick={cancelEditPassword}>Batal</Button>
					<Button size="sm" onClick={handleSavePassword}>
						{#if isSavingPassword}Menyimpan...{:else}Simpan Password{/if}
					</Button>
				</div>
			</div>
		{:else}
			<p class="current-value masked">••••••••</p>
		{/if}
	</Card>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
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

	.profile-card-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.avatar-section {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--color-border);
	}

	.user-meta {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.user-meta h2 {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.role-badge {
		font-size: 0.8rem;
		font-weight: 600;
		color: #2563eb;
		background: #dbeafe;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		width: fit-content;
	}

	.dept-badge {
		font-size: 0.8rem;
		font-weight: 600;
		color: #059669;
		background: #d1fae5;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		width: fit-content;
	}

	.info-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text-light);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.info-value {
		font-size: 0.95rem;
		color: var(--color-text);
		font-weight: 500;
	}

	/* Section cards */
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.25rem 0;
	}

	.section-desc {
		font-size: 0.85rem;
		color: var(--color-text-light);
		margin: 0;
	}

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.current-value {
		font-size: 0.95rem;
		color: var(--color-text);
		margin: 0;
	}

	.current-value.masked {
		color: var(--color-text-light);
		letter-spacing: 0.15em;
	}
</style>
