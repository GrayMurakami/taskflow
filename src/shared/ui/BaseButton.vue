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
  background: var(--color-primary);
  color: var(--color-primary-text);
}

.secondary {
  background: var(--color-secondary);
  color: var(--color-secondary-text);
}

.danger {
  background: var(--color-danger);
  color: var(--color-danger-text);
}
</style>
