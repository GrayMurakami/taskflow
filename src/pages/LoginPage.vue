<script setup lang="ts">
import LoginForm from '@/features/auth/LoginForm.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
</script>

<template>
  <div class="login-screen">
    <div class="login-screen__blob login-screen__blob--top"></div>
    <div class="login-screen__blob login-screen__blob--bottom"></div>
      <ThemeToggle class="login-screen__theme" />
      <LoginForm />
  </div>
</template>

<style scoped>
.login-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.login-screen__blob {
  position: absolute;
  border-radius: 50%;
  background: var(--color-ink);
  pointer-events: none;
}
.login-screen__blob--top { 
  width: 460px; 
  height: 460px; 
  opacity: 0.08; 
  top: -140px; 
  right: -140px; 
}

.login-screen__blob--bottom { 
  width: 300px; 
  height: 300px; 
  opacity: 0.06; 
  bottom: -120px; 
  left: -100px; 
}

.login-screen__theme { 
  position: absolute; 
  top: 24px; 
  right: 24px; 
}
</style>
