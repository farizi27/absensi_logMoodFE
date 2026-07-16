<script lang="ts">
	import Button from "../ui/Button.svelte";
	import Avatar from "../ui/Avatar.svelte";

	let {
		width = 400,
		height = 300,
		onCapture
	}: {
		width?: number;
		height?: number;
		onCapture?: (file: File) => void;
	} = $props();

	let video = $state<HTMLVideoElement>();
	let canvas = $state<HTMLCanvasElement>();

	let stream = $state<MediaStream | null>(null);

	let preview = $state<string | null>(null);

	let isCameraOpen = $state(false);

	async function openCamera() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user"
				}
			});

			if (video) {
				video.srcObject = stream;
			}

			isCameraOpen = true;
		} catch (err) {
			alert("Kamera tidak dapat dibuka.");
			console.error(err);
		}
	}

	function stopCamera() {
		stream?.getTracks().forEach((track) => track.stop());

		stream = null;

		isCameraOpen = false;
	}

	function capture() {
		if (!video || !canvas) return;

		const context = canvas.getContext("2d");

		if (!context) return;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		context.drawImage(video, 0, 0);

		preview = canvas.toDataURL("image/png");

		canvas.toBlob((blob) => {
			if (!blob) return;

			const file = new File([blob], "face.png", {
				type: "image/png"
			});

			onCapture?.(file);
		});

		stopCamera();
	}
</script>

<div class="face-capture">

	{#if preview}

		<Avatar
			src={preview}
			size="xl"
		/>

	{:else if isCameraOpen}

		<video
			bind:this={video}
			autoplay
			playsinline
		></video>

	{:else}

		<div class="placeholder">

			<Avatar size="xl" />

		</div>

	{/if}

	<div class="actions">

		{#if !isCameraOpen}

			<Button onClick={openCamera}>
				Buka Kamera
			</Button>

		{:else}

			<Button
				variant="success"
				onClick={capture}
			>
				Ambil Foto
			</Button>

			<Button
				variant="danger"
				onClick={stopCamera}
			>
				Batal
			</Button>

		{/if}

	</div>

	<canvas
		bind:this={canvas}
		hidden
	></canvas>

</div>

<style>
	.face-capture {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	video {
		width: 100%;
		max-width: 400px;
		aspect-ratio: 4 / 3;

		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);

		object-fit: cover;
		background: black;
	}

	.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.actions {
		display: flex;
		gap: .75rem;
	}
</style>