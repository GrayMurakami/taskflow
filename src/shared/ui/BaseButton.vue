<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'danger'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    disabled: false,
  }
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="['base-button', variant]">
    <slot />
  </button>
  
</template>

<style scoped>
.base-button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.primary {
  background: #3b82f6;
  color: white;
}

.secondary {
  background: #e5e7eb;
  color: #111827;
}

.danger {
  background: #ef4444;
  color: white;
}
</style>