<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import BaseButton from './BaseButton.vue'

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <BaseButton class="theme-toggle" @click="toggleTheme">
    {{ theme === 'light' ? '🌙 Dark' : '☀️ Light' }}
  </BaseButton>  
</template>

<style scoped>
.theme-toggle {
  background: var(--color-surface-raised);
  color: var(--color-text);
  border: 1.5px solid var(--color-text-muted);
  box-shadow: 0 2px 6px rgba(23, 31, 27, 0.12);
}

.theme-toggle:hover:not(:disabled) {
  background: var(--color-secondary);
  border-color: var(--color-ink);
}
</style>
