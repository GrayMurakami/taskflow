<script setup lang="ts">
import LoginForm from '@/features/auth/LoginForm.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue';
</script>

<template>
  <div class="page login-page">
    <div class="page-header">
      <h1>TaskFlow</h1>
      <ThemeToggle />
    </div>

    <LoginForm />
  </div>
</template>

<style scoped>
.login-page {
  max-width: 400px;
}
</style>
