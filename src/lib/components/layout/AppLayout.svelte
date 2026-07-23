<script lang="ts">
	import { onMount } from "svelte";
	import type { Snippet } from "svelte";
	import type { NavigationGroup } from "$lib/config/navigations";
	import { page } from "$app/state";

	import Header from "$lib/components/layout/Header.svelte";
	import Sidebar from "$lib/components/layout/Sidebar.svelte";
	import Breadcrumb from "$lib/components/layout/Breadcrumb.svelte";
	import Footer from "$lib/components/layout/Fouter.svelte";

	import { sidebar } from "$lib/stores/sidebar";

	interface Props {
		navigation: NavigationGroup[];
		title?: string;
		logo?: string;
		children?: Snippet;
	}

	let {
		navigation,
		title = "LogMood",
		logo = "",
		children
	}: Props = $props();

	let isMobile = $state(false);

	function updateScreen() {
		const wasMobile = isMobile;
		isMobile = window.innerWidth <= 768;
		
		// Auto-reset mobile open state if expanding to desktop
		if (wasMobile && !isMobile) {
			sidebar.closeMobile();
		}
	}

	onMount(() => {
		updateScreen();
		window.addEventListener("resize", updateScreen);

		return () => {
			window.removeEventListener("resize", updateScreen);
		};
	});

	// Auto-close sidebar on mobile after clicking navigation link
	$effect(() => {
		if (page.url.pathname && isMobile) {
			sidebar.closeMobile();
		}
	});

	function toggleSidebar() {
		if (isMobile) {
			sidebar.toggleMobile();
		} else {
			sidebar.toggle();
		}
	}

	function closeMobileSidebar() {
		sidebar.closeMobile();
	}
</script>

<div class="app-layout" class:is-mobile={isMobile}>
	<!-- Overlay Backdrop for Mobile Drawer -->
	{#if isMobile && $sidebar.mobileOpen}
		<div
			class="mobile-backdrop"
			onclick={closeMobileSidebar}
			onkeydown={(e) => e.key === 'Escape' && closeMobileSidebar()}
			role="button"
			tabindex="0"
			aria-label="Close sidebar overlay"
		></div>
	{/if}

	<!-- Fixed Full-Height Sidebar (Desktop: Fixed 100vh, Mobile: Off-canvas Drawer in Front) -->
	<aside
		class="sidebar-aside"
		class:collapsed={!isMobile && $sidebar.collapsed}
		class:mobile-open={isMobile && $sidebar.mobileOpen}
	>
		<Sidebar
			{title}
			{logo}
			{navigation}
			collapsed={!isMobile && $sidebar.collapsed}
			onClose={isMobile ? closeMobileSidebar : undefined}
		/>
	</aside>

	<!-- Main Content Area (Header, Breadcrumb, Main Content, Footer) -->
	<div class="main-wrapper" class:collapsed={!isMobile && $sidebar.collapsed}>
		<Header onMenuClick={toggleSidebar} />

		<div class="breadcrumb-container">
			<Breadcrumb />
		</div>

		<main class="page-content">
			{@render children?.()}
		</main>

		<Footer />
	</div>
</div>

<style>
	/* ===================================================
	   APP LAYOUT CONTAINER
	=================================================== */
	.app-layout {
		display: flex;
		min-height: 100vh;
		width: 100%;
		background-color: var(--color-background, #f8fafc);
		position: relative;
	}

	/* ===================================================
	   FIXED FULL-HEIGHT SIDEBAR (DESKTOP)
	=================================================== */
	.sidebar-aside {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		height: 100vh;
		z-index: 100;
		flex-shrink: 0;
		width: 260px;
		transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
		            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.sidebar-aside.collapsed {
		width: 80px;
	}

	/* ===================================================
	   MOBILE DRAWER OVERLAY (FRONT SIDEBAR ON MOBILE)
	=================================================== */
	@media (max-width: 768px) {
		.sidebar-aside {
			position: fixed;
			top: 0;
			left: 0;
			height: 100vh;
			width: 280px !important;
			z-index: 1000; /* selalu di depan */
			transform: translateX(-100%);
			box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
		}

		.sidebar-aside.mobile-open {
			transform: translateX(0);
		}

		.mobile-backdrop {
			position: fixed;
			inset: 0;
			background: rgba(15, 23, 42, 0.45);
			backdrop-filter: blur(4px);
			-webkit-backdrop-filter: blur(4px);
			z-index: 999;
			animation: fadeIn 0.25s ease-out forwards;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* ===================================================
	   MAIN WRAPPER (HEADER, CONTENT, FOOTER)
	=================================================== */
	.main-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0; /* Prevents overflow inside flexbox */
		min-height: 100vh;
		margin-left: 260px;
		transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.main-wrapper.collapsed {
		margin-left: 80px;
	}

	@media (max-width: 768px) {
		.main-wrapper {
			margin-left: 0 !important;
		}

		.breadcrumb-container {
			padding: 0.75rem 1rem 0.25rem 1rem;
		}

		.page-content {
			padding: 1rem;
		}
	}

	.breadcrumb-container {
		padding: 1rem 1.5rem 0.25rem 1.5rem;
	}

	.page-content {
		flex: 1;
		padding: 1.5rem;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>