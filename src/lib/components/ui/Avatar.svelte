<script lang="ts">
    import  User  from '@lucide/svelte/icons/user';
	interface Props {
		src?: string;
		alt?: string;
		name?: string;
		size?: "sm" | "md" | "lg" | "xl";
		rounded?: boolean;
	}

	let {
		src = "",
		alt = "",
		name = "",
		size = "md",
		rounded = true
	}: Props = $props();

</script>

<div
	class={[
		"avatar",
		size,
		rounded && "rounded"
	]}
>
	{#if src}
		<img src={src} alt={alt || name} />
	{:else}
        <div class="user-icon">
            <User />
        </div>
	{/if}
</div>

<style>
	.avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;

		background: var(--color-primary-light);
		color: var(--color-primary);

		font-weight: 600;

		overflow: hidden;

		user-select: none;

		border: 1px solid var(--color-border);
	}

	.rounded {
		border-radius: 50%;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.user-icon{
        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;
        border-radius: 50%;

        background: var(--color-surface-hover);
        color: var(--color-text-light);
    }

	.sm {
		width: 32px;
		height: 32px;
		font-size: .8rem;
	}

	.md {
		width: 40px;
		height: 40px;
		font-size: .95rem;
	}

	.lg {
		width: 56px;
		height: 56px;
		font-size: 1.2rem;
	}

	.xl {
		width: 72px;
		height: 72px;
		font-size: 1.5rem;
	}
</style>