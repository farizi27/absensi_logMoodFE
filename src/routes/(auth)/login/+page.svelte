<script lang="ts">
    import {auth} from '$lib/stores/auth';
    import Input from '$lib/components/ui/Input.svelte';
    import Button from '$lib/components/ui/Button.svelte';
    import {login} from '$lib/services/auth.service';
    import{goto} from '$app/navigation';

    let email = $state('');
    let password = $state('');

    async function handleLogin() {
        try{
            const result = await login({
                email: email,
                password: password
            });
            auth.login(result.user,result.token);
            console.log('Login successful:', result);
            if (result.user.role === 'admin') {
                goto('/admin/dashboard');
            } else {
                goto('/employee/dashboard');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    }
</script>

<svelte:head>
    <title>Login</title>
</svelte:head>

<div class="login-page">

    <div class="background-circle circle-1"></div>
    <div class="background-circle circle-2"></div>

    <div class="login-card">

        <div class="header">
            <h1>Selamat Datang</h1>

            <p>
                Silakan masuk untuk melanjutkan ke sistem
            </p>
        </div>

            <Input
                label="Email"
                placeholder="Masukkan email"
                bind:value={email}
            />

            <Input
                label="Password"
                type="password"
                placeholder="Masukkan password"
                bind:value={password}
            />

            <Button
                fullWidth
                type="submit"
                onClick={handleLogin}
            >
                Masuk
            </Button>


    </div>

</div>

<style >
    /* ===========================
   PAGE
=========================== */

.login-page{

    position:relative;

    display:flex;
    justify-content:center;
    align-items:center;

    min-height:100vh;

    overflow:hidden;

    padding:32px;

    background: var(--color-background);
}


/* ===========================
   CARD
=========================== */

.login-card{

    position:relative;

    width:100%;
    max-width:420px;

    background: var(--color-surface);

    border-radius:24px;

    padding:40px;

    box-shadow: var(--color-shadow-sm);

    animation:
        fadeUp .8s ease;
}


/* ===========================
   HEADER
=========================== */

.header{

    text-align:center;

    margin-bottom:32px;
}

.header h1{

    margin-bottom:10px;

    font-size:2rem;

    color: var(--color-text);
}

.header p{

    color: var(--color-text-secondary);

    line-height:1.6;
}


/* ===========================
   BACKGROUND
=========================== */

.background-circle{

    position:absolute;

    border-radius:50%;

    filter:blur(70px);

    opacity:.25;

    animation:
        float 9s ease-in-out infinite;
}

.circle-1{

    width:320px;
    height:320px;

    background:#4f46e5;

    top:-120px;
    left:-80px;
}

.circle-2{

    width:280px;
    height:280px;

    background:#3b82f6;

    right:-80px;
    bottom:-100px;

    animation-delay:2s;
}


/* ===========================
   ANIMATION
=========================== */

@keyframes fadeUp{

    from{

        opacity:0;

        transform:
            translateY(35px)
            scale(.97);
    }

    to{

        opacity:1;

        transform:
            translateY(0)
            scale(1);
    }

}

@keyframes float{

    0%{

        transform:
            translateY(0px)
            scale(1);
    }

    50%{

        transform:
            translateY(30px)
            scale(1.12);
    }

    100%{

        transform:
            translateY(0px)
            scale(1);
    }

}


/* ===========================
   RESPONSIVE
=========================== */

@media (max-width:768px){

    .login-page{

        padding:20px;
    }

    .login-card{

        padding:30px 24px;
    }

    .header h1{

        font-size:1.75rem;
    }

}

@media (max-width:480px){

    .login-page{

        align-items:flex-start;

        padding-top:48px;
    }

    .login-card{

        max-width:none;

        border-radius:20px;

        padding:24px;
    }

    .header{

        margin-bottom:24px;
    }

    .header h1{

        font-size:1.5rem;
    }

    .header p{

        font-size:.95rem;
    }

}
</style>