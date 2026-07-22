<script lang="ts">
	import { page } from "$app/state";
	import { ChevronRight, Home } from "@lucide/svelte";

	import { adminNavigation, karyawanNavigation } from "$lib/config/navigations";

	// Generate map of path -> label from navigation config
	const routeLabelMap = new Map<string, string>([
		["/admin", "Admin Portal"],
		["/karyawan", "Karyawan Portal"],
		["/login", "Login"],
		["/register", "Registrasi"]
	]);

	[...adminNavigation, ...karyawanNavigation].forEach(group => {
		group.items.forEach(item => {
			routeLabelMap.set(item.href, item.label);
		});
	});

	const segments = $derived.by(() => {
		const currentPath = page.url.pathname;
		const pathSegments = currentPath.split("/").filter(Boolean);

		return pathSegments.map((segment, index) => {
			const href = "/" + pathSegments.slice(0, index + 1).join("/");
			
			// Jangan buat link jika mengarah ke root /admin atau /karyawan karena halamannya tidak ada (404)
			const isClickable = href !== "/admin" && href !== "/karyawan";

			const rawLabel = routeLabelMap.get(href) || 
				segment
					.replace(/-/g, " ")
					.replace(/\b\w/g, (char) => char.toUpperCase());

			return {
				label: rawLabel,
				href,
				isClickable,
				isLast: index === pathSegments.length - 1
			};
		});
	});

	const rootHref = $derived.by(() => {
		if (page.url.pathname.startsWith("/admin")) return "/admin/dashboard";
		if (page.url.pathname.startsWith("/karyawan")) return "/karyawan/dashboard";
		return "/login";
	});
</script>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href={rootHref} class="home-link" title="Dashboard Utama">
		<Home size={16} />
	</a>

	{#if segments.length > 0}
		<ChevronRight size={14} class="separator" />
	{/if}

	{#each segments as item}
		{#if !item.isLast}
			{#if item.isClickable}
				<a href={item.href} class="breadcrumb-item link">
					{item.label}
				</a>
			{:else}
				<span class="breadcrumb-item text-muted">
					{item.label}
				</span>
			{/if}
			<ChevronRight size={14} class="separator" />
		{:else}
			<span class="breadcrumb-item active" aria-current="page">
				{item.label}
			</span>
		{/if}
	{/each}
</nav>

<style>
	.breadcrumb {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: var(--color-text-light, #64748b);
		padding: 0.25rem 0;
	}

	.home-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-light, #64748b);
		padding: 0.3rem;
		border-radius: var(--radius-sm, 6px);
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.home-link:hover {
		color: var(--color-primary, #2563eb);
		background: var(--color-surface-hover, #f1f5f9);
	}

	.breadcrumb-item {
		display: inline-flex;
		align-items: center;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.link {
		color: var(--color-text-light, #64748b);
		font-weight: 500;
	}

	.link:hover {
		color: var(--color-primary, #2563eb);
	}

	.active {
		font-weight: 600;
		color: var(--color-text, #0f172a);
		background: var(--color-surface-hover, #f1f5f9);
		padding: 0.2rem 0.6rem;
		border-radius: var(--radius-sm, 6px);
	}

	:global(.separator) {
		flex-shrink: 0;
		color: var(--color-text-light, #94a3b8);
		opacity: 0.7;
	}

	.text-muted {
		color: var(--color-text-light, #64748b);
		font-weight: 500;
	}
</style>