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
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.base-input:focus {
  outline: none;
  border-color: #3b82f6;
}
</style>