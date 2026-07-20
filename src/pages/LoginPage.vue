<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/entities/user/useAuth'

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
    router.push('/')
  }
}

async function handleGuestLogin() {
  const success = await loginAsGuest();

  if (success) {
    router.push('/')
  }
}
</script>

<template>
  <div class="login-page">
    <form @submit.prevent="handleSubmit" class="login-form">
      <h1>{{ isRegisterMode ? 'Register' : 'LogIn' }}</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
        minlength="6"
      />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Loading ・・・' : isRegisterMode ? 'Sign Up' : 'Log in' }}
      </button>

      <button type="button" @click="isRegisterMode = !isRegisterMode">
        {{ isRegisterMode ? 'Already have an account? Log in' : 'Don\'t have an account? Sign up' }}
      </button>

      <hr />

      <button type="button" @click="handleGuestLogin" :disabled="isLoading">
        Log in as a guest (Demo)
      </button>
    </form>
  </div>
</template>
