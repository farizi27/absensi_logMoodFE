<script lang="ts">
    interface Props {
        label?: string;
        placeholder?: string;
        name?: string;
        value?: string;
        required?: boolean;
        disabled?: boolean;
        error?: string;
        id?: string;
        rows?: number;
        resize?: boolean;
    }
    let {
        label = '',
        placeholder = '',
        name = '',
        value = $bindable(''),
        required = false,
        disabled = false,
        error = '',
        id = name || crypto.randomUUID(),
        rows = 3,
        resize = true
    }: Props = $props();
</script>

<div class="input-group">
    {#if label}
        <label for={id}>{label}</label>
    {/if}

    <textarea
        id={id}
        bind:value
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        class:error={!!error}
        class:no-resize={!resize}
    ></textarea>

    {#if error}
        <small>{error}</small>
    {/if}
</div>

<style>
.input-group {
	display: flex;
	flex-direction: column;
	gap: 0.4rem;
	width: 100%;
}

label {
	font-size: 0.9rem;
	font-weight: 500;
	color: var(--color-text);
}

textarea {
	width: 100%;
	padding: 0.8rem 1rem;

	border: 1px solid var(--color-border);
	border-radius: var(--color-radius-md);

	background: var(--color-surface);
	color: var(--color-text);

	font-size: 0.95rem;
	font-family: inherit;
	line-height: 1.5;

	transition:
		border-color 0.2s,
		box-shadow 0.2s;

	resize: vertical;
}

textarea:focus {
	outline: none;
	border-color: var(--color-primary);
	box-shadow: 0 0 0 3px var(--color-primary-light);
}

textarea:disabled {
	background: var(--color-background);
	color: var(--color-text-light);
	cursor: not-allowed;
	opacity: 0.7;
}

textarea::placeholder {
	color: var(--color-text-light);
}

textarea.error {
	border-color: var(--color-danger);
}

textarea.error:focus {
	box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.no-resize {
	resize: none;
}

small {
	font-size: 0.8rem;
	color: var(--color-danger);
}
</style>