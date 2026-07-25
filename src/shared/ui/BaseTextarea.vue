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
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  background: var(--color-bg);
  color: var(--color-text);
}

.base-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}
</style>
