<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import { auth } from "$lib/stores/auth";
	import { Clock, Smile, CheckCircle, AlertCircle, Loader } from "@lucide/svelte";
	import { getMyAttendanceHistory } from "$lib/services/attendance.service";
	import { getMyMoodJournals } from "$lib/services/mood.service";
	import type { AttendanceLog } from "$lib/types/attendance";
	import type { MoodJournal } from "$lib/types/mood";
	import { MOOD_LABEL, MOOD_EMOJI } from "$lib/types/mood";
	import { onMount } from "svelte";

	// --- State ---
	let loading = $state(true);
	let error = $state<string | null>(null);

	let todayAttendance = $state<AttendanceLog | null>(null);
	let todayMood = $state<MoodJournal | null>(null);

	// --- Helpers ---
	function getTodayDateString() {
		return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
	}

	function formatTime(isoString: string | null) {
		if (!isoString) return "-";
		return new Date(isoString).toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit"
		});
	}

	// --- Derived state ---
	const checkedIn = $derived(!!todayAttendance?.checkIn);
	const checkedOut = $derived(!!todayAttendance?.checkOut);
	const hasMood = $derived(!!todayMood);

	const checkInTime = $derived(
		todayAttendance?.checkIn ? formatTime(todayAttendance.checkIn) : null
	);
	const checkOutTime = $derived(
		todayAttendance?.checkOut ? formatTime(todayAttendance.checkOut) : null
	);
	// --- Fetch data ---
	async function loadData() {
		try {
			loading = true;
			error = null;

			const today = getTodayDateString();

			const [attendanceRes, moodRes] = await Promise.all([
				getMyAttendanceHistory(),
				getMyMoodJournals()
			]);

			// Cari absensi hari ini
			todayAttendance =
				attendanceRes.data.find((log) => log.attendanceDate.startsWith(today)) ?? null;

			// Cari mood jurnal hari ini
			todayMood =
				moodRes.data.find((m) => m.createdAt.startsWith(today)) ?? null;
		} catch (err: unknown) {
			const e = err as { message?: string };
			error = e?.message ?? "Gagal memuat data dashboard.";
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadData();

		// Refresh data setiap kali user kembali ke tab/halaman ini
		// (misalnya setelah mengisi mood-jurnal atau absensi)
		function onVisible() {
			if (document.visibilityState === "visible") {
				loadData();
			}
		}

		document.addEventListener("visibilitychange", onVisible);
		return () => document.removeEventListener("visibilitychange", onVisible);
	});

</script>

<svelte:head>
	<title>Dashboard Karyawan - LogMood</title>
</svelte:head>

<div class="page-container">
	<div class="welcome-card">
		<div class="welcome-text">
			<h1>Selamat Datang, {$auth.user?.name} 👋</h1>
			<p>Semoga harimu menyenangkan dan produktif di kantor!</p>
		</div>
	</div>

	{#if error}
		<div class="error-banner">
			<AlertCircle size={18} />
			<span>{error}</span>
		</div>
	{/if}

	{#if loading}
		<div class="loading-wrapper">
			<Loader size={28} class="spin" />
			<span>Memuat data...</span>
		</div>
	{:else}
		<div class="status-grid">
			<!-- Status Presensi Card -->
			<Card border hover padding="lg">
				<div class="card-inner">
					<div class="card-icon">
						<Clock size={24} />
					</div>
					<div class="card-body">
						<h3>Status Absensi Hari Ini</h3>
						{#if checkedIn}
							<div class="status-badge success">
								<CheckCircle size={16} />
								{#if checkedOut}
									Hadir · Masuk: {checkInTime} · Keluar: {checkOutTime}
								{:else}
									Masuk pukul {checkInTime} · Belum absen keluar
								{/if}
							</div>
						{:else}
							<div class="status-badge pending">Belum Absen Masuk</div>
						{/if}
					</div>
					<div class="card-action">
						<Button
							variant={checkedIn && !checkedOut ? "secondary" : "primary"}
							onClick={() => (window.location.href = "/karyawan/absensi")}
						>
							{#if !checkedIn}
								Absen Masuk
							{:else if !checkedOut}
								Absen Keluar
							{:else}
								Lihat Absensi
							{/if}
						</Button>
					</div>
				</div>
			</Card>

			<!-- Status Mood Card -->
			<Card border hover padding="lg">
				<div class="card-inner">
					<div class="card-icon mood-icon">
						<Smile size={24} />
					</div>
					<div class="card-body">
						<h3>Jurnal Mood Hari Ini</h3>
						{#if hasMood && todayMood}
							<div class="status-badge mood-badge">
								<span class="mood-emoji">{MOOD_EMOJI[todayMood.moodLevel]}</span>
								{MOOD_LABEL[todayMood.moodLevel]}
								{#if todayMood.note}
									<span class="mood-note">· "{todayMood.note}"</span>
								{/if}
							</div>
						{:else}
							<p>Bagaimana perasaanmu menjalankan pekerjaan hari ini?</p>
						{/if}
					</div>
					<div class="card-action">
						<Button
							variant="ghost"
							onClick={() => (window.location.href = "/karyawan/mood-jurnal")}
						>
							{hasMood ? "Lihat Jurnal Mood" : "Isi Jurnal Mood"}
						</Button>
					</div>
				</div>
			</Card>
		</div>
	{/if}
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

	/* Error banner */
	.error-banner {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.85rem 1.25rem;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: var(--radius-md, 10px);
		color: #b91c1c;
		font-size: 0.9rem;
		font-weight: 500;
	}

	/* Loading */
	.loading-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 3rem 0;
		color: var(--color-text-light);
		font-size: 0.95rem;
	}

	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
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

	.status-badge.mood-badge {
		background: #ede9fe;
		color: #6d28d9;
		flex-wrap: wrap;
	}

	.mood-emoji {
		font-size: 1.1rem;
	}

	.mood-note {
		font-weight: 400;
		font-style: italic;
		opacity: 0.85;
		font-size: 0.8rem;
	}

	.card-action {
		margin-top: auto;
	}
</style>
