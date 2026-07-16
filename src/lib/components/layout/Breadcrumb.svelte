<script lang="ts">
	import { page } from "$app/state";
	import { ChevronRight } from "@lucide/svelte";

	const segments = $derived.by(() => {
		return page.url.pathname
			.split("/")
			.filter(Boolean)
			.map((segment, index, array) => {
				const href = "/" + array.slice(0, index + 1).join("/");

				const label = segment
					.replace(/-/g, " ")
					.replace(/\b\w/g, (char) => char.toUpperCase());

				return {
					label,
					href,
					last: index === array.length - 1
				};
			});
	});
</script>

<nav
	class="breadcrumb"
	aria-label="Breadcrumb"
>

	{#each segments as item}

		{#if !item.last}

			<a href={item.href}>
				{item.label}
			</a>

			<ChevronRight size={16} />

		{:else}

			<span class="active">
				{item.label}
			</span>

		{/if}

	{/each}

</nav>

<style>

	.breadcrumb {

		display: flex;

		align-items: center;

		gap: .45rem;

		font-size: .9rem;

		color: var(--color-text-light);

	}

	a {

		text-decoration: none;

		color: inherit;

		transition: .2s;

	}

	a:hover {

		color: var(--color-primary);

	}

	.active {

		font-weight: 600;

		color: var(--color-text);

	}

	svg:global() {

		flex-shrink: 0;

		color: var(--color-text-light);

	}

</style>