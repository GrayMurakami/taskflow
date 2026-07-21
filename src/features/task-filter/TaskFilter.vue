<script setup lang="ts">
defineProps<{
  modelValue: 'all' | 'active' | 'done'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: 'all' | 'active' | 'done' ]
}>()
</script>

<template>
  <div>
    <button
      @click="emit('update:modelValue', 'all')"
      :class="{ active: modelValue === 'all' }"
    >
      All
    </button>
    <button
      @click="emit('update:modelValue', 'active')"
      :class="{ active: modelValue === 'active'}"
    >
      Active
    </button>
    <button
      @click="emit('update:modelValue', 'done')"
      :class="{ active: modelValue === 'done' }"
    >
      Done
    </button>
  </div>
</template>

<style scoped>
button.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
