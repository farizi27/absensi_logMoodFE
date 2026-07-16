<script lang="ts">
	interface Props {
		label?: string;
		name?: string;
		id?: string;
		checked?: boolean;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
	}

	let {
		label = "",
		name = "",
		id = name || crypto.randomUUID(),
		checked = $bindable(false),
		value = "",
		required = false,
		disabled = false,
		error = ""
	}: Props = $props();
</script>

<div class="checkbox-group">
	<label class="checkbox-label" for={id}>
		<input
			id={id}
			type="checkbox"
			name={name}
			bind:checked
			{value}
			{required}
			{disabled}
		/>

		<span class="checkmark"></span>

		{#if label}
			<span class="label">{label}</span>
		{/if}
	</label>

	{#if error}
		<small>{error}</small>
	{/if}
</div>

<style>
	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: .35rem;
	}

	.checkbox-label {
		display: inline-flex;
		align-items: center;
		gap: .75rem;
		cursor: pointer;
		user-select: none;
		color: var(--color-text);
	}

	input {
		display: none;
	}

	.checkmark {
		width: 20px;
		height: 20px;

		border: 2px solid var(--color-border);
		border-radius: var(--radius-sm);

		display: flex;
		align-items: center;
		justify-content: center;

		transition: .2s;
	}

	input:checked + .checkmark {
		background: var(--color-primary);
		border-color: var(--color-primary);
	}

	input:checked + .checkmark::after {
		content: "✓";
		color: white;
		font-size: .8rem;
		font-weight: bold;
	}

	input:focus-visible + .checkmark {
		box-shadow: 0 0 0 3px var(--color-primary-light);
	}

	input:disabled + .checkmark {
		background: var(--color-background);
		cursor: not-allowed;
		opacity: .6;
	}

	.label {
		font-size: .95rem;
	}

	small {
		font-size: .8rem;
		color: var(--color-danger);
	}
</style>