<script setup lang="ts">
import { ref } from 'vue'
import { useTasks } from '@/entities/task/useTasks'
import type { NewTask } from '@/entities/task/Task.types'
import BaseInput from '@/shared/ui/BaseInput.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'

const { createTask, isLoading, error } = useTasks();

const title = ref('');
const description = ref('');
const priority = ref<NewTask['priority']>('medium');
const deadline = ref('');

async function handleSubmit() {
  const success = await createTask({
    title: title.value,
    description: description.value || null,
    priority: priority.value,
    deadline: deadline.value || null,
  });

  if (success) {
    title.value = ''
    description.value = ''
    priority.value = 'medium'
    deadline.value = ''
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <BaseInput
      v-model="title"
      type="text"
      placeholder="Task name"
      required 
    />
    <textarea v-model="description" placeholder="Description (optional)"></textarea>

    <select v-model="priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>

    <BaseInput
      v-model="deadline"
      type="date"
    />

    <p v-if="error">{{ error }}</p>

    <BaseButton type="submit" :disabled="isLoading">
      Add task
    </BaseButton>
  </form>
</template>