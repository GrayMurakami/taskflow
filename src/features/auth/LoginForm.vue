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
  <form @submit.prevent="handleSubmit" class="login-form">
    <h1>{{ isRegisterMode ? 'Register' : 'LogIn' }}</h1>

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

    <p v-if="error" class="error">Error: {{ error }}</p>

    <BaseButton type="submit" :disabled="isLoading">
      {{ isLoading ? 'Loading ・・・' : isRegisterMode ? 'Sign Up' : 'Log In' }}
    </BaseButton>

    <BaseButton type="button" variant="secondary" @click="isRegisterMode = !isRegisterMode">
      {{ isRegisterMode ? 'Already have an account? Log In' : 'Don\'t have an account? Sign up' }}
    </BaseButton>

    <hr />

    <BaseButton type="button" variant="secondary" @click="handleGuestLogin" :disabled="isLoading">
      Log In as a guest (Demo)
    </BaseButton>
  </form>
</template>

<style scoped>

</style>