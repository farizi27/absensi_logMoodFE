<script lang="ts">
	interface Option {
		label: string;
		value: string;
		disabled?: boolean;
	}

	interface Props {
		label?: string;
		name?: string;
		id?: string;
		value?: string;
		options: Option[];
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
	}

	let {
		label = "",
		name = "",
		id = name || crypto.randomUUID(),
		value = $bindable(""),
		options = [],
		placeholder = "Pilih...",
		required = false,
		disabled = false,
		error = ""
	}: Props = $props();
</script>

<div class="select-group">
	{#if label}
		<label for={id}>
			{label}
		</label>
	{/if}

	<select
		id={id}
		name={name}
		bind:value
		{required}
		{disabled}
		class:error={!!error}
	>
		<option value="" disabled>
			{placeholder}
		</option>

		{#each options as option}
			<option
				value={option.value}
				disabled={option.disabled}
			>
				{option.label}
			</option>
		{/each}
	</select>

	{#if error}
		<small>{error}</small>
	{/if}
</div>

<style>
	.select-group {
		display: flex;
		flex-direction: column;
		gap: .4rem;
		width: 100%;
	}

	label {
		font-size: .9rem;
		font-weight: 500;
		color: var(--color-text);
	}

	select {
		width: 100%;
		padding: .8rem 1rem;

		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);

		background: var(--color-surface);
		color: var(--color-text);

		font: inherit;

		cursor: pointer;

		transition:
			border-color .2s,
			box-shadow .2s;
	}

	select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-primary-light);
	}

	select.error {
		border-color: var(--color-danger);
	}

	select:disabled {
		cursor: not-allowed;
		opacity: .7;
		background: var(--color-background);
	}

	small {
		font-size: .8rem;
		color: var(--color-danger);
	}
</style>