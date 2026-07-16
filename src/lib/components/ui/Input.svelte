<script lang="ts">  
    import type { Snippet } from "svelte"; 
	interface Props {
		label?: string;
		type?: HTMLInputElement['type'];
		placeholder?: string;
		name?: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		error?: string;
		id?: string;
        prefix?: Snippet;
        suffix?: Snippet;
	}

	let {
		label = '',
		type = 'text',
		placeholder = '',
		name = '',
		value = $bindable(''),
		required = false,
		disabled = false,
		error = '',
		id = name || crypto.randomUUID(),
        prefix,
        suffix
	}: Props = $props();
</script>

<div class="input-group">
	{#if label}
		<label for={id}>{label}</label>
	{/if}

    <div class="input-wrapper">
		{#if prefix}
			<div class="prefix">
				{@render prefix()}
			</div>
		{/if}

	<input
		id={id}
		bind:value
		{type}
		{name}
		{placeholder}
		{required}
		{disabled}
		class:error={!!error}
	/>
        
    {#if suffix}
		<div class="suffix">
			{@render suffix()}
		</div>
	{/if}
	</div>

	{#if error}
		<small>{error}</small>
	{/if}
</div>

<style>
    .input-wrapper {
        display: flex;
        align-items: center;
        gap: .75rem;

        padding: 0 .9rem;

        border: 1px solid var(--color-border);
        border-radius: var(--color-radius-md);

        background: var(--color-surface);

        transition: .2s;
    }

	.input-group {
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

    input {
        flex: 1;

        border: none;
        outline: none;

        background: transparent;

        padding: .9rem 0;

        font-size: .95rem;
        color: var(--color-text);
    }

    .input-wrapper:focus-within {
        border-color: var(--color-primary);

        box-shadow: 0 0 0 3px var(--color-primary-light);
    }

    .error {
        border-color: var(--color-danger);
    }

	small {
		color: var(--color-danger);
		font-size: .8rem;
	}
    .prefix,
	.suffix {
		display: flex;
		align-items: center;
		color: var(--color-text-light);
	}
</style>