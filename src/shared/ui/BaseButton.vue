<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'md' | 'sm'
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
  }
)
</script>

<template>
  <button :type="type" :disabled="disabled" :class="['base-button', variant, size]">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  padding: 9px 18px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-body);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.base-button:active:not(:disabled) {
  transform: scale(0.97);
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.base-button.sm {
  padding: 8px 0;
  font-size: 13px;
}

.primary {
  background: var(--color-ink);
  color: var(--color-ink-text);
  box-shadow: var(--shadow-card);
}

.primary:hover:not(:disabled) {
  box-shadow: 0 2px 8px rgba(47, 111, 107, 0.35);
}

.secondary {
  background: var(--color-secondary);
  color: var(--color-secondary-text);
}

.secondary:hover:not(:disabled) {
  background: var(--color-border);
}

.danger {
  background: transparent;
  color: var(--color-danger);
  border: 1px solid var(--color-danger);
}

.danger:hover:not(:disabled) {
  background: var(--color-danger);
  color: var(--color-danger-text);
}

.ghost {
  background: transparent;
  color: var(--color-text-muted);
  font-weight: 500;
}

.ghost:hover:not(:disabled) {
  color: var(--color-text);
}
</style>
