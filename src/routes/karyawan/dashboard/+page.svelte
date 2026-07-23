<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { Calendar, Clock, Smile, CheckCircle } from "@lucide/svelte";

	let checkedIn = $state(true);
	let checkInTime = $state("07:55 AM");
</script>

<svelte:head>
	<title>Dashboard Karyawan - LogMood</title>
</svelte:head>

<div class="page-container">
	<div class="welcome-card">
		<div class="welcome-text">
			<h1>Selamat Datang, Budi Santoso 👋</h1>
			<p>Semoga harimu menyenangkan dan produktif di kantor!</p>
		</div>
	</div>

	<div class="status-grid">
		<!-- Status Presensi Card using UI Card component -->
		<Card border hover padding="lg">
			<div class="card-inner">
				<div class="card-icon">
					<Clock size={24} />
				</div>
				<div class="card-body">
					<h3>Status Absensi Hari Ini</h3>
					{#if checkedIn}
						<div class="status-badge success">
							<CheckCircle size={16} /> Hadir (Masuk: {checkInTime})
						</div>
					{:else}
						<div class="status-badge pending">Belum Absen Masuk</div>
					{/if}
				</div>
				<div class="card-action">
					<Button variant={checkedIn ? "secondary" : "primary"} onClick={() => window.location.href = '/karyawan/absensi'}>
						{checkedIn ? "Absen Keluar" : "Absen Masuk"}
					</Button>
				</div>
			</div>
		</Card>

		<!-- Status Mood Card using UI Card component -->
		<Card border hover padding="lg">
			<div class="card-inner">
				<div class="card-icon mood-icon">
					<Smile size={24} />
				</div>
				<div class="card-body">
					<h3>Jurnal Mood Hari Ini</h3>
					<p>Bagaimana perasaanmu menjalankan pekerjaan hari ini?</p>
				</div>
				<div class="card-action">
					<Button variant="ghost" onClick={() => window.location.href = '/karyawan/mood-jurnal'}>Isi Jurnal Mood</Button>
				</div>
			</div>
		</Card>
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.welcome-card {
		background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
		color: white;
		border-radius: var(--radius-lg, 16px);
		padding: 2rem;
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
	}

	.welcome-card h1 {
		font-size: 1.75rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.welcome-card p {
		opacity: 0.9;
		font-size: 1rem;
	}

	.status-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.25rem;
	}

	.card-inner {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
	}

	.card-icon {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--color-primary-light, #dbeafe);
		color: var(--color-primary, #2563eb);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mood-icon {
		background: #fef3c7;
		color: #d97706;
	}

	.card-body h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.card-body p {
		font-size: 0.9rem;
		color: var(--color-text-light);
		margin: 0;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.status-badge.success {
		background: #dcfce7;
		color: #15803d;
	}

	.status-badge.pending {
		background: #fef3c7;
		color: #b45309;
	}

	.card-action {
		margin-top: auto;
	}
</style>
