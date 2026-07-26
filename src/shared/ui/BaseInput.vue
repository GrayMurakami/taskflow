<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: string
  placeholder?: string
  required?: boolean
  minlength?: number
}>();

defineEmits<{
  'update:modelValue': [value: string]
}>();
</script>

<template>
  <input
    :value="modelValue"
    :type="type ?? 'text'"
    :placeholder="placeholder"
    :required="required"
    :minlength="minlength"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="base-input" 
  />
</template>

<style scoped>
.base-input {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: var(--font-body);
  width: 100%;
  box-sizing: border-box;
  background: var(--color-surface-raised);
  color: var(--color-text);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.base-input::placeholder {
  color: var(--color-text-muted);
}

.base-input:focus {
  outline: none;
  border-color: var(--color-ink);
  box-shadow: 0 0 0 3px rgba(47, 111, 107, 0.15);
}
</style>
