<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue'

defineProps<{
  modelValue: 'all' | 'active' | 'done'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: 'all' | 'active' | 'done' ]
}>()
</script>

<template>
  <div>
    <BaseButton
      :variant="modelValue === 'all' ? 'primary' : 'secondary'"
      @click="emit('update:modelValue', 'all')"
    >
      All
    </BaseButton>
    <BaseButton
      :variant="modelValue === 'active' ? 'primary' : 'secondary'"
      @click="emit('update:modelValue', 'active')"
    >
      Active
    </BaseButton>
    <BaseButton
      :variant="modelValue === 'done' ? 'primary' : 'secondary'"
      @click="emit('update:modelValue', 'done')"
    >
      Done
    </BaseButton>
  </div>
</template>

<style scoped>
</style>
