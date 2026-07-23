<script lang="ts">
    import {auth} from '$lib/stores/auth';
    import Card from '$lib/components/ui/Card.svelte';
    import Input from '$lib/components/ui/Input.svelte';
    import Button from '$lib/components/ui/Button.svelte';
    import {register} from '$lib/services/auth.service';
    import {goto} from '$app/navigation';

    let full_name = $state('')
    let name = $state('');
    let email = $state('');
    let password = $state('');

    async function handleRegister() {
        try{
            const result = await register({
                full_name: full_name,
                name: name,
                email: email,
                password: password
            });
            goto("/login")
            console.log('Registration successful:', result);
        } catch (error) {
            const err = 'Pendaftaran gagal. Silakan coba lagi.';
            console.error(err, error);
        }
    }
</script>

<svelte:head>
    <title>Register - LogMood</title>
</svelte:head>

<div class="login-page">
    <div class="background-circle circle-1"></div>
    <div class="background-circle circle-2"></div>

    <div class="card-wrapper">
        <Card border padding="lg">
            <div class="header">
                <h1>Daftar Akun Baru</h1>
                <p>Silakan isi data diri Anda untuk mendaftar ke sistem</p>
            </div>

            <form class="login-form" onsubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                <div class="inputs-container">
                    <Input
                        label="Full Name"
                        placeholder="Masukkan nama"
                        bind:value={full_name}
                    />

                    <Input
                        label="Nama"
                        placeholder="Masukkan nama"
                        bind:value={name}
                    />

                    <Input
                        label="Email"
                        placeholder="Masukkan email"
                        bind:value={email}
                        error={email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Email tidak valid' : ''}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Masukkan password"
                        bind:value={password}
                        error={password && password.length < 6 ? 'Password harus memiliki minimal 6 karakter' : ''}
                    />
                </div>

                <Button fullWidth type="submit">Daftar</Button>
            </form>
            <p class="footer-link">Sudah punya akun? <a href="/login">Masuk di sini</a></p>
        </Card>
    </div>
</div>

<style>
.login-page {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    padding: 32px;
    background: var(--color-background);
}

.card-wrapper {
    position: relative;
    width: 100%;
    max-width: 420px;
    z-index: 10;
    animation: fadeUp 0.8s ease;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.inputs-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.footer-link {
    text-align: center;
    margin-top: 20px;
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.footer-link a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
}

.header {
    text-align: center;
    margin-bottom: 24px;
}

.header h1 {
    margin-bottom: 8px;
    font-size: 1.85rem;
    color: var(--color-text);
    font-weight: 700;
}

.header p {
    color: var(--color-text-light);
    line-height: 1.5;
    font-size: 0.95rem;
}

.background-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.25;
    animation: float 9s ease-in-out infinite;
}

.circle-1 {
    width: 320px;
    height: 320px;
    background: #4f46e5;
    top: -120px;
    left: -80px;
}

.circle-2 {
    width: 280px;
    height: 280px;
    background: #3b82f6;
    right: -80px;
    bottom: -100px;
    animation-delay: 2s;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(35px) scale(0.97);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) scale(1);
    }
    50% {
        transform: translateY(30px) scale(1.12);
    }
}

@media (max-width: 768px) {
    .login-page {
        padding: 20px;
    }
}
</style>