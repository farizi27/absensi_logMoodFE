<script lang="ts">
	interface Props {
		appName?: string;
		version?: string;
		company?: string;
	}

	let {
		appName = "LogMood",
		version = "1.0.0",
		company = "PT. Company"
	}: Props = $props();

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="left">
		<span>© {year} {appName}</span>
	</div>

	<div class="right">
		<span>{company}</span>
		<span class="divider">•</span>
		<span>v{version}</span>
	</div>
</footer>

<style>
	.footer {
		height: 56px;

		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 0 1.5rem;

		border-top: 1px solid var(--color-border);

		background: var(--color-surface);

		font-size: .85rem;
		color: var(--color-text-light);
	}

	.left,
	.right {
		display: flex;
		align-items: center;
		gap: .5rem;
	}

	.divider {
		opacity: .6;
	}

	@media (max-width: 768px) {
		.footer {
			flex-direction: column;
			justify-content: center;
			gap: .3rem;

			height: auto;
			padding: .75rem 1rem;
			text-align: center;
		}
	}
</style>