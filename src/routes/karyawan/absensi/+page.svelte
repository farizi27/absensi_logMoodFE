<script lang="ts">
	import Card from "$lib/components/ui/Card.svelte";
	import Button from "$lib/components/ui/Button.svelte";
	import Modal from "$lib/components/ui/Modal.svelte";
	import FaceCapture from "$lib/components/common/FaceCapture.svelte";
	import Avatar from "$lib/components/ui/Avatar.svelte";
	import { MapPin, Camera, Check, RefreshCw } from "@lucide/svelte";

	let checkedIn = $state(false);
	let checkInTime = $state("");
	let capturedPhoto = $state<string | null>(null);
	let isModalOpen = $state(false);

	let currentTime = $state(new Date().toLocaleTimeString('id-ID'));

	// Update live clock
	$effect(() => {
		const interval = setInterval(() => {
			currentTime = new Date().toLocaleTimeString('id-ID');
		}, 1000);
		return () => clearInterval(interval);
	});

	function openCameraModal() {
		capturedPhoto = null;
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function handleCaptureFile(file: File) {
		const reader = new FileReader();
		reader.onload = (e) => {
			capturedPhoto = e.target?.result as string;
		};
		reader.readAsDataURL(file);
	}

	function confirmAttendance() {
		if (!capturedPhoto) {
			alert("Silakan ambil foto selfie Anda terlebih dahulu.");
			return;
		}
		checkInTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
		checkedIn = true;
		isModalOpen = false;
	}
</script>

<svelte:head>
	<title>Absensi Karyawan - LogMood</title>
</svelte:head>

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
				<span>Lokasi Terdeteksi: PT. Company Office (Radius Valid)</span>
			</div>

			{#if capturedPhoto}
				<div class="preview-box">
					<h4>Foto Selfie Presensi:</h4>
					<Avatar src={capturedPhoto} name="Selfie Absensi" size={100} />
				</div>
			{/if}

			<div class="action-box">
				{#if !checkedIn}
					<Button fullWidth onClick={openCameraModal}>
						<Camera size={20} style="margin-right: 8px;" />
						Ambil Foto Selfie & Absen Masuk
					</Button>
				{:else}
					<div class="success-message">
						<Check size={24} />
						<span>Anda Sudah Absen Masuk Hari Ini ({checkInTime || "07:55 AM"})</span>
					</div>
					<Button variant="secondary" fullWidth onClick={() => { checkedIn = false; capturedPhoto = null; }}>
						Absen Keluar
					</Button>
				{/if}
			</div>
		</div>
	</Card>
</div>

<!-- Modal Kamera Presensi Wajah -->
<Modal open={isModalOpen} title="Presensi Wajah / Take Selfie" onClose={closeModal}>
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
		<Button variant="ghost" onClick={closeModal}>Batal</Button>
		{#if capturedPhoto}
			<Button variant="success" onClick={confirmAttendance}>
				<Check size={18} style="margin-right: 6px;" />
				Konfirmasi & Presensi
			</Button>
		{/if}
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

	.modal-camera-container {
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
</style>
