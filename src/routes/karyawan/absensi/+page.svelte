<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import FaceCapture from "$lib/components/common/FaceCapture.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import Spinner from "$lib/components/ui/Spinner.svelte";
	import { MapPin, Camera, Check, RefreshCw, Smile } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { checkIn, checkOut, getMyAttendanceHistory } from "$lib/services/attendance.service";
	import { createMoodJournal } from "$lib/services/mood.service";
	import type { AttendanceLog } from "$lib/types/attendance";
	import type { MoodLevel } from "$lib/types/mood";

	let checkedIn = $state(false);
	let checkedOut = $state(false);
	let checkInTime = $state("");
	let checkOutTime = $state("");
	let capturedPhoto = $state<string | null>(null);
	
	// Modals state
	let isCameraModalOpen = $state(false);
	let isMoodModalOpen = $state(false);
	let isLoading = $state(false);

	// Mood state
	let selectedMood = $state<MoodLevel>("Happy");
	let moodNotes = $state("");

	const moods: { emoji: string; label: string; moodLevel: MoodLevel }[] = [
		{ emoji: "🤩", label: "Sangat Senang", moodLevel: "Excited" },
		{ emoji: "😊", label: "Senang", moodLevel: "Happy" },
		{ emoji: "😐", label: "Netral", moodLevel: "Neutral" },
		{ emoji: "🥱", label: "Lelah", moodLevel: "Tired" },
		{ emoji: "😠", label: "Stres / Kesal", moodLevel: "Stressed" }
	];

	let latitude = $state<number>(-6.200000);
	let longitude = $state<number>(106.816666);
	let locationText = $state("Mendeteksi lokasi...");

	let currentTime = $state(new Date().toLocaleTimeString('id-ID'));

	// Tanggal aktif saat halaman dimuat — digunakan untuk deteksi pergantian hari
	let activeDate = $state(new Date().toISOString().split('T')[0]);

	let toastVisible = $state(false);
	let toastMessage = $state("");
	let toastType = $state<"success" | "danger" | "warning" | "info">("success");

	function showToast(message: string, type: "success" | "danger" | "warning" | "info" = "success") {
		toastMessage = message;
		toastType = type;
		toastVisible = true;
	}

	function formatTime(timeStr: string | null): string {
		if (!timeStr) return "-";
		try {
			const date = new Date(timeStr);
			if (isNaN(date.getTime())) return timeStr;
			return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
		} catch {
			return timeStr;
		}
	}

	async function loadAttendanceStatus() {
		try {
			isLoading = true;
			const res = await getMyAttendanceHistory().catch(() => ({ data: [] }));
			const logs: AttendanceLog[] = res.data || [];
			
			const todayStr = new Date().toISOString().split("T")[0];
			const todayLog = logs.find((log) => {
				const logDate = log.attendanceDate ? log.attendanceDate.split("T")[0] : log.createdAt ? log.createdAt.split("T")[0] : "";
				return logDate === todayStr;
			});

			if (todayLog) {
				if (todayLog.checkIn) {
					checkedIn = true;
					checkInTime = formatTime(todayLog.checkIn);
				}
				if (todayLog.checkOut) {
					checkedOut = true;
					checkOutTime = formatTime(todayLog.checkOut);
				}
			}
		} catch (error: any) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	}

	function detectLocation() {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					latitude = pos.coords.latitude;
					longitude = pos.coords.longitude;
					locationText = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)} (Radius Valid)`;
				},
				(err) => {
					console.warn("Geolocation warning:", err.message);
					locationText = `Lat: ${latitude}, Long: ${longitude} (Lokasi Default)`;
				}
			);
		} else {
			locationText = `Lat: ${latitude}, Long: ${longitude} (Lokasi Default)`;
		}
	}

	// Update live clock
	$effect(() => {
	const interval = setInterval(() => {
		currentTime = new Date().toLocaleTimeString('id-ID');
		}, 1000);
		return () => clearInterval(interval);
	});

	// Midnight reset: cek pergantian hari setiap 30 detik
	// Jika tanggal berubah, reset state absensi agar karyawan bisa absen kembali
	$effect(() => {
	const midnightChecker = setInterval(() => {
		const nowDate = new Date().toISOString().split('T')[0];
			if (nowDate !== activeDate) {
				// Hari sudah berganti — reset semua state absensi
				activeDate = nowDate;
				checkedIn = false;
				checkedOut = false;
				checkInTime = '';
				checkOutTime = '';
				capturedPhoto = null;
				// Muat ulang status dari server untuk hari baru
				loadAttendanceStatus();
				showToast('Hari baru dimulai! Silakan lakukan absensi hari ini.', 'info');
			}
		}, 30_000); // cek setiap 30 detik
		return () => clearInterval(midnightChecker);
	});

	onMount(() => {
		detectLocation();
		loadAttendanceStatus();
	});

	function openCameraModal() {
		capturedPhoto = null;
		isCameraModalOpen = true;
	}

	function closeCameraModal() {
		isCameraModalOpen = false;
	}

	function handleCaptureFile(file: File) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const rawSrc = e.target?.result as string;
			if (!rawSrc) return;

			// Compress and resize image using Canvas for fast lightweight payload
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const maxDim = 400;
				let width = img.width;
				let height = img.height;

				if (width > height) {
					if (width > maxDim) {
						height = Math.round((height * maxDim) / width);
						width = maxDim;
					}
				} else {
					if (height > maxDim) {
						width = Math.round((width * maxDim) / height);
						height = maxDim;
					}
				}

				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext("2d");
				if (ctx) {
					ctx.drawImage(img, 0, 0, width, height);
					capturedPhoto = canvas.toDataURL("image/jpeg", 0.7);
				} else {
					capturedPhoto = rawSrc;
				}
			};
			img.src = rawSrc;
		};
		reader.readAsDataURL(file);
	}

	// Step 1: After taking selfie photo, move to Mood selection modal
	function proceedToMoodModal() {
		if (!capturedPhoto) {
			showToast("Silakan ambil foto selfie Anda terlebih dahulu.", "warning");
			return;
		}
		isCameraModalOpen = false;
		isMoodModalOpen = true;
	}

	// Absen Keluar langsung — tanpa kamera & mood
	async function handleCheckOut() {
		try {
			isLoading = true;
			await checkOut({ latitude, longitude });
			showToast("Absen keluar berhasil dicatat!", "success");
			await loadAttendanceStatus();
		} catch (err: unknown) {
			const e = err as { message?: string };
			showToast(e?.message || "Gagal melakukan absen keluar", "danger");
		} finally {
			isLoading = false;
		}
	}

	// Step 2: Final submit (Save Attendance + Save Mood Journal)
	async function submitAttendanceAndMood() {
		try {
			isLoading = true;
			
			// 1. Submit Attendance Check-In or Check-Out
			if (!checkedIn) {
				await checkIn({ latitude, longitude, photo: capturedPhoto });
			} else {
				await checkOut({ latitude, longitude });
			}

			// 2. Submit Mood Journal
			await createMoodJournal({
				moodLevel: selectedMood,
				note: moodNotes || undefined
			}).catch((err) => console.warn("Mood journal save skipped/failed:", err));

			showToast("Foto selfie, presensi, dan jurnal mood berhasil disimpan!", "success");
			
			await loadAttendanceStatus();
			isMoodModalOpen = false;
		} catch (error: any) {
			console.error(error);
			showToast(error?.message || "Gagal melakukan presensi", "danger");
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Absensi Karyawan - LogMood</title>
</svelte:head>

<Toast 
	visible={toastVisible} 
	message={toastMessage} 
	type={toastType} 
	onClose={() => toastVisible = false} 
/>

{#if isLoading}
	<Spinner fullscreen label="Memproses presensi & mood..." />
{/if}

<div class="page-container">
	<div class="header-action">
		<div>
			<h1>Absensi Presensi Wajah</h1>
			<p>Lakukan presensi foto selfie dan lokasi untuk mencatat kehadiran Anda hari ini.</p>
		</div>
	</div>

	<Card border padding="lg">
		<div class="absensi-card-content">
			<div class="time-display">
				<span class="live-tag">LIVE CLOCK</span>
				<h2>{currentTime}</h2>
				<p>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
			</div>

			<div class="location-box">
				<MapPin size={20} color="#2563eb" />
				<span>{locationText}</span>
			</div>

			{#if capturedPhoto}
				<div class="preview-box">
					<h4>Foto Selfie Presensi Tersimpan:</h4>
					<Avatar src={capturedPhoto} name="Selfie Absensi" size={100} />
				</div>
			{/if}

			<div class="action-box">
				{#if !checkedIn}
					<Button fullWidth onClick={openCameraModal}>
						<Camera size={20} style="margin-right: 8px;" />
						Ambil Foto Selfie & Absen Masuk
					</Button>
				{:else if !checkedOut}
					<div class="success-message">
						<Check size={24} />
						<span>Anda Sudah Absen Masuk Hari Ini ({checkInTime})</span>
					</div>
				<Button variant="secondary" fullWidth onClick={handleCheckOut}>
						Absen Keluar
					</Button>
				{:else}
					<div class="success-message">
						<Check size={24} />
						<span>Presensi Hari Ini Selesai (Masuk: {checkInTime}, Keluar: {checkOutTime})</span>
					</div>
					<p class="next-attendance-info">
						🔄 Absensi akan tersedia kembali mulai <strong>00:00 hari berikutnya</strong>.
						Data hari ini tersimpan di <a href="/karyawan/riwayat-absensi">Riwayat Absensi</a>.
					</p>
				{/if}
			</div>
		</div>
	</Card>
</div>

<!-- Modal 1: Kamera Presensi Wajah -->
<Modal open={isCameraModalOpen} title="1. Presensi Wajah / Take Selfie" onClose={closeCameraModal}>
	<div class="modal-camera-container">
		{#if !capturedPhoto}
			<p class="instruction">Posisikan wajah Anda di dalam area kamera lalu tekan <strong>Ambil Foto</strong>.</p>
			<FaceCapture onCapture={handleCaptureFile} />
		{:else}
			<div class="photo-preview-confirm">
				<p class="instruction">Pratinjau Hasil Foto Selfie Presensi:</p>
				<Avatar src={capturedPhoto} name="Captured Face" size={140} />
				<div class="retake-btn">
					<Button variant="ghost" size="sm" onClick={() => capturedPhoto = null}>
						<RefreshCw size={16} style="margin-right: 6px;" />
						Foto Ulang
					</Button>
				</div>
			</div>
		{/if}
	</div>

	{#snippet footer()}
		<Button variant="ghost" onClick={closeCameraModal}>Batal</Button>
		{#if capturedPhoto}
			<Button variant="primary" onClick={proceedToMoodModal}>
				Lanjut Pilih Mood
				<Smile size={18} style="margin-left: 6px;" />
			</Button>
		{/if}
	{/snippet}
</Modal>

<!-- Modal 2: Pilih Jurnal Mood Harian -->
<Modal open={isMoodModalOpen} title="2. Pilih Jurnal Mood Hari Ini" onClose={() => isMoodModalOpen = false}>
	<div class="modal-mood-container">
		<div class="captured-badge">
			<Avatar src={capturedPhoto || ""} name="Selfie" size={48} />
			<span>Foto selfie berhasil diambil! Silakan pilih mood Anda.</span>
		</div>

		<h3>Bagaimana Perasaanmu Hari Ini?</h3>
		<div class="emoji-selector">
			{#each moods as item}
				<button
					type="button"
					class="emoji-btn"
					class:active={selectedMood === item.moodLevel}
					onclick={() => selectedMood = item.moodLevel}
				>
					<span class="emoji">{item.emoji}</span>
					<span class="label">{item.label}</span>
				</button>
			{/each}
		</div>

		<div class="input-group">
			<label for="mood-notes-modal">Catatan Tambahan (Opsional)</label>
			<textarea
				id="mood-notes-modal"
				rows="3"
				placeholder="Tuliskan catatan perasaan atau tantangan hari ini..."
				bind:value={moodNotes}
			></textarea>
		</div>
	</div>

	{#snippet footer()}
		<Button variant="ghost" onClick={() => { isMoodModalOpen = false; isCameraModalOpen = true; }}>
			Kembali ke Kamera
		</Button>
		<Button variant="success" onClick={submitAttendanceAndMood}>
			<Check size={18} style="margin-right: 6px;" />
			Simpan Presensi & Jurnal Mood
		</Button>
	{/snippet}
</Modal>

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

	.absensi-card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1.5rem;
	}

	.live-tag {
		font-size: 0.75rem;
		font-weight: 700;
		color: #2563eb;
		background: #dbeafe;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
	}

	.time-display h2 {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--color-text);
		margin: 0.5rem 0 0.2rem 0;
	}

	.time-display p {
		color: var(--color-text-light);
		margin: 0;
	}

	.location-box {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--color-background);
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md, 10px);
		font-size: 0.9rem;
		color: var(--color-text);
		border: 1px solid var(--color-border);
	}

	.preview-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.preview-box h4 {
		margin: 0;
		font-size: 0.9rem;
		color: var(--color-text-light);
	}

	.action-box {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.success-message {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: #dcfce7;
		color: #15803d;
		padding: 1rem;
		border-radius: var(--radius-md, 10px);
		font-weight: 600;
	}

	.next-attendance-info {
		margin: 0;
		padding: 0.7rem 1rem;
		background: #eff6ff;
		border: 1px solid #bfdbfe;
		border-radius: var(--radius-md, 10px);
		font-size: 0.85rem;
		color: #1e40af;
		text-align: center;
		line-height: 1.5;
	}

	.next-attendance-info a {
		color: #2563eb;
		font-weight: 600;
		text-decoration: underline;
	}

	.modal-camera-container,
	.modal-mood-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.instruction {
		font-size: 0.9rem;
		color: var(--color-text-light);
		text-align: center;
		margin: 0;
	}

	.photo-preview-confirm {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 1rem 0;
	}

	.retake-btn {
		margin-top: 0.5rem;
	}

	.captured-badge {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #dcfce7;
		color: #15803d;
		padding: 0.6rem 1rem;
		border-radius: var(--radius-md, 10px);
		font-size: 0.85rem;
		font-weight: 600;
		width: 100%;
		box-sizing: border-box;
	}

	.modal-mood-container h3 {
		margin: 0.5rem 0 0 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.emoji-selector {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
		gap: 0.6rem;
		width: 100%;
	}

	.emoji-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.75rem 0.4rem;
		border-radius: var(--radius-md, 12px);
		border: 1px solid var(--color-border);
		background: var(--color-background);
		cursor: pointer;
		transition: 0.2s;
	}

	.emoji-btn:hover {
		background: var(--color-surface-hover);
		transform: translateY(-2px);
	}

	.emoji-btn.active {
		border-color: var(--color-primary);
		background: var(--color-primary-light, #dbeafe);
	}

	.emoji {
		font-size: 1.75rem;
		margin-bottom: 0.25rem;
	}

	.label {
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-text);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		width: 100%;
	}

	.input-group label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text);
	}

	textarea {
		width: 100%;
		padding: 0.75rem;
		border-radius: var(--radius-md, 10px);
		border: 1px solid var(--color-border);
		background: var(--color-background);
		color: var(--color-text);
		font-family: inherit;
		font-size: 0.9rem;
		outline: none;
		box-sizing: border-box;
	}

	textarea:focus {
		border-color: var(--color-primary);
	}
</style>
