<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Input from "$lib/components/ui/Input.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";

	let name = $state("Budi Santoso");
	let email = $state("budi@company.com");
	let division = $state("IT Engineering");
	let password = $state("********");
</script>

<svelte:head>
	<title>Profil Saya - LogMood</title>
</svelte:head>

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Profil Saya</h1>
			<p>Kelola informasi akun dan pengaturan profil Anda.</p>
		</div>
	</div>

	<Card border padding="lg">
		<div class="profile-card-content">
			<div class="avatar-section">
				<Avatar name={name} size={80} />
				<div class="user-meta">
					<h2>{name}</h2>
					<span class="role-badge">Karyawan</span>
				</div>
			</div>

			<div class="form-grid">
				<Input label="Nama Lengkap" bind:value={name} />
				<Input label="Email Perusahaan" bind:value={email} disabled />
				<Input label="Divisi" bind:value={division} disabled />
				<Input label="Password" bind:value={password} type="password" />
			</div>

			<div class="card-footer">
				<Button onClick={() => alert("Profil diperbarui!")}>Simpan Perubahan</Button>
			</div>
		</div>
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

	.user-meta h2 {
		margin: 0 0 0.35rem 0;
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
	}

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.card-footer {
		display: flex;
		justify-content: flex-end;
		padding-top: 0.5rem;
	}
</style>
