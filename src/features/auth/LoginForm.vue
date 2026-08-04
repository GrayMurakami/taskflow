<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const email = ref('');
const password = ref('');
const isRegisterMode = ref(false);

const { login, register, loginAsGuest, isLoading, error } = useAuth();
const router = useRouter();

async function handleSubmit() {
  const success = isRegisterMode.value
    ? await register(email.value, password.value)
    : await login(email.value, password.value)

  if (success) {
    router.push('/');
  }
}

async function handleGuestLogin() {
  const success = await loginAsGuest();

  if (success) {
    router.push('/');
  }
}

function toggleMode(mode: boolean) {
  isRegisterMode.value = mode;
  email.value = '';
  password.value = '';
}
</script>

<template>
  <div class="login-card">
    <div class="login-card__brand">
      <h1>Task<span>Flow</span></h1>
      <span class="login-card__tagline mono">
        Organize your day
      </span>
    </div>

    <div class="login-card__tabs">
      <BaseButton
        type="button"
        size="sm"
        :variant="!isRegisterMode ? 'primary' : 'ghost'"
        class="login-card__tab"
        @click="toggleMode(false)"
      >
        Log In
      </BaseButton>
      <BaseButton
        type="button"
        size="sm"
        :variant="isRegisterMode ? 'primary' : 'ghost'"
        class="login-card__tab"
        @click="toggleMode(true)"
      >
        Register
      </BaseButton>
    </div>

    <form @submit.prevent="handleSubmit" class="login-card__form">
      <BaseInput 
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <BaseInput
        v-model="password"
        type="password"
        placeholder="Password"
        required
        :minlength="6"
      />

      <p 
        v-if="error" 
        class="error"
      >
        Error: {{ error }}
      </p>

      <BaseButton 
        type="submit" 
        :disabled="isLoading"
      >
        {{ isLoading ? 'Loading ・・・' : isRegisterMode ? 'Sign Up' : 'Log In' }}
      </BaseButton>
    </form>

    <div class="login-card__divider">
      <span>
        or
      </span>
    </div>

    <BaseButton
      type="button"
      variant="secondary"
      class="login-card__full"
      @click="handleGuestLogin"
      :disabled="isLoading"
    >
      Continue as guest (Demo)
    </BaseButton>

  </div>
</template>

<style scoped>
.login-card { 
  width: 100%;
  max-width: 380px;
  background: var(--color-surface-raised); 
  border-radius: 18px; 
  box-shadow: var(--shadow-card); 
  padding: 38px 32px; 
  position: relative; 
  z-index: 1;
}

.login-card__brand { 
  text-align: center; 
  margin-bottom: 26px; 
}

.login-card__brand h1 { 
  font-size: 28px; 
  letter-spacing: -0.02em; 
}

.login-card__brand h1 span { 
  color: var(--color-ink); 
}

.login-card__tagline { 
  display: block; 
  font-size: 12px; 
  color: var(--color-text-muted); 
  margin-top: 8px; 
  text-transform: uppercase; 
  letter-spacing: 0.08em; 
}

.login-card__tabs { 
  display: flex; 
  background: var(--color-secondary); 
  border-radius: 10px; 
  padding: 4px; 
  margin-bottom: 22px; 
  gap: 4px; 
}

.login-card__tab { 
  flex: 1; 
}

.login-card__form { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
}

.login-card__full {
  width: 100%;
}

.login-card__divider { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  margin: 22px 0; 
  font-family: var(--font-mono); 
  font-size: 11px; 
  color: var(--color-text-muted); 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
}

.login-card__divider::before, .login-card__divider::after { 
  content: ''; 
  flex: 1; 
  height: 1px; 
  background: var(--color-border); 
}

.error { 
  color: var(--color-danger); 
  font-size: 13px; 
  margin: 0; 
}
</style>
