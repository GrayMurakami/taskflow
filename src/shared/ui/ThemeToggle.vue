<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import BaseButton from './BaseButton.vue'

const { theme, toggleTheme } = useTheme();
</script>

<template>
  <BaseButton variant="secondary" @click="toggleTheme">
    {{ theme === 'light' ? '🌙 Dark' : '☀️ Light' }}
  </BaseButton>  
</template>

<style scoped>

</style>
