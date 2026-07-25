<script setup lang="ts">
import LoginForm from '@/features/auth/LoginForm.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue';
</script>

<template>
  <div class="login-page">
    <ThemeToggle />
    <LoginForm />
  </div>
</template>
