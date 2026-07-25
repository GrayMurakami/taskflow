<script setup lang="ts">
import type { Task } from './Task.types'
import BaseButton from '@/shared/ui/BaseButton.vue'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggleStatus: [id: string, currentStatus: 'active' | 'done' ]
  delete: [id: string]
}>()

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB')
}
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

    <p v-if="task.description">{{ task.description }}</p>

    <small v-if="task.deadline">
      Deadline: {{ formatDate(task.deadline) }}
    </small>
    <small>
      Create at {{ formatDate(task.created_at) }}
    </small>
    <BaseButton variant="danger" @click="emit('delete', task.id)">Delete</BaseButton>
  </li>
</template>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
