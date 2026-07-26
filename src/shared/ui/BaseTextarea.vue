<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>();

defineEmits<{
  'update:modelValue': [value: string]
}>();
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    class="base-textarea"
  />
</template>

<style scoped>
.base-textarea {
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: var(--font-body);
  width: 100%;
  resize: vertical;
  min-height: 60px;
  box-sizing: border-box;
  background: var(--color-surface-raised);
  color: var(--color-text);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.base-textarea:focus {
  outline: none;
  border-color: var(--color-ink);
  box-shadow: 0 0 0 3px rgba(47, 111, 107, 0.15);
}
</style>
