<script setup lang="ts">
import type { Task } from './Task.types'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggleStatus: [id: string, currentStatus: 'active' | 'done' ]
  delete: [id: string]
}>()
</script>

<template>
  <li>
    <input
      type="checkbox"
      :checked="task.status === 'done'"
      @change="emit('toggleStatus', task.id, task.status)"
    />
    <span :class="{ done: task.status === 'done' }">
      {{ task.title }} - {{ task.priority }}
    </span>
    <button @click="emit('delete', task.id)">Delete</button>
  </li>
</template>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
