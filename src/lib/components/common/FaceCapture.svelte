<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import Button from "../ui/Button.svelte";
	import Avatar from "../ui/Avatar.svelte";
	import { Camera, RefreshCw, AlertCircle } from "@lucide/svelte";

	let {
		autoStart = true,
		onCapture
	}: {
		autoStart?: boolean;
		onCapture?: (file: File) => void;
	} = $props();

	let video = $state<HTMLVideoElement | null>(null);
	let canvas = $state<HTMLCanvasElement | null>(null);

	let stream = $state<MediaStream | null>(null);
	let preview = $state<string | null>(null);
	let isCameraOpen = $state(false);
	let cameraError = $state<string | null>(null);

	async function openCamera() {
		cameraError = null;
		isCameraOpen = true; // Mount <video> in DOM first so bind:this works!

		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
					width: { ideal: 1280 },
					height: { ideal: 720 }
				},
				audio: false
			});

			stream = mediaStream;

			setTimeout(() => {
				if (video) {
					video.srcObject = mediaStream;
					video.play().catch(console.error);
				}
			}, 50);
		} catch (err) {
			console.error("Camera access error:", err);
			cameraError = "Kamera tidak dapat diakses. Pastikan izin kamera telah diberikan di browser.";
			isCameraOpen = false;
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
		isCameraOpen = false;
	}

	function capture() {
		if (!video || !canvas) return;

		const context = canvas.getContext("2d");
		if (!context) return;

		canvas.width = video.videoWidth || 640;
		canvas.height = video.videoHeight || 480;

		// Mirror horizontally for natural selfie orientation
		context.translate(canvas.width, 0);
		context.scale(-1, 1);
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		preview = canvas.toDataURL("image/png");

		canvas.toBlob((blob) => {
			if (!blob) return;
			const file = new File([blob], "face-capture.png", {
				type: "image/png"
			});
			onCapture?.(file);
		}, "image/png");

		stopCamera();
	}

	function resetCapture() {
		preview = null;
		openCamera();
	}

	onMount(() => {
		if (autoStart) {
			openCamera();
		}
	});

	onDestroy(() => {
		stopCamera();
	});
</script>

<div class="face-capture">
	{#if preview}
		<div class="preview-container">
			<img src={preview} alt="Pratinjau Foto Selfie" class="captured-preview" />
			<div class="actions">
				<Button variant="ghost" size="sm" onClick={resetCapture}>
					<RefreshCw size={16} style="margin-right: 6px;" />
					Foto Ulang
				</Button>
			</div>
		</div>
	{:else if cameraError}
		<div class="error-container">
			<AlertCircle size={36} color="#ef4444" />
			<p>{cameraError}</p>
			<Button size="sm" onClick={openCamera}>Coba Lagi</Button>
		</div>
	{:else if isCameraOpen}
		<div class="video-container">
			<!-- Live camera feed with mirror transform for selfie -->
			<video
				bind:this={video}
				autoplay
				playsinline
				muted
			></video>
			<div class="face-guide-overlay">
				<div class="face-ellipse"></div>
			</div>
		</div>

		<div class="actions">
			<Button variant="success" onClick={capture}>
				<Camera size={18} style="margin-right: 6px;" />
				Ambil Foto
			</Button>
			<Button variant="danger" onClick={stopCamera}>
				Batal
			</Button>
		</div>
	{:else}
		<div class="placeholder-container">
			<Avatar size={80} />
			<p>Kamera belum aktif</p>
			<Button onClick={openCamera}>
				<Camera size={18} style="margin-right: 6px;" />
				Buka Kamera
			</Button>
		</div>
	{/if}

	<canvas bind:this={canvas} hidden></canvas>
</div>

<style>
	.face-capture {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		width: 100%;
	}

	.video-container {
		position: relative;
		width: 100%;
		max-width: 420px;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-lg, 16px);
		overflow: hidden;
		background: #000;
		box-shadow: var(--shadow-md, 0 4px 10px rgba(0,0,0,0.15));
		border: 2px solid var(--color-border);
	}

	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scaleX(-1); /* Mirror view for natural selfie camera */
	}

	.face-guide-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.face-ellipse {
		width: 60%;
		height: 75%;
		border: 2px dashed rgba(255, 255, 255, 0.7);
		border-radius: 50%;
		box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25);
	}

	.preview-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		width: 100%;
	}

	.captured-preview {
		width: 100%;
		max-width: 420px;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-lg, 16px);
		object-fit: cover;
		border: 2px solid var(--color-success, #22c55e);
		box-shadow: var(--shadow-md);
	}

	.placeholder-container,
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
		background: var(--color-background);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-lg, 16px);
		width: 100%;
		max-width: 420px;
		text-align: center;
	}

	.error-container p,
	.placeholder-container p {
		font-size: 0.9rem;
		color: var(--color-text-light);
		margin: 0;
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}
</style>