<script lang="ts">
	let {
		name = "",
		src = "",
		size = 40,
		background = "var(--color-primary)",
		color = "var(--color-text-white)"
	}: {
		name?: string;
		src?: string;
		size?: number | string;
		background?: string;
		color?: string;
	} = $props();

	const numericSize = $derived.by(() => {
		if (typeof size === "number") return size;
		if (size === "sm") return 32;
		if (size === "md") return 40;
		if (size === "lg") return 48;
		if (size === "xl") return 64;
		const parsed = parseInt(size, 10);
		return isNaN(parsed) ? 40 : parsed;
	});

	const initials = $derived.by(() => {
		if (!name) return "?";

		return name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((word) => word[0].toUpperCase())
			.join("");
	});
</script>

<div
	class="avatar"
	style="
		width: {numericSize}px;
		height: {numericSize}px;
		background: {background};
		color: {color};
		font-size: {numericSize * 0.4}px;
	"
	title={name}
>
	{#if src}
		<img {src} alt={name} class="avatar-img" />
	{:else}
		{initials}
	{/if}
</div>

<style>
	.avatar {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		font-weight: 600;
		user-select: none;
		flex-shrink: 0;
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>